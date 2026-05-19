// FeatureGrid.jsx — alternating text/visual feature rows, Metronome-style
const FEATURES = [
  {
    eyebrow: "LISTEN",
    title: "Product analytics without the instrumentation debt.",
    body: "Auto-captured events, retention, funnels, paths — set up in minutes and shareable with every team.",
    bullets: ["Auto-tracked behavior", "Cohorts & retention", "Paths & funnels"],
    visual: "analytics"
  },
  {
    eyebrow: "UNDERSTAND",
    title: "Replay the moments that matter.",
    body: "Watch sessions tied to specific funnel drop-offs. Close the loop with in-app surveys and sentiment.",
    bullets: ["Session replay", "In-app NPS & surveys", "Sentiment tagging"],
    visual: "replay"
  },
  {
    eyebrow: "ACT",
    title: "Ship guides without waiting on engineering.",
    body: "Launch in-app guides, tours, and announcements from the browser — targeted to any segment.",
    bullets: ["In-app guides", "Segment targeting", "A/B tested rollouts"],
    visual: "guides"
  }
];

const FeatureGrid = () => (
  <section style={fgStyles.wrap}>
    <div style={fgStyles.header}>
      <div style={fgStyles.eyebrow}>
        <span style={fgStyles.dot}/> THE PLATFORM
      </div>
      <h2 style={fgStyles.title}>Beyond dashboards. One place to see, understand, and act.</h2>
      <p style={fgStyles.sub}>Stop stitching signals across four tools. Pendo gives product teams the full picture — and the controls to act on it.</p>
    </div>

    <div style={fgStyles.stack}>
      {FEATURES.map((f, i) => (
        <div key={f.title} style={{ ...fgStyles.row, gridTemplateAreas: i % 2 === 0 ? '"text visual"' : '"visual text"' }}>
          <div style={{ ...fgStyles.text, gridArea: "text" }}>
            <div style={fgStyles.rowEyebrow}>{f.eyebrow}</div>
            <h3 style={fgStyles.rowTitle}>{f.title}</h3>
            <p style={fgStyles.rowBody}>{f.body}</p>
            <ul style={fgStyles.bullets}>
              {f.bullets.map(b => (
                <li key={b} style={fgStyles.li}>
                  <span style={fgStyles.liDot}/> {b}
                </li>
              ))}
            </ul>
            <a href="#" style={fgStyles.link}>Learn more →</a>
          </div>
          <div style={{ ...fgStyles.visual, gridArea: "visual" }}>
            <FeatureVisual kind={f.visual}/>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const FeatureVisual = ({ kind }) => {
  if (kind === "analytics") {
    return (
      <div style={fvStyles.card}>
        <div style={fvStyles.vHeader}>
          <div style={fvStyles.vTitle}>Weekly active users</div>
          <div style={fvStyles.pill}>Last 90 days</div>
        </div>
        <svg viewBox="0 0 400 140" style={{ width: "100%", height: 140 }}>
          <defs>
            <linearGradient id="fgA" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#FF4876" stopOpacity="0.25"/>
              <stop offset="1" stopColor="#FF4876" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0 110 L40 95 L80 100 L120 80 L160 88 L200 65 L240 70 L280 50 L320 55 L360 30 L400 38 L400 140 L0 140 Z" fill="url(#fgA)"/>
          <path d="M0 110 L40 95 L80 100 L120 80 L160 88 L200 65 L240 70 L280 50 L320 55 L360 30 L400 38" fill="none" stroke="#FF4876" strokeWidth="2.5"/>
        </svg>
        <div style={fvStyles.legend}>
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
        </div>
      </div>
    );
  }
  if (kind === "replay") {
    return (
      <div style={fvStyles.card}>
        <div style={fvStyles.vHeader}>
          <div style={fvStyles.vTitle}>Session · 2m 14s</div>
          <div style={fvStyles.pill}>Drop-off · Onboarding</div>
        </div>
        <div style={{ background: "#181818", borderRadius: 10, aspectRatio: "16/9", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #303030, #181818)" }}/>
          <div style={{ position: "absolute", left: 24, top: 24, right: 24, bottom: 24, border: "1.5px dashed rgba(255,255,255,0.18)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 54, height: 54, borderRadius: 999, background: "#FF4876", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 10, height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 999 }}>
            <div style={{ width: "38%", height: "100%", background: "#FF4876", borderRadius: 999 }}/>
          </div>
        </div>
        <div style={fvStyles.legend}><span>Paused at password-reset screen</span><span>01:24 / 02:14</span></div>
      </div>
    );
  }
  // guides
  return (
    <div style={fvStyles.card}>
      <div style={fvStyles.vHeader}>
        <div style={fvStyles.vTitle}>Live guide · First report</div>
        <div style={fvStyles.pill}>Published</div>
      </div>
      <div style={fvStyles.guidePreview}>
        <div style={fvStyles.guideCallout}>
          <div style={fvStyles.guideEyebrow}>TIP · 1 OF 3</div>
          <div style={fvStyles.guideH}>Build your first report</div>
          <div style={fvStyles.guideP}>Drag a metric here to see it trended over any time window.</div>
          <div style={fvStyles.guideRow}>
            <span style={fvStyles.skip}>Skip tour</span>
            <button style={fvStyles.nextBtn}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const fgStyles = {
  wrap: { background: "#fff", padding: "96px 40px" },
  header: { maxWidth: 720, margin: "0 auto 64px", textAlign: "center", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" },
  eyebrow: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Inter", fontWeight: 600, fontSize: 11, letterSpacing: "0.14em", color: "#565655", textTransform: "uppercase" },
  dot: { width: 6, height: 6, background: "#FF4876", borderRadius: 999 },
  title: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 44, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#181818", margin: 0 },
  sub: { fontFamily: "Inter", fontSize: 17, lineHeight: 1.5, color: "#565655", margin: 0, maxWidth: 560 },

  stack: { maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", background: "#F7F7F3", borderRadius: 20, padding: "56px 56px" },
  text: { display: "flex", flexDirection: "column", gap: 14, maxWidth: 440 },
  rowEyebrow: { fontFamily: "Inter", fontWeight: 700, fontSize: 11, letterSpacing: "0.2em", color: "#FF4876", textTransform: "uppercase" },
  rowTitle: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 30, lineHeight: 1.15, letterSpacing: "-0.015em", color: "#181818", margin: 0 },
  rowBody: { fontFamily: "Inter", fontSize: 15.5, lineHeight: 1.55, color: "#565655", margin: 0 },
  bullets: { listStyle: "none", padding: 0, margin: "6px 0 10px", display: "flex", flexDirection: "column", gap: 8 },
  li: { display: "flex", alignItems: "center", gap: 10, fontFamily: "Inter", fontSize: 14, color: "#181818" },
  liDot: { width: 5, height: 5, borderRadius: 999, background: "#FF4876" },
  link: { color: "#181818", textDecoration: "none", fontFamily: "Inter", fontWeight: 600, fontSize: 14, borderBottom: "1.5px solid #181818", alignSelf: "flex-start", paddingBottom: 2 },
  visual: { display: "flex", justifyContent: "center" }
};

const fvStyles = {
  card: { width: "100%", maxWidth: 460, background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 12px 36px -12px rgba(24,24,24,0.15), 0 2px 6px rgba(24,24,24,0.04)", border: "1px solid rgba(24,24,24,0.06)", display: "flex", flexDirection: "column", gap: 14 },
  vHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  vTitle: { fontFamily: "Inter", fontWeight: 600, fontSize: 14, color: "#181818" },
  pill: { fontFamily: "Inter", fontSize: 11, color: "#7C7C79", fontWeight: 500, padding: "4px 10px", borderRadius: 999, background: "#F7F7F3", border: "1px solid #EDEEE7" },
  legend: { display: "flex", justifyContent: "space-between", fontFamily: "JetBrains Mono, monospace", fontSize: 10.5, color: "#7C7C79" },

  guidePreview: { background: "#F7F7F3", borderRadius: 10, padding: 28, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220 },
  guideCallout: { background: "#fff", borderRadius: 10, padding: 18, width: 240, boxShadow: "0 10px 28px -8px rgba(24,24,24,0.18)", borderLeft: "3px solid #FF4876", display: "flex", flexDirection: "column", gap: 8 },
  guideEyebrow: { fontFamily: "Inter", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", color: "#FF4876" },
  guideH: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 17, color: "#181818", margin: 0 },
  guideP: { fontFamily: "Inter", fontSize: 12.5, color: "#565655", margin: 0, lineHeight: 1.45 },
  guideRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  skip: { fontFamily: "Inter", fontSize: 11.5, color: "#7C7C79" },
  nextBtn: { background: "#181818", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, fontFamily: "Inter", fontWeight: 600, fontSize: 11.5, cursor: "pointer" }
};

window.FeatureGrid = FeatureGrid;
