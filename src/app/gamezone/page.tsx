import React from 'react';
import dynamic from 'next/dynamic';
import { Gamepad2, Swords, Heart } from 'lucide-react';

// API helper function
import { getClanData, getClanWarLog, getClanCurrentWar } from './api';

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

// Page component ab 'async' hai aur server par run hoga
const GamezonePage = async () => {
    // Server par data fetch karein
    const [clanInfo, warLog, currentWar] = await Promise.all([
        getClanData(),
        getClanWarLog(),
        getClanCurrentWar()
    ]);

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <ParticleConstellation />
            <GamezoneClient 
            tabs={tabs} 
            clanInfo = {clanInfo}
            warLog = {warLog}
            currentWar = {currentWar} />
        </div>
    );
};

export default GamezonePage;