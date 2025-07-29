// app/gamezone/components/CapitalRaidSection.tsx
'use client';

import { motion } from 'framer-motion';
import { CapitalRaidSeason } from '../data';
import { Calendar, Target, Gem, Shield } from 'lucide-react'; // Shield icon import kiya

// Props ka type define karo
interface CapitalRaidSectionProps {
    capitalRaids: { items: CapitalRaidSeason[] };
}

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// ===================================
// MAIN COMPONENT
// ===================================
const CapitalRaidSection: React.FC<CapitalRaidSectionProps> = ({ capitalRaids }) => {
    // Sabse latest raid ko pehle dikhao
    const sortedRaids = [...capitalRaids.items].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
        >
            {sortedRaids.map((raid, index) => {
                // Top 5 contributors ko find karo
                const topContributors = raid.members
                    ? [...raid.members]
                        .sort((a, b) => b.capitalResourcesLooted - a.capitalResourcesLooted)
                        .slice(0, 5) // Top 5 dikhayenge ab
                    : [];

                return (
                    <motion.div
                        key={raid.startTime}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                    >
                        {/* Raid Header */}
                        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
                            <div>
                                <h3 className="text-xl font-bold text-white">Raid Weekend</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(raid.startTime)} - {formatDate(raid.endTime)}</span>
                                </div>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                raid.state === 'ended' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                                {raid.state.charAt(0).toUpperCase() + raid.state.slice(1)}
                            </span>
                        </div>

                        {/* Raid Stats (UPGRADED) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 text-center">
                            {/* Stat 1: Total Loot */}
                            <div>
                                <p className="text-sm text-gray-400">Total Loot</p>
                                <p className="text-lg font-bold flex items-center justify-center gap-1">
                                    <Gem className="w-4 h-4 text-cyan-400"/> {raid.capitalTotalLoot.toLocaleString()}
                                </p>
                            </div>
                            {/* Stat 2: Offensive Loot */}
                             <div>
                                <p className="text-sm text-gray-400">Offensive Loot</p>
                                <p className="text-lg font-bold text-gray-300">{raid.offensiveReward.toLocaleString()}</p>
                            </div>
                            {/* Stat 3: Defensive Reward */}
                            <div>
                                <p className="text-sm text-gray-400">Defensive Reward</p>
                                <p className="text-lg font-bold text-green-400 flex items-center justify-center gap-1">
                                    <Shield className="w-4 h-4"/> +{raid.defensiveReward.toLocaleString()}
                                </p>
                            </div>
                            {/* Stat 4: Total Attacks */}
                             <div>
                                <p className="text-sm text-gray-400">Total Attacks</p>
                                <p className="text-lg font-bold flex items-center justify-center gap-1">
                                    <Target className="w-4 h-4 text-red-400"/> {raid.totalAttacks}
                                </p>
                            </div>
                            {/* Stat 5: Raids Completed */}
                             <div>
                                <p className="text-sm text-gray-400">Raids Completed</p>
                                <p className="text-lg font-bold">{raid.raidsCompleted}</p>
                            </div>
                            {/* Stat 6: Districts Destroyed */}
                             <div>
                                <p className="text-sm text-gray-400">Districts Destroyed</p>
                                <p className="text-lg font-bold">{raid.enemyDistrictsDestroyed}</p>
                            </div>
                        </div>

                        {/* Top Contributors Leaderboard */}
                        {topContributors.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2 text-gray-300">Top 5 Contributors</h4>
                                <div className="space-y-2">
                                    {topContributors.map((member, rank) => (
                                        <div key={member.tag} className="flex items-center justify-between bg-gray-900/50 p-2 rounded-md">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-lg w-6 text-center">
                                                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
                                                </span>
                                                <p>{member.name}</p>
                                            </div>
                                            <div className="flex items-center gap-1 font-semibold">
                                                <Gem className="w-4 h-4 text-cyan-500"/>
                                                {member.capitalResourcesLooted.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default CapitalRaidSection;
