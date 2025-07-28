import { CoCStats, WarLogEntry, CurrentWar } from "./data";

const API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImY5Y2M2ZDY0LTFhZDEtNGY4ZS1hMzFlLTE0MzUyMWRmYmVmMiIsImlhdCI6MTc1MzY1NDA5NSwic3ViIjoiZGV2ZWxvcGVyL2EzNGFhZjU5LTFhMmQtMDZmOC0xYzEzLTM3ZTBkYzFmN2FjNSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjEwNi43Ny4xODIuOTkiXSwidHlwZSI6ImNsaWVudCJ9XX0.7ADzzqvnkUkz0XxKwK1-Uf59kgwPmiWJNNYi9VClddckN2hH2-BDI5FBYKJEqaBDhGImw7-kY7Boa52Kt_Lf6g";
const CLAN_TAG = "#2QUU9L9QV";
const formattedClanTag = encodeURIComponent(CLAN_TAG);

async function fetchFromApi(endpoint: string) {
  if (!API_KEY) {
    console.error("Clash of Clans API Key not found.");
    return null;
  }
  try {
    const res = await fetch(`https://api.clashofclans.com/v1${endpoint}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: 300 }, // 5 min cache
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
export async function getClanData(): Promise<{
  basicInfo: CoCStats;
  memberList: any[];
} | null> {
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
    memberList: data.memberList,
  };
}

// War Log Data
export async function getClanWarLog(): Promise<{
  items: WarLogEntry[];
} | null> {
  return fetchFromApi(`/clans/${formattedClanTag}/warlog`);
}

// Current War Data
export async function getClanCurrentWar(): Promise<CurrentWar | null> {
  const data = await fetchFromApi(`/clans/${formattedClanTag}/currentwar`);

  console.log("Current War API Response : ", data);

  if (data && data.state === "notInWar") {
    console.log("Status : Clan is not in a war.");
    return null;
  }
  return data;
}
