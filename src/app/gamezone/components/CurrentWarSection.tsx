'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CurrentWar } from '../data';
import { Swords, Shield, Star, Clock } from 'lucide-react';

// Helper function to parse CoC API's unique date format
const parseCoCDate = (dateString: string): Date => {
    // Format: YYYYMMDDTHHMMSS.000Z -> YYYY-MM-DDTHH:MM:SSZ
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(9, 11);
    const minute = dateString.substring(11, 13);
    const second = dateString.substring(13, 15);
    
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`);
};

const CurrentWarSection = ({ currentWar }: { currentWar: CurrentWar }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [warPhase, setWarPhase] = useState<'preparation' | 'battle' | 'ended'>('ended');

    useEffect(() => {
        const calculateWarState = () => {
            const now = new Date();
            const startTime = parseCoCDate(currentWar.startTime);
            const endTime = parseCoCDate(currentWar.endTime);
            
            let targetTime: Date;
            let currentPhase: typeof warPhase;

            if (now < startTime) {
                currentPhase = 'preparation';
                targetTime = startTime;
            } else if (now < endTime) {
                currentPhase = 'battle';
                targetTime = endTime;
            } else {
                currentPhase = 'ended';
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return; // War has ended, no need to set an interval
            }
            setWarPhase(currentPhase);

            const difference = +targetTime - +now;
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    // ✅ Hours ko 24 ke cycle mein rakha gaya hai
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };
        
        // Pehli baar turant calculate karein
        calculateWarState();
        
        // Har second update karne ke liye interval set karein
        const interval = setInterval(calculateWarState, 1000);
        
        // Component unmount hone par interval clear karein
        return () => clearInterval(interval);

    }, [currentWar]);

    const formatTime = (time: number) => time.toString().padStart(2, '0');
    
    const timerText = warPhase === 'preparation' ? 'War Begins In' : 'War Ends In';

    if (warPhase === 'ended') {
        return <p className="text-center text-gray-400">War has ended.</p>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-6 bg-gray-800/50 rounded-lg border border-gray-700"
        >
            <div className="flex justify-center items-center mb-4">
                <Clock className="w-6 h-6 mr-2 text-yellow-400" />
                <p className="text-xl font-bold text-yellow-400">
                    {/* ✅ Ab timer '1d 0h 5m 10s' jaisa dikhega agar zaroorat padi */}
                    {timerText}: 
                    {timeLeft.days > 0 && ` ${timeLeft.days}d`}
                    {` ${formatTime(timeLeft.hours)}h ${formatTime(timeLeft.minutes)}m ${formatTime(timeLeft.seconds)}s`}
                </p>
            </div>

            <div className="grid grid-cols-3 items-center text-center">
                {/* Your Clan */}
                <div className="flex flex-col items-center">
                    <Shield className="w-10 h-10 text-blue-400 mb-2" />
                    <p className="font-bold text-lg text-blue-400">{currentWar.clan.name}</p>
                    <p className="text-2xl font-bold">{currentWar.clan.stars} <Star className="inline w-6 h-6 text-yellow-500 fill-current" /></p>
                    <p className="text-gray-400">{currentWar.clan.destructionPercentage.toFixed(2)}%</p>
                </div>

                {/* VS Icon */}
                <div>
                    <Swords className="w-12 h-12 text-red-500" />
                </div>

                {/* Opponent Clan */}
                <div className="flex flex-col items-center">
                    <Shield className="w-10 h-10 text-red-400 mb-2" />
                    <p className="font-bold text-lg text-red-400">{currentWar.opponent.name}</p>
                    <p className="text-2xl font-bold">{currentWar.opponent.stars} <Star className="inline w-6 h-6 text-yellow-500 fill-current" /></p>
                    <p className="text-gray-400">{currentWar.opponent.destructionPercentage.toFixed(2)}%</p>
                </div>
            </div>
        </motion.div>
    );
};

export default CurrentWarSection;