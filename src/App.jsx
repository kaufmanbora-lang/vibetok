import { useEffect, useMemo, useRef, useState } from "react";
import seedTikTokRows from "./tiktokSeed.json";
import {
  AtSign,
  Bell,
  Bookmark,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clapperboard,
  Copy,
  Crown,
  Eye,
  Flag,
  Flame,
  Gift,
  Hash,
  Heart,
  Home,
  LogIn,
  LogOut,
  MessageCircle,
  Mic2,
  MoreHorizontal,
  Music2,
  Palette,
  Pause,
  Pencil,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Repeat2,
  Save,
  Scissors,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  SmilePlus,
  Sparkles,
  Upload,
  User,
  Users,
  Video,
  Volume2,
  VolumeX,
  Wand2,
  X,
  Zap,
} from "lucide-react";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const LAUNCH_SPLASH_MS = 5000;

const API_BASE_URL = (() => {
  const configuredUrl = import.meta.env.VITE_VIBETOK_API_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");
  if (typeof window === "undefined" || window.location.protocol === "file:") return "";

  const isLocalHost = ["127.0.0.1", "localhost"].includes(window.location.hostname);
  if (isLocalHost && window.location.port === "5173") {
    return "http://127.0.0.1:8787/api";
  }

  return `${window.location.origin}/api`;
})();

async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) return null;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 4000);
  const body = options.body === undefined ? undefined : JSON.stringify(options.body);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      body,
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Не удалось связаться с общей базой");
    }
    return data;
  } finally {
    window.clearTimeout(timer);
  }
}

function normalizeSharedAccount(account) {
  return {
    role: "user",
    premium: false,
    verified: false,
    suspended: false,
    followers: 0,
    likes: 0,
    videos: 0,
    createdBy: "human",
    ...account,
  };
}

const PUBLIC_VIDEO_SOURCE = {
  id: "internet",
  handle: "russian.feed",
  name: "Русская лента",
  title: "Русские TikTok-видео",
  avatar: "RU",
  gradient: "linear-gradient(135deg, #343448, #ff2d6f)",
  verified: false,
  isSource: true,
  tags: [],
};

const ADMIN_ACCOUNT = {
  id: "admin-root",
  email: "admin@vibetok.local",
  password: "admin123",
  handle: "admin",
  name: "VibeTok Admin",
  bio: "Главный администратор VibeTok.",
  accent: "#ffb31a",
  avatar: "AD",
  gradient: "linear-gradient(135deg, #ffb31a, #ff2d6f)",
  verified: true,
  premium: true,
  role: "admin",
  followers: 0,
  likes: 0,
  videos: 0,
  createdBy: "system",
};

const INTERNET_VIDEO_SOURCES = [
  {
    title: "Sintel fire cut",
    source: "https://docs.evostream.com/sample_content/assets/sintel1m720p.mp4",
    duration: "00:52",
    vibe: "city",
    tags: ["кино", "ночь", "монтаж"],
    music: "Viral edit - Fire pulse",
  },
  {
    title: "Sintel trailer",
    source: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    duration: "00:52",
    vibe: "music",
    tags: ["кино", "travel", "ночь"],
    music: "Trailer beat - Cold sparks",
  },
  {
    title: "Street pulse",
    source: "https://samplelib.com/mp4/sample-5s-360p.mp4",
    duration: "00:05",
    vibe: "city",
    tags: ["город", "travel", "монтаж"],
    music: "Street Light - Quick Loop",
  },
  {
    title: "Fast city clip",
    source: "https://samplelib.com/mp4/sample-10s-360p.mp4",
    duration: "00:10",
    vibe: "city",
    tags: ["город", "ночь", "travel"],
    music: "Traffic Kit - Ten Seconds",
  },
  {
    title: "Urban mini story",
    source: "https://samplelib.com/mp4/sample-15s-360p.mp4",
    duration: "00:15",
    vibe: "dance",
    tags: ["город", "музыка", "челлендж"],
    music: "Mini Story - Hook Loop",
  },
  {
    title: "Traffic stream",
    source: "https://samplelib.com/mp4/sample-20s-360p.mp4",
    duration: "00:20",
    vibe: "city",
    tags: ["город", "челлендж", "монтаж"],
    music: "Road Loop - Moving Fast",
  },
  {
    title: "Crosswalk life",
    source: "https://samplelib.com/mp4/sample-30s-360p.mp4",
    duration: "00:30",
    vibe: "dance",
    tags: ["город", "travel", "музыка"],
    music: "Crosswalk - City Rhythm",
  },
  {
    title: "Movie flash",
    source: "https://media.w3.org/2010/05/video/movie_300.mp4",
    duration: "00:10",
    vibe: "music",
    tags: ["кино", "город", "монтаж"],
    music: "Archive Pop - Mini Scene",
  },
  {
    title: "Bunny action",
    source: "https://docs.evostream.com/sample_content/assets/bun33s.mp4",
    duration: "00:33",
    vibe: "dance",
    tags: ["кино", "челлендж", "музыка"],
    music: "Open Movie - Viral Beat",
  },
  {
    title: "Sintel short hook",
    source: "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4",
    duration: "00:10",
    vibe: "music",
    tags: ["кино", "ночь", "монтаж"],
    music: "Sintel 10 - Hook",
  },
  {
    title: "Bunny quick cut",
    source: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
    duration: "00:10",
    vibe: "dance",
    tags: ["кино", "челлендж", "музыка"],
    music: "Bunny 10 - Fast Edit",
  },
];

const INTERNET_CAPTIONS = [
  "Вирусный клип в стиле рекомендаций.",
  "Короткий момент, который хочется досмотреть.",
  "Быстрый монтаж, звук и движение.",
  "Такой ролик легко залипает в ленте.",
  "Мини-сцена с темпом под TikTok.",
  "Кадр для быстрых рекомендаций.",
  "Смотри со звуком, тут весь вайб.",
  "Киношный кусок без лишней паузы.",
  "Динамичный ролик вместо спокойной природы.",
  "Похоже на трендовый короткий эдит.",
  "Слишком коротко, чтобы скипнуть.",
  "Лента стала бодрее.",
];

function generateInternetFeedVideos(count = 500) {
  return Array.from({ length: count }, (_, index) => {
    const source = INTERNET_VIDEO_SOURCES[index % INTERNET_VIDEO_SOURCES.length];
    const creatorId = "internet";
    const serial = index + 1;
    const wave = Math.floor(index / INTERNET_VIDEO_SOURCES.length) + 1;

    return {
      id: `web-${String(serial).padStart(3, "0")}`,
      creatorId,
      source: source.source,
      caption: `${INTERNET_CAPTIONS[index % INTERNET_CAPTIONS.length]} #${serial} · ${source.title}`,
      music: `${source.music} · подборка ${wave}`,
      tags: source.tags,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      duration: source.duration,
      vibe: source.vibe,
    };
  });
}

const UNAVAILABLE_TIKTOK_VIDEO_IDS = new Set([
  "6996675941657316610",
  "7073875835597409542",
]);

const INTERNET_FEED_VIDEOS = seedTikTokRows.filter((row) => {
  if (!row.video_id) return true;
  return !UNAVAILABLE_TIKTOK_VIDEO_IDS.has(String(row.video_id));
}).map((row, index) => {
  const handle = row.author_unique_id || "tiktok";
  const caption = row.description?.trim() || `TikTok @${handle} #${index + 1}`;

  return {
    id: `seed-tiktok-${row.video_id || index}`,
    creatorId: "internet",
    source: row.url,
    embedUrl: getTikTokEmbedUrl(row.url),
    externalUrl: row.url,
    caption,
    music: `Original sound - ${handle}`,
    tags: row.tags?.length ? row.tags : ["русский", "рекомендации", "видео"],
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    duration: row.duration && row.duration !== "0" ? `${row.duration}s` : "TikTok",
    vibe: index % 3 === 0 ? "city" : index % 3 === 1 ? "music" : "dance",
    importedFrom: "tiktok-seed",
  };
});

const TAGS = [
  "всё",
  "русский",
  "рекомендации",
  "тренд",
  "юмор",
  "видео",
  "город",
  "музыка",
  "спорт",
  "travel",
  "челлендж",
  "ночь",
  "кино",
  "природа",
  "океан",
  "монтаж",
  "релакс",
];

const DEFAULT_RECOMMENDATION_CONSENT = {
  termsAccepted: false,
  personalizeInApp: false,
  allowExternalInterests: false,
  externalInterests: "",
  acceptedAt: null,
};

const RECOMMENDATION_TERMS_VERSION = "2026-07-01";
const ALL_TAG = TAGS[0];

const INTEREST_STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "you",
  "with",
  "это",
  "как",
  "для",
  "что",
  "из",
  "на",
  "по",
  "всё",
  "все",
  "видео",
  "ролик",
  "tiktok",
  "original",
  "sound",
]);

function normalizeInterestToken(value) {
  return value
    .toLowerCase()
    .replace(/^#|^@/, "")
    .replace(/[^\p{L}\p{N}._-]+/gu, "")
    .trim();
}

function tokenizeInterests(value) {
  return String(value ?? "")
    .split(/[\s,;|/]+/u)
    .map(normalizeInterestToken)
    .filter((token) => token.length > 2 && !INTEREST_STOP_WORDS.has(token));
}

function uniqueItems(items) {
  return [...new Set(items.filter(Boolean))];
}

function getVideoInterestTokens(video, creator) {
  return uniqueItems([
    ...(video.tags ?? []).map(normalizeInterestToken),
    ...tokenizeInterests(video.caption),
    ...tokenizeInterests(video.music),
    normalizeInterestToken(video.vibe),
    normalizeInterestToken(video.importedFrom),
    normalizeInterestToken(creator?.handle),
  ]);
}

function addWeighted(map, keys, weight) {
  keys.forEach((key) => {
    if (!key) return;
    map.set(key, (map.get(key) ?? 0) + weight);
  });
}

function topWeightedEntries(map, limit = 6) {
  return [...map.entries()]
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function buildRecommendationProfile({
  videos,
  liked,
  saved,
  followed,
  signals,
  consent,
}) {
  const tags = new Map();
  const tokens = new Map();
  const creators = new Map();
  const vibes = new Map();
  const interactions = Object.values(signals ?? {});

  videos.forEach((video) => {
    const creator = video.creatorId === "me" ? null : getCreator(video.creatorId);
    const videoTokens = getVideoInterestTokens(video, creator);
    const cleanTags = (video.tags ?? []).map(normalizeInterestToken);
    let weight = 0;

    if (liked.includes(video.id)) weight += 9;
    if (saved.includes(video.id)) weight += 12;
    if (followed.includes(video.creatorId)) weight += 8;

    const signal = signals?.[video.id];
    if (signal) {
      weight += Math.min(signal.views ?? 0, 8) * 1.2;
      weight += Math.min((signal.watchMs ?? 0) / 1000, 24) * 0.35;
      weight += (signal.likes ?? 0) * 9;
      weight += (signal.saves ?? 0) * 12;
      weight += (signal.follows ?? 0) * 8;
      weight -= (signal.skips ?? 0) * 2.4;
    }

    if (weight <= 0) return;
    addWeighted(tags, cleanTags, weight);
    addWeighted(tokens, videoTokens, weight * 0.72);
    addWeighted(creators, [video.creatorId], weight * 0.58);
    addWeighted(vibes, [video.vibe], weight * 0.45);
  });

  if (consent.allowExternalInterests) {
    const externalTokens = tokenizeInterests(consent.externalInterests);
    addWeighted(tokens, externalTokens, 10);
    addWeighted(tags, externalTokens.filter((token) => TAGS.includes(token)), 12);
  }

  return {
    tags,
    tokens,
    creators,
    vibes,
    interactions,
    topTags: topWeightedEntries(tags, 7).map(([tag]) => tag),
    topTokens: topWeightedEntries(tokens, 7).map(([token]) => token),
  };
}

function getRecommendationScore(video, creator, profile, consent) {
  const tokens = getVideoInterestTokens(video, creator);
  const tags = (video.tags ?? []).map(normalizeInterestToken);
  const baseFreshness = Number(video.id.replace(/\D/g, "").slice(-5)) % 37;
  let score = baseFreshness / 100;

  if (!consent.termsAccepted || !consent.personalizeInApp) {
    return score + Math.log10((video.likes ?? 0) + 10) * 0.15;
  }

  tags.forEach((tag) => {
    score += (profile.tags.get(tag) ?? 0) * 1.25;
  });
  tokens.forEach((token) => {
    score += profile.tokens.get(token) ?? 0;
  });
  score += (profile.creators.get(video.creatorId) ?? 0) * 1.15;
  score += (profile.vibes.get(video.vibe) ?? 0) * 0.8;
  score += Math.log10((video.likes ?? 0) + 10) * 0.12;

  return score;
}

function explainRecommendation(video, profile, consent) {
  if (!consent.termsAccepted || !consent.personalizeInApp) return "общая лента";
  const tags = (video.tags ?? []).map(normalizeInterestToken);
  const matchedTag = tags.find((tag) => profile.tags.has(tag));
  if (matchedTag) return `похоже на #${matchedTag}`;
  const matchedToken = getVideoInterestTokens(video, getCreator(video.creatorId)).find((token) =>
    profile.tokens.has(token),
  );
  if (matchedToken) return `интерес: ${matchedToken}`;
  return "новое для проверки";
}

function useLocalState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Local storage can be unavailable in private modes; the app still works in memory.
    }
  }, [key, value]);

  return [value, setValue];
}

function compactNumber(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}K`;
  return `${value}`;
}

function extractTikTokPostId(url) {
  const value = url.trim();
  const match =
    value.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/i) ||
    value.match(/tiktok\.com\/@\/video\/(\d+)/i) ||
    value.match(/tiktok\.com\/v\/(\d+)\.html/i) ||
    value.match(/tiktok\.com\/(?:embed|player)\/v1\/(\d+)/i);
  return match?.[1] ?? null;
}

function getTikTokEmbedUrl(url) {
  const postId = extractTikTokPostId(url);
  const params = new URLSearchParams({
    controls: "0",
    progress_bar: "0",
    play_button: "0",
    volume_control: "0",
    fullscreen_button: "0",
    timestamp: "0",
    music_info: "0",
    description: "0",
    rel: "0",
    native_context_menu: "0",
    closed_caption: "0",
    loop: "1",
    autoplay: "1",
    muted: "0",
  });
  return postId ? `https://www.tiktok.com/player/v1/${postId}?${params.toString()}` : null;
}

function getTikTokHandle(url) {
  const match = url.trim().match(/tiktok\.com\/@([^/]+)\/video\/\d+/i);
  return match?.[1] ?? "tiktok";
}

function parseTikTokImportList(value) {
  const links = value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const seen = new Set();
  const valid = [];
  const invalid = [];

  links.forEach((url) => {
    const postId = extractTikTokPostId(url);
    if (!postId) {
      invalid.push(url);
      return;
    }
    if (seen.has(postId)) return;
    seen.add(postId);
    valid.push({
      postId,
      handle: getTikTokHandle(url),
      originalUrl: url,
      embedUrl: getTikTokEmbedUrl(url),
    });
  });

  return {
    valid: valid.slice(0, 500),
    invalid,
    duplicates: links.length - valid.length - invalid.length,
    overflow: Math.max(0, valid.length - 500),
  };
}

function isDirectVideoUrl(url) {
  return /^https?:\/\/.+\.(mp4|webm|mov)(\?.*)?$/i.test(url.trim());
}

function isInternalQaAccount(account) {
  return /^qa\d+@example\.com$/i.test(account?.email ?? "");
}

function getCreator(id) {
  if (id === "internet") return PUBLIC_VIDEO_SOURCE;
  return PUBLIC_VIDEO_SOURCE;
}

function Avatar({ user, size = "md", className = "" }) {
  const safeUser = user ?? PUBLIC_VIDEO_SOURCE;
  return (
    <div
      className={`avatar avatar-${size} ${className}`}
      style={{ background: safeUser.gradient }}
      aria-hidden="true"
    >
      {safeUser.avatarImage ? (
        <img src={safeUser.avatarImage} alt="" />
      ) : (
        <span>{safeUser.avatar}</span>
      )}
    </div>
  );
}

function getAccountSearchText(account) {
  return [
    account.handle,
    `@${account.handle}`,
    account.name,
    account.bio,
    account.role,
    account.premium ? "premium" : "",
    account.verified ? "verified" : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function IconButton({ icon: Icon, label, active, className = "", ...props }) {
  return (
    <button
      className={`icon-button ${active ? "is-active" : ""} ${className}`}
      type="button"
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon size={20} strokeWidth={2.2} />
    </button>
  );
}

function PrimaryButton({ icon: Icon, children, className = "", ...props }) {
  return (
    <button className={`primary-button ${className}`} type="button" {...props}>
      {Icon ? <Icon size={18} strokeWidth={2.3} /> : null}
      <span>{children}</span>
    </button>
  );
}

function GhostButton({ icon: Icon, children, className = "", ...props }) {
  return (
    <button className={`ghost-button ${className}`} type="button" {...props}>
      {Icon ? <Icon size={17} strokeWidth={2.2} /> : null}
      <span>{children}</span>
    </button>
  );
}

function Sidebar({
  activeTab,
  setActiveTab,
  feedMode,
  setFeedMode,
  currentUser,
  followed,
  toggleFollow,
  openUpload,
  openProfile,
}) {
  const nav = [
    { id: "home", label: "Для тебя", icon: Home, onClick: () => setFeedMode("forYou") },
    {
      id: "following",
      label: "Подписки",
      icon: Users,
      onClick: () => setFeedMode("following"),
    },
    { id: "live", label: "LIVE", icon: Radio },
    { id: "upload", label: "Загрузить", icon: Upload, onClick: openUpload },
    { id: "messages", label: "Сообщения", icon: MessageCircle },
    { id: "profile", label: "Профиль", icon: User, onClick: openProfile },
    ...(currentUser?.role === "admin"
      ? [{ id: "admin", label: "Админ", icon: ShieldCheck }]
      : []),
  ];

  return (
    <aside className="sidebar">
      <button className="brand" type="button" onClick={() => setActiveTab("home")}>
        <span>Vibe</span>
        <strong>Tok</strong>
      </button>

      <nav className="side-nav" aria-label="Основная навигация">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === activeTab ||
            (item.id === "home" && activeTab === "home" && feedMode === "forYou") ||
            (item.id === "following" && activeTab === "home" && feedMode === "following");
          return (
            <button
              key={item.id}
              className={`side-link ${isActive ? "is-active" : ""}`}
              type="button"
              onClick={() => {
                if (item.onClick) item.onClick();
                if (!["upload", "profile", "home", "following"].includes(item.id)) {
                  setActiveTab(item.id);
                }
                if (item.id === "home" || item.id === "following") setActiveTab("home");
              }}
            >
              <Icon size={22} strokeWidth={2.4} />
              <span>{item.label}</span>
              {item.badge ? <b>{item.badge}</b> : null}
            </button>
          );
        })}
      </nav>

      <div className="live-mini">
        <div className="section-label">
          <span className="live-dot" />
          <span>LIVE</span>
        </div>
        <button className="live-card-mini" type="button" onClick={() => setActiveTab("live")}>
          <div className="live-card-bg" />
          <div className="live-chip">0 зрителей</div>
          <div className="live-card-info">
            <strong>Начать трансляцию</strong>
            <span>{currentUser ? "Ваш эфир с 0 зрителей" : "После регистрации"}</span>
          </div>
        </button>
      </div>

      <div className="suggested-accounts">
        <div className="section-label">Аккаунты</div>
        {currentUser ? (
          <div className="suggested-row">
            <Avatar user={currentUser} size="sm" />
            <div>
              <strong>{currentUser.handle}</strong>
              <span>0 подписчиков</span>
            </div>
          </div>
        ) : (
          <div className="empty-mini">Зарегистрированных авторов пока нет.</div>
        )}
      </div>
    </aside>
  );
}

function PeopleSearchDropdown({
  query,
  peopleResults,
  currentUser,
  followed,
  onOpenAccount,
  onFollowAccount,
  openLogin,
}) {
  const cleanQuery = query.trim();
  const hasQuery = Boolean(cleanQuery);

  return (
    <div className="people-search-popover" onMouseDown={(event) => event.preventDefault()}>
      <div className="people-search-head">
        <span>{hasQuery ? "Люди по запросу" : "Поиск людей"}</span>
        <b>{peopleResults.length ? `${peopleResults.length} аккаунт` : "нет совпадений"}</b>
      </div>

      {peopleResults.length ? (
        <div className="people-results">
          {peopleResults.map((account) => {
            const isOwnAccount = currentUser?.id === account.id;
            const isFollowing = followed.includes(account.id);
            return (
              <article className="people-result-card" key={account.id}>
                <button
                  className="people-main-button"
                  type="button"
                  onClick={() => onOpenAccount(account)}
                >
                  <Avatar user={account} size="md" />
                  <div>
                    <strong>
                      @{account.handle}
                      {account.verified ? <CheckCircle2 size={14} /> : null}
                      {account.premium ? <Crown size={13} /> : null}
                    </strong>
                    <span>{account.name}</span>
                    <em>{account.bio || "Публичный профиль VibeTok"}</em>
                  </div>
                </button>
                {isOwnAccount ? (
                  <span className="people-self-pill">Вы</span>
                ) : (
                  <button
                    className={`people-follow-button ${isFollowing ? "is-on" : ""}`}
                    type="button"
                    onClick={() => (currentUser ? onFollowAccount(account.id) : openLogin())}
                  >
                    {isFollowing ? "Подписка" : "Подписаться"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="people-empty">
          {hasQuery
            ? `Зарегистрированных людей по запросу “${cleanQuery}” пока нет.`
            : "Когда люди зарегистрируются, они появятся здесь."}
        </div>
      )}
    </div>
  );
}

function TopBar({
  feedMode,
  setFeedMode,
  feedCount,
  query,
  setQuery,
  selectedTag,
  setSelectedTag,
  openUpload,
  openLogin,
  openAdmin,
  currentUser,
  signOut,
  showToast,
  openRecommendationSettings,
  peopleResults,
  followed,
  onOpenAccount,
  onFollowAccount,
}) {
  const [peopleSearchOpen, setPeopleSearchOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="search-wrap">
        <Search size={20} />
        <input
          value={query}
          onFocus={() => setPeopleSearchOpen(true)}
          onClick={() => setPeopleSearchOpen(true)}
          onBlur={() => setPeopleSearchOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setPeopleSearchOpen(false);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setPeopleSearchOpen(true);
          }}
          placeholder="Поиск видео и людей"
          aria-label="Поиск видео, тегов и людей"
        />
        <IconButton
          icon={SlidersHorizontal}
          label="Фильтры рекомендаций"
          onClick={openRecommendationSettings}
        />
        {peopleSearchOpen ? (
          <PeopleSearchDropdown
            query={query}
            peopleResults={peopleResults}
            currentUser={currentUser}
            followed={followed}
            onOpenAccount={(account) => {
              setPeopleSearchOpen(false);
              onOpenAccount(account);
            }}
            onFollowAccount={onFollowAccount}
            openLogin={openLogin}
          />
        ) : null}
      </div>

      <div className="feed-tabs" role="tablist" aria-label="Тип ленты">
        <button
          className={feedMode === "forYou" ? "is-active" : ""}
          type="button"
          onClick={() => setFeedMode("forYou")}
        >
          Для тебя
        </button>
        <button
          className={feedMode === "following" ? "is-active" : ""}
          type="button"
          onClick={() => setFeedMode("following")}
        >
          Подписки
        </button>
      </div>

      <div className="feed-count-pill">
        <Clapperboard size={16} />
        <span>{compactNumber(feedCount)} видео</span>
      </div>

      <div className="tag-strip" aria-label="Рекомендации по интересам">
        {TAGS.map((tag) => (
          <button
            key={tag}
            className={selectedTag === tag ? "is-active" : ""}
            type="button"
            onClick={() => setSelectedTag(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="top-actions">
        <PrimaryButton icon={Plus} onClick={openUpload}>
          Загрузить
        </PrimaryButton>
        <IconButton
          icon={Send}
          label="Поделиться профилем"
          onClick={() => {
            navigator.clipboard?.writeText(`https://vibetok.local/@${currentUser?.handle ?? "guest"}`).catch(() => {});
            showToast("Ссылка на профиль скопирована");
          }}
        />
        <IconButton
          icon={Bell}
          label="Уведомления"
          className="has-badge"
          onClick={() => showToast("Уведомления просмотрены")}
        />
        {currentUser?.role === "admin" ? (
          <IconButton
            icon={ShieldCheck}
            label="Админ-панель"
            onClick={openAdmin}
          />
        ) : null}
        {currentUser ? (
          <button className="user-pill" type="button" onClick={signOut}>
            <Avatar user={currentUser} size="xs" />
            <span>Выйти</span>
            <LogOut size={16} />
          </button>
        ) : (
          <button className="user-pill" type="button" onClick={openLogin}>
            <LogIn size={17} />
            <span>Войти</span>
          </button>
        )}
      </div>
    </header>
  );
}

function VideoStage({
  video,
  creator,
  currentUser,
  isLiked,
  isSaved,
  isFollowing,
  toggleLike,
  toggleSave,
  toggleFollow,
  nextVideo,
  prevVideo,
  onReport,
  openLogin,
  openUpload,
  showToast,
}) {
  const videoRef = useRef(null);
  const embeddedFrameRef = useRef(null);
  const embeddedSoundAttemptsRef = useRef(0);
  const videoTapStartRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const isEmbeddedVideo = Boolean(video.embedUrl);

  useEffect(() => {
    if (isEmbeddedVideo) {
      setPlaying(true);
      setMuted(false);
      setProgress(0);
      setDuration(0);
      embeddedSoundAttemptsRef.current = 0;
      const autoplayTimers = [120, 420, 900, 1500].map((delay) =>
        window.setTimeout(() => {
          sendEmbeddedCommand("unMute");
          sendEmbeddedCommand("play");
        }, delay),
      );
      return () => autoplayTimers.forEach((timer) => window.clearTimeout(timer));
    }
    const element = videoRef.current;
    if (!element) return;
    element.muted = false;
    element.volume = 1;
    setProgress(0);
    const playPromise = element.play();
    if (playPromise?.then) {
      playPromise
        .then(() => {
          setMuted(false);
          setPlaying(true);
        })
        .catch(() => {
          element.muted = true;
          setMuted(true);
          element
            .play()
            .then(() => setPlaying(true))
            .catch(() => setPlaying(false));
        });
    }
    return undefined;
  }, [video.id, isEmbeddedVideo]);

  useEffect(() => {
    if (!isEmbeddedVideo) return undefined;

    function handleEmbeddedMessage(event) {
      if (event.source !== embeddedFrameRef.current?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data !== "object" || data["x-tiktok-player"] !== true) return;

      if (data.type === "onPlayerReady") {
        embeddedSoundAttemptsRef.current = 0;
        sendEmbeddedCommand("unMute");
        sendEmbeddedCommand("play");
        setMuted(false);
        setPlaying(true);
      }

      if (data.type === "onStateChange") {
        setPlaying(data.value === 1);
      }

      if (data.type === "onCurrentTime" && data.value) {
        const currentTime = Number(data.value.currentTime) || 0;
        const nextDuration = Number(data.value.duration) || 0;
        setDuration(nextDuration);
        setProgress(nextDuration ? (currentTime / nextDuration) * 100 : 0);
      }

      if (data.type === "onMute") {
        if (data.value) {
          embeddedSoundAttemptsRef.current += 1;
          if (embeddedSoundAttemptsRef.current <= 6) {
            setMuted(false);
            window.setTimeout(() => {
              sendEmbeddedCommand("unMute");
              sendEmbeddedCommand("play");
            }, embeddedSoundAttemptsRef.current * 180);
          } else {
            setMuted(true);
          }
        } else {
          embeddedSoundAttemptsRef.current = 0;
          setMuted(false);
        }
      }
    }

    window.addEventListener("message", handleEmbeddedMessage);
    return () => window.removeEventListener("message", handleEmbeddedMessage);
  }, [isEmbeddedVideo, video.id]);

  function sendEmbeddedCommand(type, value) {
    embeddedFrameRef.current?.contentWindow?.postMessage(
      { type, value, "x-tiktok-player": true },
      "*",
    );
  }

  async function enableSound() {
    setMuted(false);
    if (isEmbeddedVideo) {
      sendEmbeddedCommand("unMute");
      sendEmbeddedCommand("play");
      setPlaying(true);
      showToast("Звук включен");
      return;
    }
    const element = videoRef.current;
    if (!element) return;
    element.muted = false;
    element.volume = 1;
    try {
      await element.play();
      setPlaying(true);
      showToast("Звук включен");
    } catch {
      showToast("Нажмите play, чтобы включить звук");
    }
  }

  function togglePlayback() {
    if (isEmbeddedVideo) {
      const nextPlaying = !playing;
      sendEmbeddedCommand(nextPlaying ? "play" : "pause");
      setPlaying(nextPlaying);
      showToast(nextPlaying ? "Видео запущено внутри VibeTok" : "Видео на паузе");
      return;
    }
    const element = videoRef.current;
    if (!element) return;
    if (muted) {
      enableSound();
      return;
    }
    if (element.paused) {
      element.play();
      setPlaying(true);
    } else {
      element.pause();
      setPlaying(false);
    }
  }

  function isVideoShellActionTarget(target) {
    return target.closest("button, a, input, textarea, select");
  }

  function handleVideoShellPointerDown(event) {
    if (!["mouse", "touch", "pen"].includes(event.pointerType)) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (isVideoShellActionTarget(event.target)) return;
    videoTapStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: Date.now(),
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handleVideoShellPointerCancel() {
    videoTapStartRef.current = null;
  }

  function handleVideoShellPointerUp(event) {
    if (!["mouse", "touch", "pen"].includes(event.pointerType)) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (isVideoShellActionTarget(event.target)) return;
    const tapStart = videoTapStartRef.current;
    videoTapStartRef.current = null;
    if (!tapStart || tapStart.pointerId !== event.pointerId) return;
    const deltaX = Math.abs(event.clientX - tapStart.x);
    const deltaY = Math.abs(event.clientY - tapStart.y);
    const elapsed = Date.now() - tapStart.time;
    if (deltaX > 22 || deltaY > 22 || elapsed > 700) return;
    nextVideo();
  }

  function handleShare() {
    const shareText = `VibeTok: @${creator.handle} - ${video.caption}`;
    navigator.clipboard?.writeText(shareText).catch(() => {});
    showToast("Ссылка на видео скопирована");
  }

  return (
    <section className="video-stage" aria-label="Лента коротких видео">
      <div className={`ambient ambient-${video.vibe}`} />
      <div
        className="video-shell"
        onPointerDown={handleVideoShellPointerDown}
        onPointerCancel={handleVideoShellPointerCancel}
        onPointerUp={handleVideoShellPointerUp}
      >
        {isEmbeddedVideo ? (
          <div className="main-video tiktok-crop-frame">
            <iframe
              ref={embeddedFrameRef}
              key={video.id}
              className="embedded-video"
              src={video.embedUrl}
              title={video.caption}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            key={video.id}
            className="main-video"
            src={video.source}
            playsInline
            muted={muted}
            loop
            autoPlay
            preload="metadata"
            onTimeUpdate={(event) => {
              const element = event.currentTarget;
              if (element.duration) setProgress((element.currentTime / element.duration) * 100);
            }}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
          />
        )}
        <div className="video-gradient" />
        {muted ? (
          <button className="sound-unlock" type="button" onClick={enableSound}>
            <Volume2 size={18} />
            <span>Включить звук</span>
          </button>
        ) : null}

        <div className="video-menu">
          <IconButton
            icon={MoreHorizontal}
            label="Еще"
            onClick={() => showToast("Быстрые фишки: дуэт, клип, сохранить")}
          />
        </div>

        <div className="stage-controls">
          <IconButton icon={SkipBack} label="Предыдущее видео" onClick={prevVideo} />
          <button className="play-toggle" type="button" onClick={togglePlayback}>
            {playing ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <IconButton icon={SkipForward} label="Следующее видео" onClick={nextVideo} />
          <IconButton
            icon={muted ? VolumeX : Volume2}
            label={muted ? "Включить звук" : "Выключить звук"}
            onClick={() => {
              if (muted) {
                enableSound();
              } else {
                setMuted(true);
                if (isEmbeddedVideo) sendEmbeddedCommand("mute");
                showToast("Звук выключен");
              }
            }}
          />
        </div>

        <div className="video-meta">
          <div className="creator-line">
            <strong>{creator.isSource ? creator.handle : `@${creator.handle}`}</strong>
            {creator.verified ? <CheckCircle2 size={16} /> : null}
            {creator.premium ? (
              <span className="premium-badge">
                <Crown size={13} />
                Premium
              </span>
            ) : null}
            {!creator.isSource ? (
            <button
              type="button"
              onClick={() => (currentUser ? toggleFollow(creator.id) : openLogin())}
            >
              {isFollowing ? "Подписка" : "Подписаться"}
            </button>
            ) : null}
          </div>
          <p>{video.caption}</p>
          <div className="tag-row">
            {video.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
          <div className="music-line">
            <Music2 size={17} />
            <span>{video.music}</span>
          </div>
        </div>

        <div className="progress-track" aria-label="Прогресс видео">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="time-chip">
          {duration ? `${Math.round(progress)}%` : video.duration}
        </div>
      </div>

      <div className="action-rail" aria-label="Действия видео">
        {!creator.isSource ? (
        <button
          className="creator-follow"
          type="button"
          onClick={() => (currentUser ? toggleFollow(creator.id) : openLogin())}
        >
          <Avatar user={creator} size="lg" />
          <span>
            <Plus size={18} />
          </span>
        </button>
        ) : null}
        <RailAction
          icon={Heart}
          label="Лайк"
          value={video.likes + (isLiked ? 1 : 0)}
          active={isLiked}
          onClick={() => (currentUser ? toggleLike(video.id) : openLogin())}
        />
        <RailAction
          icon={MessageCircle}
          label="Комментарии"
          value={video.comments}
          onClick={() => showToast("Комментарии открыты справа")}
        />
        <RailAction icon={Share2} label="Поделиться" value={video.shares} onClick={handleShare} />
        <RailAction
          icon={Flag}
          label="Жалоба"
          value="mod"
          onClick={() => onReport(video)}
        />
        <RailAction
          icon={Bookmark}
          label="Сохранить"
          value={video.saves + (isSaved ? 1 : 0)}
          active={isSaved}
          onClick={() => (currentUser ? toggleSave(video.id) : openLogin())}
        />
        <RailAction icon={Repeat2} label="Дуэт" value="Дуэт" onClick={openUpload} />
        <RailAction icon={Scissors} label="Клип" value="Клип" onClick={openUpload} />
      </div>
    </section>
  );
}

function RailAction({ icon: Icon, label, value, active, onClick }) {
  return (
    <button className={`rail-action ${active ? "is-active" : ""}`} type="button" onClick={onClick}>
      <span>
        <Icon size={26} fill={active && Icon === Heart ? "currentColor" : "none"} />
      </span>
      <b>{typeof value === "number" ? compactNumber(value) : value}</b>
      <em>{label}</em>
    </button>
  );
}

function CommentsPanel({
  video,
  creator,
  comments,
  currentUser,
  addComment,
  openLogin,
  showToast,
}) {
  const [draft, setDraft] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!currentUser) {
      openLogin();
      return;
    }
    const text = draft.trim();
    if (!text) return;
    addComment(video.id, text);
    setDraft("");
  }

  return (
    <aside className="comments-panel" aria-label="Комментарии">
      <div className="panel-header">
        <div>
          <h2>Комментарии</h2>
          <span>{compactNumber(video.comments + comments.length)} комментариев</span>
        </div>
        <IconButton
          icon={X}
          label="Закрыть комментарии"
          onClick={() => showToast("Панель комментариев закреплена")}
        />
      </div>

      <div className="pinned-comment">
        <Avatar user={creator} size="sm" />
        <div>
            <strong>{creator.isSource ? creator.handle : `@${creator.handle}`}</strong>
          <p>{video.caption}</p>
        </div>
      </div>

      <div className="comments-list">
        {comments.length ? (
          comments.map((comment) => (
          <article className="comment" key={comment.id}>
            <Avatar
              user={{
                avatar: comment.user
                  .split(".")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase(),
                gradient: "linear-gradient(135deg, #343448, #7b7b95)",
              }}
              size="sm"
            />
            <div className="comment-body">
              <strong>{comment.user}</strong>
              <p>{comment.text}</p>
              <span>{comment.time} · Ответить</span>
            </div>
            <button className="comment-like" type="button" aria-label="Лайк комментария">
              <Heart size={18} />
              <span>{comment.likes}</span>
            </button>
          </article>
          ))
        ) : (
          <div className="empty-comments">
            <MessageCircle size={26} />
            <p>Комментариев пока нет.</p>
          </div>
        )}
      </div>

      <form className="comment-form" onSubmit={submit}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={currentUser ? "Добавьте комментарий..." : "Войдите, чтобы комментировать"}
        />
        <IconButton icon={AtSign} label="Упомянуть" />
        <IconButton icon={SmilePlus} label="Эмоции" />
        <button type="submit">Отправить</button>
      </form>
    </aside>
  );
}

function RecommendationsPanel({
  videos,
  currentVideoId,
  setCurrentVideoById,
  selectedTag,
  setSelectedTag,
  followed,
  toggleFollow,
  currentUser,
  openProfile,
  openLogin,
  showToast,
  recommendationProfile,
  recommendationConsent,
  openRecommendationSettings,
}) {
  const personalizationEnabled =
    recommendationConsent.termsAccepted && recommendationConsent.personalizeInApp;
  const topInterests = [
    ...recommendationProfile.topTags.map((tag) => `#${tag}`),
    ...recommendationProfile.topTokens,
  ].slice(0, 8);

  return (
    <aside className="recommendations-panel" aria-label="Рекомендации">
      <section className="side-panel">
        <div className="panel-header compact">
          <h2>Рекомендации</h2>
          <IconButton
            icon={SlidersHorizontal}
            label="Настроить рекомендации"
            onClick={openRecommendationSettings}
          />
        </div>

        <div className="reco-status">
          <Sparkles size={17} />
          <div>
            <strong>{personalizationEnabled ? "Лента учится" : "Персонализация выключена"}</strong>
            <span>
              {personalizationEnabled
                ? "Учитываем лайки, сохранения, подписки и досмотры."
                : "Нажмите настройки и дайте согласие."}
            </span>
          </div>
        </div>

        {topInterests.length ? (
          <div className="reco-chips" aria-label="Главные интересы">
            {topInterests.map((interest) => (
              <span key={interest}>{interest}</span>
            ))}
          </div>
        ) : null}

        <div className="recommendation-list">
          {videos.slice(0, 24).map((video, index) => {
            const creator = getCreator(video.creatorId);
            const reason = explainRecommendation(video, recommendationProfile, recommendationConsent);
            return (
              <button
                key={video.id}
                className={`recommendation-item ${
                  currentVideoId === video.id ? "is-active" : ""
                }`}
                type="button"
                onClick={() => setCurrentVideoById(video.id)}
              >
                <div className={`thumb thumb-${video.vibe}`}>
                  <span>{video.duration}</span>
                </div>
                <div>
                  <strong>{video.caption}</strong>
                  <span>@{creator.handle}</span>
                  <em>
                    <Sparkles size={14} />
                    {reason}
                  </em>
                </div>
                <b>{index + 1}</b>
              </button>
            );
          })}
        </div>
      </section>

      <section className="side-panel tune-panel">
        <div className="panel-header compact">
          <h2>Тюнинг ленты</h2>
          <IconButton
            icon={RefreshCw}
            label="Обновить рекомендации"
            onClick={() => showToast("Рекомендации пересчитаны")}
          />
        </div>
        <div className="interest-grid">
          {TAGS.map((tag) => (
            <button
              key={tag}
              className={selectedTag === tag ? "is-active" : ""}
              type="button"
              onClick={() => setSelectedTag(tag)}
            >
              <Hash size={14} />
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="side-panel profile-panel">
        <div className="panel-header compact">
          <h2>Мой профиль</h2>
          <Settings size={18} />
        </div>
        {currentUser ? (
          <>
            <div className="profile-summary">
              <Avatar user={currentUser} size="xl" />
              <div>
                <strong>
                  {currentUser.handle}
                  {currentUser.verified ? <CheckCircle2 size={16} /> : null}
                  {currentUser.premium ? <Crown size={15} /> : null}
                </strong>
                <span>{currentUser.name}</span>
              </div>
            </div>
            <div className="profile-stats">
              <div>
                <strong>{followed.length}</strong>
                <span>Подписки</span>
              </div>
              <div>
                <strong>{currentUser.followers ?? 0}</strong>
                <span>Подписчики</span>
              </div>
              <div>
                <strong>{currentUser.likes ?? 0}</strong>
                <span>Лайки</span>
              </div>
            </div>
            <PrimaryButton icon={Pencil} onClick={openProfile}>
              Редактировать профиль
            </PrimaryButton>
          </>
        ) : (
          <PrimaryButton icon={LogIn} onClick={openLogin}>
            Войти в аккаунт
          </PrimaryButton>
        )}
      </section>

      <section className="side-panel">
        <div className="panel-header compact">
          <h2>Кого смотреть</h2>
          <Users size={18} />
        </div>
        <div className="creator-stack">
          <div className="empty-mini">Здесь появятся только реальные зарегистрированные аккаунты.</div>
        </div>
      </section>
    </aside>
  );
}

function LiveView({ currentUser, openLogin, showToast }) {
  const liveVideoRef = useRef(null);
  const [chatDraft, setChatDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [mediaError, setMediaError] = useState("");
  const host = currentUser ?? PUBLIC_VIDEO_SOURCE;
  const activeLive = {
    title: currentUser
      ? isStreaming
        ? `@${currentUser.handle} в эфире`
        : "Эфир еще не запущен"
      : "Войдите, чтобы начать LIVE",
    topic: currentUser ? "Ваш эфир" : "Регистрация",
    viewers: viewerCount,
  };

  useEffect(() => {
    if (liveVideoRef.current && stream) {
      liveVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!isStreaming) return undefined;
    const timer = window.setInterval(() => {
      setViewerCount((count) => Math.max(0, count + (Math.random() > 0.45 ? 1 : -1)));
    }, 2600);
    return () => window.clearInterval(timer);
  }, [isStreaming]);

  useEffect(
    () => () => {
      stream?.getTracks().forEach((track) => track.stop());
    },
    [stream],
  );

  async function startLive() {
    if (!currentUser) {
      openLogin();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaError("Браузер не дал доступ к камере и микрофону");
      return;
    }
    setMediaError("");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      setCameraOn(true);
      setMicOn(true);
      setViewerCount(0);
      setIsStreaming(true);
      showToast("LIVE запущен: камера и микрофон работают");
    } catch {
      setMediaError("Разрешите камеру и микрофон, чтобы начать эфир");
      showToast("Нет доступа к камере или микрофону");
    }
  }

  function stopLive() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsStreaming(false);
    setViewerCount(0);
    showToast("Стрим остановлен");
  }

  function toggleTrack(kind) {
    if (!stream) return;
    const tracks = kind === "video" ? stream.getVideoTracks() : stream.getAudioTracks();
    const nextEnabled = !(kind === "video" ? cameraOn : micOn);
    tracks.forEach((track) => {
      track.enabled = nextEnabled;
    });
    if (kind === "video") {
      setCameraOn(nextEnabled);
    } else {
      setMicOn(nextEnabled);
    }
  }

  function sendLiveMessage(event) {
    event.preventDefault();
    if (!currentUser) {
      openLogin();
      return;
    }
    const text = chatDraft.trim();
    if (!text) return;
    setMessages((items) => [
      ...items,
      { id: `live-${Date.now()}`, user: currentUser.handle, text },
    ]);
    setChatDraft("");
  }

  return (
    <main className="live-view">
      <section className="live-stage">
        <div className="live-player">
          {stream ? (
            <video
              ref={liveVideoRef}
              className="live-video"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <div className="live-visual">
              <div className="broadcast-lines" />
              <Video size={72} />
            </div>
          )}
          <div className="live-overlay">
            <span className={isStreaming ? "live-badge" : "live-badge is-off"}>
              {isStreaming ? "LIVE" : "OFFLINE"}
            </span>
            <strong>{activeLive.title}</strong>
            <span>
              <Eye size={16} />
              {compactNumber(activeLive.viewers)} смотрят
            </span>
          </div>
        </div>
        <div className="live-info">
          <Avatar user={host} size="lg" />
          <div>
            <strong>{currentUser ? `@${host.handle}` : "Нет аккаунта"}</strong>
            <span>{activeLive.topic}</span>
          </div>
          <PrimaryButton icon={LogIn} onClick={currentUser ? undefined : openLogin}>
            {currentUser ? `${compactNumber(currentUser.followers ?? 0)} подписчиков` : "Зарегистрироваться"}
          </PrimaryButton>
          <GhostButton icon={Camera} onClick={isStreaming ? stopLive : startLive}>
            {isStreaming ? "Остановить" : "Начать стрим"}
          </GhostButton>
          <IconButton
            icon={Camera}
            label={cameraOn ? "Выключить камеру" : "Включить камеру"}
            active={cameraOn}
            onClick={() => toggleTrack("video")}
          />
          <IconButton
            icon={Mic2}
            label={micOn ? "Выключить микрофон" : "Включить микрофон"}
            active={micOn}
            onClick={() => toggleTrack("audio")}
          />
        </div>
        {mediaError ? <p className="live-error">{mediaError}</p> : null}
      </section>

      <aside className="live-chat">
        <div className="panel-header">
          <div>
            <h2>Чат стрима</h2>
            <span>Подарки, вопросы и реакции</span>
          </div>
          <Gift size={21} />
        </div>
        <div className="gift-row">
          {["Star", "Boost", "Wave"].map((gift) => (
            <button
              key={gift}
              type="button"
              onClick={() => showToast(`Подарок ${gift} отправлен`)}
            >
              <Gift size={17} />
              {gift}
            </button>
          ))}
        </div>
        <div className="live-messages">
          {messages.map((message) => (
            <p key={message.id}>
              <strong>{message.user}</strong>
              <span>{message.text}</span>
            </p>
          ))}
        </div>
        <form className="comment-form" onSubmit={sendLiveMessage}>
          <input
            value={chatDraft}
            onChange={(event) => setChatDraft(event.target.value)}
            placeholder="Написать в чат..."
          />
          <button type="submit">Отправить</button>
        </form>
      </aside>

      <section className="live-directory">
        <div className="empty-block">
          <Radio size={34} />
          <p>Активных трансляций пока нет. Первый настоящий стрим начнется с 0 зрителей.</p>
        </div>
      </section>
    </main>
  );
}

function MessagesView({ currentUser, openLogin }) {
  const [selected, setSelected] = useState("");
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState([]);

  const thread = threads.find((item) => item.name === selected) ?? threads[0];

  function sendMessage(event) {
    event.preventDefault();
    if (!currentUser) {
      openLogin();
      return;
    }
    const text = draft.trim();
    if (!text) return;
    if (!thread) return;
    setThreads((items) =>
      items.map((item) =>
        item.id === thread.id
          ? { ...item, last: text, messages: [...item.messages, text], unread: 0 }
          : item,
      ),
    );
    setDraft("");
  }

  return (
    <main className="messages-view">
      <section className="thread-list">
        <h1>Сообщения</h1>
        {threads.length ? (
          threads.map((item) => (
          <button
            key={item.id}
            className={selected === item.name ? "thread is-active" : "thread"}
            type="button"
            onClick={() => setSelected(item.name)}
          >
            <Avatar
              user={{
                avatar: item.name.slice(0, 2).toUpperCase(),
                gradient: "linear-gradient(135deg, #ff2d6f, #00e5ff)",
              }}
              size="sm"
            />
            <div>
              <strong>{item.name}</strong>
              <span>{item.last}</span>
            </div>
            {item.unread ? <b>{item.unread}</b> : null}
          </button>
          ))
        ) : (
          <div className="empty-mini">Диалогов пока нет.</div>
        )}
      </section>
      <section className="thread-panel">
        {thread ? (
          <>
          <div className="panel-header">
            <div>
              <h2>{thread.name}</h2>
              <span>Быстрый чат и коллаборации</span>
            </div>
            <IconButton icon={Video} label="Видеозвонок" />
          </div>
          <div className="message-bubbles">
            {thread.messages.map((message, index) => (
              <p className={index % 2 ? "mine" : ""} key={`${thread.id}-${index}`}>
                {message}
              </p>
            ))}
          </div>
          <form className="comment-form" onSubmit={sendMessage}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Написать сообщение..."
            />
            <button type="submit">Отправить</button>
          </form>
          </>
        ) : (
          <div className="empty-block">
            <MessageCircle size={38} />
            <p>Сообщений пока нет. Новые диалоги появятся только с реальными аккаунтами.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function ProfileView({
  currentUser,
  profileUser = currentUser,
  isOwnProfile = true,
  isFollowing = false,
  toggleFollowProfile,
  uploads,
  likedCount,
  followedCount,
  openProfile,
  openUpload,
  openLogin,
  showToast,
}) {
  if (!profileUser) {
    return (
      <main className="empty-view">
        <LogIn size={52} />
        <h1>Войдите в аккаунт</h1>
        <p>После входа появятся профиль, настройки, загрузки и статистика.</p>
        <PrimaryButton icon={LogIn} onClick={openLogin}>
          Войти
        </PrimaryButton>
      </main>
    );
  }

  const profileUploads = isOwnProfile
    ? uploads
    : uploads.filter((video) => video.creatorId === profileUser.id);
  const displayFollowers =
    (profileUser.followers ?? 0) + (!isOwnProfile && isFollowing ? 1 : 0);
  const displayLikes = isOwnProfile ? likedCount : profileUser.likes ?? 0;
  const displayVideos = isOwnProfile ? profileUploads.length : profileUser.videos ?? profileUploads.length;
  const displayFollowing = isOwnProfile ? followedCount : 0;

  return (
    <main className="profile-view">
      <section className="profile-hero" style={{ "--profile-accent": profileUser.accent ?? "#ff2d6f" }}>
        <div className="profile-cover" />
        <Avatar user={profileUser} size="xxl" />
        <div className="profile-copy">
          <span className="display-name">{profileUser.name}</span>
          <h1>
            @{profileUser.handle}
            {profileUser.verified ? <CheckCircle2 size={22} /> : null}
            {profileUser.premium ? (
              <span className="profile-premium">
                <Crown size={16} />
                Premium
              </span>
            ) : null}
          </h1>
          <p>{profileUser.bio}</p>
        </div>
        <div className="profile-actions">
          {isOwnProfile ? (
            <>
              <PrimaryButton icon={Pencil} onClick={openProfile}>
                Редактировать профиль
              </PrimaryButton>
              <GhostButton icon={Upload} onClick={openUpload}>
                Новое видео
              </GhostButton>
            </>
          ) : (
            <>
              <PrimaryButton
                icon={isFollowing ? CheckCircle2 : Plus}
                onClick={() => (currentUser ? toggleFollowProfile() : openLogin())}
              >
                {isFollowing ? "Вы подписаны" : "Подписаться"}
              </PrimaryButton>
              <GhostButton
                icon={MessageCircle}
                onClick={() =>
                  currentUser
                    ? showToast(`Диалог с @${profileUser.handle} открыт`)
                    : openLogin()
                }
              >
                Сообщение
              </GhostButton>
            </>
          )}
        </div>
      </section>

      <section className="profile-grid">
        <div className="metric-card">
          <strong>{displayFollowers}</strong>
          <span>Подписчики</span>
        </div>
        <div className="metric-card">
          <strong>{displayLikes}</strong>
          <span>Лайки</span>
        </div>
        <div className="metric-card">
          <strong>{displayVideos}</strong>
          <span>Загрузки</span>
        </div>
        <div className="metric-card">
          <strong>{displayFollowing}</strong>
          <span>Подписки</span>
        </div>
      </section>

      <section className="profile-content">
        <div className="panel-header">
          <div>
            <h2>{isOwnProfile ? "Мои видео" : "Видео аккаунта"}</h2>
            <span>
              {isOwnProfile
                ? "Локальные загрузки текущей сессии"
                : `Публичные ролики @${profileUser.handle}`}
            </span>
          </div>
          <Clapperboard size={20} />
        </div>
        {profileUploads.length ? (
          <div className="upload-grid">
            {profileUploads.map((video) => (
              <article className="upload-card" key={video.id}>
                {video.embedUrl ? (
                  <iframe
                    className="upload-embed"
                    src={video.embedUrl}
                    title={video.caption}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={video.source} muted playsInline preload="metadata" />
                )}
                <strong>{video.caption}</strong>
                <span>{video.tags.map((tag) => `#${tag}`).join(" ")}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-block">
            <Upload size={38} />
            <p>
              {isOwnProfile
                ? "Пока нет своих видео. Загрузите первый ролик и он появится в ленте."
                : "У этого аккаунта пока нет публичных видео."}
            </p>
            {isOwnProfile ? (
              <PrimaryButton icon={Upload} onClick={openUpload}>
                Загрузить
              </PrimaryButton>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}

function UploadModal({ currentUser, onClose, onUpload, openLogin }) {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [bulkLinks, setBulkLinks] = useState("");
  const [caption, setCaption] = useState("Мой новый вайб");
  const [tags, setTags] = useState("vibetok, new");
  const [visibility, setVisibility] = useState("public");
  const cleanLink = link.trim();
  const cleanBulkLinks = bulkLinks.trim();
  const parsedBulkLinks = useMemo(() => parseTikTokImportList(cleanBulkLinks), [cleanBulkLinks]);
  const linkEmbedUrl = cleanLink ? getTikTokEmbedUrl(cleanLink) : null;
  const linkIsPlayable = Boolean(cleanLink && (linkEmbedUrl || isDirectVideoUrl(cleanLink)));
  const canBulkImport = parsedBulkLinks.valid.length > 0;
  const canPublish = Boolean(file || linkIsPlayable || canBulkImport);

  function submit(event) {
    event.preventDefault();
    if (!currentUser) {
      openLogin();
      return;
    }
    if (!canPublish) return;
    if (canBulkImport) {
      const now = Date.now();
      onUpload(
        parsedBulkLinks.valid.map((item, index) => ({
          id: `tiktok-${item.postId}-${now}-${index}`,
          creatorId: "internet",
          source: item.originalUrl,
          embedUrl: item.embedUrl,
          externalUrl: item.originalUrl,
          caption: `TikTok @${item.handle} #${index + 1}`,
          music: "Original sound - TikTok",
          tags: ["tiktok", "real", "viral"],
          likes: 0,
          comments: 0,
          shares: 0,
          saves: 0,
          duration: "TikTok",
          vibe: index % 2 ? "music" : "city",
          visibility,
          importedFrom: "tiktok",
        })),
      );
      onClose();
      return;
    }
    const embedUrl = file ? null : linkEmbedUrl;
    const source = file ? URL.createObjectURL(file) : cleanLink;
    onUpload({
      id: `upload-${Date.now()}`,
      creatorId: "me",
      source,
      embedUrl,
      externalUrl: cleanLink || null,
      caption,
      music: "Original sound - " + currentUser.handle,
      tags: tags
        .split(",")
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter(Boolean),
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      duration: embedUrl ? "TikTok" : "new",
      vibe: "upload",
      visibility,
    });
    onClose();
  }

  return (
    <Modal title="Загрузить видео" icon={Upload} onClose={onClose}>
      <form className="upload-form" onSubmit={submit}>
        <label className="drop-zone">
          <input
            type="file"
            accept="video/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <Upload size={32} />
          <strong>{file ? file.name : "Выберите видео"}</strong>
          <span>MP4, WebM или MOV. Можно также вставить ссылку ниже.</span>
        </label>
        <label>
          Ссылка на TikTok или прямое MP4
          <input
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://www.tiktok.com/@name/video/123 или https://site/video.mp4"
          />
        </label>
        {cleanLink && !linkIsPlayable ? (
          <p className="upload-hint">Нужна полная TikTok-ссылка с /video/ или прямая ссылка на MP4/WebM/MOV.</p>
        ) : null}
        <label>
          Описание
          <textarea value={caption} onChange={(event) => setCaption(event.target.value)} />
        </label>
        <label>
          Теги через запятую
          <input value={tags} onChange={(event) => setTags(event.target.value)} />
        </label>
        <label>
          Массовый импорт TikTok
          <textarea
            value={bulkLinks}
            onChange={(event) => setBulkLinks(event.target.value)}
            placeholder="Вставьте до 500 ссылок TikTok, по одной в строке"
          />
        </label>
        {cleanBulkLinks ? (
          <div className="bulk-import-status">
            <strong>{parsedBulkLinks.valid.length} готово к импорту</strong>
            <span>
              {parsedBulkLinks.invalid.length} неверных ссылок
              {parsedBulkLinks.overflow ? `, ${parsedBulkLinks.overflow} сверх лимита 500` : ""}
            </span>
          </div>
        ) : null}
        <div className="segmented">
          {[
            ["public", "Всем"],
            ["followers", "Подписчикам"],
            ["draft", "Черновик"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={visibility === id ? "is-active" : ""}
              type="button"
              onClick={() => setVisibility(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="modal-actions">
          <GhostButton icon={X} onClick={onClose}>
            Отмена
          </GhostButton>
          <PrimaryButton
            icon={Upload}
            type="submit"
            disabled={!canPublish}
            className={!canPublish ? "is-disabled" : ""}
          >
            Опубликовать
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

function LoginModal({ accounts, onClose, onLogin, authApi, apiStatus }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLogin(event) {
    event.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();

    if (authApi) {
      setIsSubmitting(true);
      try {
        const user = await authApi.login({ email: normalizedEmail, password });
        onLogin(user);
        return;
      } catch (requestError) {
        setError(requestError.message || "Не удалось войти через общую базу");
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    const account = accounts.find((item) => item.email === normalizedEmail);
    if (!account || (account.password && account.password !== password)) {
      setError("Неверный email или пароль");
      return;
    }
    if (account.suspended) {
      setError("Аккаунт заблокирован модерацией");
      return;
    }
    onLogin(account.password ? account : { ...account, password });
  }

  async function submitRegistration(event) {
    event.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    const cleanHandle = handle.trim().replace(/^@/, "").replace(/\s+/g, ".").toLowerCase();
    const displayName = name.trim() || cleanHandle;
    if (!normalizedEmail || !cleanHandle || password.length < 4) {
      setError("Введите email, ник и пароль от 4 символов");
      return;
    }
    const existingAccount = accounts.find((account) => account.email === normalizedEmail);
    if (existingAccount) {
      setError("Такой email уже зарегистрирован. Переключитесь на вход.");
      return;
    }
    const existingHandle = accounts.find(
      (account) => account.handle?.toLowerCase() === cleanHandle,
    );
    if (existingHandle) {
      setError("Такой ник уже занят");
      return;
    }

    if (authApi) {
      setIsSubmitting(true);
      try {
        const user = await authApi.register({
          email: normalizedEmail,
          password,
          handle: cleanHandle,
          name: displayName,
        });
        onLogin(user);
        return;
      } catch (requestError) {
        setError(requestError.message || "Не удалось зарегистрироваться через общую базу");
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    onLogin({
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      password,
      handle: cleanHandle,
      name: displayName,
      bio: "Новый зарегистрированный автор VibeTok.",
      accent: "#00e5ff",
      avatar: cleanHandle
        .split(".")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      gradient: "linear-gradient(135deg, #00e5ff, #ff2d6f)",
      verified: false,
      premium: false,
      role: "user",
      suspended: false,
      followers: 0,
      likes: 0,
      videos: 0,
      createdBy: "human",
    });
  }

  return (
    <Modal title={mode === "login" ? "Вход в аккаунт" : "Регистрация по почте"} icon={LogIn} onClose={onClose}>
      <form className="custom-login" onSubmit={mode === "login" ? submitLogin : submitRegistration}>
        <p className={`auth-network ${apiStatus === "online" ? "is-online" : "is-local"}`}>
          {apiStatus === "online"
            ? "Общая база подключена: люди увидят аккаунт на других устройствах."
            : apiStatus === "checking"
              ? "Проверяем общую базу аккаунтов..."
              : "Локальный режим: запустите pnpm api, чтобы люди видели друг друга."}
        </p>
        <div className="auth-switch">
          <button
            className={mode === "login" ? "is-active" : ""}
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Вход
          </button>
          <button
            className={mode === "register" ? "is-active" : ""}
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Регистрация
          </button>
        </div>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={isSubmitting}
            required
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={mode === "login" ? "Ваш пароль" : "Минимум 4 символа"}
            disabled={isSubmitting}
            required
          />
        </label>
        {mode === "register" ? (
          <>
            <label>
              Ник
              <input
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                placeholder="your.name"
                disabled={isSubmitting}
                required
              />
            </label>
            <label>
              Имя
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ваше имя"
                disabled={isSubmitting}
              />
            </label>
          </>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        <PrimaryButton icon={Sparkles} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Проверяем..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
        </PrimaryButton>
      </form>
    </Modal>
  );
}

function ProfileEditor({ currentUser, onClose, onSave }) {
  const [draft, setDraft] = useState(currentUser);
  const palettes = [
    ["#ff2d6f", "linear-gradient(135deg, #ff2d6f, #4deaff)"],
    ["#00e5ff", "linear-gradient(135deg, #00e5ff, #8357ff)"],
    ["#ffb31a", "linear-gradient(135deg, #ffb31a, #ff2d6f)"],
    ["#22e6a9", "linear-gradient(135deg, #22e6a9, #fff36d)"],
  ];

  if (!currentUser) return null;

  function handleAvatarFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((value) => ({ ...value, avatarImage: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <Modal title="Редактировать профиль" icon={Palette} onClose={onClose}>
      <form
        className="profile-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
      >
        <div className="profile-preview">
          <Avatar user={draft} size="xl" />
          <div>
            <strong>@{draft.handle}</strong>
            <span>{draft.name}</span>
          </div>
        </div>
        <label className="avatar-upload">
          Фото профиля из галереи
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleAvatarFile(event.target.files?.[0])}
          />
        </label>
        <label>
          Имя
          <input
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          />
        </label>
        <label>
          Ник
          <input
            value={draft.handle}
            onChange={(event) => setDraft({ ...draft, handle: event.target.value })}
          />
        </label>
        <label>
          О себе
          <textarea
            value={draft.bio}
            onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
          />
        </label>
        <div className="palette-row" aria-label="Цвет профиля">
          {palettes.map(([accent, gradient]) => (
            <button
              key={accent}
              className={draft.accent === accent ? "is-active" : ""}
              type="button"
              style={{ background: gradient }}
              onClick={() => setDraft({ ...draft, accent, gradient })}
            />
          ))}
        </div>
        <div className="account-badges-row">
          <span className={draft.verified ? "is-on" : ""}>
            <CheckCircle2 size={16} />
            Галочка
          </span>
          <span className={draft.premium ? "is-on" : ""}>
            <Crown size={16} />
            Premium
          </span>
        </div>
        <div className="modal-actions">
          <GhostButton icon={X} onClick={onClose}>
            Отмена
          </GhostButton>
          <PrimaryButton icon={Save} type="submit">
            Сохранить
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

function AdminPanel({
  currentUser,
  accounts,
  uploads,
  reports,
  feedCount,
  onUpdateAccount,
  onRemoveUpload,
  onHideVideo,
  onResolveReport,
  openLogin,
  showToast,
}) {
  if (currentUser?.role !== "admin") {
    return (
      <main className="empty-view">
        <ShieldCheck size={52} />
        <h1>Админ-панель</h1>
        <p>Войдите как администратор, чтобы управлять модерацией, галочками и Premium.</p>
        <PrimaryButton icon={LogIn} onClick={openLogin}>
          Войти как админ
        </PrimaryButton>
      </main>
    );
  }

  return (
    <main className="admin-view">
      <section className="admin-hero">
        <div>
          <span>VibeTok Admin</span>
          <h1>Модерация и роли</h1>
          <p>Управление аккаунтами, жалобами, Premium-тегами и галочками.</p>
        </div>
        <ShieldCheck size={46} />
      </section>

      <section className="profile-grid">
        <div className="metric-card">
          <strong>{accounts.length}</strong>
          <span>Аккаунты</span>
        </div>
        <div className="metric-card">
          <strong>{uploads.length}</strong>
          <span>Загрузки</span>
        </div>
        <div className="metric-card">
          <strong>{reports.length}</strong>
          <span>Жалобы</span>
        </div>
        <div className="metric-card">
          <strong>{feedCount}</strong>
          <span>Видео в ленте</span>
        </div>
      </section>

      <section className="admin-grid">
        <div className="side-panel admin-panel">
          <div className="panel-header compact">
            <h2>Аккаунты</h2>
            <Users size={18} />
          </div>
          <div className="admin-list">
            {accounts.map((account) => (
              <article className="admin-row" key={account.id}>
                <Avatar user={account} size="sm" />
                <div>
                  <strong>
                    @{account.handle}
                    {account.role === "admin" ? " · admin" : ""}
                  </strong>
                  <span>{account.email}</span>
                </div>
                <button
                  className={account.verified ? "tiny-button is-on" : "tiny-button"}
                  type="button"
                  disabled={account.role === "admin"}
                  onClick={() =>
                    onUpdateAccount(account.id, { verified: !account.verified })
                  }
                >
                  <CheckCircle2 size={15} />
                  Галочка
                </button>
                <button
                  className={account.premium ? "tiny-button is-on" : "tiny-button"}
                  type="button"
                  disabled={account.role === "admin"}
                  onClick={() =>
                    onUpdateAccount(account.id, { premium: !account.premium })
                  }
                >
                  <Crown size={15} />
                  Premium
                </button>
                <button
                  className={account.suspended ? "tiny-button is-danger" : "tiny-button"}
                  type="button"
                  disabled={account.role === "admin"}
                  onClick={() =>
                    onUpdateAccount(account.id, { suspended: !account.suspended })
                  }
                >
                  {account.suspended ? "Разблок" : "Блок"}
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="side-panel admin-panel">
          <div className="panel-header compact">
            <h2>Жалобы</h2>
            <Flag size={18} />
          </div>
          <div className="admin-list">
            {reports.length ? (
              reports.map((report) => (
                <article className="admin-row report-row" key={report.id}>
                  <div>
                    <strong>{report.videoCaption}</strong>
                    <span>@{report.user} · {report.time}</span>
                  </div>
                  <button
                    className="tiny-button"
                    type="button"
                    onClick={() => {
                      onResolveReport(report.id);
                      showToast("Жалоба закрыта");
                    }}
                  >
                    Оставить
                  </button>
                  <button
                    className="tiny-button is-danger"
                    type="button"
                    onClick={() => {
                      onHideVideo(report.videoId);
                      onResolveReport(report.id);
                      showToast("Контент скрыт модерацией");
                    }}
                  >
                    Скрыть
                  </button>
                </article>
              ))
            ) : (
              <div className="empty-mini">Жалоб пока нет.</div>
            )}
          </div>
        </div>

        <div className="side-panel admin-panel admin-wide">
          <div className="panel-header compact">
            <h2>Загруженные видео</h2>
            <Clapperboard size={18} />
          </div>
          <div className="admin-list">
            {uploads.length ? (
              uploads.map((video) => (
                <article className="admin-row" key={video.id}>
                  <div>
                    <strong>{video.caption}</strong>
                    <span>{video.tags.map((tag) => `#${tag}`).join(" ")}</span>
                  </div>
                  <button
                    className="tiny-button is-danger"
                    type="button"
                    onClick={() => {
                      onRemoveUpload(video.id);
                      showToast("Видео удалено модерацией");
                    }}
                  >
                    Удалить
                  </button>
                </article>
              ))
            ) : (
              <div className="empty-mini">Пользовательских загрузок пока нет.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function RecommendationSettingsModal({
  consent,
  onClose,
  onSave,
  onReset,
}) {
  const [termsAccepted, setTermsAccepted] = useState(Boolean(consent.termsAccepted));
  const [personalizeInApp, setPersonalizeInApp] = useState(Boolean(consent.personalizeInApp));
  const [allowExternalInterests, setAllowExternalInterests] = useState(
    Boolean(consent.allowExternalInterests),
  );
  const [externalInterests, setExternalInterests] = useState(consent.externalInterests ?? "");

  function submit(event) {
    event.preventDefault();
    onSave({
      termsAccepted,
      personalizeInApp: termsAccepted && personalizeInApp,
      allowExternalInterests: termsAccepted && allowExternalInterests,
      externalInterests: termsAccepted && allowExternalInterests ? externalInterests : "",
      acceptedAt: termsAccepted ? new Date().toISOString() : null,
      termsVersion: RECOMMENDATION_TERMS_VERSION,
    });
  }

  return (
    <Modal title="Согласие на рекомендации" icon={SlidersHorizontal} onClose={onClose}>
      <form className="recommendation-form" onSubmit={submit}>
        <section className="terms-card">
          <h3>Как работает лента</h3>
          <p>
            VibeTok может локально анализировать ваши лайки, сохранения, подписки,
            просмотры, пропуски, поисковые слова и выбранные теги. Это нужно только
            для сортировки ленты “Для тебя” на этом устройстве.
          </p>
          <p>
            Внешние интересы не собираются автоматически. Сайт не читает историю
            браузера, другие приложения и чужие сайты. Можно учитывать только темы,
            которые вы сами введёте ниже или явно импортируете.
          </p>
        </section>

        <label className="check-row">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
          />
          <span>
            Я принимаю пользовательское соглашение VibeTok Recommendations
            от {RECOMMENDATION_TERMS_VERSION}
          </span>
        </label>

        <label className="check-row">
          <input
            type="checkbox"
            checked={personalizeInApp}
            disabled={!termsAccepted}
            onChange={(event) => setPersonalizeInApp(event.target.checked)}
          />
          <span>Разрешаю персонализацию по действиям внутри VibeTok</span>
        </label>

        <label className="check-row">
          <input
            type="checkbox"
            checked={allowExternalInterests}
            disabled={!termsAccepted}
            onChange={(event) => setAllowExternalInterests(event.target.checked)}
          />
          <span>Разрешаю учитывать внешние интересы, которые я введу сам</span>
        </label>

        <label>
          Внешние интересы
          <textarea
            value={externalInterests}
            disabled={!termsAccepted || !allowExternalInterests}
            onChange={(event) => setExternalInterests(event.target.value)}
            placeholder="Например: футбол, монтаж, юмор, музыка, аниме, Москва"
            rows={4}
          />
        </label>

        <div className="privacy-note">
          <ShieldCheck size={18} />
          <span>
            Данные рекомендаций хранятся локально в браузере. Вы можете выключить
            персонализацию или сбросить обучение в любой момент.
          </span>
        </div>

        <div className="modal-actions split">
          <GhostButton icon={RefreshCw} onClick={onReset}>
            Сбросить обучение
          </GhostButton>
          <div>
            <GhostButton onClick={onClose}>Отмена</GhostButton>
            <PrimaryButton icon={Sparkles} type="submit">
              Сохранить
            </PrimaryButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function Modal({ title, icon: Icon, children, onClose }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h2>
            <Icon size={21} />
            {title}
          </h2>
          <IconButton icon={X} label="Закрыть" onClick={onClose} />
        </div>
        {children}
      </section>
    </div>
  );
}

function LaunchSplash() {
  return (
    <div className="launch-splash" role="status" aria-label="VibeTok запускается">
      <div className="launch-splash-inner">
        <div className="launch-logo-mark" aria-hidden="true">
          <span>V</span>
        </div>
        <div className="launch-wordmark" aria-hidden="true">
          <span>Vibe</span>
          <strong>Tok</strong>
        </div>
        <div className="launch-beat" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="launch-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}

function EmptyFeed({ openUpload, setFeedMode }) {
  return (
    <main className="empty-view">
      <Wand2 size={52} />
      <h1>Лента пока пустая</h1>
      <p>Подпишитесь на авторов или загрузите свое видео, чтобы запустить рекомендации.</p>
      <div className="empty-actions">
        <PrimaryButton icon={Upload} onClick={openUpload}>
          Загрузить
        </PrimaryButton>
        <GhostButton icon={Sparkles} onClick={() => setFeedMode("forYou")}>
          Вернуться в рекомендации
        </GhostButton>
      </div>
    </main>
  );
}

function MobileNav({ activeTab, setActiveTab, openUpload, openProfile }) {
  const items = [
    ["home", Home, "Главная"],
    ["live", Radio, "LIVE"],
    ["upload", Plus, "Загрузка"],
    ["messages", MessageCircle, "Чат"],
    ["profile", User, "Профиль"],
  ];
  return (
    <nav className="mobile-nav" aria-label="Мобильная навигация">
      {items.map(([id, Icon, label]) => (
        <button
          key={id}
          className={activeTab === id ? "is-active" : ""}
          type="button"
          onClick={() => {
            if (id === "upload") {
              openUpload();
              return;
            }
            if (id === "profile") {
              openProfile();
              return;
            }
            setActiveTab(id);
          }}
          aria-label={label}
          title={label}
        >
          <Icon size={22} />
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useLocalState("vibetok-human-user", null);
  const [registeredAccounts, setRegisteredAccounts] = useLocalState(
    "vibetok-human-accounts",
    [],
  );
  const [followed, setFollowed] = useLocalState("vibetok-human-followed", []);
  const [liked, setLiked] = useLocalState("vibetok-human-liked", []);
  const [saved, setSaved] = useLocalState("vibetok-human-saved", []);
  const [commentsByVideo, setCommentsByVideo] = useLocalState("vibetok-human-comments", {});
  const [reports, setReports] = useLocalState("vibetok-human-reports", []);
  const [hiddenVideoIds, setHiddenVideoIds] = useLocalState("vibetok-hidden-videos", []);
  const [sharedAccounts, setSharedAccounts] = useState([]);
  const [apiStatus, setApiStatus] = useState(API_BASE_URL ? "checking" : "offline");
  const [recommendationConsent, setRecommendationConsent] = useLocalState(
    "vibetok-recommendation-consent",
    DEFAULT_RECOMMENDATION_CONSENT,
  );
  const [recommendationSignals, setRecommendationSignals] = useLocalState(
    "vibetok-recommendation-signals",
    {},
  );
  const [uploads, setUploads] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [feedMode, setFeedMode] = useState("forYou");
  const [selectedTag, setSelectedTag] = useState(ALL_TAG);
  const [query, setQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedProfileId, setViewedProfileId] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [showLaunchSplash, setShowLaunchSplash] = useState(true);
  const feedTouchStartRef = useRef(null);
  const feedWheelLockRef = useRef(false);
  const activeVideoRef = useRef(null);
  const recommendationPromptShownRef = useRef(false);

  const personalizationEnabled =
    recommendationConsent.termsAccepted && recommendationConsent.personalizeInApp;

  const allVideos = useMemo(
    () => [...uploads, ...INTERNET_FEED_VIDEOS].filter((video) => !hiddenVideoIds.includes(video.id)),
    [hiddenVideoIds, uploads],
  );

  const localAccounts = useMemo(
    () => [
      ADMIN_ACCOUNT,
      ...registeredAccounts
        .filter((account) => !isInternalQaAccount(account))
        .map((account) => ({
          role: "user",
          premium: false,
          verified: false,
          suspended: false,
          ...account,
        })),
    ],
    [registeredAccounts],
  );

  const allAccounts = useMemo(
    () =>
      apiStatus === "online" && sharedAccounts.length
        ? sharedAccounts.map(normalizeSharedAccount)
        : localAccounts,
    [apiStatus, localAccounts, sharedAccounts],
  );

  const peopleResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allAccounts
      .filter((account) => {
        if (account.suspended && currentUser?.role !== "admin") return false;
        if (!normalizedQuery) return true;
        return getAccountSearchText(account).includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [allAccounts, currentUser?.role, query]);

  const profileUser = useMemo(() => {
    if (!viewedProfileId) return currentUser;
    return allAccounts.find((account) => account.id === viewedProfileId) ?? currentUser;
  }, [allAccounts, currentUser, viewedProfileId]);

  const isOwnProfile = Boolean(currentUser && profileUser?.id === currentUser.id);

  const recommendationProfile = useMemo(
    () =>
      buildRecommendationProfile({
        videos: allVideos,
        liked,
        saved,
        followed,
        signals: recommendationSignals,
        consent: recommendationConsent,
      }),
    [allVideos, followed, liked, recommendationConsent, recommendationSignals, saved],
  );

  const visibleVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = allVideos.filter((video) => {
      const creator = video.creatorId === "me" ? currentUser : getCreator(video.creatorId);
      const matchesMode =
        feedMode === "forYou" ||
        video.creatorId === "me" ||
        followed.includes(video.creatorId);
      const matchesTag =
        selectedTag === ALL_TAG || video.tags.some((tag) => tag.toLowerCase() === selectedTag);
      const haystack = `${video.caption} ${video.tags.join(" ")} ${creator?.handle ?? ""}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesMode && matchesTag && matchesQuery;
    });

    if (feedMode !== "forYou") return filtered;

    return filtered
      .map((video, index) => ({
        video,
        index,
        score: getRecommendationScore(
          video,
          video.creatorId === "me" ? currentUser : getCreator(video.creatorId),
          recommendationProfile,
          recommendationConsent,
        ),
      }))
      .sort((left, right) => right.score - left.score || left.index - right.index)
      .map((item) => item.video);
  }, [
    allVideos,
    currentUser,
    feedMode,
    followed,
    query,
    recommendationConsent,
    recommendationProfile,
    selectedTag,
  ]);

  async function refreshSharedAccounts() {
    try {
      const data = await apiRequest("/accounts");
      if (!data?.accounts) {
        setApiStatus("offline");
        return null;
      }
      const accounts = data.accounts.map(normalizeSharedAccount);
      setSharedAccounts(accounts);
      setApiStatus("online");
      return accounts;
    } catch {
      setApiStatus("offline");
      return null;
    }
  }

  useEffect(() => {
    if (currentIndex >= visibleVideos.length) setCurrentIndex(0);
  }, [currentIndex, visibleVideos.length]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowLaunchSplash(false), LAUNCH_SPLASH_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setRegisteredAccounts((accounts) => accounts.filter((account) => !isInternalQaAccount(account)));
  }, [setRegisteredAccounts]);

  useEffect(() => {
    if (!API_BASE_URL) {
      setApiStatus("offline");
      return undefined;
    }

    let cancelled = false;
    async function syncAccounts() {
      const accounts = await refreshSharedAccounts();
      if (cancelled || !accounts) return;
      if (currentUser?.id) {
        const serverUser = accounts.find((account) => account.id === currentUser.id);
        if (serverUser) {
          setCurrentUser((user) =>
            user?.id === serverUser.id ? { ...user, ...serverUser, email: user.email } : user,
          );
        }
      }
    }

    syncAccounts();
    const timer = window.setInterval(syncAccounts, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [currentUser?.id, setCurrentUser]);

  useEffect(() => {
    if (apiStatus !== "online" || !currentUser?.id) return undefined;
    let cancelled = false;

    apiRequest(`/follows/${encodeURIComponent(currentUser.id)}`)
      .then((data) => {
        if (!cancelled && data?.followed) setFollowed(data.followed);
      })
      .catch(() => setApiStatus("offline"));

    return () => {
      cancelled = true;
    };
  }, [apiStatus, currentUser?.id, setFollowed]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [activeTab]);

  useEffect(() => {
    document.documentElement.style.setProperty("--user-accent", currentUser?.accent ?? "#ff2d6f");
  }, [currentUser]);

  useEffect(() => {
    if (recommendationConsent.termsAccepted) return undefined;
    if (recommendationPromptShownRef.current) return undefined;
    const timer = window.setTimeout(() => {
      recommendationPromptShownRef.current = true;
      setModal((currentModal) => currentModal ?? "recommendations");
    }, 900);
    return () => window.clearTimeout(timer);
  }, [recommendationConsent.termsAccepted]);

  const activeVideo = visibleVideos[currentIndex];
  const activeCreator =
    activeVideo?.creatorId === "me"
      ? currentUser ?? PUBLIC_VIDEO_SOURCE
      : getCreator(activeVideo?.creatorId);

  function recordRecommendationEvent(video, patch) {
    if (!personalizationEnabled || !video) return;
    setRecommendationSignals((items) => {
      const current = items[video.id] ?? {
        views: 0,
        watchMs: 0,
        likes: 0,
        saves: 0,
        follows: 0,
        skips: 0,
        lastSeen: 0,
      };
      return {
        ...items,
        [video.id]: {
          ...current,
          views: current.views + (patch.views ?? 0),
          watchMs: current.watchMs + (patch.watchMs ?? 0),
          likes: current.likes + (patch.likes ?? 0),
          saves: current.saves + (patch.saves ?? 0),
          follows: current.follows + (patch.follows ?? 0),
          skips: current.skips + (patch.skips ?? 0),
          creatorId: video.creatorId,
          tags: video.tags,
          vibe: video.vibe,
          lastSeen: Date.now(),
        },
      };
    });
  }

  function toggleListValue(setter, id) {
    setter((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  }

  async function toggleFollow(id) {
    if (id === "me" || !currentUser) return;
    const shouldFollow = !followed.includes(id);

    if (apiStatus === "online") {
      try {
        const data = await apiRequest("/follows/toggle", {
          method: "POST",
          body: { followerId: currentUser.id, targetId: id },
        });
        if (data?.followed) setFollowed(data.followed);
        applySharedAccounts(data?.accounts);
        if (shouldFollow && activeVideo?.creatorId === id) {
          recordRecommendationEvent(activeVideo, { follows: 1 });
        }
        return;
      } catch (requestError) {
        setApiStatus("offline");
        showToast(requestError.message || "Общая база недоступна, подписка сохранена локально");
      }
    }

    toggleListValue(setFollowed, id);
    if (shouldFollow && activeVideo?.creatorId === id) {
      recordRecommendationEvent(activeVideo, { follows: 1 });
    }
  }

  function toggleLike(id) {
    const shouldLike = !liked.includes(id);
    toggleListValue(setLiked, id);
    if (shouldLike) {
      recordRecommendationEvent(allVideos.find((video) => video.id === id), { likes: 1 });
    }
  }

  function toggleSave(id) {
    const shouldSave = !saved.includes(id);
    toggleListValue(setSaved, id);
    if (shouldSave) {
      recordRecommendationEvent(allVideos.find((video) => video.id === id), { saves: 1 });
    }
  }

  function showToast(message) {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(""), 2200);
  }

  function applySharedAccounts(accounts) {
    if (!accounts) return;
    setSharedAccounts(accounts.map(normalizeSharedAccount));
    setApiStatus("online");
  }

  async function loginWithSharedApi(credentials) {
    let data;
    try {
      data = await apiRequest("/auth/login", {
        method: "POST",
        body: credentials,
      });
    } catch (requestError) {
      setApiStatus("offline");
      throw requestError;
    }
    if (!data?.user) throw new Error("Не удалось войти через общую базу");
    applySharedAccounts(data.accounts);
    if (data.followed) setFollowed(data.followed);
    return data.user;
  }

  async function registerWithSharedApi(payload) {
    let data;
    try {
      data = await apiRequest("/auth/register", {
        method: "POST",
        body: payload,
      });
    } catch (requestError) {
      setApiStatus("offline");
      throw requestError;
    }
    if (!data?.user) throw new Error("Не удалось зарегистрироваться через общую базу");
    applySharedAccounts(data.accounts);
    if (data.followed) setFollowed(data.followed);
    return data.user;
  }

  function saveRegisteredUser(user) {
    if (user.role === "admin") {
      setCurrentUser(user);
      return;
    }
    const normalizedUser = {
      ...user,
      followers: user.followers ?? 0,
      likes: user.likes ?? 0,
      videos: user.videos ?? 0,
      verified: user.verified ?? false,
      premium: user.premium ?? false,
      role: user.role ?? "user",
      suspended: user.suspended ?? false,
      createdBy: "human",
    };
    if (apiStatus === "online") {
      setSharedAccounts((accounts) => {
        const exists = accounts.some((account) => account.id === normalizedUser.id);
        return exists
          ? accounts.map((account) =>
              account.id === normalizedUser.id ? normalizeSharedAccount(normalizedUser) : account,
            )
          : [...accounts, normalizeSharedAccount(normalizedUser)];
      });
    }
    setRegisteredAccounts((accounts) => {
      const exists = accounts.some((account) => account.email === normalizedUser.email);
      return exists
        ? accounts.map((account) =>
            account.email === normalizedUser.email ? normalizedUser : account,
          )
        : [...accounts, normalizedUser];
    });
    setCurrentUser(normalizedUser);
  }

  async function updateAccount(accountId, patch) {
    const applyLocalUpdate = (nextPatch) => {
      setRegisteredAccounts((accounts) =>
        accounts.map((account) =>
          account.id === accountId ? { ...account, ...nextPatch } : account,
        ),
      );
      setSharedAccounts((accounts) =>
        accounts.map((account) =>
          account.id === accountId ? normalizeSharedAccount({ ...account, ...nextPatch }) : account,
        ),
      );
      setCurrentUser((user) => (user?.id === accountId ? { ...user, ...nextPatch } : user));
    };

    if (apiStatus === "online") {
      try {
        const data = await apiRequest(`/accounts/${encodeURIComponent(accountId)}`, {
          method: "PATCH",
          body: { patch },
        });
        applySharedAccounts(data?.accounts);
        if (data?.account) {
          applyLocalUpdate(data.account);
        }
        return;
      } catch (requestError) {
        setApiStatus("offline");
        showToast(requestError.message || "Общая база недоступна, профиль сохранён локально");
      }
    }

    applyLocalUpdate(patch);
  }

  function openAccountProfile(account) {
    setViewedProfileId(account.id);
    setActiveTab("profile");
    setQuery("");
  }

  function reportVideo(video) {
    setReports((items) => [
      {
        id: `report-${Date.now()}`,
        videoId: video.id,
        videoCaption: video.caption,
        user: currentUser?.handle ?? "guest",
        time: "только что",
      },
      ...items,
    ]);
    showToast("Жалоба отправлена модерации");
  }

  function addComment(videoId, text) {
    setCommentsByVideo((items) => ({
      ...items,
      [videoId]: [
        ...(items[videoId] ?? []),
        {
          id: `comment-${Date.now()}`,
          user: currentUser.handle,
          text,
          likes: 0,
          time: "только что",
        },
      ],
    }));
  }

  function handleUpload(videoOrVideos) {
    const videos = Array.isArray(videoOrVideos) ? videoOrVideos : [videoOrVideos];
    setUploads((items) => [...videos, ...items]);
    setFeedMode("forYou");
    setSelectedTag(ALL_TAG);
    setActiveTab("home");
    setCurrentIndex(0);
    showToast(
      videos.length === 1
        ? "Видео добавлено в ленту"
        : `${videos.length} TikTok-видео добавлено в ленту`,
    );
  }

  function removeUpload(videoId) {
    setUploads((items) => items.filter((video) => video.id !== videoId));
    setReports((items) => items.filter((report) => report.videoId !== videoId));
  }

  function hideVideo(videoId) {
    setHiddenVideoIds((items) => (items.includes(videoId) ? items : [...items, videoId]));
    removeUpload(videoId);
  }

  function resolveReport(reportId) {
    setReports((items) => items.filter((report) => report.id !== reportId));
  }

  function setCurrentVideoById(id) {
    const index = visibleVideos.findIndex((video) => video.id === id);
    if (index >= 0) setCurrentIndex(index);
  }

  function shouldIgnoreFeedGesture(target) {
    if (!target?.closest) return true;
    if (
      target.closest(
        ".comments-panel, .recommendations-panel, .modal, .topbar, .mobile-nav, .action-rail, input, textarea, select, button, a",
      )
    ) {
      return true;
    }
    return !target.closest(".video-shell");
  }

  function goToFeedVideo(direction) {
    if (!visibleVideos.length) return;
    setCurrentIndex((index) => (index + direction + visibleVideos.length) % visibleVideos.length);
  }

  function handleFeedWheel(event) {
    if (shouldIgnoreFeedGesture(event.target)) return;
    if (activeTab !== "home" || !visibleVideos.length || Math.abs(event.deltaY) < 32) return;
    event.preventDefault();
    if (feedWheelLockRef.current) return;
    feedWheelLockRef.current = true;
    goToFeedVideo(event.deltaY > 0 ? 1 : -1);
    window.setTimeout(() => {
      feedWheelLockRef.current = false;
    }, 520);
  }

  function handleFeedTouchStart(event) {
    if (shouldIgnoreFeedGesture(event.target)) {
      feedTouchStartRef.current = null;
      return;
    }
    const touch = event.touches?.[0];
    if (!touch) return;
    feedTouchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  function handleFeedTouchMove(event) {
    if (activeTab !== "home" || !feedTouchStartRef.current) return;
    const touch = event.touches?.[0];
    if (!touch) return;
    const deltaY = feedTouchStartRef.current.y - touch.clientY;
    const deltaX = Math.abs(feedTouchStartRef.current.x - touch.clientX);
    if (Math.abs(deltaY) > 18 && Math.abs(deltaY) > deltaX * 1.2) {
      event.preventDefault();
    }
  }

  function handleFeedTouchEnd(event) {
    if (activeTab !== "home" || !visibleVideos.length || !feedTouchStartRef.current) return;
    const touch = event.changedTouches?.[0];
    if (!touch) return;
    const deltaY = feedTouchStartRef.current.y - touch.clientY;
    const deltaX = Math.abs(feedTouchStartRef.current.x - touch.clientX);
    feedTouchStartRef.current = null;
    if (Math.abs(deltaY) < 58 || Math.abs(deltaY) < deltaX * 1.2) return;
    event.preventDefault();
    goToFeedVideo(deltaY > 0 ? 1 : -1);
  }

  useEffect(() => {
    if (!personalizationEnabled || activeTab !== "home" || !activeVideo) return undefined;
    activeVideoRef.current = {
      id: activeVideo.id,
      startedAt: Date.now(),
    };
    recordRecommendationEvent(activeVideo, { views: 1 });

    return () => {
      const startedAt = activeVideoRef.current?.startedAt ?? Date.now();
      const watchedMs = Math.max(0, Date.now() - startedAt);
      recordRecommendationEvent(activeVideo, {
        watchMs: watchedMs > 600 ? watchedMs : 0,
        skips: watchedMs < 1200 ? 1 : 0,
      });
    };
  }, [activeTab, activeVideo?.id, personalizationEnabled]);

  const modalProps = {
    currentUser,
    onClose: () => setModal(null),
    openLogin: () => setModal("login"),
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        feedMode={feedMode}
        setFeedMode={setFeedMode}
        currentUser={currentUser}
        followed={followed}
        toggleFollow={toggleFollow}
        openUpload={() => setModal("upload")}
        openProfile={() => {
          setViewedProfileId(null);
          setActiveTab("profile");
        }}
      />

      <div className="main-column">
        <TopBar
          feedMode={feedMode}
          setFeedMode={(mode) => {
            setFeedMode(mode);
            setActiveTab("home");
          }}
          feedCount={visibleVideos.length}
          query={query}
          setQuery={setQuery}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          openUpload={() => setModal("upload")}
          openLogin={() => setModal("login")}
          openAdmin={() => setActiveTab("admin")}
          currentUser={currentUser}
          signOut={() => {
            setCurrentUser(null);
            setViewedProfileId(null);
            showToast("Вы вышли из аккаунта");
          }}
          showToast={showToast}
          openRecommendationSettings={() => setModal("recommendations")}
          peopleResults={peopleResults}
          followed={followed}
          onOpenAccount={openAccountProfile}
          onFollowAccount={toggleFollow}
        />

        {activeTab === "home" && activeVideo && activeCreator ? (
          <div
            className="content-grid feed-swipe-zone"
            onWheel={handleFeedWheel}
            onTouchStart={handleFeedTouchStart}
            onTouchMove={handleFeedTouchMove}
            onTouchEnd={handleFeedTouchEnd}
          >
            <VideoStage
              video={activeVideo}
              creator={activeCreator}
              currentUser={currentUser}
              isLiked={liked.includes(activeVideo.id)}
              isSaved={saved.includes(activeVideo.id)}
              isFollowing={followed.includes(activeVideo.creatorId)}
              toggleLike={toggleLike}
              toggleSave={toggleSave}
              toggleFollow={toggleFollow}
              nextVideo={() => goToFeedVideo(1)}
              prevVideo={() => goToFeedVideo(-1)}
              onReport={reportVideo}
              openLogin={() => setModal("login")}
              openUpload={() => setModal("upload")}
              showToast={showToast}
            />
            <CommentsPanel
              video={activeVideo}
              creator={activeCreator}
              comments={commentsByVideo[activeVideo.id] ?? []}
              currentUser={currentUser}
              addComment={addComment}
              openLogin={() => setModal("login")}
              showToast={showToast}
            />
            <RecommendationsPanel
              videos={visibleVideos.length ? visibleVideos : allVideos}
              currentVideoId={activeVideo.id}
              setCurrentVideoById={setCurrentVideoById}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              followed={followed}
              toggleFollow={toggleFollow}
              currentUser={currentUser}
              openProfile={() => setActiveTab("profile")}
              openLogin={() => setModal("login")}
              showToast={showToast}
              recommendationProfile={recommendationProfile}
              recommendationConsent={recommendationConsent}
              openRecommendationSettings={() => setModal("recommendations")}
            />
          </div>
        ) : null}

        {activeTab === "home" && !activeVideo ? (
          <EmptyFeed openUpload={() => setModal("upload")} setFeedMode={setFeedMode} />
        ) : null}

        {activeTab === "live" ? (
          <LiveView
            currentUser={currentUser}
            openLogin={() => setModal("login")}
            showToast={showToast}
          />
        ) : null}

        {activeTab === "messages" ? (
          <MessagesView currentUser={currentUser} openLogin={() => setModal("login")} />
        ) : null}

        {activeTab === "profile" ? (
          <ProfileView
            currentUser={currentUser}
            profileUser={profileUser}
            isOwnProfile={isOwnProfile}
            isFollowing={Boolean(profileUser && followed.includes(profileUser.id))}
            toggleFollowProfile={() => {
              if (profileUser) toggleFollow(profileUser.id);
            }}
            uploads={uploads}
            likedCount={uploads.reduce((total, video) => total + video.likes, 0)}
            followedCount={followed.length}
            openProfile={() => setModal("profile")}
            openUpload={() => setModal("upload")}
            openLogin={() => setModal("login")}
            showToast={showToast}
          />
        ) : null}

        {activeTab === "admin" ? (
          <AdminPanel
            currentUser={currentUser}
            accounts={allAccounts}
            uploads={uploads}
            reports={reports}
            feedCount={allVideos.length}
            onUpdateAccount={updateAccount}
            onRemoveUpload={removeUpload}
            onHideVideo={hideVideo}
            onResolveReport={resolveReport}
            openLogin={() => setModal("login")}
            showToast={showToast}
          />
        ) : null}
      </div>

      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openUpload={() => setModal("upload")}
        openProfile={() => {
          setViewedProfileId(null);
          setActiveTab("profile");
        }}
      />

      {modal === "upload" ? <UploadModal {...modalProps} onUpload={handleUpload} /> : null}
      {modal === "recommendations" ? (
        <RecommendationSettingsModal
          consent={recommendationConsent}
          onClose={() => setModal(null)}
          onSave={(nextConsent) => {
            setRecommendationConsent(nextConsent);
            setModal(null);
            showToast(
              nextConsent.personalizeInApp
                ? "Рекомендации включены"
                : "Персонализация выключена",
            );
          }}
          onReset={() => {
            setRecommendationSignals({});
            setRecommendationConsent(DEFAULT_RECOMMENDATION_CONSENT);
            setModal(null);
            showToast("Обучение ленты сброшено");
          }}
        />
      ) : null}
      {modal === "login" ? (
        <LoginModal
          accounts={allAccounts}
          authApi={
            API_BASE_URL && apiStatus !== "offline"
              ? {
                  login: loginWithSharedApi,
                  register: registerWithSharedApi,
                }
              : null
          }
          apiStatus={apiStatus}
          onClose={() => setModal(null)}
          onLogin={(user) => {
            saveRegisteredUser(user);
            setModal(null);
            showToast(`Вход выполнен: @${user.handle}`);
          }}
        />
      ) : null}
      {modal === "profile" && currentUser ? (
        <ProfileEditor
          currentUser={currentUser}
          onClose={() => setModal(null)}
          onSave={(user) => {
            updateAccount(user.id, user);
            setModal(null);
            showToast("Профиль обновлен");
          }}
        />
      ) : null}

      {toast ? (
        <div className="toast" role="status">
          <Zap size={18} />
          {toast}
        </div>
      ) : null}

      {showLaunchSplash ? <LaunchSplash /> : null}
    </div>
  );
}
