"use client";

import { ArrowRight, Globe, ClipboardList } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const services = [
  {
    number: "01",
    icon: Globe,
    category: "Web Services",
    title: "Website Development",
    description:
      "Custom, high-performance websites built specifically for sports organizations to engage fans and drive growth.",
    stats: [
      { label: "Projects Completed", value: "50+" },
      { label: "Client Satisfaction", value: "98%" },
    ],
    href: "/services/web-development",
  },
  {
    number: "02",
    icon: ClipboardList,
    category: "Event Management",
    title: "Event Registration",
    description:
      "Seamless online registration systems with payment processing that handle everything from sign-ups to check-ins.",
    stats: [
      { label: "Registrations Processed", value: "100K+" },
      { label: "Revenue Generated", value: "$2M+" },
    ],
    href: "/services/event-registration",
  },
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = services[activeIndex];

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#f8f9fb" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700;1,800;1,900&family=Barlow:wght@400;500;600&display=swap');

        .sv-display { font-family:'Barlow Condensed',sans-serif; }
        .sv-body    { font-family:'Barlow',sans-serif; }

        .sv-tag {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:700;text-transform:uppercase;
          font-size:.68rem;letter-spacing:.16em;
        }

        @keyframes sv-fade { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }
        .sv-panel { animation:sv-fade .35s cubic-bezier(.22,1,.36,1) both; }

        /* Sidebar item */
        .sv-item {
          border-left:3px solid transparent;
          transition:border-color .18s, background .18s;
          cursor:pointer;
          padding:28px 28px;
        }
        .sv-item:hover {
          background:rgba(232,25,44,.03);
          border-left-color:rgba(232,25,44,.3);
        }
        .sv-item.active {
          background:#fff;
          border-left-color:#e8192c;
        }
        .sv-item-num {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:900;font-style:italic;
          font-size:.72rem;
          color:rgba(0,0,0,.2);
          transition:color .18s;
          margin-bottom:6px;
        }
        .sv-item.active .sv-item-num { color:#e8192c; }

        .sv-item-title {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:800;text-transform:uppercase;
          letter-spacing:.05em;
          font-size:1.15rem;
          color:#94a3b8;
          line-height:1.1;
          transition:color .18s;
        }
        .sv-item:hover .sv-item-title { color:#475569; }
        .sv-item.active .sv-item-title { color:#0f1623; }

        .sv-item-cat {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:600;text-transform:uppercase;
          font-size:.6rem;letter-spacing:.14em;
          color:transparent;
          transition:color .18s;
          margin-top:4px;
        }
        .sv-item.active .sv-item-cat { color:#e8192c; opacity:.65; }

        /* Stat pill */
        .sv-stat {
          font-family:'Barlow Condensed',sans-serif;
          border:1.5px solid #e2e8f0;
          clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));
          padding:.8rem 1.1rem;
          background:#fff;
          transition:border-color .2s,transform .2s,box-shadow .2s;
        }
        .sv-stat:hover {
          border-color:rgba(232,25,44,.35);
          transform:translateY(-2px);
          box-shadow:0 6px 20px rgba(0,0,0,.06);
        }

        .sv-btn {
          font-family:'Barlow Condensed',sans-serif;font-weight:700;
          text-transform:uppercase;letter-spacing:.09em;font-size:1rem;
          background:#e8192c;color:#fff;
          clip-path:polygon(0 0,calc(100% - 11px) 0,100% 11px,100% 100%,11px 100%,0 calc(100% - 11px));
          transition:background .18s,transform .18s;
          display:inline-flex;align-items:center;gap:8px;
          padding:13px 28px;white-space:nowrap;
        }
        .sv-btn:hover { background:#b91220; transform:translateX(3px); }

        .sv-ghost {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:900;font-style:italic;
          -webkit-text-stroke:1.5px rgba(232,25,44,.05);
          color:transparent;
          user-select:none;pointer-events:none;
          line-height:1;
        }

        .sv-link {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:700;text-transform:uppercase;letter-spacing:.09em;
          font-size:.9rem;color:#e8192c;
          display:inline-flex;align-items:center;gap:6px;
          transition:gap .18s,color .18s;
        }
        .sv-link:hover { gap:10px; color:#b91220; }

        .sv-icon {
          clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));
          transition:background .2s,color .2s;
        }

        .sv-mobile-card {
          background:#fff;
          border:1.5px solid #e2e8f0;
          overflow:hidden;
          transition:border-color .18s,box-shadow .18s;
        }
        .sv-mobile-card.active {
          border-color:rgba(232,25,44,.3);
          box-shadow:0 8px 32px rgba(0,0,0,.07);
        }

        .sv-progress-dot {
          width:6px;height:6px;border-radius:50%;
          background:#e2e8f0;
          transition:background .18s,transform .18s;
          cursor:pointer;
        }
        .sv-progress-dot.active {
          background:#e8192c;
          transform:scale(1.3);
        }
      `}</style>

      {/* Dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top red bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.75"
        style={{ background: "#e8192c" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28">
        {/* Section header — all Barlow Condensed, consistent */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-0.5 shrink-0"
                style={{ background: "#e8192c" }}
              />
              <span className="sv-tag" style={{ color: "#e8192c" }}>
                What We Do
              </span>
            </div>
            <h2
              className="sv-display font-black uppercase text-[#0f1623] leading-[.92]"
              style={{
                fontSize: "clamp(2.4rem,5vw,5rem)",
                letterSpacing: ".01em",
              }}
            >
              Services That
              <br />
              <span
                style={{
                  WebkitTextStroke: "2.5px #0f1623",
                  color: "transparent",
                }}
              >
                Win.
              </span>
            </h2>
          </div>
          <p className="sv-body text-slate-500 max-w-sm leading-relaxed text-sm lg:text-right lg:pb-1">
            Comprehensive digital solutions for sports organizations — from
            websites to registration systems.
          </p>
        </div>

        {/* ── DESKTOP ── */}
        <div
          className="hidden lg:grid grid-cols-[300px_1fr] border border-slate-200 overflow-hidden"
          style={{ boxShadow: "0 4px 40px rgba(0,0,0,.07)" }}
        >
          {/* Sidebar */}
          <div
            className="border-r border-slate-200 flex flex-col"
            style={{ background: "#f1f5f9" }}
          >
            {services.map((s, i) => (
              <div
                key={i}
                className={`sv-item border-b border-slate-200 last:border-b-0 flex-1 flex flex-col justify-center ${activeIndex === i ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
              >
                <div className="sv-item-num">{s.number}</div>
                <div className="sv-item-title">{s.title}</div>
                <div className="sv-item-cat">{s.category}</div>
              </div>
            ))}
          </div>

          {/* Content panel */}
          <div
            key={activeIndex}
            className="sv-panel bg-white p-10 lg:p-12 flex flex-col justify-between gap-8 relative overflow-hidden"
          >
            <div
              className="sv-ghost absolute right-6 bottom-2 text-[11rem]"
              aria-hidden="true"
            >
              {active.number}
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className="sv-icon w-12 h-12 flex items-center justify-center"
                  style={{
                    background: "rgba(232,25,44,.08)",
                    color: "#e8192c",
                  }}
                >
                  <active.icon className="w-5 h-5" />
                </div>
                <span className="sv-tag" style={{ color: "#94a3b8" }}>
                  {active.category}
                </span>
              </div>

              <h3
                className="sv-display font-black uppercase text-[#0f1623] leading-none"
                style={{
                  fontSize: "clamp(2rem,3.5vw,3.2rem)",
                  letterSpacing: ".01em",
                }}
              >
                {active.title}
              </h3>

              <p
                className="sv-body text-slate-500 leading-relaxed max-w-lg"
                style={{ fontSize: "1rem" }}
              >
                {active.description}
              </p>

              <div className="flex gap-4 flex-wrap">
                {active.stats.map(({ label, value }, j) => (
                  <div key={j} className="sv-stat">
                    <div
                      className="sv-display font-black text-[#0f1623]"
                      style={{ fontSize: "1.6rem", lineHeight: 1 }}
                    >
                      {value}
                    </div>
                    <div
                      className="sv-tag mt-1"
                      style={{ color: "#94a3b8", fontSize: ".6rem" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-6 pt-5 border-t border-slate-100">
              <Link href={active.href} className="sv-btn">
                Learn More <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link href="/services" className="sv-link">
                All Services <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="flex gap-2 ml-auto">
                {services.map((_, i) => (
                  <button
                    key={i}
                    className={`sv-progress-dot ${activeIndex === i ? "active" : ""}`}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Service ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="lg:hidden space-y-3">
          {services.map((s, i) => (
            <div
              key={i}
              className={`sv-mobile-card ${activeIndex === i ? "active" : ""}`}
            >
              <div
                className="flex items-center justify-between p-5 cursor-pointer"
                onClick={() => setActiveIndex(activeIndex === i ? -1 : i)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="sv-icon w-10 h-10 flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(232,25,44,.08)",
                      color: "#e8192c",
                    }}
                  >
                    <s.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="sv-item-num">{s.number}</div>
                    <div
                      className="sv-display font-bold uppercase text-[#0f1623]"
                      style={{ fontSize: "1rem", letterSpacing: ".05em" }}
                    >
                      {s.title}
                    </div>
                  </div>
                </div>
                <div
                  className={`transition-transform duration-200 ${activeIndex === i ? "rotate-90" : ""}`}
                  style={{ color: "#e8192c" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {activeIndex === i && (
                <div className="sv-panel px-5 pb-6 space-y-4 border-t border-slate-100">
                  <p className="sv-body text-slate-500 leading-relaxed text-sm pt-4">
                    {s.description}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {s.stats.map(({ label, value }, j) => (
                      <div key={j} className="sv-stat">
                        <div
                          className="sv-display font-black text-[#0f1623]"
                          style={{ fontSize: "1.3rem", lineHeight: 1 }}
                        >
                          {value}
                        </div>
                        <div
                          className="sv-tag mt-1"
                          style={{ color: "#94a3b8", fontSize: ".6rem" }}
                        >
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href={s.href} className="sv-btn inline-flex mt-2">
                    Learn More <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
