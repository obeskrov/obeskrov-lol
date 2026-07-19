import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("missing url", { status: 400 });

  // only allow lastfm CDN
  if (!url.includes("lastfm.freetls.fastly.net") && !url.includes("lastfm.net")) {
    return new NextResponse("forbidden", { status: 403 });
  }

  try {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/png";

    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("fetch failed", { status: 500 });
  }
}
