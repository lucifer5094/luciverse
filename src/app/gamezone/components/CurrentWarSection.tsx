// app/gamezone/components/CurrentWarSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurrentWar, WarClan } from '../data';
import { Swords, Shield, Star, Clock, Target, Grid } from 'lucide-react';

// IMPORT THE NEW COMPONENT
import WarBattlefield from './WarBattlefield'; 

// --- (The helper functions like parseCoCDate and WarClanInfo can remain the same) ---
const parseCoCDate = (dateString: string): Date => {
    // ... same as before
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(9, 11);
    const minute = dateString.substring(11, 13);
    const second = dateString.substring(13, 15);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`);
};

const WarClanInfo: React.FC<{ clan: WarClan; alignment: 'left' | 'right' }> = ({ clan, alignment }) => (
    // ... same as before
    <div className={`flex flex-col items-center w-full`}>
        <img src={clan.badgeUrls.medium} alt={clan.name} className="w-20 h-20 md:w-24 md:h-24 mb-2 drop-shadow-lg" />
        <p className={`font-extrabold text-xl md:text-2xl text-white truncate w-full px-2 text-center`}>{clan.name}</p>
        <div className="flex items-center gap-1 text-sm text-gray-400">
            <Shield className="w-3 h-3"/> Lv. {clan.clanLevel}
        </div>
        <div className="mt-4 space-y-2 text-center">
            <p className="text-3xl md:text-4xl font-bold text-yellow-400 flex items-center gap-2">
                <Star className="w-7 h-7" fill="currentColor" /> {clan.stars}
            </p>
            <p className="text-lg font-mono text-gray-300">{clan.destructionPercentage.toFixed(2)}%</p>
            <p className="text-base text-cyan-400 flex items-center justify-center gap-2">
                <Target className="w-4 h-4" /> {clan.attacks} Attacks
            </p>
        </div>
    </div>
);


// --- MAIN COMPONENT (UPDATED) ---
const CurrentWarSection: React.FC<{ currentWar: CurrentWar }> = ({ currentWar }) => {
    // We add a new state for the tabs in this section
    const [activeWarTab, setActiveWarTab] = useState('scoreboard');
    const [timeLeft, setTimeLeft] = useState('');
    const [warPhase, setWarPhase] = useState<'preparation' | 'battle' | 'ended'>('ended');

    // useEffect hook for timer remains the same...
    useEffect(() => {
        //...same timer logic as before
        const calculateWarState = () => {
            const now = new Date();
            const startTime = parseCoCDate(currentWar.startTime);
            const endTime = parseCoCDate(currentWar.endTime);
            let targetTime: Date;
            let currentPhase: typeof warPhase;
            if (now < startTime) {
                currentPhase = 'preparation';
                targetTime = startTime;
            } else if (now < endTime) {
                currentPhase = 'battle';
                targetTime = endTime;
            } else {
                currentPhase = 'ended';
                setTimeLeft('War has ended');
                setWarPhase(currentPhase);
                return;
            }
            setWarPhase(currentPhase);
            const difference = +targetTime - +now;
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                let timeString = `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
                if (days > 0) {
                    timeString = `${days}d ${timeString}`;
                }
                setTimeLeft(timeString);
            }
        };
        calculateWarState();
        const interval = setInterval(calculateWarState, 1000);
        return () => clearInterval(interval);
    }, [currentWar]);


    const warTabs = ['scoreboard', 'battlefield'];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 md:p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-2xl"
        >
            {/* War State Header (remains the same) */}
            <div className="text-center mb-4">
                 {/* ...same header code... */}
            </div>

            {/* NEW: TABS FOR SWITCHING VIEWS */}
            <div className="flex justify-center border-b border-gray-700 mb-6">
                {warTabs.map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveWarTab(tab)} 
                        className={`py-2 px-5 text-sm font-medium transition-colors capitalize relative
                            ${activeWarTab === tab ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                    >
                        {tab}
                        {activeWarTab === tab && (
                            <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" layoutId="warTabUnderline" />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeWarTab}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* View 1: The Scoreboard */}
                    {activeWarTab === 'scoreboard' && (
                        <div className="grid grid-cols-3 items-start">
                            <WarClanInfo clan={currentWar.clan} alignment="left" />
                            <div className="flex justify-center items-center h-full pt-20">
                                <Swords className="w-10 h-10 md:w-16 md:h-16 text-gray-500" />
                            </div>
                            <WarClanInfo clan={currentWar.opponent} alignment="right" />
                        </div>
                    )}

                    {/* View 2: The Detailed Battlefield */}
                    {activeWarTab === 'battlefield' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <WarBattlefield clan={currentWar.clan} opponent={currentWar.opponent} />
                           <WarBattlefield clan={currentWar.opponent} opponent={currentWar.clan} isMirrorView={true} />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default CurrentWarSection;