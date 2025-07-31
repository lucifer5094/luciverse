'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ApodData {
    title: string;
    date: string;
    explanation: string;
    url: string;
    hdurl: string;
    media_type: 'image' | 'video';
    copyright?: string;
}

export default function PictureOfTheDayPage() {
    const [apodData, setApodData] = useState<ApodData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApodData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/nasa/apod');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch data from our server.');
                }
                const data = await response.json();
                setApodData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchApodData();
    }, []);

    return (
        <div className="p-4 sm:p-8 text-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <Link href="/observatory" className="inline-block text-purple-400 hover:text-purple-300 mb-8">
                    &larr; Back to The Observatory
                </Link>
                {loading && <p className="text-center">Loading Picture of the Day...</p>}
                {error && <p className="text-center text-red-400">Error: {error}</p>}
                {apodData && (
                    // ... The same JSX for displaying the data
                    <div className="bg-gray-800/50 rounded-xl overflow-hidden">
                        <a href={apodData.hdurl} target="_blank" rel="noopener noreferrer">
                            <Image src={apodData.url} alt={apodData.title} width={1280} height={720} className="w-full h-auto" priority />
                        </a>
                        <div className="p-6">
                            <h1 className="text-3xl font-bold mb-2">{apodData.title}</h1>
                            <p className="text-sm text-gray-400 mb-4">{apodData.date}</p>
                            <p className="leading-relaxed">{apodData.explanation}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}