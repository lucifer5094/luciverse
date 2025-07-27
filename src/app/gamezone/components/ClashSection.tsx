'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CoCStats, ClanMember, WarLogEntry, CurrentWar } from '../data';
import MemberList from './MemberList';
import WarLogSection from './WarLogSection';
import CurrentWarSection from './CurrentWarSection';

interface ClashSectionProps {
    clanInfo: { basicInfo: CoCStats, memberList: ClanMember[] } | null;
    warLog: { items: WarLogEntry[] } | null;
    currentWar: CurrentWar | null;
}

const ClashSection: React.FC<ClashSectionProps> = ({ clanInfo, warLog, currentWar }) => {
    const [activeTab, setActiveTab] = useState('members');

    if (!clanInfo) {
        return <p className="text-center text-red-500">Could not load Clan data.</p>;
    }

    const tabs = ['members', 'warlog', 'currentwar'];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold mb-2 text-center">{clanInfo.basicInfo.clanName}</h2>
            <p className="text-center text-gray-400 font-mono mb-6">{clanInfo.basicInfo.clanTag}</p>

            <div className="flex justify-center border-b border-gray-700 mb-6">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'members' && <MemberList members={clanInfo.memberList} />}
                {activeTab === 'warlog' && warLog && <WarLogSection warLog={warLog} />}
                {activeTab === 'currentwar' && (
                    currentWar
                        ? <CurrentWarSection currentWar={currentWar} />
                        : <p className="text-center text-gray-400">Not currently in a war.</p>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ClashSection;