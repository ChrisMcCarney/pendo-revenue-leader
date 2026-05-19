// StatementLightSlide.jsx — Giant light-bg statement (like "Coding agents are 10Xing…")
// Chevron in bottom-left. Light cream background. Graphite heading. Pink rule accent.
const StatementLightSlide = () => (
  <SlideFrame bg="#EDEEE7" label="02 Statement · light" color="#181818">
    <ChevronBottomLeft />
    <div style={{ position: "absolute", left: 120, top: 180, right: 120, display: "flex", flexDirection: "column", gap: 40 }}>
      <Eyebrow>The shift</Eyebrow>
      <h1 style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 160, lineHeight: 1.0, letterSpacing: "-0.035em", color: "#181818", margin: 0, maxWidth: 1500, textWrap: "balance" }}>
        Coding agents are <span style={{ color: "#FF4876" }}>10×ing</span> the best engineers.
      </h1>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 24 }}>
        <PinkRule w={96} />
        <div style={{ fontFamily: "Inter", fontSize: 26, color: "#565655", letterSpacing: "0.02em" }}>And the builders who feel it first are pulling ahead.</div>
      </div>
    </div>
  </SlideFrame>
);
window.StatementLightSlide = StatementLightSlide;
