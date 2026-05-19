// NavBar.jsx — Pendo marketing top nav, LIGHT
const NavBar = () => {
  const links = ["Platform", "Solutions", "Customers", "Pricing", "Resources"];
  return (
    <nav style={navStyles.bar}>
      <a href="#" style={navStyles.logo}>
        <img src="../../assets/pendo-logo-dark.svg" alt="Pendo" style={{ height: 22, width: "auto", display: "block" }}/>
      </a>
      <div style={navStyles.links}>
        {links.map(l => <a key={l} href="#" style={navStyles.link}>{l}</a>)}
      </div>
      <div style={navStyles.cta}>
        <a href="#" style={navStyles.signin}>Sign in</a>
        <a href="#" style={navStyles.getDemo}>Get a demo</a>
      </div>
    </nav>
  );
};
const navStyles = {
  bar: { position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 40px", background: "rgba(247,247,243,0.85)", backdropFilter: "blur(16px) saturate(1.05)", borderBottom: "1px solid rgba(24,24,24,0.06)" },
  logo: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  links: { display: "flex", gap: 28 },
  link: { color: "#181818", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500 },
  cta: { display: "flex", alignItems: "center", gap: 14 },
  signin: { color: "#181818", textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500 },
  getDemo: { background: "#181818", color: "#fff", padding: "9px 16px", borderRadius: 8, textDecoration: "none", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13 }
};
window.NavBar = NavBar;
