'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';

// Data and Type imports
// STEP 1: Naye ChessData type ko import karo
import { Tab, Clan, WarLogEntry, CurrentWar, CapitalRaidSeason, ClanWarLeagueGroup, ChessData } from '../data';

// Component imports
import FavoritesSection from './FavoritesSection';
import ClashSection from './ClashSection';
import UpcomingSection from './UpcomingSection';
import ChessSection from './ChessSection'; // STEP 2: Naya component import karo

// STEP 3: Props ke interface mein naya chessData prop add karo
interface GamezoneClientProps {
    tabs: Tab[];
    clanInfo: Clan | null;
    warLog: { items: WarLogEntry[] } | null;
    currentWar: CurrentWar | null;
    capitalRaids: { items: CapitalRaidSeason[] } | null;
    cwlGroup: ClanWarLeagueGroup | null;
    isCocDisabled?: boolean;
    chessData: ChessData | null; // Naya prop
}

const GamezoneClient: React.FC<GamezoneClientProps> = ({ 
    tabs, 
    clanInfo, 
    warLog, 
    currentWar, 
    capitalRaids,
    cwlGroup,
    isCocDisabled,
    chessData // STEP 4: Naye prop ko yahan receive karo
}) => {
    const [activeTab, setActiveTab] = useState('coc');
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

    return (
        <>
            {/* Hero Section & Nav (unchanged) */}
            <section className="relative text-center pt-20 pb-12 sm:pt-32 sm:pb-20 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
                <motion.div style={{ y }} className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-700/50 [mask-image:linear-gradient(to_bottom,white_50%,transparent_100%)]" />
                <div className="relative z-10">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 120 }} className="inline-block p-4 bg-primary/10 rounded-full mb-6">
                        <Trophy className="w-16 h-16 text-primary" />
                    </motion.div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        The Gamezone
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        A look into my gaming world. From epic RPGs to competitive clan wars.
                    </p>
                </div>
            </section>
            <nav className="sticky top-0 z-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center space-x-2 sm:space-x-4 py-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'} relative flex items-center gap-2 px-3 py-2 text-sm sm:text-base font-medium rounded-lg transition-colors duration-200`}
                            >
                                {tab.icon}
                                <span className="hidden sm:block">{tab.label}</span>
                                {activeTab === tab.id && (
                                    <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" layoutId="underline" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <AnimatePresence mode="wait">
                    {activeTab === 'favorites' && <FavoritesSection />}
                    
                    {activeTab === 'coc' && (
                        isCocDisabled ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center bg-gray-800/50 p-8 rounded-lg"
                            >
                                <h2 className="text-2xl font-bold text-yellow-400">Under Development!</h2>
                                <p className="text-gray-400 mt-2">
                                    The Clash of Clans live stats feature is currently in a special testing phase.
                                    <br/>
                                    Full data is visible only in the local development environment for now.
                                </p>
                            </motion.div>
                        ) : (
                            <ClashSection
                                clanInfo={clanInfo}
                                warLog={warLog}
                                currentWar={currentWar}
                                capitalRaids={capitalRaids}
                                cwlGroup={cwlGroup}
                            />
                        )
                    )}

                    {/* STEP 5: Naye tab ka content render karo */}
                    {activeTab === 'chess' && (
                        chessData 
                            ? <ChessSection chessData={chessData} />
                            : <p className="text-center text-gray-400">Could not load Chess.com data.</p>
                    )}
                    
                    {activeTab === 'upcoming' && <UpcomingSection />}
                </AnimatePresence>
            </main>
        </>
    );
};

export default GamezoneClient;
