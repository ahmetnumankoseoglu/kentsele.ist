import { ImageResponse } from "next/og";

export const runtime = "edge";

/** PWA 512 — brand green circle + white K */
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
            fontSize: 300,
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          K
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
