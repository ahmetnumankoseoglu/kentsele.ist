import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — matches public/favicon.svg brand mark */
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
          background: "#3eac50",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 96,
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          K
        </div>
      </div>
    ),
    { ...size }
  );
}
