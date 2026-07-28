import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon (iOS home screen) */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111321",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
            fontWeight: 800,
            fontSize: 42,
            letterSpacing: -1,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span>kentsele</span>
          <span style={{ color: "#2cb34f", fontSize: 36 }}>.ist</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
