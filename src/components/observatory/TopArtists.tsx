'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

// Type definitions
type TimeRange = 'short_term' | 'medium_term' | 'long_term';

interface Artist {
    name: string;
    images: { url: string }[];
    external_urls: { spotify: string };
}

export default function TopArtists() {
    const { data: session } = useSession();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');

    useEffect(() => {
        if (!session) {
            setLoading(false);
            return;
        }

        const fetchTopArtists = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/spotify/top-artists?time_range=${timeRange}`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    // This logic now checks for all possible error message formats
                    let errorMessage = 'Failed to fetch data.'; 
                    if (errorData.error) {
                        errorMessage = errorData.error.message || errorData.error_description || errorData.error;
                    }
                    throw new Error(errorMessage);
                }
                
                const data = await response.json();
                setArtists(data.items || []);

            } catch (err: any) {
                setError(err.message);
                console.error("Caught error in component:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopArtists();
    }, [session, timeRange]);

    if (!session) {
      return <p className="text-center text-gray-400">Please log in to see your top artists.</p>;
    }
    
    // ... baaki ka component (return JSX) waise hi rahega
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">Your Top Artists</h2>
                <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
                    {(['short_term', 'medium_term', 'long_term'] as TimeRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 w-full ${timeRange === range ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            {range === 'short_term' ? 'Last 4 Weeks' : range === 'medium_term' ? 'Last 6 Months' : 'All Time'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-400 py-10">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-400 py-10">Error: {error}</p>
            ) : artists.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-in fade-in-50 duration-300">
                    {artists.map((artist) => (
                        <a key={artist.name} href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-center group">
                            <img 
                                src={artist.images[0]?.url} 
                                alt={artist.name} 
                                className="rounded-full aspect-square object-cover w-full h-auto transition-all duration-300 group-hover:scale-105 shadow-lg"
                            />
                            <p className="mt-2 font-semibold text-sm truncate text-gray-200 group-hover:text-green-400">{artist.name}</p>
                        </a>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 py-10">Could not find any top artists for this period. Listen to more music!</p>
            )}
        </div>
    );
}