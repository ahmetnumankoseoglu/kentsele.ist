import { NextResponse } from "next/server";

/**
 * Client VAPID public key — build-time NEXT_PUBLIC_* kaçırılırsa
 * runtime env ile de çalışsın (Vercel).
 */
export async function GET() {
  const publicKey =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim().replace(
      /^["']|["']$/g,
      ""
    ) ||
    process.env.VAPID_PUBLIC_KEY?.trim().replace(/^["']|["']$/g, "") ||
    "";

  if (!publicKey) {
    return NextResponse.json(
      { error: "missing", message: "VAPID public key tanımlı değil." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { publicKey },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    }
  );
}
