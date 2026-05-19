// ResourcesSection.jsx — three resource cards with distinct visual treatments
const ResourcesSection = () => (
  <section style={rsStyles.wrap}>
    <div style={rsStyles.header}>
      <h2 style={rsStyles.title}>Show yourself around.</h2>
      <p style={rsStyles.sub}>Tour the platform, see how Pendo works, dive into new features,<br/>all without talking to sales.</p>
    </div>
    <div style={rsStyles.grid}>
      <ResourceCard kind="demo"
        heading="Interactive demos"
        meta="3–5 minute product tours"
        cta="Start exploring"
      />
      <ResourceCard kind="video"
        heading="Video demos"
        meta="Quick video walkthroughs"
        cta="Start watching"
      />
      <ResourceCard kind="release"
        heading="What's new and next"
        meta="Pendo Autumn Release"
        cta="Start learning"
      />
    </div>
  </section>
);

const ResourceCard = ({ kind, heading, meta, cta }) => (
  <div style={rcStyles.card}>
    <div style={rcStyles.media}>
      {kind === "demo" && <DemoMedia/>}
      {kind === "video" && <VideoMedia/>}
      {kind === "release" && <ReleaseMedia/>}
    </div>
    <div style={rcStyles.body}>
      <div style={rcStyles.heading}>{heading}</div>
      <div style={rcStyles.meta}>{meta}</div>
      <a href="#" style={rcStyles.cta}>{cta} <span style={rcStyles.arrow}>→</span></a>
    </div>
  </div>
);

// 1. Pank gradient behind a floating product UI screenshot
const DemoMedia = () => (
  <div style={{
    position: "relative", width: "100%", height: "100%",
    background: "url('../../assets/pankiverse/pankiverse-04.png') center/cover no-repeat, linear-gradient(135deg, #FF9ED7, #FD6AA5 45%, #D80574)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 20px 0"
  }}>
    <img
      src="../../assets/pankiverse/ui-listen.png"
      alt=""
      style={{
        width: "88%",
        borderRadius: "8px 8px 0 0",
        boxShadow: "0 20px 40px -12px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.18)",
        display: "block",
        objectFit: "cover",
        objectPosition: "top",
        maxHeight: "100%",
        alignSelf: "flex-end"
      }}
    />
  </div>
);

// 2. Photo-like gradient with a centered play button
const VideoMedia = () => (
  <div style={{
    position: "relative", width: "100%", height: "100%",
    background: "radial-gradient(circle at 35% 40%, #E8D5C0 0%, #C7B8A3 35%, #3D3A2E 85%)",
    display: "flex", alignItems: "center", justifyContent: "center"
  }}>
    {/* subtle silhouette shape to hint at a person */}
    <svg viewBox="0 0 400 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.85 }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="rcVid" cx="0.35" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#F3E4D0"/>
          <stop offset="0.5" stopColor="#A89378"/>
          <stop offset="1" stopColor="#2E2B22"/>
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#rcVid)"/>
      {/* soft silhouette */}
      <ellipse cx="200" cy="165" rx="110" ry="95" fill="#5A4E3A" opacity="0.55"/>
      <ellipse cx="200" cy="110" rx="52" ry="62" fill="#7A6A52" opacity="0.65"/>
    </svg>
    {/* play button */}
    <div style={{
      position: "relative", width: 56, height: 56, borderRadius: 999,
      background: "rgba(24,24,24,0.72)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(4px)"
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
    </div>
  </div>
);

// 3. Pank backdrop with a serif headline
const ReleaseMedia = () => (
  <div style={{
    position: "relative", width: "100%", height: "100%",
    background: "url('../../assets/pankiverse/pankiverse-02.png') center/cover no-repeat, #2A0A1E",
    display: "flex", alignItems: "flex-start", justifyContent: "flex-start",
    padding: "28px 28px"
  }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 45%)" }}/>
    <h3 style={{
      position: "relative",
      fontFamily: "Cormorant Garamond, Georgia, serif",
      fontWeight: 500,
      fontSize: 34,
      lineHeight: 1.05,
      color: "#fff",
      margin: 0,
      maxWidth: "80%",
      letterSpacing: "-0.01em"
    }}>
      The Autumn<br/>Release is<br/>now live
    </h3>
  </div>
);

const rsStyles = {
  wrap: { background: "#F7F7F3", padding: "96px 40px" },
  header: { maxWidth: 720, margin: "0 auto 48px", textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" },
  title: { fontFamily: "Sora, Inter, sans-serif", fontWeight: 700, fontSize: 44, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#181818", margin: 0 },
  sub: { fontFamily: "Inter", fontSize: 16, lineHeight: 1.5, color: "#565655", margin: 0 },
  grid: { maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }
};

const rcStyles = {
  card: { background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(24,24,24,0.06)", display: "flex", flexDirection: "column", boxShadow: "0 1px 2px rgba(24,24,24,0.04)" },
  media: { aspectRatio: "4/3", overflow: "hidden" },
  body: { padding: "22px 24px 26px", display: "flex", flexDirection: "column", gap: 4 },
  heading: { fontFamily: "Inter", fontWeight: 700, fontSize: 18, color: "#181818" },
  meta: { fontFamily: "Inter", fontSize: 13, color: "#7C7C79", marginBottom: 14 },
  cta: { alignSelf: "flex-start", background: "#181818", color: "#fff", padding: "9px 16px", borderRadius: 999, fontFamily: "Inter", fontWeight: 600, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 },
  arrow: { fontSize: 13 }
};

window.ResourcesSection = ResourcesSection;
