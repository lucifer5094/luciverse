'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

// Type definitions
interface Artist {
  name: string;
}

interface Song {
  name: string;
  artists: Artist[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyData {
  item: Song;
  progress_ms: number;
  is_playing: boolean;
}

export default function SpotifyStatus() {
  const { data: session } = useSession();
  const [song, setSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      // Don't set loading to true on every interval, only on initial load
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/spotify/currently-playing');

        if (!response.ok) {
          // If response is not OK, maybe the token expired.
          // NextAuth will handle refresh on next session check.
          console.error("Failed to fetch from API.");
          setIsPlaying(false);
          return;
        }

        // Check for 204 No Content, which means nothing is playing
        if (response.status === 204) {
          setIsPlaying(false);
          setSong(null);
          return;
        }

        const data: SpotifyData = await response.json();
        
        if (data && data.item) {
          setIsPlaying(data.is_playing);
          setSong(data.item);
          const progressPercent = (data.progress_ms / data.item.duration_ms) * 100;
          setProgress(progressPercent);
        } else {
          setIsPlaying(false);
          setSong(null);
        }
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentlyPlaying();
    const interval = setInterval(fetchCurrentlyPlaying, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [session]);


  if (!session) {
    return (
      <div className="text-center">
        <button onClick={() => signIn('spotify')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700">
          Login with Spotify
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-center text-sm text-gray-400">Loading Spotify status...</p>;
  }

  return (
    <div>
      {isPlaying && song ? (
        <a href={song.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
          <div className="flex items-center space-x-4">
            {/* Album Art */}
            <img 
              src={song.album.images[2]?.url || song.album.images[0]?.url} 
              alt={song.album.name} 
              className="w-16 h-16 rounded-md object-cover" 
            />
            {/* Song Details & Progress Bar */}
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-white truncate">{song.name}</p>
              <p className="text-sm text-gray-300 truncate">{song.artists.map(a => a.name).join(', ')}</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-600 rounded-full h-1 mt-2">
                <div 
                  className="bg-green-500 h-1 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </a>
      ) : (
        <p className="text-center text-sm text-gray-400">Not playing anything right now.</p>
      )}
      <div className="text-center">
        <button onClick={() => signOut()} className="text-xs text-red-500 mt-4 hover:underline">
          Logout
        </button>
      </div>
    </div>
  );
}