'use client';

import { motion } from 'framer-motion';
import { Swords, Shield, Star, Hash, Users } from 'lucide-react';

// Updated type import
import { WarLogEntry } from '../data';

interface WarLogSectionProps {
    warLog: { items: WarLogEntry[] };
}

// Helper function to format date (e.g., "2 days ago")
const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const WarLogSection: React.FC<WarLogSectionProps> = ({ warLog }) => {
    
    // Helper to get border and text colors based on result
    const getResultClasses = (result: string) => {
        switch (result) {
            case 'win': return 'border-green-500/50 text-green-400';
            case 'lose': return 'border-red-500/50 text-red-400';
            case 'tie': return 'border-gray-500/50 text-gray-400';
            default: return 'border-gray-700';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-4"
        >
            {warLog.items.map((war, index) => (
                <div 
                    key={index} 
                    className={`bg-gray-800/30 border-2 rounded-lg p-4 transition-all hover:bg-gray-800/60 ${getResultClasses(war.result)}`}
                >
                    <div className="flex items-center justify-around">
                        {/* Your Clan's Details */}
                        <div className="flex flex-col items-center w-2/5 text-center">
                            <img src={war.clan.badgeUrls.medium} alt={war.clan.name} className="w-16 h-16 mb-2" />
                            <p className="font-bold text-lg text-white truncate">{war.clan.name}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                                <Shield className="w-3 h-3"/> Lv. {war.clan.clanLevel}
                            </div>
                        </div>

                        {/* 'VS' Section with Stars */}
                        <div className="flex flex-col items-center text-center">
                             <p className={`font-extrabold text-2xl mb-1 ${getResultClasses(war.result)}`}>
                                {war.clan.stars} <Swords className="inline w-6 h-6 mx-1"/> {war.opponent.stars}
                            </p>
                            <p className="text-sm font-mono text-gray-500">{war.clan.destructionPercentage.toFixed(2)}%</p>
                        </div>
                        
                        {/* Opponent's Details */}
                        <div className="flex flex-col items-center w-2/5 text-center">
                            <img src={war.opponent.badgeUrls.medium} alt={war.opponent.name} className="w-16 h-16 mb-2" />
                            <p className="font-bold text-lg text-white truncate">{war.opponent.name}</p>
                             <div className="flex items-center gap-1 text-sm text-gray-400">
                                <Shield className="w-3 h-3"/> Lv. {war.opponent.clanLevel}
                            </div>
                        </div>
                    </div>

                    {/* War Footer */}
                    <div className="mt-4 pt-2 border-t border-gray-700/50 flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3"/> {war.teamSize} vs {war.teamSize}
                        </div>
                        <p className="font-semibold capitalize">{war.result}</p>
                        <p>{timeAgo(war.endTime)}</p>
                    </div>
                </div>
            ))}
        </motion.div>
    );
};

export default WarLogSection;