// Shared slide utilities
const SLIDE_W = 1920;
const SLIDE_H = 1080;

// Full wordmark lockup
const Logo = ({ variant = "light", size = "small" }) => {
  const h = size === "large" ? 56 : size === "xl" ? 88 : 34;
  const src =
    variant === "light"      ? "../../assets/pendo-logo-light.svg"  // cream + pink chevron (for dark bg)
  : variant === "dark"       ? "../../assets/pendo-logo-dark.svg"   // graphite + pink chevron (for light bg)
  : variant === "white"      ? "../../assets/pendo-logo-white.svg"  // mono white
  : variant === "black"      ? "../../assets/pendo-logo-black.svg"  // mono black
                             : "../../assets/pendo-logo-light.svg";
  return <img src={src} alt="Pendo" style={{ height: h, width: "auto", display: "block" }}/>;
};

// Standalone pink chevron — used as a bottom-left corner mark
const Chevron = ({ size = 56 }) => (
  <img src="../../assets/pendo-chevron.svg" alt="" aria-hidden="true" style={{ width: size, height: "auto", display: "block" }}/>
);

// Chevron, bottom-left — primary slide-footer mark (matches keynote reference).
// Small + tight to the corner.
const ChevronBottomLeft = ({ size = 28 }) => (
  <div style={{ position: "absolute", left: 40, bottom: 40, zIndex: 5 }}>
    <Chevron size={size} />
  </div>
);

// Full wordmark, positions
const LogoBottomLeft = ({ variant = "light", size = "small" }) => (
  <div style={{ position: "absolute", left: 56, bottom: 56, zIndex: 5 }}>
    <Logo variant={variant} size={size} />
  </div>
);
const LogoTopLeft = ({ variant = "light", size = "small" }) => (
  <div style={{ position: "absolute", left: 56, top: 56, zIndex: 5 }}>
    <Logo variant={variant} size={size} />
  </div>
);

// Bottom-right slide label (matches keynote reference: "1 of 8")
const SlideCounter = ({ n, total, color = "#7C7C79" }) => (
  <div style={{ position: "absolute", right: 56, bottom: 56, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 18, color, letterSpacing: "0.08em", zIndex: 5 }}>
    {n} of {total}
  </div>
);

const Eyebrow = ({ children, color = "#FF4876" }) => (
  <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 16, letterSpacing: "0.22em", color, textTransform: "uppercase" }}>{children}</div>
);

const PinkRule = ({ w = 72, h = 7 }) => (
  <div style={{ width: w, height: h, background: "#FF4876", borderRadius: h / 2 }} />
);

const Bolt = () => (
  <svg width="56" height="56" viewBox="0 0 32 32" fill="#FF4876" aria-hidden="true">
    <path d="M18 2 L6 18 H14 L12 30 L26 12 H17 L18 2 Z"/>
  </svg>
);

const NumberCircle = ({ n, size = 56, color = "#FF4876" }) => (
  <div style={{ width: size, height: size, borderRadius: 999, border: `2px solid ${color}`, color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontWeight: 500, fontSize: size * 0.42, flex: "0 0 auto" }}>{n}</div>
);

const Pill = ({ children, variant = "outline", color = "#FF4876" }) => {
  const base = { display: "inline-flex", alignItems: "center", padding: "8px 18px", borderRadius: 999, fontFamily: "Inter", fontWeight: 700, fontSize: 14, letterSpacing: "0.18em", textTransform: "uppercase" };
  const styles = variant === "filled"
    ? { ...base, background: color, color: "#fff" }
    : { ...base, border: `2px solid ${color}`, color, background: "transparent" };
  return <div style={styles}>{children}</div>;
};

// Corner arrow — matches keynote "next" indicator, small pink chevron motif
const CornerArrow = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" style={{ display: "block" }}>
    <path d="M4 14 L20 14 M14 7 L21 14 L14 21" stroke="#FF4876" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SlideFrame = ({ children, bg = "#000", label, color = "#fff" }) => (
  <section data-screen-label={label} data-om-validate style={{ position: "relative", width: SLIDE_W, height: SLIDE_H, background: bg, overflow: "hidden", color }}>
    {children}
  </section>
);

Object.assign(window, {
  Logo, Chevron, ChevronBottomLeft,
  LogoBottomLeft, LogoTopLeft, SlideCounter,
  Eyebrow, PinkRule, Bolt, NumberCircle, Pill, CornerArrow,
  SlideFrame, SLIDE_W, SLIDE_H
});
