// StatCalloutSlide.jsx — Single-stat emphasis on cream bg (like "Only one in five…")
// Big mixed-weight headline, pink fraction as accent. Chevron bottom-left.
const StatCalloutSlide = () => (
  <SlideFrame bg="#EDEEE7" label="04 Stat callout · light" color="#181818">
    <ChevronBottomLeft />
    <div style={{ position: "absolute", left: 120, top: 240, right: 120, display: "flex", flexDirection: "column", gap: 48 }}>
      <Eyebrow>Industry signal</Eyebrow>
      <h1 style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 500, fontSize: 132, lineHeight: 1.02, letterSpacing: "-0.025em", color: "#181818", margin: 0, maxWidth: 1500, textWrap: "balance" }}>
        Only <span style={{ color: "#FF4876", fontWeight: 800 }}>one in five</span> companies has a mature model for governance of autonomous AI agents.
      </h1>
      <div style={{ fontFamily: "Inter", fontSize: 22, color: "#565655", fontStyle: "italic", letterSpacing: "0.02em" }}>
        Source: Pendo AI Readiness Report, FY27
      </div>
    </div>
  </SlideFrame>
);
window.StatCalloutSlide = StatCalloutSlide;
