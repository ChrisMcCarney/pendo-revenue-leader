// FAQ.jsx — simple accordion above the footer, light mode
const FAQS = [
  {
    q: "How does Pendo work with my existing stack?",
    a: "Pendo installs with a single snippet (or our SDK) and automatically captures events across web, mobile, and in-product experiences. No engineering tickets, no manual instrumentation — you're shipping guides and reading analytics within an afternoon."
  },
  {
    q: "What can I measure out of the box?",
    a: "Retention, funnels, paths, feature adoption, NPS, sentiment, session replay — all in one place. Pair them with custom metrics for your business, and layer in cohorts and segments without writing queries."
  },
  {
    q: "How is Pendo different from a traditional analytics tool?",
    a: "Pendo doesn't stop at reporting. You understand what's happening, then act on it — ship in-app guides, surveys, and announcements to the exact segment, without waiting for an engineering cycle."
  },
  {
    q: "Do you support mobile and employee-facing software?",
    a: "Yes. Pendo supports web, iOS, and Android products, plus internal workplace software via Pendo for Employees. The same listen-understand-act loop runs across every surface your people use."
  },
  {
    q: "How long does it take to see value?",
    a: "Most teams are live within a day and seeing product signals in the first week. Customers typically report meaningful adoption and retention lifts within a quarter."
  },
  {
    q: "Is my data safe?",
    a: "Pendo is SOC 2 Type II, ISO 27001, HIPAA, and GDPR-ready. You control what's collected, where it's stored, and who can access it."
  }
];

const FAQ = () => {
  const [open, setOpen] = React.useState(0);
  return (
    <section style={faqStyles.wrap}>
      <div style={faqStyles.inner}>
        <div style={faqStyles.header}>
          <div style={faqStyles.eyebrow}><span style={faqStyles.dot}/> FAQ</div>
          <h2 style={faqStyles.title}>Answers, without the sales call.</h2>
        </div>
        <div style={faqStyles.list}>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} style={faqStyles.row}>
                <button
                  type="button"
                  style={faqStyles.rowBtn}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span style={faqStyles.q}>{item.q}</span>
                  <span style={{ ...faqStyles.plus, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </span>
                </button>
                <div style={{ ...faqStyles.aWrap, maxHeight: isOpen ? 400 : 0, opacity: isOpen ? 1 : 0 }}>
                  <p style={faqStyles.a}>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const faqStyles = {
  wrap: { background: "transparent", padding: "96px 40px 64px" },
  inner: { maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 },
  header: { display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" },
  eyebrow: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Inter", fontWeight: 600, fontSize: 11, letterSpacing: "0.14em", color: "#565655", textTransform: "uppercase" },
  dot: { width: 6, height: 6, background: "#FF4876", borderRadius: 999 },
  title: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 44, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#181818", margin: 0 },

  list: { display: "flex", flexDirection: "column", borderTop: "1px solid rgba(24,24,24,0.1)" },
  row: { borderBottom: "1px solid rgba(24,24,24,0.1)" },
  rowBtn: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "22px 4px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" },
  q: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 600, fontSize: 18, color: "#181818", letterSpacing: "-0.005em" },
  plus: { display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#181818", transition: "transform 0.2s ease" },
  aWrap: { overflow: "hidden", transition: "max-height 0.28s ease, opacity 0.2s ease" },
  a: { fontFamily: "Inter", fontSize: 15, lineHeight: 1.6, color: "#565655", margin: "0 0 22px", maxWidth: 680 }
};

window.FAQ = FAQ;
