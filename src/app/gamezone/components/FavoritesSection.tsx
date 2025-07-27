// app/gamezone/components/FavoritesSection.tsx

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play, Star } from 'lucide-react';
import { favoriteGames } from '../data';

const FavoritesSection = () => (
    <motion.div
        key="favorites"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
    >
        <h2 className="text-3xl font-bold mb-8 text-center">My All-Time Favorites</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteGames.map((game, index) => (
                <motion.div
                    key={game.name}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-primary/30 transition-shadow duration-400 overflow-hidden group"
                >
                    <div className="relative h-48 overflow-hidden">
                        <Image src={game.image} alt={game.name} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                            <Play className="w-12 h-12 text-white drop-shadow-lg" />
                        </div>
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full text-yellow-400">
                            {[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < game.rating ? 'fill-current' : 'text-gray-500'}`} />))}
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold">{game.name}</h3>
                        <p className="text-sm text-primary mb-2">{game.genre}</p>
                        <p className="text-gray-600 dark:text-gray-400">{game.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    </motion.div>
);

export default FavoritesSection;