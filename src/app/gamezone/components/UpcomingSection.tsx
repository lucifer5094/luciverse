// app/gamezone/components/UpcomingSection.tsx

'use client';

import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

const UpcomingSection = () => (
    <motion.div
        key="upcoming"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
    >
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                <Gamepad2 className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">More Games Coming Soon!</h2>
            <p className="max-w-md text-lg text-gray-600 dark:text-gray-400">
                I&apos;m always exploring new worlds. This section will feature more of my gaming adventures soon.
            </p>
        </div>
    </motion.div>
);

export default UpcomingSection;