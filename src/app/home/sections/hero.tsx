"use client";

import { ArrowRight, Zap, Users, Trophy, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  {
    icon: Trophy,
    value: "50+",
    label: "Sports Orgs",
    bg: "#e8192c",
    iconColor: "#fff",
  },
  {
    icon: Users,
    value: "100K+",
    label: "Registrations",
    bg: "#161e2e",
    iconColor: "#e8192c",
  },
  {
    icon: TrendingUp,
    value: "300%",
    label: "Avg Growth",
    bg: "#1a0a0d",
    iconColor: "#e8192c",
  },
  {
    icon: Zap,
    value: "$2M+",
    label: "Revenue Generated",
    bg: "#0d1520",
    iconColor: "#e8192c",
  },
];

const ticker = [
  "Website Development",
  "Event Registration",
  "Sports Consulting",
  "School Camps",
  "Youth Athletics",
  "Tournament Management",
  "Fan Engagement",
  "Mobile-First Design",
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700;1,800;1,900&family=Barlow:wght@400;500;600&display=swap');

        .h-root    { font-family:'Barlow',sans-serif; background:#0f1623; }
        .h-display { font-family:'Barlow Condensed',sans-serif; }

        @keyframes h-left  { from{opacity:0;transform:translateX(-36px);}to{opacity:1;transform:translateX(0);} }
        @keyframes h-up    { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
        @keyframes h-right { from{opacity:0;transform:translateX(36px);}to{opacity:1;transform:translateX(0);} }
        @keyframes h-ticker{ 0%{transform:translateX(0);}100%{transform:translateX(-50%);} }

        .h-al{animation:h-left  .7s cubic-bezier(.22,1,.36,1) both;}
        .h-au{animation:h-up    .65s cubic-bezier(.22,1,.36,1) both;}
        .h-ar{animation:h-right .7s cubic-bezier(.22,1,.36,1) both;}
        .h-d1{animation-delay:.05s;} .h-d2{animation-delay:.15s;}
        .h-d3{animation-delay:.28s;} .h-d4{animation-delay:.42s;}
        .h-d5{animation-delay:.56s;}

        .h-ticker{animation:h-ticker 26s linear infinite;white-space:nowrap;}

        .h-noise{
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity:.03;mix-blend-mode:overlay;pointer-events:none;
        }

        .h-slab{
          position:absolute;top:0;right:0;width:52%;height:100%;
          background:#161e2e;
          clip-path:polygon(10% 0%,100% 0%,100% 100%,0% 100%);
          display:none;
        }
        @media(min-width:1280px){ .h-slab{ display:block; } }

        .h-btn-red{
          font-family:'Barlow Condensed',sans-serif;font-weight:700;
          text-transform:uppercase;letter-spacing:.09em;
          background:#e8192c;color:#fff;
          clip-path:polygon(0 0,calc(100% - 11px) 0,100% 11px,100% 100%,11px 100%,0 calc(100% - 11px));
          transition:background .18s,transform .18s;
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          padding:13px 28px;font-size:1rem;white-space:nowrap;
        }
        .h-btn-red:hover{background:#b91220;transform:translateX(3px);}

        .h-btn-ghost{
          font-family:'Barlow Condensed',sans-serif;font-weight:700;
          text-transform:uppercase;letter-spacing:.09em;color:#94a3b8;
          border:1.5px solid rgba(255,255,255,.18);
          clip-path:polygon(0 0,calc(100% - 11px) 0,100% 11px,100% 100%,11px 100%,0 calc(100% - 11px));
          transition:border-color .18s,background .18s,color .18s;
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          padding:13px 28px;font-size:1rem;white-space:nowrap;
        }
        .h-btn-ghost:hover{border-color:rgba(255,255,255,.4);background:rgba(255,255,255,.05);color:#fff;}

        .h-stat{
          border:1px solid rgba(255,255,255,.07);
          clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
          transition:transform .2s,border-color .2s;
          padding:1.5rem 1.4rem;
          display:flex;flex-direction:column;gap:.6rem;
        }
        .h-stat:hover{transform:translateY(-4px);border-color:rgba(232,25,44,.5);}

        .h-outline{-webkit-text-stroke:3px #fff;color:transparent;}

        .h-ghost{
          font-family:'Barlow Condensed',sans-serif;font-weight:900;font-style:italic;
          -webkit-text-stroke:1px rgba(232,25,44,.07);color:transparent;
          user-select:none;pointer-events:none;line-height:1;white-space:nowrap;
        }

        .h-tag{
          font-family:'Barlow Condensed',sans-serif;font-weight:700;
          text-transform:uppercase;font-size:.68rem;letter-spacing:.16em;
        }

        .h-headline{
          font-family:'Barlow Condensed',sans-serif;
          font-weight:900;font-style:italic;text-transform:uppercase;
          color:#fff;line-height:.92;
          font-size:clamp(2.8rem, 5.2vw, 6.4rem);
        }
      `}</style>

      <section className="h-root relative overflow-hidden min-h-screen flex flex-col">
        <div className="h-noise absolute inset-0 z-0" />
        <div className="h-slab z-0" />
        <div
          className="absolute top-0 left-0 right-0 h-0.75 z-20"
          style={{ background: "#e8192c" }}
        />

        {/* Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Ghost GRIT */}
        <div
          className="h-ghost absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 hidden xl:block"
          style={{ fontSize: "15vw" }}
          aria-hidden="true"
        >
          GRIT
        </div>

        {/* Stat cards */}
        <div
          className={`hidden xl:grid grid-cols-2 gap-4 absolute bottom-16 right-12 z-10 w-[42%] ${mounted ? "h-ar h-d5" : "opacity-0"}`}
        >
          {stats.map(({ icon: Icon, value, label, bg, iconColor }, i) => (
            <div key={i} className="h-stat" style={{ background: bg }}>
              <Icon className="w-5 h-5 shrink-0" style={{ color: iconColor }} />
              <div
                className="h-display font-black text-white"
                style={{
                  fontSize: "clamp(1.8rem,2.4vw,2.4rem)",
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
              <div
                className="h-tag"
                style={{ color: "rgba(255,255,255,.45)", fontSize: ".62rem" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-12 xl:py-0">
            {/* Left column */}
            <div className="max-w-2xl space-y-5 xl:space-y-6">
              <div
                className={`flex items-center gap-3 ${mounted ? "h-au h-d1" : "opacity-0"}`}
              >
                <div
                  className="w-8 h-0.5 shrink-0"
                  style={{ background: "#e8192c" }}
                />
                <span className="h-tag" style={{ color: "#e8192c" }}>
                  Sports &amp; School Registration Experts
                </span>
              </div>

              <div className={`${mounted ? "h-al h-d2" : "opacity-0"}`}>
                <h1 className="h-headline">
                  <span className="block">Built for</span>
                  <span className="block" style={{ color: "#e8192c" }}>
                    Champions.
                  </span>
                  <span className="block">Designed</span>
                  <span className="block">
                    to <span className="h-outline">Win.</span>
                  </span>
                </h1>
              </div>

              <p
                className={`text-slate-400 leading-relaxed max-w-lg ${mounted ? "h-au h-d3" : "opacity-0"}`}
                style={{ fontSize: "clamp(.9rem,1.3vw,1.05rem)" }}
              >
                We build high-performance websites and registration systems for{" "}
                <span className="text-white font-semibold">
                  sports teams, schools, and camps
                </span>{" "}
                across the USA — so you can focus on the game.
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-3 ${mounted ? "h-au h-d4" : "opacity-0"}`}
              >
                <button className="h-btn-red">
                  Start Your Project <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <button className="h-btn-ghost">View Our Work</button>
              </div>

              <div
                className={`flex items-center gap-3 flex-wrap ${mounted ? "h-au h-d5" : "opacity-0"}`}
              >
                <div className="flex -space-x-2 shrink-0">
                  {["#e8192c", "#1c2638", "#b91220", "#243044"].map((bg, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: bg, borderColor: "#0f1623" }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 text-sm">
                  Trusted by{" "}
                  <span className="text-white font-semibold">
                    50+ organizations
                  </span>{" "}
                  nationwide
                </p>
              </div>

              {/* Stat cards inline — mobile/tablet only */}
              <div
                className={`grid grid-cols-2 gap-4 xl:hidden ${mounted ? "h-au h-d5" : "opacity-0"}`}
              >
                {stats.map(({ icon: Icon, value, label, bg, iconColor }, i) => (
                  <div key={i} className="h-stat" style={{ background: bg }}>
                    <Icon
                      className="w-5 h-5 shrink-0"
                      style={{ color: iconColor }}
                    />
                    <div
                      className="h-display font-black text-white"
                      style={{
                        fontSize: "clamp(1.6rem,5vw,2rem)",
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </div>
                    <div
                      className="h-tag"
                      style={{
                        color: "rgba(255,255,255,.45)",
                        fontSize: ".62rem",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div
          className="relative z-20 py-3 overflow-hidden border-t shrink-0"
          style={{ background: "#e8192c", borderColor: "rgba(255,255,255,.1)" }}
        >
          <div className="h-ticker inline-flex gap-12">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="inline-flex gap-12">
                {ticker.map((item, j) => (
                  <span
                    key={j}
                    className="h-display inline-flex items-center gap-3 text-white font-bold uppercase text-sm tracking-widest"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 inline-block shrink-0" />
                    {item}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
