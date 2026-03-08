"use client";

import { ArrowRight, Zap, Users, Trophy, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  {
    icon: Trophy,
    value: "50+",
    label: "Sports Orgs",
    bg: "rgba(232,25,44,.85)",
    iconColor: "#fff",
  },
  {
    icon: Users,
    value: "100K+",
    label: "Registrations",
    bg: "rgba(22,30,46,.9)",
    iconColor: "#e8192c",
  },
  {
    icon: TrendingUp,
    value: "300%",
    label: "Avg Growth",
    bg: "rgba(26,10,13,.9)",
    iconColor: "#e8192c",
  },
  {
    icon: Zap,
    value: "$2M+",
    label: "Revenue Generated",
    bg: "rgba(13,21,32,.9)",
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
        .h-d5{animation-delay:.56s;} .h-d6{animation-delay:.8s;}

        .h-ticker{animation:h-ticker 26s linear infinite;white-space:nowrap;}

        .h-noise{
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity:.04;mix-blend-mode:overlay;pointer-events:none;
        }

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
          text-transform:uppercase;letter-spacing:.09em;color:#fff;
          border:1.5px solid rgba(255,255,255,.35);
          clip-path:polygon(0 0,calc(100% - 11px) 0,100% 11px,100% 100%,11px 100%,0 calc(100% - 11px));
          transition:border-color .18s,background .18s,color .18s;
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          padding:13px 28px;font-size:1rem;white-space:nowrap;
        }
        .h-btn-ghost:hover{border-color:rgba(255,255,255,.6);background:rgba(255,255,255,.08);color:#fff;}

        .h-stat{
          border:1px solid rgba(255,255,255,.12);
          clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
          transition:transform .2s,border-color .2s;
          padding:1.4rem 1.3rem;
          display:flex;flex-direction:column;gap:.6rem;
          backdrop-filter:blur(8px);
        }
        .h-stat:hover{transform:translateY(-4px);border-color:rgba(232,25,44,.6);}

        .h-outline{-webkit-text-stroke:3px #fff;color:transparent;}

        .h-tag{
          font-family:'Barlow Condensed',sans-serif;font-weight:700;
          text-transform:uppercase;font-size:.68rem;letter-spacing:.16em;
        }

        .h-headline{
          font-family:'Barlow Condensed',sans-serif;
          font-weight:900;font-style:italic;text-transform:uppercase;
          color:#fff;line-height:.92;
          font-size:clamp(2.8rem,5.2vw,6.4rem);
          text-shadow:0 2px 24px rgba(0,0,0,.5);
        }

        /* Video bg */
        .h-video{
          position:absolute;inset:0;width:100%;height:100%;
          object-fit:cover;object-position:center;
          z-index:0;
        }

        /* Layered overlays for readability */
        .h-overlay-base{
          position:absolute;inset:0;z-index:1;
          background:rgba(10,14,22,.65);
        }
        .h-overlay-grad{
          position:absolute;inset:0;z-index:2;
          background:linear-gradient(
            105deg,
            rgba(10,14,22,.85) 0%,
            rgba(10,14,22,.6) 45%,
            rgba(10,14,22,.3) 100%
          );
        }
        /* Bottom fade so ticker blends in */
        .h-overlay-bottom{
          position:absolute;bottom:0;left:0;right:0;height:160px;z-index:2;
          background:linear-gradient(to bottom,transparent,rgba(10,14,22,.9));
        }

        /* Grid lines */
        .h-grid{
          position:absolute;inset:0;z-index:3;pointer-events:none;opacity:.02;
          background-image:linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px);
          background-size:80px 80px;
        }
      `}</style>

      <section className="h-root relative overflow-hidden min-h-screen flex flex-col">
        {/* ── VIDEO BACKGROUND ── */}
        <video
          className="h-video"
          src="/video/hero_video_bg.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Overlays */}
        <div className="h-overlay-base" />
        <div className="h-overlay-grad" />
        <div className="h-overlay-bottom" />
        <div className="h-grid" />
        <div className="h-noise absolute inset-0 z-4 pointer-events-none" />

        {/* Top red bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.75 z-20"
          style={{ background: "#e8192c" }}
        />

        {/* Stat cards — absolutely positioned bottom-right on xl */}
        <div
          className={`hidden xl:grid grid-cols-2 gap-4 absolute bottom-20 right-12 z-20 w-[40%] ${mounted ? "h-ar h-d6" : "opacity-0"}`}
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
                style={{ color: "rgba(255,255,255,.5)", fontSize: ".62rem" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-12 xl:py-0">
            <div className="max-w-2xl space-y-5 xl:space-y-6">
              {/* Tag */}
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

              {/* Headline */}
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

              {/* Body */}
              <p
                className={`text-slate-300 leading-relaxed max-w-lg ${mounted ? "h-au h-d3" : "opacity-0"}`}
                style={{
                  fontSize: "clamp(.9rem,1.3vw,1.05rem)",
                  textShadow: "0 1px 8px rgba(0,0,0,.5)",
                }}
              >
                We build high-performance websites and registration systems for{" "}
                <span className="text-white font-semibold">
                  sports teams, schools, and camps
                </span>{" "}
                across the USA — so you can focus on the game.
              </p>

              {/* CTAs */}
              <div
                className={`flex flex-col sm:flex-row gap-3 ${mounted ? "h-au h-d4" : "opacity-0"}`}
              >
                <button className="h-btn-red">
                  Start Your Project <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <button className="h-btn-ghost">View Our Work</button>
              </div>

              {/* Social proof */}
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
                <p
                  className="text-slate-400 text-sm"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,.5)" }}
                >
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

        {/* ── TICKER ── */}
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
