// FeatureSlide.jsx — 3-up feature grid on dark, section-title style (keynote "What's next for Agent Analytics")
const FEATURES = [
  { t: "AI-recommended solutions", b: "Get AI recommendations and implement fixes directly in Pendo." },
  { t: "Impact analysis and tracking", b: "Compare changes to models, tools, or prompts and track performance trends." },
  { t: "Advanced agent issue detection", b: "Automatically surface incorrect answers, ignored instructions, and failed tasks." }
];
const FeatureSlide = () => (
  <SlideFrame bg="#181818" label="06 Feature 3-up · dark" color="#fff">
    <ChevronBottomLeft />
    <div style={{ position: "absolute", left: 120, top: 160, right: 120, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <Eyebrow>Roadmap</Eyebrow>
        <h1 style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 84, letterSpacing: "-0.028em", color: "#fff", margin: "22px 0 0", maxWidth: 1200, lineHeight: 1.0 }}>
          What's next for <span style={{ color: "#FF4876" }}>Agent Analytics.</span>
        </h1>
      </div>
      <Pill>FY27 Q2</Pill>
    </div>
    <div style={{ position: "absolute", left: 120, right: 120, top: 520, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
      {FEATURES.map((f, i) => (
        <div key={f.t} style={{ display: "flex", flexDirection: "column", gap: 24, borderTop: "3px solid #FF4876", paddingTop: 36 }}>
          <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 16, letterSpacing: "0.22em", color: "#FF4876", textTransform: "uppercase" }}>0{i + 1}</div>
          <div style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 40, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.015em", minHeight: 96 }}>{f.t}</div>
          <div style={{ fontFamily: "Inter", fontSize: 22, color: "#A1A29E", lineHeight: 1.5 }}>{f.b}</div>
        </div>
      ))}
    </div>
  </SlideFrame>
);
window.FeatureSlide = FeatureSlide;
