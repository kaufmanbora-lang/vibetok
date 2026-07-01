import { useEffect, useMemo, useRef, useState } from "react";
import {
  AtSign,
  Bell,
  Bookmark,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clapperboard,
  Copy,
  Eye,
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

const DEMO_USERS = [
  {
    id: "me",
    handle: "alina.vibes",
    name: "Алина",
    bio: "Снимаю город, музыку и ночные прогулки.",
    accent: "#ff2d6f",
    avatar: "AV",
    gradient: "linear-gradient(135deg, #ff2d6f, #4deaff)",
    verified: true,
  },
  {
    id: "neo",
    handle: "neo.motion",
    name: "Нео",
    bio: "Монтаж, танцы, яркий свет.",
    accent: "#00e5ff",
    avatar: "NM",
    gradient: "linear-gradient(135deg, #00e5ff, #8357ff)",
    verified: false,
  },
  {
    id: "vera",
    handle: "vera.live",
    name: "Вера",
    bio: "Стримы и backstage каждый вечер.",
    accent: "#ffb31a",
    avatar: "VL",
    gradient: "linear-gradient(135deg, #ffb31a, #ff2d6f)",
    verified: true,
  },
];

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const CREATORS = [
  {
    id: "ride",
    handle: "ride.with.me",
    name: "Ира",
    title: "Сноуборд",
    avatar: "RW",
    gradient: "linear-gradient(135deg, #88d8ff, #ff4f8b)",
    verified: true,
    tags: ["спорт", "горы", "travel"],
  },
  {
    id: "max",
    handle: "max.bond",
    name: "Макс Бонд",
    title: "Город",
    avatar: "MB",
    gradient: "linear-gradient(135deg, #ff2d6f, #3d6bff)",
    verified: false,
    tags: ["город", "кино", "ночь"],
  },
  {
    id: "ksenia",
    handle: "ksenia.fit",
    name: "Ксения Фит",
    title: "Фитнес",
    avatar: "KF",
    gradient: "linear-gradient(135deg, #22e6a9, #fff36d)",
    verified: true,
    tags: ["спорт", "здоровье", "лайфстайл"],
  },
  {
    id: "vlad",
    handle: "vlad.music",
    name: "Влад Музыка",
    title: "Биты",
    avatar: "VM",
    gradient: "linear-gradient(135deg, #8357ff, #ff2d6f)",
    verified: false,
    tags: ["музыка", "ремикс", "бит"],
  },
  {
    id: "maria",
    handle: "maria.soul",
    name: "Мария",
    title: "Океан",
    avatar: "MS",
    gradient: "linear-gradient(135deg, #00e5ff, #004dff)",
    verified: false,
    tags: ["travel", "океан", "утро"],
  },
  {
    id: "kate",
    handle: "travel.kate",
    name: "Кейт",
    title: "Пейзажи",
    avatar: "TK",
    gradient: "linear-gradient(135deg, #ff9f43, #22d3ee)",
    verified: true,
    tags: ["travel", "горы", "природа"],
  },
];

const SEED_VIDEOS = [
  {
    id: "snow",
    creatorId: "ride",
    source: assetPath("/videos/snow.mp4"),
    caption: "Горы зовут. Свобода в каждом повороте.",
    music: "Pulse Lights - Frost Run",
    tags: ["спорт", "горы", "travel"],
    likes: 128400,
    comments: 2300,
    shares: 7600,
    saves: 18900,
    duration: "00:15",
    vibe: "snow",
  },
  {
    id: "tokyo",
    creatorId: "max",
    source: assetPath("/videos/city.mp4"),
    caption: "Ночной город, неон и быстрый монтаж.",
    music: "Neon Drift - City edit",
    tags: ["город", "ночь", "кино"],
    likes: 215400,
    comments: 4500,
    shares: 12200,
    saves: 26800,
    duration: "00:15",
    vibe: "city",
  },
  {
    id: "ocean",
    creatorId: "maria",
    source: assetPath("/videos/ocean.mp4"),
    caption: "Утро у океана: мягкий свет и чистый звук.",
    music: "Soft Tide - Morning loop",
    tags: ["travel", "океан", "утро"],
    likes: 98700,
    comments: 1280,
    shares: 5300,
    saves: 11200,
    duration: "00:12",
    vibe: "ocean",
  },
  {
    id: "dance",
    creatorId: "ksenia",
    source: assetPath("/videos/dance.mp4"),
    caption: "Челлендж на 8 счетов. Повтори и отметь друга.",
    music: "Bad White - Step line",
    tags: ["спорт", "танцы", "челлендж"],
    likes: 62100,
    comments: 870,
    shares: 3100,
    saves: 5900,
    duration: "00:11",
    vibe: "dance",
  },
  {
    id: "beats",
    creatorId: "vlad",
    source: assetPath("/videos/music.mp4"),
    caption: "Собрал бит из звуков улицы.",
    music: "Vlad Music - Sidewalk kit",
    tags: ["музыка", "ремикс", "город"],
    likes: 134200,
    comments: 1900,
    shares: 6800,
    saves: 14500,
    duration: "00:10",
    vibe: "music",
  },
];

const LIVE_STREAMS = [
  {
    id: "live-daria",
    hostId: "vera",
    title: "Just Chatting: монтаж клипа",
    topic: "Музыка",
    viewers: 2100,
    accent: "#ff2d6f",
  },
  {
    id: "live-max",
    hostId: "max",
    title: "Ночной маршрут по центру",
    topic: "Город",
    viewers: 870,
    accent: "#00e5ff",
  },
  {
    id: "live-kate",
    hostId: "kate",
    title: "План похода и вопросы",
    topic: "Travel",
    viewers: 1440,
    accent: "#ffb31a",
  },
];

const INITIAL_COMMENTS = {
  snow: [
    {
      id: "c1",
      user: "nikita.shred",
      text: "Какой кайф!",
      likes: 342,
      time: "1 ч. назад",
    },
    {
      id: "c2",
      user: "maria.snow",
      text: "Техника на высоте.",
      likes: 210,
      time: "1 ч. назад",
    },
    {
      id: "c3",
      user: "snow.legend",
      text: "Где это место?",
      likes: 98,
      time: "56 мин. назад",
    },
    {
      id: "c4",
      user: "just.vibes",
      text: "Сезон открыт. Поехали.",
      likes: 32,
      time: "25 мин. назад",
    },
  ],
  tokyo: [
    {
      id: "c5",
      user: "neon.nika",
      text: "Цвета просто космос.",
      likes: 512,
      time: "18 мин. назад",
    },
    {
      id: "c6",
      user: "framehunter",
      text: "Сохранил для референса.",
      likes: 74,
      time: "9 мин. назад",
    },
  ],
  ocean: [
    {
      id: "c7",
      user: "slow.morning",
      text: "Такой звук нужен на будильник.",
      likes: 190,
      time: "44 мин. назад",
    },
  ],
  dance: [
    {
      id: "c8",
      user: "move.today",
      text: "Повторила с первого раза.",
      likes: 67,
      time: "12 мин. назад",
    },
  ],
  beats: [
    {
      id: "c9",
      user: "808room",
      text: "Кик плотный, прям надо.",
      likes: 121,
      time: "5 мин. назад",
    },
  ],
};

const TAGS = ["всё", "город", "музыка", "спорт", "travel", "челлендж", "ночь"];

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

function getCreator(id) {
  return CREATORS.find((creator) => creator.id === id) ?? CREATORS[0];
}

function Avatar({ user, size = "md", className = "" }) {
  return (
    <div
      className={`avatar avatar-${size} ${className}`}
      style={{ background: user.gradient }}
      aria-hidden="true"
    >
      <span>{user.avatar}</span>
    </div>
  );
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
    { id: "messages", label: "Сообщения", icon: MessageCircle, badge: 3 },
    { id: "profile", label: "Профиль", icon: User, onClick: openProfile },
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
          <span>LIVE сейчас</span>
        </div>
        <button className="live-card-mini" type="button" onClick={() => setActiveTab("live")}>
          <div className="live-card-bg" />
          <div className="live-chip">LIVE</div>
          <div className="viewers">
            <Eye size={14} />
            2.1K
          </div>
          <div className="live-card-info">
            <strong>DariaWave</strong>
            <span>Just Chatting</span>
          </div>
        </button>
      </div>

      <div className="suggested-accounts">
        <div className="section-label">Рекомендуемые аккаунты</div>
        {CREATORS.slice(1, 4).map((creator) => (
          <div className="suggested-row" key={creator.id}>
            <Avatar user={creator} size="sm" />
            <div>
              <strong>{creator.handle}</strong>
              <span>{creator.name}</span>
            </div>
            <button
              className={followed.includes(creator.id) ? "tiny-button is-on" : "tiny-button"}
              type="button"
              onClick={() => toggleFollow(creator.id)}
            >
              {followed.includes(creator.id) ? "Вы" : "Подписаться"}
            </button>
          </div>
        ))}
        <button className="more-link" type="button">
          Показать еще
          <ChevronDown size={15} />
        </button>
      </div>
    </aside>
  );
}

function TopBar({
  feedMode,
  setFeedMode,
  query,
  setQuery,
  selectedTag,
  setSelectedTag,
  openUpload,
  openLogin,
  currentUser,
  signOut,
  showToast,
}) {
  return (
    <header className="topbar">
      <div className="search-wrap">
        <Search size={20} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск"
          aria-label="Поиск видео, тегов и авторов"
        />
        <IconButton
          icon={SlidersHorizontal}
          label="Фильтры рекомендаций"
          onClick={() => showToast("Фильтры доступны в строке тегов")}
        />
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
  openLogin,
  openUpload,
  showToast,
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    element.muted = muted;
    setProgress(0);
    const playPromise = element.play();
    if (playPromise?.then) {
      playPromise.then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [video.id, muted]);

  function togglePlayback() {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) {
      element.play();
      setPlaying(true);
    } else {
      element.pause();
      setPlaying(false);
    }
  }

  function handleShare() {
    const shareText = `VibeTok: @${creator.handle} - ${video.caption}`;
    navigator.clipboard?.writeText(shareText).catch(() => {});
    showToast("Ссылка на видео скопирована");
  }

  return (
    <section className="video-stage" aria-label="Лента коротких видео">
      <div className={`ambient ambient-${video.vibe}`} />
      <div className="video-shell">
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
          onClick={togglePlayback}
        />
        <div className="video-gradient" />

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
            onClick={() => setMuted((value) => !value)}
          />
        </div>

        <div className="video-meta">
          <div className="creator-line">
            <strong>@{creator.handle}</strong>
            {creator.verified ? <CheckCircle2 size={16} /> : null}
            <button
              type="button"
              onClick={() => (currentUser ? toggleFollow(creator.id) : openLogin())}
            >
              {isFollowing ? "Подписка" : "Подписаться"}
            </button>
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
          onClick={() => showToast("Панель комментариев закреплена для демо")}
        />
      </div>

      <div className="pinned-comment">
        <Avatar user={creator} size="sm" />
        <div>
          <strong>@{creator.handle}</strong>
          <p>{video.caption}</p>
        </div>
      </div>

      <div className="comments-list">
        {comments.map((comment) => (
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
        ))}
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
}) {
  const recommendedCreators = CREATORS.filter((creator) => !followed.includes(creator.id)).slice(0, 3);

  return (
    <aside className="recommendations-panel" aria-label="Рекомендации">
      <section className="side-panel">
        <div className="panel-header compact">
          <h2>Рекомендации</h2>
          <IconButton
            icon={RefreshCw}
            label="Обновить рекомендации"
            onClick={() => showToast("Рекомендации обновлены")}
          />
        </div>

        <div className="recommendation-list">
          {videos.slice(0, 2).map((video, index) => {
            const creator = getCreator(video.creatorId);
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
                    <Heart size={14} />
                    {compactNumber(video.likes)}
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
          <Sparkles size={18} />
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
                </strong>
                <span>{currentUser.name}</span>
              </div>
            </div>
            <div className="profile-stats">
              <div>
                <strong>186</strong>
                <span>Подписки</span>
              </div>
              <div>
                <strong>24.3K</strong>
                <span>Подписчики</span>
              </div>
              <div>
                <strong>512.6K</strong>
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
          {recommendedCreators.map((creator) => (
            <div className="creator-row" key={creator.id}>
              <Avatar user={creator} size="sm" />
              <div>
                <strong>{creator.handle}</strong>
                <span>{creator.title}</span>
              </div>
              <button
                className="tiny-button"
                type="button"
                onClick={() => toggleFollow(creator.id)}
              >
                Подписаться
              </button>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

function LiveView({ currentUser, followed, toggleFollow, openLogin, showToast }) {
  const [activeLive, setActiveLive] = useState(LIVE_STREAMS[0]);
  const [chatDraft, setChatDraft] = useState("");
  const [messages, setMessages] = useState([
    { id: "l1", user: "mod", text: "Проверяем звук и свет." },
    { id: "l2", user: "alisa", text: "В кадре все отлично." },
    { id: "l3", user: "beat.room", text: "Покажи пресет." },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const host = getCreator(activeLive.hostId);

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
          <div className="live-visual">
            <div className="broadcast-lines" />
            <Video size={72} />
          </div>
          <div className="live-overlay">
            <span className="live-badge">LIVE</span>
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
            <strong>@{host.handle}</strong>
            <span>{activeLive.topic}</span>
          </div>
          <PrimaryButton
            icon={Plus}
            onClick={() => (currentUser ? toggleFollow(host.id) : openLogin())}
          >
            {followed.includes(host.id) ? "Вы подписаны" : "Подписаться"}
          </PrimaryButton>
          <GhostButton
            icon={Camera}
            onClick={() => {
              setIsStreaming((value) => !value);
              showToast(isStreaming ? "Стрим остановлен" : "Тестовый стрим запущен");
            }}
          >
            {isStreaming ? "Остановить" : "Начать стрим"}
          </GhostButton>
        </div>
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
        {LIVE_STREAMS.map((stream) => {
          const streamHost = getCreator(stream.hostId);
          return (
            <button
              key={stream.id}
              className={activeLive.id === stream.id ? "live-tile is-active" : "live-tile"}
              type="button"
              onClick={() => setActiveLive(stream)}
              style={{ "--tile-accent": stream.accent }}
            >
              <Avatar user={streamHost} size="md" />
              <div>
                <strong>{stream.title}</strong>
                <span>@{streamHost.handle}</span>
              </div>
              <em>{compactNumber(stream.viewers)}</em>
            </button>
          );
        })}
      </section>
    </main>
  );
}

function MessagesView({ currentUser, openLogin }) {
  const [selected, setSelected] = useState("Команда VibeTok");
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState([
    {
      id: "team",
      name: "Команда VibeTok",
      last: "Ваше видео попало в рекомендации.",
      unread: 2,
      messages: ["Ваше видео попало в рекомендации.", "Добавьте описание и теги."],
    },
    {
      id: "max",
      name: "max.bond",
      last: "Го коллаб на выходных?",
      unread: 1,
      messages: ["Го коллаб на выходных?"],
    },
    {
      id: "ksenia",
      name: "ksenia.fit",
      last: "Скинула звук для челленджа.",
      unread: 0,
      messages: ["Скинула звук для челленджа."],
    },
  ]);

  const thread = threads.find((item) => item.name === selected) ?? threads[0];

  function sendMessage(event) {
    event.preventDefault();
    if (!currentUser) {
      openLogin();
      return;
    }
    const text = draft.trim();
    if (!text) return;
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
        {threads.map((item) => (
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
        ))}
      </section>
      <section className="thread-panel">
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
      </section>
    </main>
  );
}

function ProfileView({ currentUser, uploads, likedCount, openProfile, openUpload, openLogin }) {
  if (!currentUser) {
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

  return (
    <main className="profile-view">
      <section className="profile-hero" style={{ "--profile-accent": currentUser.accent }}>
        <div className="profile-cover" />
        <Avatar user={currentUser} size="xxl" />
        <div className="profile-copy">
          <span className="display-name">{currentUser.name}</span>
          <h1>
            @{currentUser.handle}
            {currentUser.verified ? <CheckCircle2 size={22} /> : null}
          </h1>
          <p>{currentUser.bio}</p>
        </div>
        <div className="profile-actions">
          <PrimaryButton icon={Pencil} onClick={openProfile}>
            Редактировать профиль
          </PrimaryButton>
          <GhostButton icon={Upload} onClick={openUpload}>
            Новое видео
          </GhostButton>
        </div>
      </section>

      <section className="profile-grid">
        <div className="metric-card">
          <strong>24.3K</strong>
          <span>Подписчики</span>
        </div>
        <div className="metric-card">
          <strong>{likedCount}</strong>
          <span>Лайки</span>
        </div>
        <div className="metric-card">
          <strong>{uploads.length}</strong>
          <span>Загрузки</span>
        </div>
        <div className="metric-card">
          <strong>87%</strong>
          <span>Удержание</span>
        </div>
      </section>

      <section className="profile-content">
        <div className="panel-header">
          <div>
            <h2>Мои видео</h2>
            <span>Локальные загрузки текущей сессии</span>
          </div>
          <Clapperboard size={20} />
        </div>
        {uploads.length ? (
          <div className="upload-grid">
            {uploads.map((video) => (
              <article className="upload-card" key={video.id}>
                <video src={video.source} muted playsInline preload="metadata" />
                <strong>{video.caption}</strong>
                <span>{video.tags.map((tag) => `#${tag}`).join(" ")}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-block">
            <Upload size={38} />
            <p>Пока нет своих видео. Загрузите первый ролик и он появится в ленте.</p>
            <PrimaryButton icon={Upload} onClick={openUpload}>
              Загрузить
            </PrimaryButton>
          </div>
        )}
      </section>
    </main>
  );
}

function UploadModal({ currentUser, onClose, onUpload, openLogin }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("Мой новый вайб");
  const [tags, setTags] = useState("vibetok, new");
  const [visibility, setVisibility] = useState("public");

  function submit(event) {
    event.preventDefault();
    if (!currentUser) {
      openLogin();
      return;
    }
    if (!file) return;
    const source = URL.createObjectURL(file);
    onUpload({
      id: `upload-${Date.now()}`,
      creatorId: "me",
      source,
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
      duration: "new",
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
          <span>MP4, WebM или MOV. Ролик добавится в начало ленты.</span>
        </label>
        <label>
          Описание
          <textarea value={caption} onChange={(event) => setCaption(event.target.value)} />
        </label>
        <label>
          Теги через запятую
          <input value={tags} onChange={(event) => setTags(event.target.value)} />
        </label>
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
            disabled={!file}
            className={!file ? "is-disabled" : ""}
          >
            Опубликовать
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

function LoginModal({ onClose, onLogin }) {
  const [customName, setCustomName] = useState("");

  function loginCustom(event) {
    event.preventDefault();
    const handle = customName.trim().replace(/\s+/g, ".").toLowerCase();
    if (!handle) return;
    onLogin({
      id: `user-${Date.now()}`,
      handle,
      name: customName.trim(),
      bio: "Новый автор в VibeTok.",
      accent: "#00e5ff",
      avatar: handle
        .split(".")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      gradient: "linear-gradient(135deg, #00e5ff, #ff2d6f)",
      verified: false,
    });
  }

  return (
    <Modal title="Вход в аккаунт" icon={LogIn} onClose={onClose}>
      <div className="login-options">
        {DEMO_USERS.map((user) => (
          <button key={user.id} type="button" onClick={() => onLogin(user)}>
            <Avatar user={user} size="md" />
            <div>
              <strong>{user.handle}</strong>
              <span>{user.bio}</span>
            </div>
            <LogIn size={18} />
          </button>
        ))}
      </div>
      <form className="custom-login" onSubmit={loginCustom}>
        <label>
          Быстрый новый аккаунт
          <input
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
            placeholder="Ваш ник"
          />
        </label>
        <PrimaryButton icon={Sparkles} type="submit">
          Создать и войти
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
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={draft.verified}
            onChange={(event) => setDraft({ ...draft, verified: event.target.checked })}
          />
          <span>
            <ShieldCheck size={18} />
            Показывать отметку автора
          </span>
        </label>
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

function MobileNav({ activeTab, setActiveTab, openUpload }) {
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
          onClick={() => (id === "upload" ? openUpload() : setActiveTab(id))}
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
  const [currentUser, setCurrentUser] = useLocalState("vibetok-user", DEMO_USERS[0]);
  const [followed, setFollowed] = useLocalState("vibetok-followed", ["ride", "vlad"]);
  const [liked, setLiked] = useLocalState("vibetok-liked", []);
  const [saved, setSaved] = useLocalState("vibetok-saved", []);
  const [commentsByVideo, setCommentsByVideo] = useLocalState(
    "vibetok-comments",
    INITIAL_COMMENTS,
  );
  const [uploads, setUploads] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [feedMode, setFeedMode] = useState("forYou");
  const [selectedTag, setSelectedTag] = useState("всё");
  const [query, setQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  const allVideos = useMemo(() => [...uploads, ...SEED_VIDEOS], [uploads]);

  const visibleVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return allVideos.filter((video) => {
      const creator = video.creatorId === "me" ? currentUser : getCreator(video.creatorId);
      const matchesMode =
        feedMode === "forYou" ||
        video.creatorId === "me" ||
        followed.includes(video.creatorId);
      const matchesTag =
        selectedTag === "всё" || video.tags.some((tag) => tag.toLowerCase() === selectedTag);
      const haystack = `${video.caption} ${video.tags.join(" ")} ${creator?.handle ?? ""}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesMode && matchesTag && matchesQuery;
    });
  }, [allVideos, currentUser, feedMode, followed, query, selectedTag]);

  useEffect(() => {
    if (currentIndex >= visibleVideos.length) setCurrentIndex(0);
  }, [currentIndex, visibleVideos.length]);

  useEffect(() => {
    document.documentElement.style.setProperty("--user-accent", currentUser?.accent ?? "#ff2d6f");
  }, [currentUser]);

  const activeVideo = visibleVideos[currentIndex];
  const activeCreator =
    activeVideo?.creatorId === "me"
      ? currentUser ?? {
          ...DEMO_USERS[0],
          handle: "local.upload",
          name: "Локальная загрузка",
          bio: "Видео из текущей сессии",
        }
      : getCreator(activeVideo?.creatorId);

  function toggleListValue(setter, id) {
    setter((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  }

  function toggleFollow(id) {
    if (id === "me") return;
    toggleListValue(setFollowed, id);
  }

  function showToast(message) {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(""), 2200);
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

  function handleUpload(video) {
    setUploads((items) => [video, ...items]);
    setFeedMode("forYou");
    setSelectedTag("всё");
    setActiveTab("home");
    setCurrentIndex(0);
    showToast("Видео добавлено в ленту");
  }

  function setCurrentVideoById(id) {
    const index = visibleVideos.findIndex((video) => video.id === id);
    if (index >= 0) setCurrentIndex(index);
  }

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
        followed={followed}
        toggleFollow={toggleFollow}
        openUpload={() => setModal("upload")}
        openProfile={() => setActiveTab("profile")}
      />

      <div className="main-column">
        <TopBar
          feedMode={feedMode}
          setFeedMode={(mode) => {
            setFeedMode(mode);
            setActiveTab("home");
          }}
          query={query}
          setQuery={setQuery}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          openUpload={() => setModal("upload")}
          openLogin={() => setModal("login")}
          currentUser={currentUser}
          signOut={() => {
            setCurrentUser(null);
            showToast("Вы вышли из аккаунта");
          }}
          showToast={showToast}
        />

        {activeTab === "home" && activeVideo && activeCreator ? (
          <div className="content-grid">
            <VideoStage
              video={activeVideo}
              creator={activeCreator}
              currentUser={currentUser}
              isLiked={liked.includes(activeVideo.id)}
              isSaved={saved.includes(activeVideo.id)}
              isFollowing={followed.includes(activeVideo.creatorId)}
              toggleLike={(id) => toggleListValue(setLiked, id)}
              toggleSave={(id) => toggleListValue(setSaved, id)}
              toggleFollow={toggleFollow}
              nextVideo={() => setCurrentIndex((index) => (index + 1) % visibleVideos.length)}
              prevVideo={() =>
                setCurrentIndex((index) => (index - 1 + visibleVideos.length) % visibleVideos.length)
              }
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
            />
          </div>
        ) : null}

        {activeTab === "home" && !activeVideo ? (
          <EmptyFeed openUpload={() => setModal("upload")} setFeedMode={setFeedMode} />
        ) : null}

        {activeTab === "live" ? (
          <LiveView
            currentUser={currentUser}
            followed={followed}
            toggleFollow={toggleFollow}
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
            uploads={uploads}
            likedCount={liked.length}
            openProfile={() => setModal("profile")}
            openUpload={() => setModal("upload")}
            openLogin={() => setModal("login")}
          />
        ) : null}
      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} openUpload={() => setModal("upload")} />

      {modal === "upload" ? <UploadModal {...modalProps} onUpload={handleUpload} /> : null}
      {modal === "login" ? (
        <LoginModal
          onClose={() => setModal(null)}
          onLogin={(user) => {
            setCurrentUser(user);
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
            setCurrentUser(user);
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
    </div>
  );
}
