// QuoteSlide.jsx — Full-bleed Pankiverse with white quote card (keynote Ticketmaster style)
const QuoteSlide = () => (
  <SlideFrame
    label="09 Quote · Pankiverse"
    bg="url('../../assets/pankiverse/pankiverse-02.png') center/cover no-repeat, #000"
    color="#181818"
  >
    <ChevronBottomLeft />

    {/* Small attribution title above the card, like "Ticketmaster is saving 15 hours…" */}
    <div style={{ position: "absolute", left: 160, top: 120, right: 160, textAlign: "center" }}>
      <div style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 44, color: "#fff", letterSpacing: "-0.015em", textShadow: "0 2px 16px rgba(0,0,0,0.25)" }}>
        Ticketmaster is saving <span style={{ color: "#fff" }}>15 hours per week</span><br/>using Pendo MCP in Claude.
      </div>
    </div>

    <div style={{ position: "absolute", left: 200, right: 200, top: 340, bottom: 160, background: "#fff", borderRadius: 24, padding: "80px 100px", display: "flex", flexDirection: "column", gap: 40, boxShadow: "0 40px 80px rgba(151,18,122,0.35)" }}>
      <div style={{ fontFamily: "Sora, serif", fontWeight: 700, fontSize: 180, color: "#FF4876", lineHeight: 0.5, height: 80 }}>&ldquo;</div>
      <blockquote style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 500, fontSize: 54, letterSpacing: "-0.018em", lineHeight: 1.2, color: "#181818", margin: 0, textWrap: "balance" }}>
        Being able to join our Pendo data with external sources has been insanely powerful — delivering answers to our teams they've been wanting for years.
      </blockquote>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: "auto" }}>
        <img src="../../assets/placeholder-portrait.svg" alt="" style={{ width: 72, height: 72, borderRadius: 999, objectFit: "cover" }}/>
        <div>
          <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 24, color: "#181818" }}>Joshua Joiner</div>
          <div style={{ fontFamily: "Inter", fontWeight: 400, fontSize: 20, color: "#565655" }}>Sr. Technical Product Manager, Ticketmaster</div>
        </div>
      </div>
    </div>

  </SlideFrame>
);
window.QuoteSlide = QuoteSlide;
