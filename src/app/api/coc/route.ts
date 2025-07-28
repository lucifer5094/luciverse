// File: app/api/coc/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Apni Secret API Key ko yahan server pe access karo
  // Isse .env.local mein rakho aur Vercel/Netlify pe bhi set karo
  const apiKey = process.env.NEXT_PUBLIC_COC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ message: 'API key not found.' }, { status: 500 });
  }

  // 2. CoC API ka URL (apne clan ka tag daal dena)
  const cocApiUrl = 'https://api.clashofclans.com/v1/clans/%232QUU9L9QV';

  try {
    // 3. Apne server se CoC API ko call karo
    const response = await fetch(cocApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      // cache: 'no-store' // Use this to always fetch fresh data
    });

    if (!response.ok) {
      // Agar CoC se error aaye to use aage bhej do
      const errorText = await response.text();
      console.error("Error from CoC API:", errorText);
      return NextResponse.json({ message: `Failed to fetch from CoC API: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();

    // 4. Data ko apne app (frontend) ko bhej do
    return NextResponse.json(data);

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}