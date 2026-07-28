import { ImageResponse } from "next/og";

export const alt =
  "kentsele.ist — İstanbul kentsel dönüşüm ilanları, malik ücretsiz ilan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #111321 0%, #1a1f35 55%, #0f3d24 100%)",
          padding: "56px 64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#2cb34f",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          İstanbul · Kentsel Dönüşüm
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            kentsele
            <span style={{ color: "#2cb34f" }}>.ist</span>
          </div>
          <div
            style={{
              display: "flex",
              color: "rgba(255,255,255,0.88)",
              fontSize: 34,
              fontWeight: 600,
              lineHeight: 1.3,
              maxWidth: 980,
            }}
          >
            Malikler ücretsiz ilan verir · Onaylı müteahhitler iletişime geçer
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(255,255,255,0.65)",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          <span>39 ilçe · 6306 · Kira yardımı · Hibe & kredi</span>
          <span style={{ color: "#2cb34f" }}>https://kentsele.ist</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
