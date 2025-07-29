// app/gamezone/components/WarBattlefield.tsx
'use client';

import { motion } from 'framer-motion';
import { Target, Star, Shield } from 'lucide-react';
import { WarClan, WarParticipant } from '../data';

interface WarBattlefieldProps {
  clan: WarClan;
  opponent: WarClan;
  isMirrorView?: boolean; // To flip the layout for the opponent
}

// Sub-component for a single attack line
const AttackLog = ({ attack, opponentMembers }: { attack: any, opponentMembers: WarParticipant[] }) => {
  // Find the name of the player who was attacked
  const defender = opponentMembers.find(m => m.tag === attack.defenderTag);

  return (
    <div className="flex items-center justify-between text-sm pl-4">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-gray-500" />
        <span>Attacked #{defender?.mapPosition || '?'}</span>
      </div>
      <div className={`font-bold flex items-center gap-1 ${attack.stars > 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
        {attack.stars} <Star className="w-4 h-4" fill="currentColor" />
        <span className="text-xs text-gray-400 ml-1">({attack.destructionPercentage}%)</span>
      </div>
    </div>
  );
};

// Main component for this file
const WarBattlefield: React.FC<WarBattlefieldProps> = ({ clan, opponent, isMirrorView = false }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-center text-white mb-3">{clan.name}</h3>
      <div className="space-y-3">
        {clan.members.sort((a,b) => a.mapPosition - b.mapPosition).map((member) => {
          // Find who attacked this member
          const defenses = Array.isArray(opponent.attacks)
            ? opponent.attacks.filter(att => att.defenderTag === member.tag)
            : [];

          return (
            <motion.div
              key={member.tag}
              initial={{ opacity: 0, x: isMirrorView ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: member.mapPosition * 0.05 }}
              className="bg-gray-800/50 p-3 rounded-lg"
            >
              {/* Player Info Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400 text-lg w-6">#{member.mapPosition}</span>
                  <p className="font-semibold text-white">{member.name}</p>
                </div>
                <span className="font-bold text-cyan-400">TH{member.townhallLevel}</span>
              </div>

              {/* Attacks Made by this Player */}
              <div className="mt-2 space-y-1">
                {member.attacks?.map((attack, index) => (
                  <AttackLog key={index} attack={attack} opponentMembers={opponent.members} />
                ))}
              </div>
              
              {/* Defenses (Attacks received by this Player) */}
              {defenses && defenses.length > 0 && (
                 <div className="mt-2 pt-2 border-t border-gray-700 space-y-1">
                    {defenses.map((defense, index) => (
                       <div key={index} className="flex items-center justify-between text-sm pl-4">
                           <div className="flex items-center gap-2">
                               <Shield className="w-4 h-4 text-red-500"/>
                               <span>Defended vs #{opponent.members.find(m => m.tag === defense.attackerTag)?.mapPosition || '?'}</span>
                           </div>
                           <div className={`font-bold flex items-center gap-1 text-red-400`}>
                               {defense.stars} <Star className="w-4 h-4" fill="currentColor" />
                           </div>
                       </div>
                    ))}
                 </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WarBattlefield;