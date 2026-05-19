// CTAFooter.jsx — light close band with pink accent rule, then slim footer
const CTAFooter = () => (
  <>
    <section style={ctaStyles.wrap}>
      <div style={ctaStyles.inner}>
        <div style={ctaStyles.eyebrow}><span style={ctaStyles.dot}/> GET STARTED</div>
        <h2 style={ctaStyles.title}>Ready to listen better?</h2>
        <p style={ctaStyles.sub}>See how product teams at 10,000+ companies turn every signal into a smarter release.</p>
        <div style={ctaStyles.ctas}>
          <a href="#" style={ctaStyles.primary}>Get a demo</a>
          <a href="#" style={ctaStyles.secondary}>Talk to sales</a>
        </div>
      </div>
    </section>
    <footer style={ftStyles.wrap}>
      <div style={ftStyles.inner}>
        <div style={ftStyles.brand}>
          <img src="../../assets/pendo-logo-dark.svg" alt="Pendo" style={{ height: 22, width: "auto" }}/>
          <div style={ftStyles.copy}>© 2026 Pendo.io, Inc. · Better software starts here.</div>
        </div>
        <div style={ftStyles.links}>
          {["Platform","Pricing","Customers","Docs","Careers","Privacy"].map(l => (
            <a key={l} href="#" style={ftStyles.link}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  </>
);

const ctaStyles = {
  wrap: { background: "#F1E8AE", padding: "96px 40px" }, // subtle sage-yellow ribbon like Metronome's green band
  inner: { maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16, alignItems: "center", textAlign: "center" },
  eyebrow: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Inter", fontWeight: 600, fontSize: 11, letterSpacing: "0.14em", color: "#565655", textTransform: "uppercase" },
  dot: { width: 6, height: 6, background: "#FF4876", borderRadius: 999 },
  title: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 56, letterSpacing: "-0.025em", lineHeight: 1.05, color: "#181818", margin: 0 },
  sub: { fontFamily: "Inter", fontSize: 17, lineHeight: 1.5, color: "#3A3A38", margin: 0, maxWidth: 520 },
  ctas: { display: "flex", gap: 12, marginTop: 12 },
  primary: { background: "#181818", color: "#fff", padding: "13px 24px", borderRadius: 8, textDecoration: "none", fontFamily: "Inter", fontWeight: 600, fontSize: 15 },
  secondary: { background: "#fff", color: "#181818", padding: "13px 22px", borderRadius: 8, textDecoration: "none", fontFamily: "Inter", fontWeight: 600, fontSize: 15, border: "1px solid rgba(24,24,24,0.1)" }
};

const ftStyles = {
  wrap: { background: "#F7F7F3", padding: "32px 40px", borderTop: "1px solid rgba(24,24,24,0.06)" },
  inner: { maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" },
  brand: { display: "flex", alignItems: "center", gap: 14 },
  copy: { fontFamily: "Inter", fontSize: 12, color: "#7C7C79" },
  links: { display: "flex", gap: 20 },
  link: { fontFamily: "Inter", fontSize: 13, color: "#565655", textDecoration: "none", fontWeight: 500 }
};

window.CTAFooter = CTAFooter;
