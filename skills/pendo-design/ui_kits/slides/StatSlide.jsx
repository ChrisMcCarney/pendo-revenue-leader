// StatSlide.jsx — stat-3up on dark with Pank-tinted divider rules
const STATS = [
  { n: "73%", l: "Faster time to insight" },
  { n: "2.4×", l: "Lift in feature adoption" },
  { n: "$4.2B", l: "Product investment guided" }
];
const StatSlide = () => (
  <SlideFrame bg="#000" label="08 Stats · 3-up dark" color="#fff">
    <ChevronBottomLeft />
    <div style={{ position: "absolute", top: 160, left: 120, right: 120 }}>
      <Eyebrow>FY27 Impact</Eyebrow>
      <h1 style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 80, letterSpacing: "-0.025em", color: "#fff", margin: "22px 0 0", lineHeight: 1.02 }}>
        The impact, in numbers.
      </h1>
    </div>
    <div style={{ position: "absolute", top: 430, left: 120, right: 120, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
      {STATS.map((s, i) => (
        <div key={s.n} style={{ display: "flex", flexDirection: "column", gap: 28, padding: "40px 48px", borderLeft: i === 0 ? "none" : "1px solid #303030" }}>
          <Bolt />
          <div style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 800, fontSize: 180, lineHeight: 0.9, letterSpacing: "-0.035em", color: "#fff" }}>{s.n}</div>
          <div style={{ fontFamily: "Inter", fontWeight: 400, fontSize: 26, color: "#C7C8C2", lineHeight: 1.35, maxWidth: 360 }}>{s.l}</div>
        </div>
      ))}
    </div>
  </SlideFrame>
);
window.StatSlide = StatSlide;
