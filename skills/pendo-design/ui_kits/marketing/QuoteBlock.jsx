// QuoteBlock.jsx — Pendo-style two-tone quote, small byline + prev/next pager
const QUOTES = [
  {
    open: "The most exciting thing for us is the speed at which we can get information.",
    rest: "I can be in a meeting with product and engineering and within 15 minutes, we get data from Pendo to answer our question and help us make a decision.",
    name: "Chuck Konfrst",
    role: "Director of User Experience",
    initials: "CK"
  },
  {
    open: "Pendo changed how our team ships.",
    rest: "We stopped guessing what customers wanted and started seeing it — in the same week we moved from roadmap debate to roadmap action.",
    name: "Priya Desai",
    role: "VP of Product, Morgan Stanley",
    initials: "PD"
  },
  {
    open: "We cut onboarding drop-off by a third in one sprint.",
    rest: "Replay gave us the exact step customers were abandoning, and guides let us fix it without an engineering ticket.",
    name: "Marcus Ellison",
    role: "Head of Growth, Ticketmaster",
    initials: "ME"
  }
];

const QuoteBlock = () => {
  const [i, setI] = React.useState(0);
  const q = QUOTES[i];
  const go = (d) => setI((i + d + QUOTES.length) % QUOTES.length);

  return (
    <section style={qbStyles.wrap}>
      <div style={qbStyles.inner}>
        <blockquote style={qbStyles.quote}>
          <span style={qbStyles.open}>&ldquo;{q.open}</span>{" "}
          <span style={qbStyles.rest}>{q.rest}&rdquo;</span>
        </blockquote>
        <div style={qbStyles.byline}>
          <div style={qbStyles.who}>
            <div style={qbStyles.avatar}>{q.initials}</div>
            <div>
              <div style={qbStyles.name}>{q.name}</div>
              <div style={qbStyles.role}>{q.role}</div>
            </div>
          </div>
          <div style={qbStyles.pager}>
            <button style={qbStyles.pagerBtn} onClick={() => go(-1)} aria-label="Previous">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button style={qbStyles.pagerBtn} onClick={() => go(1)} aria-label="Next">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const qbStyles = {
  wrap: { background: "#F7F7F3", padding: "112px 40px" },
  inner: { maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 },
  quote: { margin: 0, fontFamily: "Sora, Inter, sans-serif", fontWeight: 600, fontSize: 36, letterSpacing: "-0.018em", lineHeight: 1.32, maxWidth: 760 },
  open: { color: "#181818" },
  rest: { color: "#A1A29E" },
  byline: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 },
  who: { display: "flex", alignItems: "center", gap: 14 },
  avatar: { width: 40, height: 40, borderRadius: 999, background: "linear-gradient(135deg, #3A3A38, #565655)", color: "#EDEEE7", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontWeight: 600, fontSize: 12, letterSpacing: "0.04em" },
  name: { fontFamily: "Inter", fontWeight: 600, fontSize: 14, color: "#181818" },
  role: { fontFamily: "Inter", fontWeight: 400, fontSize: 13, color: "#7C7C79" },
  pager: { display: "flex", gap: 8 },
  pagerBtn: { width: 36, height: 36, borderRadius: 999, background: "#181818", color: "#fff", border: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }
};

window.QuoteBlock = QuoteBlock;
