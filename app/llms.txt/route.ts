import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

/** /llms.txt — public dosyayı route ile de garanti et */
export async function GET() {
  try {
    const file = path.join(process.cwd(), "public", "llms.txt");
    const body = await readFile(file, "utf8");
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("# kentsele.ist\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
