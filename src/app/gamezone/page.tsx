// app/gamezone/page.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { Gamepad2, Swords, Heart } from 'lucide-react';

// API helper functions
import { 
    getClanData, 
    getClanWarLog, 
    getClanCurrentWar, 
    getClanCapitalRaidSeasons,
    getClanWarLeagueGroup
} from './api';

// Client component
import GamezoneClient from './components/GamezoneClient';

// Type import
import { Tab } from './data';

const ParticleConstellation = dynamic(() => import('@/components/animations/ParticleConstellation'), { ssr: false });

const tabs: Tab[] = [
    { id: 'favorites', label: 'Favorite Games', icon: <Heart className="w-5 h-5" /> },
    { id: 'coc', label: 'Clash of Clans', icon: <Swords className="w-5 h-5" /> },
    { id: 'upcoming', label: 'More Games', icon: <Gamepad2 className="w-5 h-5" /> },
];

const GamezonePage = async () => {
    // STEP 1: Saare data variables ko null se initialize karo
    let clanInfo = null;
    let warLog = null;
    let currentWar = null;
    let capitalRaids = null;
    let cwlGroup = null;
    let isCocDisabled = false;

    // STEP 2: Check karo ki environment production hai ya nahi
    if (process.env.NODE_ENV === 'production') {
        // Agar production hai, to ek flag set karo aur API calls skip kar do
        console.log("Production environment detected. Skipping CoC data fetch.");
        isCocDisabled = true;
    } else {
        // Agar development (localhost) hai, to saara data fetch karo
        console.log("Development environment detected. Fetching all CoC data...");
        [clanInfo, warLog, currentWar, capitalRaids, cwlGroup] = await Promise.all([
            getClanData(),
            getClanWarLog(),
            getClanCurrentWar(),
            getClanCapitalRaidSeasons(),
            getClanWarLeagueGroup()
        ]);
    }

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <ParticleConstellation />
            <GamezoneClient 
                tabs={tabs} 
                clanInfo={clanInfo}
                warLog={warLog}
                currentWar={currentWar}
                capitalRaids={capitalRaids}
                cwlGroup={cwlGroup}
                // STEP 3: Naya flag client component ko pass karo
                isCocDisabled={isCocDisabled}
            />
        </div>
    );
};

export default GamezonePage;
