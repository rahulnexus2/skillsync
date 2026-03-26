import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { ArrowRight, Lightbulb, Map, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

// Intersection Observer Hook
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
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const features = [
  {
    icon: <Sparkles className="h-6 w-6 text-indigo-500" />,
    title: "AI Resume Scoring",
    desc: "Upload your resume and get instant ATS compatibility scores, strength analysis, and role-specific keyword suggestions.",
  },
  {
    icon: <Map className="h-6 w-6 text-blue-500" />,
    title: "Smart Job Matching",
    desc: "Browse curated job listings and apply in one click. Each position is posted by verified admins with full details.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-sky-500" />,
    title: "Role-Based Access",
    desc: "Separate, secure experiences for candidates and hiring admins — each with tailored dashboards and controls.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-violet-500" />,
    title: "Direct Admin Chat",
    desc: "Once accepted, chat directly with the hiring admin in real-time. No middlemen, no email chains.",
  },
];

const steps = [
  { num: "01", title: "Create Your Account", desc: "Sign up as a candidate or admin using the unified auth page." },
  { num: "02", title: "Build Your Profile", desc: "Add your skills, projects, and education. Upload your resume." },
  { num: "03", title: "Discover & Apply", desc: "Browse active job listings and apply to roles with a single click." },
  { num: "04", title: "Get Hired", desc: "Admins review your profile. Once accepted, chat directly and move forward." },
];

export const Landingpage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      {/* NAV */}
      <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600 text-primary-foreground font-bold shadow-sm">
              S
            </div>
            <span className="text-xl font-bold tracking-tight">SkillSync</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="hidden md:flex h-9 min-w-max shrink-0 whitespace-nowrap items-center justify-center px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Sign In</Link>
            <Link to="/signup" className="btn-primary h-9 px-4 text-sm shadow-primary/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(37,99,235,0.1)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.12)_0%,transparent_70%)]" />
        
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-both">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              AI-Powered Job Portal
            </span>
          </div>

          <h1 className="mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ease-out fill-mode-both text-balance text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Land your dream job <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
              smarter, faster.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 ease-out fill-mode-both text-lg text-muted-foreground sm:text-xl leading-relaxed">
            SkillSync connects talented candidates with the right opportunities. Experience seamless AI resume scoring, real-time application tracking, and direct admin messaging all in one unified platform.
          </p>

          <div className="flex animate-in fade-in slide-in-from-bottom-8 flex-col items-center justify-center gap-4 duration-700 delay-500 ease-out fill-mode-both sm:flex-row">
            <Link to="/signup" className="btn-primary h-12 px-8 text-base shadow-lg shadow-primary/20 w-full sm:w-auto">
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link to="/login" className="btn-secondary h-12 px-8 text-base w-full sm:w-auto border-border">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Platform Features</h2>
              <p className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
                Everything you need to <span className="text-primary">get hired.</span>
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="card-panel group h-full p-8 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3 ring-1 ring-inset ring-primary/20">
                    {f.icon}
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Process</h2>
              <p className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                From signup to offer letter.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 100} className="relative">
                <div className="relative z-10">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-inset ring-primary/20">
                    <span className="text-sm font-extrabold text-primary">{s.num}</span>
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-[52px] top-6 -z-10 h-[2px] w-full bg-gradient-to-r from-primary/20 to-transparent"></div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background py-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded border border-primary/20 bg-primary/10">
            <span className="text-[10px] font-bold text-primary">S</span>
          </div>
          <span className="font-bold text-foreground tracking-tight">SkillSync</span>
        </div>
        <p className="text-xs text-muted-foreground">
          AI-powered job portal. Built with MERN + React + Tailwind CSS.
        </p>
      </footer>
    </div>
  );
};