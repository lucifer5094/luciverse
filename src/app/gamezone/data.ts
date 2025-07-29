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
  warPreference?: "in" | "out";
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
// This section is now updated with your actual favorite games!
// ===================================

export interface Game {
  name: string;
  genre: string;
  rating: number;
  image: string; // Note: You'll need to add these images to your /public/images/ folder
  description: string;
}

export const favoriteGames: Game[] = [
  {
    name: "Minecraft",
    genre: "Sandbox & Survival",
    rating: 5,
    image: "/images/minecraft.jpg",
    description:
      "The ultimate creative freedom. Building anything you can imagine is just pure fun.",
  },
  {
    name: "Clash of Clans",
    genre: "Strategy",
    rating: 5,
    image: "/images/coc.jpg",
    description:
      "My go-to mobile game. The strategy in clan wars is on another level.",
  },
  {
    name: "Garena Free Fire",
    genre: "Battle Royale",
    rating: 4,
    image: "/images/freefire.jpg",
    description:
      "Quick, intense matches. Perfect for when you want some fast-paced action.",
  },
  {
    name: "Grand Theft Auto V",
    genre: "Action-Adventure",
    rating: 5,
    image: "/images/gtav.jpg",
    description:
      "An incredible open world with endless things to do. The story is just iconic.",
  },
  {
    name: "Chess",
    genre: "Board & Strategy",
    rating: 5,
    image: "/images/chess.jpg",
    description:
      "The timeless classic. Nothing beats the mental challenge of a good chess match.",
  },
  {
    name: "Cities: Skylines",
    genre: "City-Builder",
    rating: 4,
    image: "/images/citiesskylines.jpg",
    description:
      "Love designing and managing my own city. It's super relaxing and complex at the same time.",
  },
];

// ===================================
// CHESS.COM API TYPES (NEW!)
// ===================================

export interface ChessStats {
  last: {
    rating: number;
    date: number; // Timestamp
  };
  best: {
    rating: number;
    date: number; // Timestamp
    game: string; // URL to the game
  };
  record: {
    win: number;
    loss: number;
    draw: number;
  };
}

export interface ChessProfile {
  player_id: number;
  "@id": string;
  url: string;
  username: string;
  name?: string;
  title?: string;
  followers: number;
  country: string; // URL to country details
  last_online: number; // Timestamp
  joined: number; // Timestamp
  status: string;
  is_streamer: boolean;
  avatar?: string;
}

export interface ChessData {
  profile: ChessProfile;
  stats: {
    chess_rapid?: ChessStats;
    chess_blitz?: ChessStats;
    chess_bullet?: ChessStats;
    puzzle_rush?: PuzzleRushStats;
    tactics?: {
      highest: {
        rating: number;
        date: number;
      };
    };
  };
  recent_games: ChessGame[];
}

export interface PuzzleRushStats {
  best: {
    total_attempts: number;
    score: number;
  };
}

export interface ChessGame {
  url: string;
  pgn?: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  white: {
    rating: number;
    result: string;
    username: string;
  };
  black: {
    rating: number;
    result: string;
    username: string;
  };
}
