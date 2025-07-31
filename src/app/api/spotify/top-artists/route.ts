import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const time_range = searchParams.get("time_range") || "medium_term";

    // @ts-ignore
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    // === URL KO THEEK KAR DIYA HAI ===
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}`, // Yahan `?time_range=` add kiya hai
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    // ===================================

    const responseBody = await response.text();

    if (!response.ok) {
      console.error(
        `Spotify API Error: Status ${response.status}`,
        responseBody
      );
      let errorJson;
      try {
        errorJson = JSON.parse(responseBody);
      } catch (e) {
        errorJson = {
          error: { message: "Spotify returned a non-JSON error response." },
        };
      }
      return NextResponse.json(errorJson, { status: response.status });
    }

    if (!responseBody) {
      return NextResponse.json({ items: [] });
    }

    const data = JSON.parse(responseBody);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Internal server error in top-artists route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
