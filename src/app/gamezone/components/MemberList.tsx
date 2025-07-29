'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClanMember, Hero } from '../data';
// STEP 1: Naye icons import karo
import { Shield, Star, ThumbsUp, ArrowDown, Trophy, Swords, LogIn, LogOut } from 'lucide-react';

// Props ka type update kiya gaya
interface MemberListProps {
    members: ClanMember[];
}

// ===================================
// SUB-COMPONENTS
// ===================================

// HeroLevels component (unchanged)
const HeroLevels: React.FC<{ heroes: Hero[] }> = ({ heroes }) => {
    const homeHeroes = heroes.filter(h => h.village === 'home' && h.level > 0).sort((a, b) => a.name.localeCompare(b.name));
    if (homeHeroes.length === 0) return <p className="text-sm text-gray-500">No heroes unlocked.</p>;
    const getHeroIcon = (name: string) => {
        if (name.includes('King')) return '👑'; if (name.includes('Queen')) return '🏹'; if (name.includes('Warden')) return '📖'; if (name.includes('Champion')) return '🛡️'; return '🦸';
    };
    return (
        <div className="flex flex-wrap gap-4">
            {homeHeroes.map(hero => (
                <div key={hero.name} className="flex items-center gap-2 bg-gray-900 px-2 py-1 rounded-md">
                    <span className="text-xl">{getHeroIcon(hero.name)}</span>
                    <span className="font-bold text-white">{hero.level}</span>
                    <span className="text-xs text-gray-400">/ {hero.maxLevel}</span>
                </div>
            ))}
        </div>
    );
};

// ===================================
// MAIN COMPONENT
// ===================================
const MemberList: React.FC<MemberListProps> = ({ members }) => {
    const [expandedMember, setExpandedMember] = useState<string | null>(null);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'leader': return 'text-red-500';
            case 'coLeader': return 'text-blue-400';
            case 'admin': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <div className="min-w-full bg-gray-800/40 rounded-lg p-2 md:p-4">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 font-bold text-sm text-gray-400 border-b border-gray-700 pb-2 mb-2 px-2">
                    <div className="col-span-2">Name</div>
                    <div className="text-center">Role</div>
                    <div className="text-center">Trophies</div>
                    <div className="text-center">Level</div>
                </div>

                {/* Member Rows */}
                {members.map((member, index) => (
                    <div key={member.tag} className="border-b border-gray-800 last:border-b-0">
                        <div 
                            className="grid grid-cols-5 gap-4 items-center py-3 px-2 cursor-pointer hover:bg-gray-800/50 rounded-md"
                            onClick={() => setExpandedMember(expandedMember === member.tag ? null : member.tag)}
                        >
                            {/* Member Name and Rank */}
                            <div className="col-span-2 flex items-center space-x-3">
                                <span className="font-bold text-gray-500 w-6 text-center">{index + 1}.</span>
                                <img src={member.league.iconUrls.tiny} alt={member.league.name} className="w-6 h-6" />
                                <p className="font-semibold truncate">{member.name}</p>
                            </div>
                            
                            {/* Role */}
                            <div className={`text-center font-medium capitalize ${getRoleColor(member.role)}`}>
                                {member.role === 'admin' ? 'Elder' : member.role}
                            </div>

                            {/* Trophies */}
                            <div className="text-center flex items-center justify-center space-x-1">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <span>{member.trophies}</span>
                            </div>
                            
                            {/* Experience Level */}
                            <div className="text-center">
                                <span className="font-bold text-cyan-400">{member.expLevel}</span>
                            </div>
                        </div>

                        {/* EXPANDABLE DETAILS SECTION (UPGRADED) */}
                        <AnimatePresence>
                            {expandedMember === member.tag && member.playerDetails && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-gray-900/70 p-4 mx-2 mb-2 rounded-lg border border-gray-700">
                                        {/* Main Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                            <div className="flex items-center gap-2"><ThumbsUp className="w-4 h-4 text-green-500"/> Donations: <span className="font-bold">{member.playerDetails.donations}</span></div>
                                            <div className="flex items-center gap-2"><ArrowDown className="w-4 h-4 text-red-500"/> Received: <span className="font-bold">{member.playerDetails.donationsReceived}</span></div>
                                            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500"/> War Stars: <span className="font-bold">{member.playerDetails.warStars}</span></div>
                                            {/* STEP 2: War Preference add karo */}
                                            <div className="flex items-center gap-2">
                                                {member.playerDetails.warPreference === 'in' 
                                                    ? <LogIn className="w-4 h-4 text-green-400"/> 
                                                    : <LogOut className="w-4 h-4 text-red-400"/>
                                                }
                                                War Preference: 
                                                <span className={`font-bold ${member.playerDetails.warPreference === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {member.playerDetails.warPreference?.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Versus Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm border-t border-gray-700 pt-4">
                                            <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-purple-400"/> Versus Trophies: <span className="font-bold">{member.playerDetails.versusTrophies || 0}</span></div>
                                            <div className="flex items-center gap-2"><Swords className="w-4 h-4 text-purple-400"/> Versus Wins: <span className="font-bold">{member.playerDetails.versusBattleWins || 0}</span></div>
                                        </div>

                                        {/* Heroes */}
                                        <h4 className="font-semibold mb-2 text-gray-300 border-t border-gray-700 pt-4">Heroes:</h4>
                                        <HeroLevels heroes={member.playerDetails.heroes} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default MemberList;
