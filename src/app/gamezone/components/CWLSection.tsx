// app/gamezone/components/CWLSection.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClanWarLeagueGroup, CWLClan, ClanWarLeagueRound } from '../data';
import { Trophy, Shield, Users, Swords, Calendar } from 'lucide-react';

// --- PROPS INTERFACE ---
interface CWLSectionProps {
    cwlGroup: ClanWarLeagueGroup;
}

// ===================================
// SUB-COMPONENTS
// ===================================

// Component to show the standings table
const StandingsTable: React.FC<{ clans: CWLClan[] }> = ({ clans }) => (
    <div className="bg-gray-800/40 rounded-lg p-4">
        <h3 className="text-xl font-bold mb-3 text-center">Group Standings</h3>
        <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-400 px-2">
                <div className="col-span-1">#</div>
                <div className="col-span-7">Clan</div>
                <div className="col-span-2 text-center">Level</div>
                <div className="col-span-2 text-center">Players</div>
            </div>
            {/* Table Body */}
            {clans.map((clan, index) => (
                <div key={clan.tag} className="grid grid-cols-12 gap-2 items-center bg-gray-900/50 p-2 rounded-md">
                    <div className="col-span-1 font-bold text-gray-300">{index + 1}</div>
                    <div className="col-span-7 flex items-center gap-2">
                        <img src={clan.badgeUrls.small} alt={clan.name} className="w-8 h-8"/>
                        <span className="font-semibold truncate">{clan.name}</span>
                    </div>
                    <div className="col-span-2 text-center flex items-center justify-center gap-1 text-cyan-400">
                        <Shield className="w-4 h-4"/> {clan.clanLevel}
                    </div>
                    <div className="col-span-2 text-center flex items-center justify-center gap-1">
                        <Users className="w-4 h-4"/> {clan.members.length}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Component to show the war rounds
const WarRounds: React.FC<{ rounds: ClanWarLeagueRound[], clans: CWLClan[] }> = ({ rounds, clans }) => {
    // Helper to find clan names from war tags
    const getClanFromWarTag = (warTag: string, roundIndex: number): CWLClan | undefined => {
        // API logic is complex, for UI we find the two clans in this round
        // This is a simplified representation
        const clanIndex = roundIndex % clans.length;
        const opponentIndex = (roundIndex + Math.floor(clans.length / 2)) % clans.length;
        // This is not accurate for real matchups but works for UI demonstration
        const clan = clans.find(c => warTag.includes(c.tag.slice(1)));
        return clan;
    };

    return (
        <div className="bg-gray-800/40 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-3 text-center">War Rounds</h3>
            <div className="space-y-3">
                {rounds.map((round, index) => (
                    <div key={index} className="bg-gray-900/50 p-3 rounded-md">
                        <p className="font-bold text-primary mb-2">Round {index + 1}</p>
                        <div className="space-y-2">
                            {round.warTags.map(warTag => {
                                // Note: The API doesn't give clan pairs directly in the group data.
                                // A real implementation would need to fetch each war to get opponents.
                                // For now, we show a placeholder.
                                if (warTag === '#0') return null; // Skip empty tags
                                return (
                                    <div key={warTag} className="flex items-center justify-center text-sm">
                                        <span className="text-gray-400">Matchup details available upon selection.</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// ===================================
// MAIN COMPONENT
// ===================================
const CWLSection: React.FC<CWLSectionProps> = ({ cwlGroup }) => {
    const [activeView, setActiveView] = useState('standings');

    const seasonDate = new Date(cwlGroup.season + '-01T12:00:00Z');
    const seasonString = seasonDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-white">Clan War League</h2>
                <p className="text-lg text-yellow-400 flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5"/> {seasonString}
                </p>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex justify-center border-b border-gray-700 mb-6">
                <button onClick={() => setActiveView('standings')} className={`py-2 px-5 text-sm font-medium transition-colors capitalize relative ${activeView === 'standings' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}>
                    Standings
                    {activeView === 'standings' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" layoutId="cwlUnderline" />}
                </button>
                <button onClick={() => setActiveView('rounds')} className={`py-2 px-5 text-sm font-medium transition-colors capitalize relative ${activeView === 'rounds' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}>
                    Rounds
                    {activeView === 'rounds' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" layoutId="cwlUnderline" />}
                </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeView === 'standings' && <StandingsTable clans={cwlGroup.clans} />}
                    {activeView === 'rounds' && <WarRounds rounds={cwlGroup.rounds} clans={cwlGroup.clans} />}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default CWLSection;
