// SectionDividerSlide.jsx — Pankiverse backdrop, section divider with large cream heading.
// Uses real Pankiverse image (pankiverse-04) not a CSS gradient approximation.
const SectionDividerSlide = () => (
  <SlideFrame
    label="03 Section divider · Pankiverse"
    bg="url('../../assets/pankiverse/pankiverse-04.png') center/cover no-repeat, #000"
  >
    {/* subtle darkening vignette so heading is legible */}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)" }}/>
    <ChevronBottomLeft />
    <div style={{ position: "absolute", left: 120, top: 280, right: 120, display: "flex", flexDirection: "column", gap: 44, zIndex: 2 }}>
      <Eyebrow color="#fff">Section 02</Eyebrow>
      <h1 style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 168, lineHeight: 0.96, letterSpacing: "-0.032em", color: "#fff", margin: 0, maxWidth: 1500 }}>
        How we're helping<br/>you make this shift.
      </h1>
      <PinkRule w={120} h={8} />
    </div>
  </SlideFrame>
);
window.SectionDividerSlide = SectionDividerSlide;
