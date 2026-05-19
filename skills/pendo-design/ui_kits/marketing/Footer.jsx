// Footer.jsx — Pank gradient bleed behind a dark sitemap card, with legal strip below
const LINK_COLS = [
  {
    title: "Platform",
    links: ["Analytics","Guides","Session Replay","NPS","Listen","Feedback","Validate","Roadmaps","Orchestrate","Data Sync","Mobile","Integrations","Pendo AI"]
  },
  {
    title: "Solutions",
    links: ["Pendo for Startups","Pendo for Enterprise","User Onboarding","In-app Support for Product","In-app Support for Employees","Product-led Growth","User Experience","Product Planning","Revenue Growth","Digital Adoption","SaaS Portfolio Management","Employee Experience","Governance & Compliance","Employee Productivity","Pendo for Customers","Pendo for Employees"]
  },
  {
    title: "Resources",
    links: ["Pendo blog","Webinars","Self-guided Tours","Pendo on Pendo","What's new in Pendo","eBooks and Research","Product-led Hub","Certification Courses","Product Benchmarks","Glossary","Help Center","Developers","Services and Support","Demo Center"]
  },
  {
    title: "Pricing",
    links: ["Pricing and Plans"],
    // rightmost col gets a CTA card below its links
    cta: true
  }
];

const LINK_COLS_2 = [
  {
    title: "Customers",
    links: ["Customer Stories","How I Pendo","Pendo Community","Pendo Academy","Pendo Certifications","Customer Events"]
  },
  {
    title: "Company",
    links: ["About Us","Why Pendo","Events","News","Partner Program","Careers"]
  },
  {
    title: "Support",
    links: ["Knowledge Base","Raise a Support Ticket","Pendo User Group","Developers","Pendo Certifications","Pendo Academy"]
  },
  {
    title: "Popular Links",
    links: ["Security and Privacy","Resource Library","Customer Support Calculator","Customer Retention Calculator","Web Accessibility"]
  }
];

const LegalLinks = ["Privacy Policy","Legal","Manage Preferences","Modern Slavery Statement"];

const Footer = () => (
  <section style={ftStyles.wrap}>
    {/* Pink gradient bleed-behind (uploaded image), extends upward to overlap the section above */}
    <div style={ftStyles.bleed} aria-hidden="true" />

    <div style={ftStyles.inner}>
      {/* Dark sitemap card */}
      <div style={ftStyles.card}>
        <div style={ftStyles.colsRow}>
          {LINK_COLS.map(col => (
            <div key={col.title} style={ftStyles.col}>
              <ColHeader>{col.title}</ColHeader>
              <ColLinks links={col.links}/>
              {col.cta && (
                <div style={ftStyles.ctaCard}>
                  <div style={ftStyles.ctaTitle}>See Pendo in<br/>action for yourself</div>
                  <button style={ftStyles.ctaBtn}>Schedule a Demo</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={ftStyles.divider}/>
        <div style={ftStyles.colsRow}>
          {LINK_COLS_2.map(col => (
            <div key={col.title} style={ftStyles.col}>
              <ColHeader>{col.title}</ColHeader>
              <ColLinks links={col.links}/>
            </div>
          ))}
        </div>
      </div>

      {/* Logo + legal strip */}
      <div style={ftStyles.logoWrap}>
        <img src="../../assets/pendo-lockup.svg" alt="Pendo" style={{ height: 32, width: "auto" }}/>
      </div>

      <div style={ftStyles.legalLinks}>
        {LegalLinks.map((l,i) => (
          <React.Fragment key={l}>
            <a href="#" style={ftStyles.legalLink}>{l}</a>
            {i < LegalLinks.length - 1 && <span style={ftStyles.sep}>·</span>}
          </React.Fragment>
        ))}
      </div>

      <div style={ftStyles.copy}>
        © 2026 Pendo.io, Inc. All rights reserved.<br/>
        Pendo trademarks, product names, logos and other marks and designs are trademarks of Pendo.io, Inc. or its subsidiaries and may not be used without permission.
      </div>
    </div>
  </section>
);

const ColHeader = ({ children }) => (
  <div style={ftStyles.colHead}>
    <div style={ftStyles.colTitle}>{children}</div>
    <div style={ftStyles.colRule}/>
  </div>
);

const ColLinks = ({ links }) => (
  <ul style={ftStyles.linkList}>
    {links.map(l => <li key={l}><a href="#" style={ftStyles.link}>{l}</a></li>)}
  </ul>
);

const ftStyles = {
  // Total section — transparent since the pink bleed now lives on the parent wrapper above (shared with FAQ)
  wrap: { position: "relative", paddingTop: 40, paddingBottom: 56, overflow: "hidden" },

  // Previously held the footer gradient image; now the parent element carries it so it extends through FAQ.
  bleed: { display: "none" },
  noise: { display: "none" },

  inner: { position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 40 },

  card: { width: "100%", background: "#181818", color: "#fff", borderRadius: 14, padding: "52px 48px" },
  colsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 },
  col: { display: "flex", flexDirection: "column", gap: 14 },
  colHead: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 },
  colTitle: { fontFamily: "Inter", fontWeight: 700, fontSize: 13, color: "#fff", letterSpacing: "0.02em" },
  colRule: { height: 2, width: 24, background: "#FF4876", borderRadius: 999 },
  linkList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  link: { fontFamily: "Inter", fontSize: 13, color: "#C7C8C2", textDecoration: "none" },

  divider: { height: 1, background: "rgba(255,255,255,0.08)", margin: "36px 0 32px" },

  ctaCard: { background: "#252524", borderRadius: 10, padding: "18px 18px 20px", marginTop: 14, display: "flex", flexDirection: "column", gap: 12 },
  ctaTitle: { fontFamily: "Inter", fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.35 },
  ctaBtn: { background: "#FF4876", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 999, fontFamily: "Inter", fontWeight: 600, fontSize: 12, cursor: "pointer", alignSelf: "flex-start" },

  logoWrap: { marginTop: 8 },
  logoTextWrap: { display: "flex", alignItems: "center", gap: 8 },
  logoChevron: { display: "inline-block" },
  logoText: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 28, color: "#181818", letterSpacing: "-0.02em" },

  legalLinks: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "center" },
  legalLink: { fontFamily: "Inter", fontSize: 13, color: "#181818", textDecoration: "none", fontWeight: 500 },
  sep: { color: "#7C7C79" },

  copy: { fontFamily: "Inter", fontSize: 12, color: "#3A3A38", textAlign: "center", lineHeight: 1.55, maxWidth: 720 }
};

window.Footer = Footer;
