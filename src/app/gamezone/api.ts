import { CoCStats, WarLogEntry, CurrentWar } from './data';

const API_KEY = process.env.NEXT_PUBLIC_COC_API_KEY;
const CLAN_TAG = '#2QUU9L9QV'; 
const formattedClanTag = encodeURIComponent(CLAN_TAG);

async function fetchFromApi(endpoint: string) {
    if (!API_KEY) {
        console.error('Clash of Clans API Key not found.');
        return null;
    }
    try {
        const res = await fetch(`https://api.clashofclans.com/v1${endpoint}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` },
            next: { revalidate: 300 } // 5 min cache
        });
        if (!res.ok) {
            console.error(`Failed to fetch ${endpoint}:`, res.status, res.statusText);
            return null;
        } 
        return res.json();
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        return null;
    }
}

// Basic Clan Data
export async function getClanData(): Promise<{ basicInfo: CoCStats, memberList: any[] } | null> {
    const data = await fetchFromApi(`/clans/${formattedClanTag}`);
    if (!data) return null;
    
    return {
        basicInfo: {
            clanName: data.name,
            clanTag: data.tag,
            clanLevel: data.clanLevel,
            members: data.members,
            warLeague: data.warLeague.name,
            warWins: data.warWins,
            winStreak: data.warWinStreak,
        },
        memberList: data.memberList
    };
}

// War Log Data
export async function getClanWarLog(): Promise<{ items: WarLogEntry[] } | null> {
    return fetchFromApi(`/clans/${formattedClanTag}/warlog`);
}

// Current War Data
export async function getClanCurrentWar(): Promise<CurrentWar | null> {
    const data = await fetchFromApi(`/clans/${formattedClanTag}/currentwar`);

    console.log("Current War API Response : ", data);

    if (data && data.state === 'notInWar') {
        console.log("Status : Clan is not in a war.");
        return null;
    }
    return data;
}