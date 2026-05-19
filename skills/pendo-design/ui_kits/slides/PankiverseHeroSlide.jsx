// PankiverseHeroSlide.jsx — Product reveal with floating UI + Pankiverse frame
// (Inspired by "Introducing Leo" keynote layout)
const PankiverseHeroSlide = () => (
  <SlideFrame bg="#000" label="07 Pankiverse product hero · dark" color="#fff">
    <ChevronBottomLeft />
    <div style={{ position: "absolute", left: 120, top: 160, right: 120, display: "flex", flexDirection: "column", gap: 28 }}>
      <Eyebrow>Introducing</Eyebrow>
      <h1 style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 128, letterSpacing: "-0.03em", color: "#fff", margin: 0, lineHeight: 0.98 }}>
        Leo, the Pendo agent.
      </h1>
      <div style={{ fontFamily: "Inter", fontSize: 30, color: "#C7C8C2", maxWidth: 1100, lineHeight: 1.35 }}>
        Always on and available, no matter where you go in Pendo.
      </div>
    </div>

    {/* Pankiverse frame with floating UI that breaks out the top */}
    <div style={{ position: "absolute", left: 120, right: 120, bottom: 120, height: 500, borderRadius: 20, overflow: "hidden", background: `url('../../assets/pankiverse/pankiverse-05.png') center/cover no-repeat` }}>
    </div>
    <div style={{ position: "absolute", left: 220, right: 220, bottom: 160, height: 560, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
      <img
        src="../../assets/pankiverse/ui-listen.png"
        alt=""
        style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", filter: "drop-shadow(0 24px 60px rgba(0,0,0,0.35))" }}
      />
    </div>

  </SlideFrame>
);
window.PankiverseHeroSlide = PankiverseHeroSlide;
