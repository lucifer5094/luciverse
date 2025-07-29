// app/gamezone/data.ts

import { ReactNode } from "react";

// ===================================
// UTILITY & GENERIC TYPES
// ===================================

export interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface IconUrls {
  small: string;
  tiny?: string;
  medium?: string;
  large?: string;
}

// ===================================
// PLAYER SPECIFIC TYPES (NEW!)
// ===================================

export interface Hero {
  name: string;
  level: number;
  maxLevel: number;
  village: "home" | "builderBase";
}

// Detailed player info, fetched individually
export interface Player {
  tag: string;
  name: string;
  townHallLevel: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  attackWins: number;
  defenseWins: number;
  builderHallLevel?: number;
  versusTrophies?: number;
  bestVersusTrophies?: number;
  versusBattleWins?: number;
  role: string;
  warPreference?: 'in' | 'out';
  donations: number;
  donationsReceived: number;
  clan: {
    tag: string;
    name: string;
    clanLevel: number;
    badgeUrls: IconUrls;
  };
  league: ClanLeague;
  heroes: Hero[];
  // We can add troops and spells later if needed
}

// ===================================
// CLASH OF CLANS API TYPES
// These now more accurately match the real API response
// ===================================

export interface ClanLeague {
  id: number;
  name: string;
  iconUrls: IconUrls;
}

export interface ClanMember {
  tag: string;
  name: string;
  role: "member" | "admin" | "coLeader" | "leader";
  expLevel: number;
  townHallLevel: number;
  trophies: number;
  versusTrophies?: number; // Optional property
  clanRank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
  league: ClanLeague;
  playerDetails: Player;
}

// This is the main interface for the primary clan data
export interface Clan {
  tag: string;
  name: string;
  type: "open" | "inviteOnly" | "closed";
  description: string;
  location?: {
    id: number;
    name: string;
    isCountry: boolean;
    countryCode: string;
  };
  badgeUrls: IconUrls;
  clanLevel: number;
  clanPoints: number;
  clanVersusPoints?: number; // Optional property
  requiredTrophies: number;
  warFrequency:
    | "always"
    | "moreThanOncePerWeek"
    | "oncePerWeek"
    | "lessThanOncePerWeek"
    | "never"
    | "unknown";
  warWinStreak: number;
  warWins: number;
  warTies: number;
  warLosses: number;
  isWarLogPublic: boolean;
  warLeague: ClanLeague;
  members: number;
  memberList: ClanMember[];
  labels: {
    id: number;
    name: string;
    iconUrls: IconUrls;
  }[];
}

// --- WAR RELATED TYPES ---

export interface WarParticipant {
  tag: string;
  name: string;
  mapPosition: number;
  townhallLevel: number;
  opponentAttacks: number;
  attacks?: {
    attackerTag: string;
    defenderTag: string;
    stars: number;
    destructionPercentage: number;
    order: number;
  }[];
}

export interface WarClan {
  tag: string;
  name: string;
  badgeUrls: IconUrls;
  clanLevel: number;
  attacks: number;
  stars: number;
  destructionPercentage: number;
  members: WarParticipant[];
}

export interface WarLogEntry {
  result: "win" | "lose" | "tie";
  teamSize: number;
  attacksPerMember?: number; // Optional property
  clan: {
    tag: string;
    name: string;
    badgeUrls: IconUrls;
    clanLevel: number;
    attacks: number;
    stars: number;
    destructionPercentage: number;
  };
  opponent: {
    tag: string;
    name: string;
    badgeUrls: IconUrls;
    clanLevel: number;
    stars: number;
    destructionPercentage: number;
  };
  endTime: string; // This is an ISO date string
}

export interface CurrentWar {
  state: "inWar" | "preparation" | "warEnded" | "notInWar";
  teamSize: number;
  clan: WarClan;
  opponent: WarClan;
  preparationStartTime: string;
  startTime: string;
  endTime: string;
}

// ===================================
// CLAN CAPITAL RAID TYPES (NEW!)
// ===================================

export interface RaidMember {
  tag: string;
  name: string;
  attacks: number;
  attackLimit: number;
  bonusAttackLimit: number;
  capitalResourcesLooted: number;
}

export interface CapitalRaidSeason {
  state: "ongoing" | "ended";
  startTime: string;
  endTime: string;
  capitalTotalLoot: number;
  raidsCompleted: number;
  totalAttacks: number;
  enemyDistrictsDestroyed: number;
  offensiveReward: number;
  defensiveReward: number;
  members: RaidMember[];
}

// ===================================
// CLAN WAR LEAGUE (CWL) TYPES (NEW!)
// ===================================

export interface CWLClanMember {
  tag: string;
  name: string;
  townHallLevel: number;
}

export interface CWLClan {
  tag: string;
  name: string;
  clanLevel: number;
  badgeUrls: IconUrls;
  members: CWLClanMember[];
}

export interface CWLWar {
  warTag: string;
  state: "inWar" | "preparation" | "warEnded" | "notInWar";
  teamSize: number;
  clan?: {
    // Optional in some cases
    tag: string;
    name: string;
    stars: number;
    destructionPercentage: number;
  };
  opponent?: {
    // Optional in some cases
    tag: string;
    name: string;
    stars: number;
    destructionPercentage: number;
  };
  endTime?: string;
}

export interface ClanWarLeagueRound {
  warTags: string[];
}

export interface ClanWarLeagueGroup {
  state: "inWar" | "preparation" | "ended";
  season: string; // e.g., "2024-07"
  clans: CWLClan[];
  rounds: ClanWarLeagueRound[];
}

// ===================================
// FAVORITE GAMES (STATIC DATA)
// This section is unchanged
// ===================================

export interface Game {
  name: string;
  genre: string;
  rating: number;
  image: string;
  description: string;
}

export const favoriteGames: Game[] = [
  {
    name: "The Witcher 3: Wild Hunt",
    genre: "Action RPG",
    rating: 5,
    image: "/images/witcher3.jpg",
    description:
      "My all-time favorite. The story, the world, the gameplay... simply a masterpiece.",
  },
  {
    name: "Red Dead Redemption 2",
    genre: "Action-Adventure",
    rating: 5,
    image: "/images/rdr2.jpg",
    description: "A visual marvel with an incredibly immersive story.",
  },
  {
    name: "Elden Ring",
    genre: "Souls-like",
    rating: 4,
    image: "/images/eldenring.jpg",
    description: "Brutally challenging yet incredibly rewarding.",
  },
];
