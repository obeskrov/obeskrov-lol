import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    return NextResponse.json(
      { error: "Last.fm credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "obeskrov-site/1.0",
      },
      next: {
        revalidate: 30,
      },
    });

    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.recenttracks?.track?.[0]) {
      return NextResponse.json({ track: null });
    }

    const track = data.recenttracks.track[0];
    const image = track.image?.find((img: { size: string; "#text": string }) => img.size === "large")?.["#text"] || null;

    return NextResponse.json({
      track: {
        name: track.name || "",
        artist: track.artist?.["#text"] || "",
        album: track.album?.["#text"] || "",
        image: image,
        nowPlaying: track["@attr"]?.nowplaying === "true",
        playedAt: track.date?.["#text"] || null,
      },
    });
  } catch (error) {
    console.error("Last.fm fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Last.fm data" },
      { status: 500 }
    );
  }
}