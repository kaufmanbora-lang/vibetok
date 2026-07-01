import http from "node:http";
import { randomUUID, createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || process.env.VIBETOK_API_PORT || 8787);
const HOST = process.env.VIBETOK_API_HOST || (process.env.PORT ? "0.0.0.0" : "127.0.0.1");
const DB_PATH = process.env.VIBETOK_DB_PATH
  ? path.resolve(process.env.VIBETOK_DB_PATH)
  : path.join(__dirname, "data", "vibetok-db.json");
const STATIC_DIRS = [
  process.env.VIBETOK_STATIC_DIR ? path.resolve(process.env.VIBETOK_STATIC_DIR) : path.join(__dirname, "dist"),
  path.resolve(__dirname, "..", "..", "outputs", "vibetok", "dist"),
];

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const ADMIN_ACCOUNT = {
  id: "admin-root",
  email: "admin@vibetok.local",
  passwordHash: hashPassword("admin123"),
  handle: "admin",
  name: "VibeTok Admin",
  bio: "Главный администратор VibeTok.",
  accent: "#ffb31a",
  avatar: "AD",
  gradient: "linear-gradient(135deg, #ffb31a, #ff2d6f)",
  verified: true,
  premium: true,
  role: "admin",
  suspended: false,
  followers: 0,
  likes: 0,
  videos: 0,
  createdBy: "system",
};

function hashPassword(password) {
  return createHash("sha256").update(String(password)).digest("hex");
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function normalizeHandle(handle) {
  return String(handle ?? "")
    .trim()
    .replace(/^@/, "")
    .replace(/\s+/g, ".")
    .replace(/[^\p{L}\p{N}._-]/gu, "")
    .toLowerCase();
}

function makeAvatar(handle) {
  return (
    handle
      .split(/[._-]+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "VT"
  );
}

function defaultDb() {
  return {
    version: 1,
    accounts: [ADMIN_ACCOUNT],
    follows: [],
  };
}

async function loadDb() {
  try {
    const raw = await readFile(DB_PATH, "utf8");
    const db = JSON.parse(raw);
    const hasAdmin = db.accounts?.some((account) => account.id === ADMIN_ACCOUNT.id);
    if (!hasAdmin) {
      db.accounts = [ADMIN_ACCOUNT, ...(db.accounts ?? [])];
    }
    db.follows ??= [];
    return applyFollowerCounts(db);
  } catch {
    const db = defaultDb();
    await saveDb(db);
    return db;
  }
}

async function saveDb(db) {
  await mkdir(path.dirname(DB_PATH), { recursive: true });
  await writeFile(DB_PATH, JSON.stringify(applyFollowerCounts(db), null, 2), "utf8");
}

function applyFollowerCounts(db) {
  const counts = new Map();
  for (const follow of db.follows ?? []) {
    counts.set(follow.targetId, (counts.get(follow.targetId) ?? 0) + 1);
  }
  db.accounts = (db.accounts ?? []).map((account) => ({
    ...account,
    followers: counts.get(account.id) ?? 0,
    likes: Number(account.likes ?? 0),
    videos: Number(account.videos ?? 0),
  }));
  return db;
}

function publicAccount(account) {
  const { password, passwordHash, email, ...safeAccount } = account;
  return safeAccount;
}

function privateAccount(account) {
  const { password, passwordHash, ...safeAccount } = account;
  return safeAccount;
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function sendStatic(res, status, buffer, filePath, method = "GET") {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(status, {
    "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=31536000, immutable",
  });
  res.end(method === "HEAD" ? undefined : buffer);
}

function sendPlain(res, status, text) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(text);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 6_000_000) {
        reject(new Error("payload_too_large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("invalid_json"));
      }
    });
    req.on("error", reject);
  });
}

function getPath(req) {
  return new URL(req.url, `http://${req.headers.host}`).pathname;
}

function getSafeStaticPath(root, pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);
  const relative = path.relative(root, filePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return filePath;
}

async function readStaticFile(pathname) {
  for (const root of STATIC_DIRS) {
    const filePath = getSafeStaticPath(root, pathname);
    if (!filePath) continue;
    try {
      return { buffer: await readFile(filePath), filePath };
    } catch {
      // Try the next static root.
    }
  }
  return null;
}

async function serveStatic(req, res, pathname) {
  if (!["GET", "HEAD"].includes(req.method)) {
    sendPlain(res, 405, "Method not allowed");
    return;
  }

  const file = await readStaticFile(pathname);
  if (file) {
    sendStatic(res, 200, file.buffer, file.filePath, req.method);
    return;
  }

  const indexFile = await readStaticFile("/");
  if (indexFile) {
    sendStatic(res, 200, indexFile.buffer, indexFile.filePath, req.method);
    return;
  }

  sendPlain(res, 404, "VibeTok build not found. Run pnpm build:hosted first.");
}

function getFollowed(db, userId) {
  return (db.follows ?? [])
    .filter((follow) => follow.followerId === userId)
    .map((follow) => follow.targetId);
}

async function handleRegister(req, res) {
  const body = await readBody(req);
  const email = normalizeEmail(body.email);
  const handle = normalizeHandle(body.handle);
  const password = String(body.password ?? "");
  const name = String(body.name ?? "").trim() || handle;

  if (!email || !email.includes("@") || !handle || password.length < 4) {
    sendJson(res, 400, { error: "Введите email, ник и пароль от 4 символов" });
    return;
  }

  const db = await loadDb();
  if (db.accounts.some((account) => normalizeEmail(account.email) === email)) {
    sendJson(res, 409, { error: "Такой email уже зарегистрирован" });
    return;
  }
  if (db.accounts.some((account) => normalizeHandle(account.handle) === handle)) {
    sendJson(res, 409, { error: "Такой ник уже занят" });
    return;
  }

  const account = {
    id: `user-${randomUUID()}`,
    email,
    passwordHash: hashPassword(password),
    handle,
    name,
    bio: String(body.bio ?? "Новый автор VibeTok."),
    accent: String(body.accent ?? "#00e5ff"),
    avatar: String(body.avatar ?? makeAvatar(handle)),
    avatarImage: body.avatarImage ? String(body.avatarImage) : "",
    gradient: String(body.gradient ?? "linear-gradient(135deg, #00e5ff, #ff2d6f)"),
    verified: false,
    premium: false,
    role: "user",
    suspended: false,
    followers: 0,
    likes: 0,
    videos: 0,
    createdBy: "human",
  };

  db.accounts.push(account);
  await saveDb(db);
  sendJson(res, 201, {
    user: privateAccount(account),
    accounts: db.accounts.map(publicAccount),
    followed: [],
  });
}

async function handleLogin(req, res) {
  const body = await readBody(req);
  const email = normalizeEmail(body.email);
  const passwordHash = hashPassword(body.password ?? "");
  const db = await loadDb();
  const account = db.accounts.find((item) => normalizeEmail(item.email) === email);

  if (!account || account.passwordHash !== passwordHash) {
    sendJson(res, 401, { error: "Неверный email или пароль" });
    return;
  }
  if (account.suspended) {
    sendJson(res, 403, { error: "Аккаунт заблокирован модерацией" });
    return;
  }

  sendJson(res, 200, {
    user: privateAccount(account),
    accounts: db.accounts.map(publicAccount),
    followed: getFollowed(db, account.id),
  });
}

async function handlePatchAccount(req, res, accountId) {
  const body = await readBody(req);
  const patch = body.patch && typeof body.patch === "object" ? body.patch : body;
  const allowed = new Set([
    "name",
    "bio",
    "accent",
    "avatar",
    "avatarImage",
    "gradient",
    "verified",
    "premium",
    "suspended",
    "followers",
    "likes",
    "videos",
  ]);
  const db = await loadDb();
  const index = db.accounts.findIndex((account) => account.id === accountId);
  if (index === -1) {
    sendJson(res, 404, { error: "Аккаунт не найден" });
    return;
  }

  const safePatch = {};
  for (const [key, value] of Object.entries(patch)) {
    if (allowed.has(key)) safePatch[key] = value;
  }

  db.accounts[index] = {
    ...db.accounts[index],
    ...safePatch,
    followers: Number(safePatch.followers ?? db.accounts[index].followers ?? 0),
    likes: Number(safePatch.likes ?? db.accounts[index].likes ?? 0),
    videos: Number(safePatch.videos ?? db.accounts[index].videos ?? 0),
  };

  await saveDb(db);
  sendJson(res, 200, {
    account: publicAccount(db.accounts[index]),
    accounts: db.accounts.map(publicAccount),
  });
}

async function handleToggleFollow(req, res) {
  const body = await readBody(req);
  const followerId = String(body.followerId ?? "");
  const targetId = String(body.targetId ?? "");
  const db = await loadDb();

  if (!followerId || !targetId || followerId === targetId) {
    sendJson(res, 400, { error: "Нельзя подписаться на этот аккаунт" });
    return;
  }
  if (!db.accounts.some((account) => account.id === followerId)) {
    sendJson(res, 404, { error: "Ваш аккаунт не найден" });
    return;
  }
  if (!db.accounts.some((account) => account.id === targetId)) {
    sendJson(res, 404, { error: "Аккаунт не найден" });
    return;
  }

  const existingIndex = db.follows.findIndex(
    (follow) => follow.followerId === followerId && follow.targetId === targetId,
  );
  if (existingIndex >= 0) {
    db.follows.splice(existingIndex, 1);
  } else {
    db.follows.push({ followerId, targetId, createdAt: new Date().toISOString() });
  }

  await saveDb(db);
  sendJson(res, 200, {
    followed: getFollowed(db, followerId),
    accounts: db.accounts.map(publicAccount),
  });
}

async function route(req, res) {
  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  const pathname = getPath(req);

  try {
    if (req.method === "GET" && pathname === "/api/health") {
      sendJson(res, 200, { ok: true, dbPath: DB_PATH });
      return;
    }

    if (req.method === "GET" && pathname === "/api/accounts") {
      const db = await loadDb();
      sendJson(res, 200, { accounts: db.accounts.map(publicAccount) });
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/api/follows/")) {
      const db = await loadDb();
      const userId = decodeURIComponent(pathname.replace("/api/follows/", ""));
      sendJson(res, 200, { followed: getFollowed(db, userId) });
      return;
    }

    if (req.method === "POST" && pathname === "/api/auth/register") {
      await handleRegister(req, res);
      return;
    }

    if (req.method === "POST" && pathname === "/api/auth/login") {
      await handleLogin(req, res);
      return;
    }

    if (req.method === "PATCH" && pathname.startsWith("/api/accounts/")) {
      const accountId = decodeURIComponent(pathname.replace("/api/accounts/", ""));
      await handlePatchAccount(req, res, accountId);
      return;
    }

    if (req.method === "POST" && pathname === "/api/follows/toggle") {
      await handleToggleFollow(req, res);
      return;
    }

    if (!pathname.startsWith("/api")) {
      await serveStatic(req, res, pathname);
      return;
    }

    sendJson(res, 404, { error: "Маршрут не найден" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Ошибка сервера" });
  }
}

http.createServer(route).listen(PORT, HOST, () => {
  console.log(`VibeTok API: http://${HOST}:${PORT}/api`);
  console.log(`Database: ${DB_PATH}`);
});
