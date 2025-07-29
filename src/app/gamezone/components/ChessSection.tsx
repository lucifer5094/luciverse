// app/gamezone/components/ChessSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ChessData, ChessStats, ChessGame } from '../data';
import { Users, Calendar, MapPin, BarChart2, Zap, BrainCircuit, ExternalLink, Crown } from 'lucide-react';

// --- PROPS INTERFACE ---
interface ChessSectionProps {
    chessData: ChessData;
}

// ===================================
// SUB-COMPONENTS
// ===================================

// StatCard component (unchanged)
const StatCard: React.FC<{ title: string; stats: ChessStats | undefined }> = ({ title, stats }) => {
    // ... same as before ...
    if (!stats) {
        return <div className="bg-gray-800/50 p-4 rounded-lg text-center"><h4 className="font-bold text-lg capitalize">{title}</h4><p className="text-gray-400 mt-2">No games played</p></div>;
    }
    const { last, best, record } = stats;
    const totalGames = record ? record.win + record.loss + record.draw : 0;
    const winPercentage = totalGames > 0 && record ? (record.win / totalGames) * 100 : 0;
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg capitalize text-primary">{title}</h4>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                <div><p className="text-gray-400">Current Rating</p><p className="font-bold text-xl">{last?.rating || 'N/A'}</p></div>
                <div>
                    <p className="text-gray-400">Best Rating</p>
                    <a href={best?.game} target="_blank" rel="noopener noreferrer" className="font-bold text-xl hover:text-yellow-400 transition-colors flex items-center gap-1">
                        {best?.rating || 'N/A'} {best && <ExternalLink className="w-4 h-4"/>}
                    </a>
                </div>
            </div>
            {record && (
                <div className="mt-4">
                    <p className="text-gray-400 text-sm">Record (W-L-D)</p>
                    <div className="flex items-center gap-2 font-semibold">
                        <span className="text-green-400">{record.win}</span><span>-</span><span className="text-red-400">{record.loss}</span><span>-</span><span className="text-gray-400">{record.draw}</span>
                    </div>
                    {totalGames > 0 && (<div className="w-full bg-gray-700 rounded-full h-2.5 mt-2"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${winPercentage}%` }}></div></div>)}
                </div>
            )}
        </div>
    );
};

// PuzzleStats component (FIXED)
const PuzzleStats: React.FC<{ stats: ChessData['stats'] }> = ({ stats }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg text-primary flex items-center gap-2"><BrainCircuit/> Puzzles</h4>
            <p className="text-gray-400 text-sm mt-2">Highest Rating</p>
            {/* FIX: Check for tactics and highest existence */}
            <p className="font-bold text-3xl">{stats.tactics?.highest?.rating || 'N/A'}</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg text-primary flex items-center gap-2"><Zap/> Puzzle Rush</h4>
            <p className="text-gray-400 text-sm mt-2">Best Score</p>
            {/* FIX: Check for puzzle_rush and best existence */}
            <p className="font-bold text-3xl">{stats.puzzle_rush?.best?.score || 'N/A'}</p>
        </div>
    </div>
);

// RecentGames component (unchanged)
const RecentGames: React.FC<{ games: ChessGame[], username: string }> = ({ games, username }) => (
    // ... same as before ...
     <div className="space-y-2">
        {games.slice(0, 5).map(game => { // Show latest 5 games
            const isWhite = game.white.username.toLowerCase() === username.toLowerCase();
            const player = isWhite ? game.white : game.black;
            const opponent = isWhite ? game.black : game.white;
            const result = player.result;
            
            let resultColor = 'text-gray-400';
            if (result === 'win') resultColor = 'text-green-400';
            if (['checkmated', 'timeout', 'resigned'].includes(result)) resultColor = 'text-red-400';

            return (
                <a href={game.url} target="_blank" rel="noopener noreferrer" key={game.url} className="block bg-gray-900/50 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${isWhite ? 'bg-white' : 'bg-black border border-gray-500'}`}></div>
                            <div>
                                <p className="font-semibold">vs {opponent.username}</p>
                                <p className="text-xs text-gray-500">{opponent.rating}</p>
                            </div>
                        </div>
                        <div className={`font-bold capitalize ${resultColor}`}>
                            {result.replace(/_/g, ' ')}
                        </div>
                    </div>
                </a>
            );
        })}
    </div>
);


// ===================================
// MAIN COMPONENT (unchanged)
// ===================================
const ChessSection: React.FC<ChessSectionProps> = ({ chessData }) => {
    // ... same as before ...
    const { profile, stats, recent_games } = chessData;

    const getFlagEmoji = (countryUrl: string) => {
        const countryCode = countryUrl.split('/').pop();
        return countryCode ? countryCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397)) : '🌍';
    };
    
    const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            {/* Player Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-800/40 p-6 rounded-lg mb-6">
                <motion.img src={profile.avatar || '/images/chess_avatar.png'} alt={profile.username} className="w-32 h-32 rounded-full border-4 border-primary shadow-lg" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} />
                <div className="text-center md:text-left">
                    <h2 className="text-4xl font-extrabold">{profile.name || profile.username}</h2>
                    <a href={profile.url} target="_blank" rel="noopener noreferrer" className="text-lg text-gray-400 font-mono hover:text-primary">@{profile.username}</a>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-gray-300">
                        <div className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {getFlagEmoji(profile.country)}</div>
                        <div className="flex items-center gap-1"><Calendar className="w-4 h-4"/> Joined {formatDate(profile.joined)}</div>
                        <div className="flex items-center gap-1"><Users className="w-4 h-4"/> {profile.followers} Followers</div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Game Stats */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2"><BarChart2 /> Game Ratings</h3>
                    <StatCard title="Rapid" stats={stats.chess_rapid} />
                    <StatCard title="Blitz" stats={stats.chess_blitz} />
                    <StatCard title="Bullet" stats={stats.chess_bullet} />
                </div>
                {/* Right Column: Puzzles & Recent Games */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Zap /> Puzzles</h3>
                        <PuzzleStats stats={stats} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Crown /> Recent Games</h3>
                        <RecentGames games={recent_games} username={profile.username} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ChessSection;
