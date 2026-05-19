// StatPanel.jsx — single dark band breaking the light rhythm (Metronome does this too)
const STATS = [
  { n: "73%", l: "Faster time to insight after adopting Pendo" },
  { n: "2.4×", l: "Lift in feature adoption across tracked launches" },
  { n: "$4.2B", l: "In product investment guided by Pendo analytics" }
];

const StatPanel = () => (
  <section style={spStyles.wrap}>
    <div style={spStyles.inner}>
      <div style={spStyles.eyebrow}>
        <span style={spStyles.dot}/> BY THE NUMBERS
      </div>
      <h2 style={spStyles.heading}>Product teams accelerate their roadmap with Pendo.</h2>
      <div style={spStyles.grid}>
        {STATS.map(s => (
          <div key={s.n} style={spStyles.item}>
            <div style={spStyles.n}>{s.n}</div>
            <div style={spStyles.divider}/>
            <div style={spStyles.l}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const spStyles = {
  wrap: { background: "#181818", padding: "96px 40px" },
  inner: { maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48, alignItems: "center", color: "#fff" },
  eyebrow: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Inter", fontWeight: 600, fontSize: 11, letterSpacing: "0.14em", color: "#C7C8C2", textTransform: "uppercase" },
  dot: { width: 6, height: 6, background: "#FF4876", borderRadius: 999 },
  heading: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 38, letterSpacing: "-0.02em", textAlign: "center", maxWidth: 720, lineHeight: 1.15, margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, width: "100%", borderTop: "1px solid rgba(255,255,255,0.1)" },
  item: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14, padding: "40px 32px", borderRight: "1px solid rgba(255,255,255,0.1)" },
  n: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 72, lineHeight: 1, letterSpacing: "-0.03em", color: "#fff" },
  divider: { width: 40, height: 3, background: "#FF4876", borderRadius: 2 },
  l: { fontFamily: "Inter", fontWeight: 400, fontSize: 15, color: "#C7C8C2", lineHeight: 1.45 }
};

window.StatPanel = StatPanel;
