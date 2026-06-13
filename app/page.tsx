"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Home() {
  const [contactsOpen, setContactsOpen] = useState(false);
  const [time, setTime] = useState("");
  const contactsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString("en-US", {
        timeZone: "America/Sao_Paulo",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTime(t.replace(" ", "").toLowerCase());
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    tl.fromTo(headerRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0 })
      .fromTo(contentRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0 }, "-=0.7")
      .fromTo(socialsRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0 }, "-=0.7")
      .fromTo(footerRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0 }, "-=0.7");
  }, []);

  useEffect(() => {
    const el = contactsRef.current;
    if (!el) return;
    if (contactsOpen) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.35, ease: "power3.out" });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.35, ease: "power3.out" });
    }
  }, [contactsOpen]);

  const hoverIn = (e: React.MouseEvent<HTMLElement>) =>
    gsap.to(e.currentTarget, { opacity: 0.5, duration: 0.2 });
  const hoverOut = (e: React.MouseEvent<HTMLElement>) =>
    gsap.to(e.currentTarget, { opacity: 1, duration: 0.2 });

  const underlineIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    hoverIn(e);
    e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.5)";
  };
  const underlineOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    hoverOut(e);
    e.currentTarget.style.borderBottomColor = "transparent";
  };

  const sw = "var(--font-switzer), sans-serif";
  const gl = "var(--font-gallant), serif";

  const linkBase: React.CSSProperties = {
    textDecoration: "none",
    color: "#fff",
    borderBottom: "1px solid transparent",
    paddingBottom: "1px",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px" }}>
      <main style={{ fontFamily: sw, width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* HEADER */}
        <header ref={headerRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: 0 }}>
          <div>
            <p style={{ fontWeight: 400, fontSize: "0.95rem", color: "#fff", lineHeight: 1.25 }}>obeskrov (aka)</p>
            <p style={{ fontWeight: 400, fontSize: "0.95rem", color: "#fff", lineHeight: 1.25 }}>frontend developer &amp; ui designer</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <button
              onClick={() => setContactsOpen(v => !v)}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              style={{ background: "none", border: "none", fontFamily: sw, fontWeight: 400, fontSize: "0.95rem", color: "#fff", padding: 0, lineHeight: 1.25, cursor: "inherit" }}
            >contacts</button>
            <div ref={contactsRef} style={{ overflow: "hidden", height: 0, opacity: 0 }}>
              <div style={{ paddingTop: "10px", display: "flex", flexDirection: "column", gap: "7px", alignItems: "flex-end" }}>
                <a href="https://github.com/obeskrov" target="_blank" rel="noopener noreferrer" onMouseEnter={underlineIn} onMouseLeave={underlineOut} style={{ ...linkBase, fontSize: "0.85rem" }}>github</a>
                <a href="https://discord.com/users/1511630619153666181" target="_blank" rel="noopener noreferrer" onMouseEnter={underlineIn} onMouseLeave={underlineOut} style={{ ...linkBase, fontSize: "0.85rem" }}>discord</a>
                <a href="https://www.tiktok.com/@krovxq" target="_blank" rel="noopener noreferrer" onMouseEnter={underlineIn} onMouseLeave={underlineOut} style={{ ...linkBase, fontSize: "0.85rem" }}>tiktok</a>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT — bio esquerda, foto direita */}
        <div ref={contentRef} style={{ opacity: 0, display: "flex", gap: "32px", alignItems: "flex-start" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontFamily: gl, fontSize: "2.1rem", color: "#fff", lineHeight: 1, letterSpacing: "-0.01em" }}>obeskrov</p>
            <p style={{ fontWeight: 400, fontSize: "0.9rem", color: "#fff", lineHeight: 1.6, textTransform: "uppercase", letterSpacing: "0.01em" }}>
              is a brazil-based front-end developer and ui designer interested in
              psychology, photography, visual arts, cinema, and history. he tends
              to get lost in details nobody asked to exist and rethink things far
              more than necessary.
              <br /><br />
              most projects start as a random idea, turn into a brief obsession,
              and either get finished or become something completely different.
            </p>
          </div>
          <div style={{ width: "140px", flexShrink: 0 }}>
            <img
              src="/images/miniaylan.jpeg"
              alt="obeskrov"
              style={{ width: "100%", display: "block", aspectRatio: "3 / 4", objectFit: "cover", objectPosition: "50% 18%" }}
            />
          </div>
        </div>

        {/* INSTAGRAM */}
        <div ref={socialsRef} style={{ opacity: 0 }}>
          <a
            href="https://www.instagram.com/krovieen"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={underlineIn}
            onMouseLeave={underlineOut}
            style={{ ...linkBase, fontWeight: 500, fontSize: "0.95rem", letterSpacing: "0.03em" }}
          >instagram</a>
        </div>

        {/* FOOTER */}
        <footer ref={footerRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0 }}>
          <p style={{ fontWeight: 400, fontSize: "0.95rem", color: "#fff" }}>são paulo,&nbsp; {time}</p>
          <p style={{ fontWeight: 400, fontSize: "0.95rem", color: "#fff" }}>©2026</p>
        </footer>

      </main>
    </div>
  );
}
