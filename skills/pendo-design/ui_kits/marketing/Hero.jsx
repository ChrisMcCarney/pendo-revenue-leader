// Hero.jsx — compact light hero, Metronome-style: text left, product UI right
const Hero = () => (
  <section style={heroStyles.wrap}>
    <div style={heroStyles.inner}>
      <div style={heroStyles.left}>
        <div style={heroStyles.eyebrow}>
          <span style={heroStyles.dot}></span>
          LISTEN · UNDERSTAND · ACT
        </div>
        <h1 style={heroStyles.title}>The product platform that actually listens.</h1>
        <p style={heroStyles.sub}>Pendo captures every signal — behavior, feedback, friction — and turns it into the guides, flags, and decisions that move your product forward.</p>
        <div style={heroStyles.ctas}>
          <a href="#" style={heroStyles.primary}>Get a demo</a>
          <a href="#" style={heroStyles.secondary}>See the platform →</a>
        </div>
      </div>
      <div style={heroStyles.right}>
        <ProductCard />
      </div>
    </div>
  </section>
);

// Small product-UI stand-in (dashboard-ish card)
const ProductCard = () => (
  <div style={pcStyles.frame}>
    <div style={pcStyles.chrome}>
      <span style={{ ...pcStyles.dotC, background: "#F87171" }}/>
      <span style={{ ...pcStyles.dotC, background: "#FBBF24" }}/>
      <span style={{ ...pcStyles.dotC, background: "#34D399" }}/>
      <div style={pcStyles.url}>app.pendo.io · Onboarding funnel</div>
    </div>
    <div style={pcStyles.body}>
      <div style={pcStyles.row}>
        <div>
          <div style={pcStyles.meta}>Activated users</div>
          <div style={pcStyles.bigN}>24,380</div>
          <div style={pcStyles.pos}>▲ 12.4% vs. last week</div>
        </div>
        <div style={pcStyles.donut}>
          <svg viewBox="0 0 36 36" width="80" height="80">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EDEEE7" strokeWidth="3.2"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FF4876" strokeWidth="3.2"
              strokeDasharray="72 28" strokeDashoffset="25" strokeLinecap="round" transform="rotate(-90 18 18)"/>
          </svg>
          <div style={pcStyles.donutN}>72%</div>
        </div>
      </div>
      <div style={pcStyles.funnel}>
        {[{l:"Signed up", v: 100},{l:"Completed tour", v: 82},{l:"First value", v: 58},{l:"Activated", v: 44}].map((s,i) => (
          <div key={i} style={pcStyles.fRow}>
            <span style={pcStyles.fLabel}>{s.l}</span>
            <div style={pcStyles.barTrack}>
              <div style={{ ...pcStyles.barFill, width: s.v + "%" }}/>
            </div>
            <span style={pcStyles.fVal}>{s.v}%</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const heroStyles = {
  wrap: { background: "#F7F7F3", padding: "80px 40px 64px" },
  inner: { maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" },
  left: { display: "flex", flexDirection: "column", gap: 20, maxWidth: 520 },
  eyebrow: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Inter", fontWeight: 600, fontSize: 11, letterSpacing: "0.14em", color: "#565655", textTransform: "uppercase" },
  dot: { width: 6, height: 6, background: "#FF4876", borderRadius: 999 },
  title: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 56, lineHeight: 1.05, letterSpacing: "-0.025em", color: "#181818", margin: 0 },
  sub: { fontFamily: "Inter", fontSize: 17, lineHeight: 1.5, color: "#565655", margin: 0, maxWidth: 460 },
  ctas: { display: "flex", gap: 10, marginTop: 8 },
  primary: { background: "#181818", color: "#fff", padding: "11px 20px", borderRadius: 8, textDecoration: "none", fontFamily: "Inter", fontWeight: 600, fontSize: 14 },
  secondary: { background: "transparent", color: "#181818", padding: "11px 18px", borderRadius: 8, textDecoration: "none", fontFamily: "Inter", fontWeight: 600, fontSize: 14 },
  right: { display: "flex", justifyContent: "flex-end" }
};

const pcStyles = {
  frame: { width: "100%", maxWidth: 520, background: "#fff", borderRadius: 14, boxShadow: "0 20px 60px -20px rgba(24,24,24,0.18), 0 2px 6px rgba(24,24,24,0.04)", overflow: "hidden", border: "1px solid rgba(24,24,24,0.06)" },
  chrome: { display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderBottom: "1px solid #EDEEE7", background: "#FAFAF7" },
  dotC: { width: 9, height: 9, borderRadius: 999, display: "inline-block" },
  url: { marginLeft: 10, fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#7C7C79" },
  body: { padding: "20px 22px", display: "flex", flexDirection: "column", gap: 20 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  meta: { fontFamily: "Inter", fontSize: 11, color: "#7C7C79", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 },
  bigN: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 36, color: "#181818", letterSpacing: "-0.02em", marginTop: 4 },
  pos: { fontFamily: "Inter", fontSize: 12, color: "#0F7A44", fontWeight: 600, marginTop: 4 },
  donut: { position: "relative", width: 80, height: 80 },
  donutN: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 18, color: "#181818" },
  funnel: { display: "flex", flexDirection: "column", gap: 9 },
  fRow: { display: "grid", gridTemplateColumns: "118px 1fr 40px", alignItems: "center", gap: 12 },
  fLabel: { fontFamily: "Inter", fontSize: 12.5, color: "#181818" },
  barTrack: { height: 8, background: "#EDEEE7", borderRadius: 999, overflow: "hidden" },
  barFill: { height: "100%", background: "#FF4876", borderRadius: 999 },
  fVal: { fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#565655", textAlign: "right" }
};

window.Hero = Hero;
