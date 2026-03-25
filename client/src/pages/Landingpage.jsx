import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const features = [
  {
    icon: "✦",
    title: "AI Resume Scoring",
    desc: "Upload your resume and get instant ATS compatibility scores, strength analysis, and role-specific keyword suggestions powered by LLMs.",
    accent: "#6366f1",
  },
  {
    icon: "◈",
    title: "Smart Job Matching",
    desc: "Browse curated job listings and apply in one click. Each position is posted by verified admins with full job details.",
    accent: "#8b5cf6",
  },
  {
    icon: "⬡",
    title: "Application Tracker",
    desc: "Track every application in real-time. Know exactly when your status changes from pending to accepted or rejected.",
    accent: "#a78bfa",
  },
  {
    icon: "◎",
    title: "Direct Admin Chat",
    desc: "Once accepted, chat directly with the hiring admin. No middlemen, no email chains — just clear communication.",
    accent: "#7c3aed",
  },
  {
    icon: "❋",
    title: "Profile Showcase",
    desc: "Build a rich professional profile with your skills, projects, education and contact info that admins can browse.",
    accent: "#6d28d9",
  },
  {
    icon: "⊕",
    title: "Role-Based Access",
    desc: "Separate, secure experiences for candidates and hiring admins — each with tailored dashboards and controls.",
    accent: "#4f46e5",
  },
];

const steps = [
  { num: "01", title: "Create Your Account", desc: "Sign up as a candidate or admin using the unified auth page. Admins verify with a secure key." },
  { num: "02", title: "Build Your Profile", desc: "Add your skills, projects, and education. Upload your resume and get an instant AI score." },
  { num: "03", title: "Discover & Apply", desc: "Browse active job listings. Apply to roles that match your profile with a single click." },
  { num: "04", title: "Get Hired", desc: "Admins review your profile and resume. Once accepted, chat directly and move forward." },
];

export const Landingpage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Instrument+Serif:ital@0;1&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .nav-pill {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(99,102,241,0.12);
          box-shadow: 0 2px 24px rgba(99,102,241,0.08);
        }

        .hero-word {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          background: linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-bg {
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 70%);
        }

        .feature-card {
          background: white;
          border: 1px solid #ede9fe;
          border-radius: 16px;
          padding: 28px;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(99,102,241,0.1);
          border-color: #c4b5fd;
        }

        .step-line {
          position: absolute;
          top: 24px;
          left: calc(50% + 24px);
          width: calc(100% - 48px);
          height: 1px;
          background: linear-gradient(90deg, #c4b5fd, transparent);
        }

        .cta-btn {
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
          text-decoration: none;
          display: inline-block;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.45);
        }

        .ghost-btn {
          background: transparent;
          color: #6366f1;
          border: 1.5px solid #c4b5fd;
          border-radius: 12px;
          padding: 13px 28px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          display: inline-block;
        }
        .ghost-btn:hover {
          background: #f5f3ff;
          border-color: #6366f1;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 13px;
          color: #6d28d9;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .dot { width: 6px; height: 6px; background: #6366f1; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }

        .grid-bg {
          background-image: linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .stat-card {
          background: white;
          border: 1px solid #ede9fe;
          border-radius: 12px;
          padding: 20px 28px;
          text-align: center;
        }

        .dark .nav-pill {
          background: rgba(24, 24, 27, 0.85);
          border-color: rgba(63, 63, 70, 0.6);
        }
        .dark .feature-card,
        .dark .stat-card {
          background: rgb(24, 24, 27);
          border-color: rgb(39, 39, 42);
          color: rgb(250, 250, 250);
        }
        .dark .grid-bg {
          background-image: linear-gradient(rgba(129, 140, 248, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(129, 140, 248, 0.06) 1px, transparent 1px);
        }
        .dark .hero-bg h1 { color: #fafafa !important; }
        .dark .hero-bg p { color: #a1a1aa !important; }
        .dark .badge {
          background: rgba(39, 39, 42, 0.9);
          border-color: #52525b;
          color: #e4e4e7;
        }
        .dark .landing-brand { color: #fafafa !important; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
        zIndex: 100, width: "90%", maxWidth: 900,
      }}>
        <div className="nav-pill" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderRadius: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #6366f1, #7c3aed)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>S</span>
            </div>
            <span className="landing-brand" style={{ fontWeight: 600, fontSize: 16, color: "#1e1b4b" }}>SkillSync</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ThemeToggle />
            <Link to="/login" className="ghost-btn" style={{ padding: "8px 20px", fontSize: 14 }}>Sign In</Link>
            <Link to="/signup" className="cta-btn" style={{ padding: "8px 20px", fontSize: 14 }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-bg grid-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.1s forwards" }}>
            <span className="badge"><span className="dot" /> AI-Powered Job Portal</span>
          </div>

          <h1 style={{
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: "-1px",
            color: "#0f0f0f",
            marginBottom: 24,
            opacity: 0,
            animation: "fadeUp 0.8s ease 0.2s forwards"
          }}>
            Land your dream job<br />
            <span className="hero-word">smarter, faster.</span>
          </h1>

          <p style={{
            fontSize: 18, color: "#64748b", lineHeight: 1.7, maxWidth: 520,
            margin: "0 auto 40px",
            opacity: 0, animation: "fadeUp 0.8s ease 0.35s forwards"
          }}>
            SkillSync connects talented candidates with the right opportunities.
            AI resume scoring, real-time tracking, and direct admin chat — all in one place.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.8s ease 0.5s forwards" }}>
            <Link to="/signup" className="cta-btn">Start for free →</Link>
            <Link to="/login" className="ghost-btn">Sign in</Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 16, justifyContent: "center", marginTop: 64, flexWrap: "wrap",
            opacity: 0, animation: "fadeUp 0.8s ease 0.65s forwards"
          }}>
            {[
              { val: "AI", label: "Resume Scoring" },
              { val: "4", label: "Core Features" },
              { val: "2", label: "User Roles" },
              { val: "∞", label: "Opportunities" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ minWidth: 120 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#6366f1", fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "100px 24px", background: "#f8f7ff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <p style={{ fontSize: 12, letterSpacing: 3, color: "#6366f1", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Features</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#0f0f0f", lineHeight: 1.2 }}>
                Everything you need to<br />
                <span className="hero-word" style={{ fontSize: "clamp(30px, 4.5vw, 48px)" }}>get hired.</span>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="feature-card">
                  <div style={{ fontSize: 24, color: f.accent, marginBottom: 16, lineHeight: 1 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: "#1e1b4b", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 24px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <p style={{ fontSize: 12, letterSpacing: 3, color: "#6366f1", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Process</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#0f0f0f", lineHeight: 1.2 }}>
                From signup to<br />
                <span className="hero-word" style={{ fontSize: "clamp(30px, 4.5vw, 48px)" }}>offer letter.</span>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 100}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#6366f1" }}>{s.num}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      position: "absolute", top: 24, left: 56,
                      width: "calc(100% - 24px)", height: 1,
                      background: "linear-gradient(90deg, #c4b5fd 0%, transparent 100%)",
                      display: "block"
                    }} />
                  )}
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: "80px 24px" }}>
        <Reveal>
          <div style={{
            maxWidth: 700, margin: "0 auto", textAlign: "center",
            background: "linear-gradient(135deg, #1e1b4b, #312e81)",
            borderRadius: 24, padding: "60px 40px",
            boxShadow: "0 24px 80px rgba(99,102,241,0.2)"
          }}>
            <p style={{ fontSize: 12, letterSpacing: 3, color: "#a78bfa", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Ready?</p>
            <h2 style={{
              fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 300,
              color: "white", lineHeight: 1.2, marginBottom: 16
            }}>
              Your next opportunity<br />
              <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#a78bfa" }}>is one click away.</span>
            </h2>
            <p style={{ fontSize: 15, color: "#94a3b8", marginBottom: 36, lineHeight: 1.6 }}>
              Join SkillSync today. Upload your resume, get AI feedback,
              and connect with hiring admins directly.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/signup" style={{
                background: "white", color: "#4f46e5",
                borderRadius: 12, padding: "14px 32px",
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                transition: "all 0.25s ease",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
              }}>
                Create Free Account
              </Link>
              <Link to="/login" style={{
                background: "transparent", color: "white",
                border: "1.5px solid rgba(255,255,255,0.2)",
                borderRadius: 12, padding: "13px 28px",
                fontSize: 15, fontWeight: 500, textDecoration: "none",
              }}>
                Sign In
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #ede9fe", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 24, height: 24, background: "linear-gradient(135deg, #6366f1, #7c3aed)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>S</span>
          </div>
          <span style={{ fontWeight: 600, color: "#1e1b4b" }}>SkillSync</span>
        </div>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>AI-powered job portal · Built with MERN + HuggingFace</p>
      </footer>
    </div>
  );
};