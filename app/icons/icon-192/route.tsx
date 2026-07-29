import { ImageResponse } from "next/og";

export const runtime = "edge";

/** PWA 192 — brand green circle + white K (favicon.svg paleti) */
export async function GET() {
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
          borderRadius: "22%",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 110,
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          K
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
