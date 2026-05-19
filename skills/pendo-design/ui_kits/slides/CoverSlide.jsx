// CoverSlide.jsx — Dark cover with full wordmark top-left (title slide keeps the wordmark)
const CoverSlide = () => (
  <SlideFrame bg="#000" label="01 Cover">
    <LogoTopLeft variant="light" size="large" />
    <div style={{ position: "absolute", left: 96, bottom: 140, display: "flex", flexDirection: "column", gap: 28, maxWidth: 1500 }}>
      <h1 style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 144, lineHeight: 0.98, letterSpacing: "-0.035em", color: "#fff", margin: 0 }}>
        Better software<br/>starts here.
      </h1>
      <PinkRule w={88} />
      <div style={{ fontFamily: "Inter", fontSize: 28, color: "#C7C8C2", letterSpacing: "0.02em" }}>FY27 · Company All-Hands</div>
    </div>
  </SlideFrame>
);
window.CoverSlide = CoverSlide;
