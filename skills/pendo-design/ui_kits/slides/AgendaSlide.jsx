// AgendaSlide.jsx — Light agenda, numbered items, chevron bottom-left
const AGENDA = [
  { n: "01", t: "Where we are", b: "Q2 progress, what shipped, what slipped." },
  { n: "02", t: "What we learned", b: "Three signals from customers we can't ignore." },
  { n: "03", t: "What's next", b: "The FY27 product plan, in sharper focus." },
  { n: "04", t: "How we'll ship it", b: "Team structure, cadences, and success metrics." }
];
const AgendaSlide = () => (
  <SlideFrame bg="#fff" label="05 Agenda · light" color="#181818">
    <ChevronBottomLeft />
    <div style={{ position: "absolute", left: 120, top: 200, width: 720 }}>
      <Eyebrow>Agenda</Eyebrow>
      <h1 style={{ fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 104, lineHeight: 1.0, letterSpacing: "-0.028em", color: "#181818", margin: "28px 0 0" }}>
        What we'll cover today.
      </h1>
      <div style={{ marginTop: 36 }}><PinkRule w={96} /></div>
    </div>
    <div style={{ position: "absolute", right: 120, top: 200, width: 920, display: "flex", flexDirection: "column", gap: 40 }}>
      {AGENDA.map(a => (
        <div key={a.n} style={{ display: "flex", gap: 28, alignItems: "flex-start", paddingBottom: 32, borderBottom: "1px solid #C7C8C2" }}>
          <NumberCircle n={a.n} size={72} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
            <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 32, color: "#181818" }}>{a.t}</div>
            <div style={{ fontFamily: "Inter", fontSize: 22, color: "#565655", lineHeight: 1.5, maxWidth: 700 }}>{a.b}</div>
          </div>
        </div>
      ))}
    </div>
  </SlideFrame>
);
window.AgendaSlide = AgendaSlide;
