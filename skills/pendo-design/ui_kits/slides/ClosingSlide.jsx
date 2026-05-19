// ClosingSlide.jsx — Closing on dark Pankiverse with full wordmark and thanks
const ClosingSlide = () => (
  <SlideFrame
    label="10 Closing · Pankiverse"
    bg="url('../../assets/pankiverse/pankiverse-01.png') center/cover no-repeat, #000"
    color="#fff"
  >
    {/* darken for legibility */}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.35) 100%)" }}/>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 44, zIndex: 2 }}>
      <Logo variant="light" size="xl" />
      <h1 style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 144, letterSpacing: "-0.035em", color: "#fff", margin: 0, textAlign: "center", lineHeight: 0.98 }}>
        Thank you.
      </h1>
      <PinkRule w={120} h={8} />
      <div style={{ fontFamily: "Inter", fontSize: 28, color: "#EDEEE7", letterSpacing: "0.02em" }}>pendo.io · brand.pendo.io</div>
    </div>
  </SlideFrame>
);
window.ClosingSlide = ClosingSlide;
