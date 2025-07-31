// app/observatory/page.tsx
import Link from 'next/link';
import { RocketLaunchIcon, PhotoIcon, CpuChipIcon } from '@heroicons/react/24/outline';

// Spotify component ko import karo
import SpotifyStatus from '@/components/spotifyStatus';
import TopArtists from '@/components/observatory/TopArtists';

// Define the data for our analysis cards
const analysisCards = [
    {
        title: 'Live Space Report',
        description: 'Real-time data on astronauts currently in space.',
        href: '/observatory/space-report',
        Icon: (props: any) => <RocketLaunchIcon {...props} />,
    },
    {
        title: 'Picture of the Day',
        description: 'Explore the cosmos with NASA\'s daily astronomical image.',
        href: '/observatory/picture-of-the-day',
        Icon: (props: any) => <PhotoIcon {...props} />,
    },
    {
        title: 'Tech Stats',
        description: 'Live statistics from the world of technology.',
        href: '/observatory/tech-stats',
        Icon: (props: any) => <CpuChipIcon {...props} />,
    },
];

export default function ObservatoryPage() {
    return (
        <div className="p-4 sm:p-8 text-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                    The Observatory
                </h1>

                {/* === NAYA SPOTIFY STATUS PANEL === */}
                <div className="mb-12 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-green-400 mb-4 text-center">
                        ♪ Now Playing on Spotify
                    </h2>
                    <SpotifyStatus />
                </div>
                {/* ================================ */}


                <TopArtists />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {analysisCards.map((card) => (
                        <Link href={card.href} key={card.title} className="group block">
                            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 h-full transition-all duration-300 hover:border-purple-500 hover:bg-gray-800/80 hover:-translate-y-1">
                                <div className="mb-4">
                                    <card.Icon className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-100 mb-2">{card.title}</h2>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{card.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}