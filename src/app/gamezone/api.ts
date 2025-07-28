// File: app/gamezone/api.ts

// Zaroori: Apne clan ka tag yahan daalo
const CLAN_TAG = '#2QUU9L9QV'; 
// Note: '#' ko URL-friendly banane ke liye '%23' mein convert karna hoga.
const ENCODED_CLAN_TAG = `%23${CLAN_TAG.slice(1)}`;

const BASE_URL = 'https://api.clashofclans.com/v1';

// Yeh helper function server par API call karega
async function fetchFromCocApi(endpoint: string) {
    const apiKey = process.env.NEXT_PUBLIC_COC_API_KEY;

    if (!apiKey) {
        // Yeh error server console mein dikhega
        console.error("Clash of Clans API key is not configured.");
        // App ko crash hone se bachao, khaali data bhejo ya error throw karo
        throw new Error("Missing authorization: API key not found on server.");
    }

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, { 
            headers,
            // Data ko fresh rakhne ke liye cache ko revalidate kar sakte hain
            next: { revalidate: 300 } // Har 5 minute (300 seconds) mein data refresh hoga
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`API Error (${response.status}): ${errorBody}`);
            throw new Error(`Failed to fetch from CoC API. Status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Failed to fetch from CoC API:", error);
        // Production mein user ko aacha error dikhane ke liye null return kar sakte hain
        return null;
    }
}

// Function 1: Clan ki general info laayega
export async function getClanData() {
    console.log("Fetching clan data...");
    return fetchFromCocApi(`/clans/${ENCODED_CLAN_TAG}`);
}

// Function 2: Clan ka war log laayega
export async function getClanWarLog() {
    console.log("Fetching clan war log...");
    return fetchFromCocApi(`/clans/${ENCODED_CLAN_TAG}/warlog`);
}

// Function 3: Clan ki current war ki details laayega
export async function getClanCurrentWar() {
    console.log("Fetching current clan war...");
    return fetchFromCocApi(`/clans/${ENCODED_CLAN_TAG}/currentwar`);
}