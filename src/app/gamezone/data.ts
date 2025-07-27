// app/gamezone/data.ts

import { ReactNode } from "react";

// Type Definitions
export interface Game {
  name: string;
  genre: string;
  rating: number;
  image: string;
  description: string;
}

export interface CoCStats {
  clanName: string;
  clanTag: string;
  clanLevel: number;
  members: number;
  warLeague: string;
  warWins: number;
  winStreak: number;
}
export interface ClanMember {
  tag: string;
  name: string;
  role: string;
  townHallLevel: number;
  league: {
    name: string;
    iconUrls: {
      small: string;
    };
  };
  trophies: number;
  donations: number;
  donationsReceived: number;
}
export interface WarLogEntry {
  result: "win" | "lose" | "tie";
  teamSize: number;
  clan: {
    tag: string;
    name: string;
    stars: number;
    destructionPercentage: number;
  };
  opponent: {
    tag: string;
    name: string;
    stars: number;
    destructionPercentage: number;
  };
  endTime: string; // Yeh ek ISO date string hogi
}

export interface CurrentWar {
  state: string; // 'inWar', 'preparation', 'warEnded' etc.
  teamSize: number;
  clan: {
    tag: string;
    name: string;
    stars: number;
    destructionPercentage: number;
    members: any[]; // Aap isko aur detail mein type kar sakte hain
  };
  opponent: {
    tag: string;
    name: string;
    stars: number;
    destructionPercentage: number;
  };
  startTime: string;
  endTime: string;
}

export interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
}

// Data Exports
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

export const clashOfClansStats: CoCStats = {
  clanName: "Your Clan Name",
  clanTag: "#YOUR_TAG",
  clanLevel: 15,
  members: 48,
  warLeague: "Master League I",
  warWins: 452,
  winStreak: 8,
};
