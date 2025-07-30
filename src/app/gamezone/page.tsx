// app/gamezone/page.tsx

import React from 'react';
import dynamic from 'next/dynamic';
// STEP 1: Chess ke liye naya icon import karo
import { Gamepad2, Swords, Heart, BrainCircuit, Puzzle } from 'lucide-react';

// API helper functions
import {
    getClanData,
    getClanWarLog,
    getClanCurrentWar,
    getClanCapitalRaidSeasons,
    getClanWarLeagueGroup,
    getChessData
} from './api';

// Client component
import GamezoneClient from './components/GamezoneClient';

// Type import
import { Tab } from './data';

const ParticleConstellation = dynamic(() => import('@/components/animations/ParticleConstellation'), { ssr: false });

// STEP 2: Naya 'chess' tab add karo
const tabs: Tab[] = [
    { id: 'favorites', label: 'Favorite Games', icon: <Heart className="w-5 h-5" /> },
    { id: 'coc', label: 'Clash of Clans', icon: <Swords className="w-5 h-5" /> },
    { id: 'chess', label: 'Chess', icon: <BrainCircuit className="w-5 h-5" /> },
    { id: 'algorhythm', label: 'AlgoRhythm', icon: <Puzzle className='w-5 h-5' /> },
    { id: 'upcoming', label: 'More Games', icon: <Gamepad2 className="w-5 h-5" /> },
];

const GamezonePage = async () => {
    let clanInfo = null, warLog = null, currentWar = null, capitalRaids = null, cwlGroup = null, isCocDisabled = false, chessData = null;

    if (process.env.NODE_ENV === 'production') {
        console.log("Production environment detected. Skipping CoC data fetch.");
        isCocDisabled = true;
        chessData = await getChessData();
    } else {
        console.log("Development environment detected. Fetching all data...");
        [clanInfo, warLog, currentWar, capitalRaids, cwlGroup, chessData] = await Promise.all([
            getClanData(),
            getClanWarLog(),
            getClanCurrentWar(),
            getClanCapitalRaidSeasons(),
            getClanWarLeagueGroup(),
            getChessData()
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
                isCocDisabled={isCocDisabled}
                chessData={chessData}
            />
        </div>
    );
};

export default GamezonePage;
