// DataSection.jsx — dark section with a Pank-gradient stat banner and "Data you can build on"
const STATS = [
  { n: "35T", l: "events" },
  { n: "1B+", l: "users" },
  { n: "50K+", l: "apps & agents" }
];

const COLS = [
  {
    title: "Instant answers",
    body: "\u201CWhy did signups drop last week?\u201D Get answers in seconds, without building reports."
  },
  {
    title: "Automatic insights",
    body: "AI finds patterns and flags opportunities. Act on proven signals."
  },
  {
    title: "Product context anywhere",
    body: "Access Pendo data in your favorite LLMs like Claude or ChatGPT."
  }
];

const DataSection = () => (
  <section style={dsStyles.wrap}>
    <div style={dsStyles.inner}>
      <div style={dsStyles.lede}>
        <h2 style={dsStyles.title}>Leverage the largest product data set in the world.</h2>
        <p style={dsStyles.body}>
          Pendo has collected <strong style={{ color: "#fff", fontWeight: 700 }}>35 trillion</strong> all-time events from clicks to conversations, video playbacks to poll responses, providing unmatched insights for training conversational AI and agentic software systems.
        </p>
      </div>

      {/* Pank-gradient stat banner */}
      <div style={dsStyles.banner}>
        {/* halftone dot texture */}
        <svg style={dsStyles.halftone} viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="ds-dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1.4" fill="rgba(255,255,255,0.28)"/>
            </pattern>
            <radialGradient id="ds-mask" cx="0.5" cy="0.5" r="0.4">
              <stop offset="0" stopColor="white" stopOpacity="1"/>
              <stop offset="1" stopColor="white" stopOpacity="0"/>
            </radialGradient>
            <mask id="ds-dots-mask">
              <rect width="600" height="200" fill="url(#ds-mask)"/>
            </mask>
          </defs>
          <rect width="600" height="200" fill="url(#ds-dots)" mask="url(#ds-dots-mask)"/>
        </svg>
        <div style={dsStyles.statRow}>
          {STATS.map(s => (
            <div key={s.n} style={dsStyles.stat}>
              <div style={dsStyles.n}>{s.n}</div>
              <div style={dsStyles.l}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Data you can build on */}
      <div style={dsStyles.bottomGrid}>
        <h3 style={dsStyles.bottomTitle}>Data you can<br/>build on.</h3>
        {COLS.map(c => (
          <div key={c.title} style={dsStyles.col}>
            <div style={dsStyles.colRule}/>
            <div style={dsStyles.colTitle}>{c.title}</div>
            <div style={dsStyles.colBody}>{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const dsStyles = {
  wrap: { background: "#181818", padding: "96px 40px", color: "#fff" },
  inner: { maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 },

  lede: { display: "flex", flexDirection: "column", gap: 14, maxWidth: 760 },
  title: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 },
  body: { fontFamily: "Inter", fontSize: 15.5, lineHeight: 1.55, color: "#C7C8C2", margin: 0 },

  banner: {
    position: "relative",
    borderRadius: 28,
    padding: "70px 48px",
    overflow: "hidden",
    background: "radial-gradient(ellipse at 30% 50%, #FF9ED7 0%, #FD6AA5 35%, #D80574 80%)",
    isolation: "isolate"
  },
  halftone: { position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.9, zIndex: 0 },
  statRow: { position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, textAlign: "center" },
  stat: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  n: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 96, lineHeight: 1, letterSpacing: "-0.035em", color: "#fff" },
  l: { fontFamily: "Inter", fontWeight: 400, fontSize: 20, color: "#fff", opacity: 0.95, marginTop: 4 },

  bottomGrid: { display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1fr", gap: 32, marginTop: 20, alignItems: "flex-start" },
  bottomTitle: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: "-0.02em", lineHeight: 1.05, color: "#fff", margin: 0 },
  col: { display: "flex", flexDirection: "column", gap: 10 },
  colRule: { width: "100%", height: 1, background: "#C7C8C2", opacity: 0.6, marginBottom: 4 },
  colTitle: { fontFamily: "Inter", fontWeight: 700, fontSize: 16, color: "#fff" },
  colBody: { fontFamily: "Inter", fontSize: 14, color: "#C7C8C2", lineHeight: 1.5 }
};

window.DataSection = DataSection;
