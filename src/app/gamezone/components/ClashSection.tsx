'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// STEP 1: Naye icons import karo
import { ShieldCheck, Trophy, GitCommitHorizontal, Medal, Users, Lock, Unlock, TrendingUp, MapPin, Tag } from 'lucide-react';

// --- TYPE IMPORTS ---
import { Clan, CurrentWar, WarLogEntry, CapitalRaidSeason, ClanWarLeagueGroup } from '../data'; 

// --- COMPONENT IMPORTS ---
import MemberList from './MemberList';
import WarLogSection from './WarLogSection';
import CurrentWarSection from './CurrentWarSection';
import CapitalRaidSection from './CapitalRaidSection';
import CWLSection from './CWLSection';

// --- PROPS INTERFACE ---
interface ClashSectionProps {
    clanInfo: Clan | null;
    warLog: { items: WarLogEntry[] } | null;
    currentWar: CurrentWar | null;
    capitalRaids: { items: CapitalRaidSeason[] } | null;
    cwlGroup: ClanWarLeagueGroup | null;
}

// --- SUB-COMPONENTS (unchanged) ---
const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number | undefined }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg text-center flex flex-col items-center justify-center transition-transform hover:scale-105">
        <div className="text-primary mb-2">{icon}</div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-bold">{value || 'N/A'}</p>
    </div>
);

// --- MAIN COMPONENT ---
const ClashSection: React.FC<ClashSectionProps> = ({ clanInfo, warLog, currentWar, capitalRaids, cwlGroup }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!clanInfo) {
        return <p className="text-center text-red-500 py-10">Could not load Clan data. Please check server logs.</p>;
    }

    const tabs = ['overview', 'members', 'warlog', 'currentwar', 'capital', 'cwl'];
    
    const getClanTypeIcon = (type: string) => {
        switch(type) {
            case 'inviteOnly': return <Lock className="w-4 h-4 text-yellow-500" />;
            case 'closed': return <Lock className="w-4 h-4 text-red-500" />;
            case 'open': return <Unlock className="w-4 h-4 text-green-500" />;
            default: return null;
        }
    }

    return (
        <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Clan Header (UPGRADED) */}
            <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-4 mb-2">
                    <img src={clanInfo.badgeUrls.medium} alt="Clan Badge" className="w-16 h-16"/>
                    <div>
                        <h2 className="text-4xl font-extrabold">{clanInfo.name}</h2>
                        <p className="text-gray-400 font-mono">{clanInfo.tag}</p>
                        {/* STEP 2: Clan Location add karo */}
                        {clanInfo.location && (
                            <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
                                <MapPin className="w-4 h-4" />
                                <span>{clanInfo.location.name}</span>
                            </div>
                        )}
                    </div>
                </div>
                <p className="max-w-2xl mx-auto text-gray-300 mt-2">
                    {clanInfo.description}
                </p>
                {/* STEP 3: Clan Labels/Tags add karo */}
                {clanInfo.labels && clanInfo.labels.length > 0 && (
                    <div className="flex justify-center flex-wrap gap-2 mt-4">
                        {clanInfo.labels.map(label => (
                            <div key={label.id} className="flex items-center gap-2 bg-gray-800 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">
                                <img src={label.iconUrls.small} alt={label.name} className="w-4 h-4" />
                                {label.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabs (unchanged) */}
            <div className="flex justify-center border-b border-gray-700 mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)} 
                        className={`py-2 px-4 text-sm font-medium transition-colors capitalize relative whitespace-nowrap
                            ${activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                    >
                        {tab === 'cwl' ? 'CWL' : tab === 'capital' ? 'Capital Raids' : tab}
                        {activeTab === tab && (
                            <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" layoutId="underline" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tabs Content (unchanged) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && ( <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> <StatCard icon={<ShieldCheck />} label="Clan Level" value={clanInfo.clanLevel} /> <StatCard icon={<Medal />} label="War League" value={clanInfo.warLeague.name} /> <StatCard icon={<Trophy />} label="Total Trophies" value={clanInfo.clanPoints} /> <StatCard icon={<Users />} label="Members" value={`${clanInfo.members}/50`} /> <StatCard icon={<GitCommitHorizontal />} label="War Wins" value={clanInfo.warWins} /> <StatCard icon={<GitCommitHorizontal color='red' />} label="War Losses" value={clanInfo.warLosses ?? 0} /> <StatCard icon={<TrendingUp />} label="Win Streak" value={clanInfo.warWinStreak} /> <StatCard icon={getClanTypeIcon(clanInfo.type)} label="Clan Type" value={clanInfo.type.replace('inviteOnly', 'Invite Only')} /> </div> )}
                    {activeTab === 'members' && <MemberList members={clanInfo.memberList} />}
                    {activeTab === 'warlog' && warLog && <WarLogSection warLog={warLog} />}
                    {activeTab === 'currentwar' && ( currentWar && currentWar.state !== 'notInWar' ? <CurrentWarSection currentWar={currentWar} /> : <p className="text-center text-gray-400 py-10">Not currently in a war.</p> )}
                    {activeTab === 'capital' && ( capitalRaids && capitalRaids.items.length > 0 ? <CapitalRaidSection capitalRaids={capitalRaids} /> : <p className="text-center text-gray-400 py-10">No Capital Raid data available.</p> )}
                    {activeTab === 'cwl' && ( cwlGroup ? <CWLSection cwlGroup={cwlGroup} /> : <p className="text-center text-gray-400 py-10">Not currently in Clan War League or data is unavailable.</p> )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default ClashSection;
