// LogosStrip.jsx — right-to-left scrolling marquee on cream
const LOGOS = ["Verizon", "Morgan Stanley", "OpenTable", "Okta", "Salesforce", "Zendesk", "Ticketmaster", "Cisco", "LabCorp", "Dell"];
const LogosStrip = () => {
  // Duplicate list for seamless loop
  const seq = [...LOGOS, ...LOGOS];
  return (
    <section style={lsStyles.wrap}>
      <div style={lsStyles.eyebrow}>Trusted by 10,000+ software teams</div>
      <div style={lsStyles.marqueeWrap}>
        <div style={lsStyles.fadeL}/>
        <div style={lsStyles.fadeR}/>
        <div style={lsStyles.track}>
          {seq.map((n,i) => <div key={i} style={lsStyles.logo}>{n}</div>)}
        </div>
      </div>
      <style>{`
        @keyframes pendo-logo-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};
const lsStyles = {
  wrap: { background: "#F7F7F3", padding: "48px 0 56px", display: "flex", flexDirection: "column", alignItems: "center", gap: 22, borderTop: "1px solid rgba(24,24,24,0.06)", borderBottom: "1px solid rgba(24,24,24,0.06)" },
  eyebrow: { fontFamily: "Inter", fontWeight: 600, fontSize: 11, letterSpacing: "0.14em", color: "#7C7C79", textTransform: "uppercase" },
  marqueeWrap: { position: "relative", width: "100%", overflow: "hidden", maskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)" },
  fadeL: { display: "none" },
  fadeR: { display: "none" },
  track: { display: "flex", gap: 64, width: "max-content", animation: "pendo-logo-marquee 42s linear infinite" },
  logo: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 22, color: "#565655", letterSpacing: "-0.01em", opacity: 0.7, whiteSpace: "nowrap" }
};
window.LogosStrip = LogosStrip;
