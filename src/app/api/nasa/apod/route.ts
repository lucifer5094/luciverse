import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NASA_API_KEY;

  if (!apiKey) {
    console.error("NASA_API_KEY not found in .env.local");
    return NextResponse.json(
      { error: "NASA API key not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NASA API returned an error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch data from NASA API.", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Internal Server Error in APOD route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
