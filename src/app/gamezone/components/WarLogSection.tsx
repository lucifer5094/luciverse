import { motion } from 'framer-motion';
import { WarLogEntry } from '../data';

const WarLogSection = ({ warLog }: { warLog: { items: WarLogEntry[] } }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-4">
        {warLog.items.map((war, index) => (
            <div key={index} className={`p-4 rounded-lg ${war.result === 'win' ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'} border`}>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg">{war.clan.name} vs {war.opponent.name}</p>
                        <p className="text-sm text-gray-400">{war.teamSize} vs {war.teamSize}</p>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold text-xl ${war.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                            {war.clan.stars}⭐ - {war.opponent.stars}⭐
                        </p>
                        <p className="text-sm text-gray-400">{war.clan.destructionPercentage.toFixed(2)}%</p>
                    </div>
                </div>
            </div>
        ))}
    </motion.div>
);

export default WarLogSection;