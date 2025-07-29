// app/gamezone/api.ts
import { Player } from './data'; // Player type ko import karo

// Zaroori: Aapka clan ka tag yahan daala hua hai
const CLAN_TAG = '#2QUU9L9QV'; 
const ENCODED_CLAN_TAG = `%23${CLAN_TAG.slice(1)}`;
const BASE_URL = 'https://api.clashofclans.com/v1';

// Yeh helper function server par API call karega
async function fetchFromCocApi(endpoint: string) {
    // NOTE: Make sure your variable name here matches the one in Vercel
    const apiKey = process.env.LUCI_COC_API_KEY; 

    if (!apiKey) {
        console.error("Clash of Clans API key is not configured.");
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
            console.error(`API Error for endpoint ${endpoint} (${response.status}): ${errorBody}`);
            // Return null instead of throwing to prevent the entire page from crashing
            return null;
        }

        return await response.json();

    } catch (error) {
        console.error(`Failed to fetch from CoC API endpoint: ${endpoint}`, error);
        // Production mein user ko aacha error dikhane ke liye null return kar sakte hain
        return null;
    }
}

// ===================================
// MAIN API FUNCTIONS
// ===================================

/**
 * Function 1: Clan ki general info laayega, aur saath hi sabhi members ki detailed info bhi.
 */
export async function getClanData() {
    console.log("Fetching clan data...");
    const clanData = await fetchFromCocApi(`/clans/${ENCODED_CLAN_TAG}`);
    
    // YEH NEW LOGIC HAI: Har member ki detailed info fetch karo
    if (clanData && clanData.memberList) {
        console.log(`Fetching details for ${clanData.memberList.length} members...`);
        // Promise.all ka use karke sabhi members ki details ek saath (concurrently) fetch karo
        const memberDetailsPromises = clanData.memberList.map((member: { tag: string }) => 
            getPlayerDetails(member.tag)
        );
        const membersDetails = await Promise.all(memberDetailsPromises);

        // Clan data mein member details ko merge karo
        clanData.memberList.forEach((member: any, index: number) => {
            // Agar kisi specific member ka data fetch nahi hua, to use skip karo
            if (membersDetails[index]) {
                member.playerDetails = membersDetails[index];
            }
        });
        console.log("Finished fetching all member details.");
    }

    return clanData;
}

/**
 * Function 2: Clan ka war log laayega
 */
export async function getClanWarLog() {
    console.log("Fetching clan war log...");
    return fetchFromCocApi(`/clans/${ENCODED_CLAN_TAG}/warlog`);
}

/**
 * Function 3: Clan ki current war ki details laayega
 */
export async function getClanCurrentWar() {
    console.log("Fetching current clan war...");
    return fetchFromCocApi(`/clans/${ENCODED_CLAN_TAG}/currentwar`);
}

/**
 * Function 4 (NEW): Player ki details (heroes etc.) laayega
 */
export async function getPlayerDetails(playerTag: string): Promise<Player | null> {
    // Player tag ko URL-friendly banao
    const encodedPlayerTag = `%23${playerTag.slice(1)}`;
    return fetchFromCocApi(`/players/${encodedPlayerTag}`);
}

/**
 * Function 5 (NEW): Clan capital raid seasons ka data laayega
 */
export async function getClanCapitalRaidSeasons() {
    console.log("Fetching capital raid seasons...");
    return fetchFromCocApi(`/clans/${ENCODED_CLAN_TAG}/capitalraidseasons`);
}

/**
 * Function 6 (NEW): Clan War League group ka data laayega
 */
export async function getClanWarLeagueGroup() {
    console.log("Fetching Clan War League data...");
    // Yeh endpoint current season ka group data deta hai
    return fetchFromCocApi(`/clans/${ENCODED_CLAN_TAG}/currentwar/leaguegroup`);
}

/**
 * Function 7 (NEW): Ek specific CWL war ki details laayega
 */
export async function getCWLWarDetails(warTag: string) {
    const encodedWarTag = `%23${warTag.slice(1)}`;
    console.log(`Fetching details for CWL war: ${encodedWarTag}`);
    return fetchFromCocApi(`/clanwarleagues/wars/${encodedWarTag}`);
}