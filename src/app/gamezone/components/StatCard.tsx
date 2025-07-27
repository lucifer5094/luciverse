// app/gamezone/components/StatCard.tsx

'use client';

import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
    <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-white/10 p-4 rounded-xl text-center backdrop-blur-sm"
    >
        <div className="flex justify-center mb-2 text-indigo-200">{icon}</div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs opacity-80">{label}</p>
    </motion.div>
);

export default StatCard;