"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import gsap from "gsap";

import {
  FaHouse,
  FaCode,
  FaEnvelope,
} from "react-icons/fa6";

import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiC,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGsap,
  SiFramer,
  SiNodedotjs,
  SiLinux,
  SiGit,
  SiGithub,
  SiFigma,
  SiDocker,
  SiPnpm,
  SiVercel,
  SiPostgresql,
} from "react-icons/si";

import {
  VscCode,
} from "react-icons/vsc";

type Tab = "home" | "skills" | "contact";

interface LanyardData {
  discord_user: { username: string; avatar: string; id: string };
  discord_status: "online" | "idle" | "dnd" | "offline";
  listening_to_spotify: boolean;
  spotify: {
    song: string; artist: string; album: string;
    album_art_url: string; track_id: string;
    timestamps: { start: number; end: number };
  } | null;
  activities: Array<{ name: string; type: number; details?: string; state?: string }>;
}

interface LastFMTrack {
  name: string;
  artist: string;
  album: string;
  image: string | null;
  nowPlaying: boolean;
  playedAt: string | null;
}

const BIRTH = new Date("2011-05-10T00:00:00-03:00");
const DISCORD_ID = "1511630619153666181";
const MS_YR = 1000 * 60 * 60 * 24 * 365.25;

const S_COLOR: Record<string, string> = {
  online: "#23a55a",
  idle: "#f0b232",
  dnd: "#f23f43",
  offline: "#80848e",
};

const S_LABEL: Record<string, string> = {
  online: "online",
  idle: "ausente",
  dnd: "não perturbe",
  offline: "offline",
};

const NAV_ITEMS: { id: Tab; icon: React.ReactNode; hint: string }[] = [
  { id: "home", icon: <FaHouse size={18} />, hint: "início / bio" },
  { id: "skills", icon: <FaCode size={18} />, hint: "stack" },
  { id: "contact", icon: <FaEnvelope size={18} />, hint: "contatos / links" },
];

const calcAge = () => ((Date.now() - BIRTH.getTime()) / MS_YR).toFixed(9);
const fmtMs = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
};

function startParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  type P = { x: number; y: number; vx: number; vy: number; a: number; r: number; da: number };
  const pts: P[] = [];
  let raf: number;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  for (let i = 0; i < 100; i++) {
    pts.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.25 + 0.08,
      r: Math.random() * 0.8 + 0.2,
      da: (Math.random() - 0.5) * 0.0004,
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pts) {
      p.x = (p.x + p.vx + canvas.width) % canvas.width;
      p.y = (p.y + p.vy + canvas.height) % canvas.height;
      p.a = Math.max(0.04, Math.min(0.35, p.a + p.da));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };
  draw();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}

function startCursor() {
  const el = document.getElementById("cursor") as HTMLDivElement;
  if (!el) return () => {};

  let mouseX = 0,
    mouseY = 0;
  let posX = 0,
    posY = 0;
  let isVisible = false;
  let raf: number;

  const move = (e: MouseEvent) => {
    mouseX = e.clientX - 10;
    mouseY = e.clientY - 10;
    if (!isVisible) {
      isVisible = true;
      el.classList.add("visible");
      posX = mouseX;
      posY = mouseY;
    }
  };

  const hide = () => {
    isVisible = false;
    el.classList.remove("visible");
  };

  const show = () => {
    isVisible = true;
    el.classList.add("visible");
  };

  const animate = () => {
    if (isVisible) {
      posX += (mouseX - posX) * 0.12;
      posY += (mouseY - posY) * 0.12;
      el.style.transform = `translate(${posX}px, ${posY}px)`;
    }
    raf = requestAnimationFrame(animate);
  };

  document.addEventListener("mousemove", move, { passive: true });
  document.addEventListener("mouseleave", hide);
  document.addEventListener("mouseenter", show);

  animate();

  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseleave", hide);
    document.removeEventListener("mouseenter", show);
  };
}

function AgeTooltip({ age }: { age: string }) {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!tooltipRef.current) return;

    if (isHovering) {
      gsap.to(tooltipRef.current, {
        opacity: 1,
        y: -6,
        duration: 0.15,
        ease: "power2.out",
      });
    } else {
      gsap.to(tooltipRef.current, {
        opacity: 0,
        y: 0,
        duration: 0.15,
        ease: "power2.out",
      });
    }
  }, [isHovering]);

  const updatePosition = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        cursor: "none",
      }}
      onMouseEnter={(e) => {
        updatePosition(e);
        setIsHovering(true);
      }}
      onMouseMove={updatePosition}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span
        style={{
          borderBottom: "1px dashed rgba(255,255,255,0.15)",
          paddingBottom: "1px",
          color: "#e6e6e6",
          fontSize: "0.9375rem",
          fontWeight: 500,
          lineHeight: 1.4,
        }}
      >
        15 anos
      </span>
      <span
        ref={tooltipRef}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y - 32,
          transform: "translateX(-50%)",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.6rem",
          color: "rgba(255,255,255,0.85)",
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: "4px 12px",
          borderRadius: "6px",
          border: "1px solid rgba(255,255,255,0.06)",
          opacity: 0,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          letterSpacing: "-0.01em",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          zIndex: 9999,
          userSelect: "none",
        }}
      >
        {age}
      </span>
    </span>
  );
}

function NavItem({
  icon,
  hint,
  isActive,
  onClick,
  onPositionUpdate,
}: {
  icon: React.ReactNode;
  hint: string;
  isActive: boolean;
  onClick: () => void;
  onPositionUpdate: (rect: DOMRect) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const updatePosition = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    if (isActive) {
      onPositionUpdate(rect);
    }
  };

  useEffect(() => {
    if (isActive && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      onPositionUpdate(rect);
    }
  }, [isActive, onPositionUpdate]);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={`nav-btn${isActive ? " active" : ""}`}
      onMouseEnter={() => {
        setShowTooltip(true);
        updatePosition();
      }}
      onMouseMove={updatePosition}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="nav-icon">{icon}</span>
      <span
        className={`nav-tooltip${showTooltip ? " visible" : ""}`}
        style={{
          left: tooltipPos.x,
          top: tooltipPos.y - 32,
          transform: showTooltip ? "translateX(-50%) translateY(-4px)" : "translateX(-50%) translateY(6px)",
        }}
      >
        {hint}
      </span>
    </button>
  );
}

export default function Page() {
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [age, setAge] = useState("");
  const [now, setNow] = useState(Date.now());
  const [mounted, setMounted] = useState(false);
  const [lastFMTrack, setLastFMTrack] = useState<LastFMTrack | null>(null);
  const [isAlbumVisible, setIsAlbumVisible] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);
  const bgRef = useRef<HTMLDivElement>(null);
  const bgRef2 = useRef<HTMLDivElement>(null);

  const updateIndicator = useCallback((rect: DOMRect) => {
    if (!indicatorRef.current || !navRef.current) return;

    const navRect = navRef.current.getBoundingClientRect();

    if (isFirstRun.current) {
      indicatorRef.current.style.transform = `translateX(${rect.left - navRect.left}px)`;
      indicatorRef.current.style.width = `${rect.width}px`;
      indicatorRef.current.style.opacity = "1";
      isFirstRun.current = false;
      return;
    }

    gsap.to(indicatorRef.current, {
      x: rect.left - navRect.left,
      width: rect.width,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
      clearProps: "none",
    });
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("particles") as HTMLCanvasElement | null;
    if (canvas) {
      const cleanup = startParticles(canvas);
      return cleanup;
    }
  }, []);

  useEffect(() => {
    const cleanup = startCursor();
    return cleanup;
  }, []);

  useEffect(() => {
    setMounted(true);
    setAge(calcAge());

    const timer = setInterval(() => {
      setAge(calcAge());
      setNow(Date.now());
    }, 250);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let heartbeat: ReturnType<typeof setInterval>;

    const connect = () => {
      const ws = new WebSocket("wss://api.lanyard.rest/socket");
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const { op, d } = JSON.parse(event.data);

          if (op === 1) {
            heartbeat = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }));
              }
            }, d.heartbeat_interval);
            ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
          }

          if (op === 0 && d) {
            setLanyard(d);
          }
        } catch (err) {}
      };

      ws.onclose = () => {
        clearInterval(heartbeat);
        setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      clearInterval(heartbeat);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const fetchLastFM = async () => {
      try {
        const res = await fetch("/api/lastfm");
        const data = await res.json();

        if (data.track) {
          setLastFMTrack(data.track);
        } else {
          setLastFMTrack(null);
        }
      } catch (error) {
        console.error("Failed to fetch Last.fm data:", error);
        setLastFMTrack(null);
      }
    };

    fetchLastFM();
    const interval = setInterval(fetchLastFM, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const shouldShow = lastFMTrack?.nowPlaying === true && lastFMTrack?.image;
    
    if (shouldShow && !isAlbumVisible) {
      setIsAlbumVisible(true);
      if (bgRef.current) {
        gsap.to(bgRef.current, { opacity: 0.55, duration: 0.9, ease: "power2.out" });
      }
      if (bgRef2.current) {
        gsap.to(bgRef2.current, { opacity: 0.3, duration: 0.9, ease: "power2.out" });
      }
    } else if (!shouldShow && isAlbumVisible) {
      if (bgRef.current) {
        gsap.to(bgRef.current, { opacity: 0, duration: 0.9, ease: "power2.out" });
      }
      if (bgRef2.current) {
        gsap.to(bgRef2.current, { opacity: 0, duration: 0.9, ease: "power2.out" });
      }
      setTimeout(() => setIsAlbumVisible(false), 900);
    }
  }, [lastFMTrack, isAlbumVisible]);

  useEffect(() => {
    if (!mounted) return;

    const elements = document.querySelectorAll("[data-in]");
    if (elements.length === 0) return;

    gsap.fromTo(
      elements,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "opacity,y",
      }
    );
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const container = document.querySelector(`[data-tab="${currentTab}"]`);
    if (!container) return;

    gsap.fromTo(
      container,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.38,
        ease: "power3.out",
        clearProps: "opacity,y",
      }
    );

    const children = container.querySelectorAll("[data-in]");
    if (children.length > 0) {
      gsap.fromTo(
        Array.from(children),
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
          clearProps: "opacity,y",
          delay: 0.05,
        }
      );
    }
  }, [currentTab, mounted]);

  if (!mounted) return null;

  const status = lanyard?.discord_status ?? "offline";
  const spotify = lanyard?.listening_to_spotify ? lanyard.spotify : null;

  const avatarExt = lanyard?.discord_user?.avatar?.startsWith("a_") ? "gif" : "webp";
  const avatarUrl = lanyard?.discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${lanyard.discord_user.avatar}.${avatarExt}?size=80`
    : null;
  const avatarSmall = lanyard?.discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${lanyard.discord_user.avatar}.${avatarExt}?size=40`
    : null;

  const spotifyProg = spotify?.timestamps
    ? Math.min(1, (now - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start))
    : 0;

  const albumArt = lastFMTrack?.image ? `/api/image-proxy?url=${encodeURIComponent(lastFMTrack.image)}` : null;
  const trackName = lastFMTrack?.name || "";
  const artistName = lastFMTrack?.artist || "";
  const albumName = lastFMTrack?.album || "";
  const nowPlaying = lastFMTrack?.nowPlaying || false;

  const Mono = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <span style={{ fontFamily: "var(--font-geist-mono), monospace", ...style }}>{children}</span>
  );

  const labelLine = (text: string) => (
    <p
      style={{
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: "0.9rem",
        color: "#4a4a4a",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px",
        letterSpacing: "0.02em",
        textTransform: "lowercase" as const,
      }}
    >
      <span style={{ display: "inline-block", width: "18px", height: "1px", background: "#4a4a4a" }} />
      {text}
    </p>
  );

  const SocialIcon = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} className="social-icon" />
  );

  const renderHome = () => (
    <div data-tab="home" style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div data-in>
          {labelLine("iae")}
          <h1
            style={{
              fontFamily: "var(--font-geist), sans-serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: "#e6e6e6",
              marginTop: "4px",
              textTransform: "lowercase" as const,
            }}
          >
            obeskrov
          </h1>
          <a
            href={`https://discord.com/users/${DISCORD_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
              marginTop: "8px",
            }}
          >
            {avatarSmall && (
              <img
                src={avatarSmall}
                alt=""
                width={18}
                height={18}
                style={{
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.08)",
                  flexShrink: 0,
                }}
              />
            )}
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "0.75rem",
                color: "#4a4a4a",
                letterSpacing: "-0.01em",
                transition: "color 0.2s",
                cursor: "none",
                display: "inline-block",
                padding: "2px 0",
                textTransform: "lowercase" as const,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e6e6e6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
            >
              @{lanyard?.discord_user?.username ?? "obeskrov"}
            </span>
          </a>
        </div>

        {nowPlaying && lastFMTrack && trackName && (
          <div
            data-in
            style={{
              textAlign: "right",
              maxWidth: "200px",
              marginTop: "28px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "0.5rem",
                color: "#4a4a4a",
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
              }}
            >
              ouvindo agora
            </p>
            <p
              style={{
                fontFamily: "var(--font-geist), sans-serif",
                fontSize: "0.8rem",
                color: "#e6e6e6",
                fontWeight: 500,
                marginTop: "2px",
                lineHeight: 1.2,
                background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.6) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {artistName} · {trackName}
            </p>
          </div>
        )}
      </div>

      <p
        data-in
        style={{
          fontFamily: "var(--font-geist), sans-serif",
          fontSize: "0.9375rem",
          color: "#4a4a4a",
          lineHeight: 1.8,
          maxWidth: "520px",
          marginBottom: "24px",
        }}
      >
        Sou um desenvolvedor front-end e designer de interfaces brasileiro. Tenho{" "}
        <AgeTooltip age={age} /> e gosto de criar coisas para a web, além de passar tempo entre{" "}
        <span style={{ color: "#e6e6e6" }}>psicologia</span>,{" "}
        <span style={{ color: "#e6e6e6" }}>fotografia</span>,{" "}
        <span style={{ color: "#e6e6e6" }}>artes visuais</span>,{" "}
        <span style={{ color: "#e6e6e6" }}>cinema</span> e{" "}
        <span style={{ color: "#e6e6e6" }}>história</span>. Costumo me perder em detalhes que
        ninguém pediu para existir e repensar as coisas muito mais do que o necessário.
        <br />
        <br />
        Quase todos os meus projetos começam como uma ideia aleatória. Alguns viram uma pequena
        obsessão até ficarem prontos; outros acabam se transformando em algo completamente diferente
        do que eram quando nasceram.
      </p>
    </div>
  );

  const renderSkills = () => {
    const skillGroups = [
      {
        group: "Languages",
        items: [
          { name: "TypeScript", icon: SiTypescript },
          { name: "JavaScript", icon: SiJavascript },
          { name: "Python", icon: SiPython },
          { name: "C", icon: SiC },
        ],
      },
      {
        group: "Frameworks & Libraries",
        items: [
          { name: "React", icon: SiReact },
          { name: "Next.js", icon: SiNextdotjs },
          { name: "Tailwind CSS", icon: SiTailwindcss },
          { name: "GSAP", icon: SiGsap },
          { name: "Framer Motion", icon: SiFramer },
          { name: "Node.js", icon: SiNodedotjs },
        ],
      },
      {
        group: "Tools & Platforms",
        items: [
          { name: "Linux", icon: SiLinux },
          { name: "Git", icon: SiGit },
          { name: "GitHub", icon: SiGithub },
          { name: "VS Code", icon: VscCode },
          { name: "Figma", icon: SiFigma },
          { name: "Docker", icon: SiDocker },
          { name: "pnpm", icon: SiPnpm },
          { name: "Vercel", icon: SiVercel },
          { name: "PostgreSQL", icon: SiPostgresql },
        ],
      },
    ];

    return (
      <div data-tab="skills" style={{ display: "flex", flexDirection: "column" }}>
        <div data-in>
          {labelLine("meu stack")}
          <h1
            style={{
              fontFamily: "var(--font-geist), sans-serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#e6e6e6",
              marginBottom: "12px",
              lineHeight: 1,
              textTransform: "lowercase" as const,
            }}
          >
            skills
          </h1>
          <p
            style={{
              fontFamily: "var(--font-geist), sans-serif",
              fontSize: "0.9rem",
              color: "#4a4a4a",
              lineHeight: 1.75,
              maxWidth: "480px",
            }}
          >
            Um conjunto das linguagens, frameworks e ferramentas que utilizo para criar interfaces,
            aplicações e experiências para a web. Minha stack evolui constantemente, sempre buscando
            simplicidade, desempenho e boas práticas.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {skillGroups.map(({ group, items }) => (
            <div key={group} data-in className="stack-card">
              <span className="stack-card-header">{group}</span>
              <div className="stack-items">
                {items.map(({ name, icon: Icon }) => (
                  <span key={name} className="stack-item">
                    <span className="stack-icon">
                      <Icon size={16} />
                    </span>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContact = () => {
    const socials = [
      {
        id: "github",
        name: "GitHub",
        handle: "@obeskrov",
        href: "https://github.com/obeskrov",
        icon: "/images/github.png",
        gradient: "rgba(255,255,255,0.04), rgba(255,255,255,0.01)",
        borderColor: "rgba(255,255,255,0.08)",
        glowColor: "rgba(255,255,255,0.03)",
      },
      {
        id: "instagram",
        name: "Instagram",
        handle: "@dglarp",
        href: "https://www.instagram.com/dglarp",
        icon: "/images/instagram.png",
        gradient: "rgba(225,48,108,0.10), rgba(193,53,132,0.05), rgba(131,58,180,0.03)",
        borderColor: "rgba(225,48,108,0.12)",
        glowColor: "rgba(225,48,108,0.05)",
      },
      {
        id: "spotify",
        name: "Spotify",
        handle: "obeskrov",
        href: "https://open.spotify.com/user/31l3zbt2hdin3llvro2yzxyisftq",
        icon: "/images/spotify.png",
        gradient: "rgba(29,185,84,0.10), rgba(29,185,84,0.03)",
        borderColor: "rgba(29,185,84,0.12)",
        glowColor: "rgba(29,185,84,0.05)",
      },
      {
        id: "haunt",
        name: "haunt.gg",
        handle: "haunt.gg/kr",
        href: "https://haunt.gg/kr",
        icon: "/images/haunt.png",
        gradient: "rgba(200,80,180,0.10), rgba(180,60,160,0.03)",
        borderColor: "rgba(200,80,180,0.12)",
        glowColor: "rgba(200,80,180,0.05)",
      },
      {
        id: "roblox",
        name: "Roblox",
        handle: "@obeskrov",
        href: "https://www.roblox.com/pt/users/7111311847/profile",
        icon: "/images/roblox.png",
        gradient: "rgba(0,100,255,0.12), rgba(0,50,200,0.06), rgba(0,20,150,0.03)",
        borderColor: "rgba(0,100,255,0.15)",
        glowColor: "rgba(0,100,255,0.06)",
      },
    ];

    return (
      <div data-tab="contact" style={{ display: "flex", flexDirection: "column" }}>
        <div data-in>
          {labelLine("fala comigo")}
          <h1
            style={{
              fontFamily: "var(--font-geist), sans-serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#e6e6e6",
              marginBottom: "12px",
              lineHeight: 1,
              textTransform: "lowercase" as const,
            }}
          >
            contatos & links
          </h1>
          <p
            style={{
              fontFamily: "var(--font-geist), sans-serif",
              fontSize: "0.9rem",
              color: "#4a4a4a",
              lineHeight: 1.75,
              maxWidth: "480px",
            }}
          >
            Aberto para collabs, dúvidas ou qualquer coisa — Discord é o mais rápido, mas escolha o
            que funcionar melhor.
          </p>
        </div>

        {lanyard?.discord_user && (
          <div data-in>
            <div className="discord-card">
              {avatarUrl && (
                <img src={avatarUrl} alt="avatar" className="discord-avatar" />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="discord-name">@{lanyard.discord_user.username}</p>
                <p className="discord-status">
                  {S_LABEL[status]} · forma mais rápida de me encontrar
                </p>
              </div>
              <div className="discord-actions">
                <button
                  className="discord-btn"
                  onClick={() => {
                    navigator.clipboard?.writeText(`@${lanyard.discord_user.username}`);
                  }}
                >
                  copiar handle
                </button>
                <span className="discord-divider">·</span>
                <a
                  href={`https://discord.com/users/${DISCORD_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="discord-btn"
                >
                  abrir
                </a>
              </div>
            </div>
          </div>
        )}

        <div data-in style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "28px" }}>
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card"
              style={{
                background: `linear-gradient(135deg, ${social.gradient})`,
                borderColor: social.borderColor,
                boxShadow: `0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 40px ${social.glowColor}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 60px ${social.glowColor}`;
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 40px ${social.glowColor}`;
                e.currentTarget.style.borderColor = social.borderColor;
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <SocialIcon src={social.icon} alt={social.name} />
                <div>
                  <span className="social-name">{social.name}</span>
                  <span className="social-handle">{social.handle}</span>
                </div>
              </div>
              <svg
                className="social-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const tabContent: Record<Tab, React.ReactNode> = {
    home: renderHome(),
    skills: renderSkills(),
    contact: renderContact(),
  };

  const albumBg = (nowPlaying && albumArt) || "";

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <canvas
          id="particles"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>

      {albumBg && (
        <>
          <div
            ref={bgRef}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              backgroundImage: `url(${albumBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(40px) brightness(0.55) saturate(0.8)",
              opacity: 0,
              transform: "scale(1.02)",
              transition: "opacity 0.9s ease-in-out, filter 0.9s ease-in-out",
            }}
          />
          <div
            ref={bgRef2}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              backgroundImage: `url(${albumBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(80px) brightness(0.4) saturate(0.6)",
              opacity: 0,
              transform: "scale(1.15)",
              transition: "opacity 0.9s ease-in-out, filter 0.9s ease-in-out",
            }}
          />
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              background: "radial-gradient(ellipse at center, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.8) 100%)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          backgroundColor: "#080808",
        }}
      />

      <nav className="navbar" ref={navRef}>
        <div ref={indicatorRef} className="nav-indicator" />
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            hint={item.hint}
            isActive={currentTab === item.id}
            onClick={() => setCurrentTab(item.id)}
            onPositionUpdate={updateIndicator}
          />
        ))}
      </nav>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100dvh",
          height: "100dvh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 clamp(20px, 6vw, 64px)",
          fontFamily: "var(--font-geist), sans-serif",
        }}
      >
        <div style={{ width: "100%", maxWidth: "720px" }}>
          {tabContent[currentTab]}
        </div>
      </div>
    </>
  );
}
