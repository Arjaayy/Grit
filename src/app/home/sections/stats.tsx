import { cn } from "@/lib/utils";
import { Trophy, Users, Target, TrendingUp } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  description?: string;
}

interface SportsStatsProps {
  stats?: StatItem[];
  className?: string;
}

const defaultStats: StatItem[] = [
  {
    icon: <Trophy className="w-6 h-6" />,
    value: "50+",
    label: "Sports Organizations",
    description: "Trusted by leading sports organizations across the USA",
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: "100K+",
    label: "Event Registrations",
    description: "Processed seamlessly through our platform",
  },
  {
    icon: <Target className="w-6 h-6" />,
    value: "98%",
    label: "Client Satisfaction",
    description: "Exceeding expectations consistently",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: "300%",
    label: "Average ROI",
    description: "Return on investment for our clients",
  },
];

const Stats = ({ stats = defaultStats, className }: SportsStatsProps) => {
  return (
    <section className={cn("relative bg-white overflow-hidden", className)}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,800;1,900&family=Barlow:wght@400;500;600&display=swap');

        .ss-display { font-family:'Barlow Condensed',sans-serif; }
        .ss-body    { font-family:'Barlow',sans-serif; }

        /* Animated count-up underline on hover */
        .ss-card {
          position: relative;
          transition: transform .22s ease, box-shadow .22s ease;
          cursor: default;
        }
        .ss-card::before {
          content:'';
          position:absolute;
          bottom:0;left:0;right:0;
          height:3px;
          background:#e8192c;
          transform:scaleX(0);
          transform-origin:left;
          transition:transform .3s cubic-bezier(.22,1,.36,1);
        }
        .ss-card:hover::before { transform:scaleX(1); }
        .ss-card:hover {
          transform:translateY(-6px);
          box-shadow:0 20px 48px rgba(0,0,0,.09);
        }

        .ss-icon-wrap {
          transition: background .22s ease, color .22s ease;
        }
        .ss-card:hover .ss-icon-wrap {
          background: #e8192c !important;
          color: #fff !important;
        }

        /* Big ghost number behind each card */
        .ss-ghost {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:900;font-style:italic;
          color:transparent;
          -webkit-text-stroke:1px rgba(232,25,44,.07);
          line-height:1;
          user-select:none;pointer-events:none;
          position:absolute;
          bottom:-10px;right:-8px;
          font-size:7rem;
          white-space:nowrap;
        }

        .ss-value {
          font-family:'Barlow Condensed',sans-serif;
          font-style:italic;
          text-transform:uppercase;
          color:#0f1623;
          line-height:1;
        }

        .ss-label {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:.08em;
          font-size: 1.4rem;
          color:#e8192c;
        }

        /* Diagonal red accent top bar */
        .ss-topbar {
          position:absolute;top:0;left:0;right:0;height:4px;
          background: linear-gradient(to right, #e8192c 0%, #e8192c 30%, rgba(232,25,44,.15) 100%);
        }

        /* Vertical number on the left */
        .ss-vert {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:900;font-style:italic;
          writing-mode:vertical-rl;
          text-orientation:mixed;
          transform:rotate(180deg);
          color:transparent;
          -webkit-text-stroke:1px rgba(232,25,44,.1);
          user-select:none;pointer-events:none;
          font-size:10rem;
          line-height:1;
          white-space:nowrap;
        }
      `}</style>

      {/* Top accent bar */}
      <div className="ss-topbar" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20">
        {/* Section header — asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-0.5 shrink-0"
                style={{ background: "#e8192c" }}
              />
              <span
                className="ss-display font-bold uppercase text-xs tracking-[.16em]"
                style={{ color: "#e8192c" }}
              >
                Proven Track Record
              </span>
            </div>
            <h2
              className="ss-display font-black italic uppercase text-[#0f1623] leading-[.9]"
              style={{ fontSize: "clamp(2.2rem,4.5vw,4rem)" }}
            >
              Champion Results for
              <br />
              <span style={{ color: "#e8192c" }}>Sports Organizations</span>
            </h2>
          </div>
          <p className="ss-body text-slate-500 max-w-xs leading-relaxed text-sm lg:text-right lg:pb-1">
            We deliver measurable results that help sports organizations thrive
            in the digital landscape.
          </p>
        </div>

        {/* Stats grid — staggered layout */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-slate-100"
          style={{ boxShadow: "0 4px 32px rgba(0,0,0,.06)" }}
        >
          {defaultStats.map((stat, i) => (
            <div
              key={i}
              className="ss-card relative overflow-hidden bg-white p-8 border-r border-b border-slate-100 last:border-r-0"
              style={{
                borderRight: i === 3 ? "none" : undefined,
                borderBottom: i >= 2 ? "none" : undefined,
              }}
            >
              {/* Ghost value behind content */}
              <div className="ss-ghost" aria-hidden="true">
                {stat.value}
              </div>

              {/* Icon */}
              <div
                className="ss-icon-wrap w-11 h-11 flex items-center justify-center mb-5 shrink-0"
                style={{
                  background: "rgba(232,25,44,.07)",
                  color: "#e8192c",
                  clipPath:
                    "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
                }}
              >
                {stat.icon}
              </div>

              {/* Value */}
              <div
                className="ss-value mb-1"
                style={{ fontSize: "clamp(2.4rem,4vw,3.2rem)" }}
              >
                {stat.value}
              </div>

              {/* Label */}
              <div className="ss-label mb-3">{stat.label}</div>

              {/* Divider */}
              <div
                className="w-8 h-0.5 mb-3"
                style={{ background: "rgba(232,25,44,.25)" }}
              />

              {/* Description */}
              {stat.description && (
                <p className="ss-body text-slate-500 text-sm leading-relaxed">
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="ss-body text-slate-400 text-sm text-center sm:text-left">
            Trusted by coaches, athletic directors, and school admins{" "}
            <span className="text-slate-700 font-semibold">nationwide</span>
          </p>
          <div className="flex items-center gap-2">
            {["#e8192c", "#1c2638", "#b91220", "#243044", "#0f1623"].map(
              (bg, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    background: bg,
                    boxShadow: "0 0 0 1px rgba(0,0,0,.08)",
                    marginLeft: i > 0 ? -8 : 0,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ),
            )}
            <span className="ss-display font-bold uppercase text-slate-400 text-xs tracking-wider ml-3">
              50+ Organizations
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
