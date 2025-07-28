'use client';

import { useState } from 'react';
// FIX: This line was missing. It tells your code what 'motion' is.
import { motion, AnimatePresence } from 'framer-motion'; 
import { ShieldCheck, Trophy, GitCommitHorizontal, Medal, Users } from 'lucide-react';

// Your other component and type imports
import { CurrentWar, WarLogEntry } from '../data';
import MemberList from './MemberList';
import WarLogSection from './WarLogSection';
import CurrentWarSection from './CurrentWarSection';

// Props for the component
interface ClashSectionProps {
    clanInfo: any;
    warLog: { items: WarLogEntry[] } | null;
    currentWar: CurrentWar | null;
}

// A small component for displaying stats
const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg text-center flex flex-col items-center justify-center">
        <div className="text-primary mb-2">{icon}</div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-bold">{value}</p>
    </div>
);

const ClashSection: React.FC<ClashSectionProps> = ({ clanInfo, warLog, currentWar }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!clanInfo) {
        return <p className="text-center text-red-500 py-10">Could not load Clan data.</p>;
    }

    const tabs = ['overview', 'members', 'warlog', 'currentwar'];

    return (
        <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Clan Header */}
            <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-4 mb-2">
                    <img src={clanInfo.badgeUrls.medium} alt="Clan Badge" className="w-16 h-16"/>
                    <div>
                        <h2 className="text-4xl font-extrabold">{clanInfo.name}</h2>
                        <p className="text-gray-400 font-mono">{clanInfo.tag}</p>
                    </div>
                </div>
                <p className="max-w-2xl mx-auto text-gray-300 mt-2">
                    {clanInfo.description}
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center border-b border-gray-700 mb-6">
                {tabs.map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)} 
                        className={`py-2 px-5 text-sm font-medium transition-colors capitalize relative
                            ${activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" layoutId="underline" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tabs Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <StatCard icon={<ShieldCheck />} label="Clan Level" value={clanInfo.clanLevel} />
                            <StatCard icon={<Medal />} label="War League" value={clanInfo.warLeague.name} />
                            <StatCard icon={<Trophy />} label="Total Trophies" value={clanInfo.clanPoints} />
                            <StatCard icon={<Users />} label="Members" value={`${clanInfo.members}/50`} />
                            <StatCard icon={<GitCommitHorizontal />} label="War Wins" value={clanInfo.warWins} />
                            <StatCard icon={<GitCommitHorizontal color='red' />} label="War Losses" value={clanInfo.warLosses} />
                            <StatCard icon={<GitCommitHorizontal color='gray'/>} label="War Ties" value={clanInfo.warTies} />
                            <StatCard icon={<Trophy />} label="Required Trophies" value={clanInfo.requiredTrophies} />
                        </div>
                    )}
                    {activeTab === 'members' && <MemberList members={clanInfo.memberList} />}
                    {activeTab === 'warlog' && warLog && <WarLogSection warLog={warLog} />}
                    {activeTab === 'currentwar' && (
                        currentWar && currentWar.state !== 'notInWar'
                            ? <CurrentWarSection currentWar={currentWar} />
                            : <p className="text-center text-gray-400 py-10">Not currently in a war.</p>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default ClashSection;