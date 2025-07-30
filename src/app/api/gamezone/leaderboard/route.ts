import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Leaderboard file ka path
const leaderboardFilePath = path.join(process.cwd(), 'src', 'data', 'algorhythm-leaderboard.json');

interface ScoreEntry {
    name: string;
    score: number; // Path length
    timestamp: number;
}

// Function to read the leaderboard
async function getLeaderboard(): Promise<ScoreEntry[]> {
    try {
        const fileContent = await fs.readFile(leaderboardFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // Agar file nahi hai ya error hai, toh empty array return karo
        return [];
    }
}

// GET handler - Leaderboard data bhejega
export async function GET() {
    const leaderboard = await getLeaderboard();
    // Scores ko sort karke bhejo (kam score behtar hai)
    leaderboard.sort((a, b) => a.score - b.score);
    return NextResponse.json(leaderboard);
}

// POST handler - Naya score add karega
export async function POST(request: Request) {
    try {
        const { name, score } = await request.json();

        if (!name || typeof score !== 'number') {
            return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
        }

        const newEntry: ScoreEntry = {
            name,
            score,
            timestamp: Date.now(),
        };

        const leaderboard = await getLeaderboard();
        leaderboard.push(newEntry);
        
        // Scores ko sort karo aur top 10 rakho
        leaderboard.sort((a, b) => a.score - b.score);
        const updatedLeaderboard = leaderboard.slice(0, 10);

        await fs.writeFile(leaderboardFilePath, JSON.stringify(updatedLeaderboard, null, 2));

        return NextResponse.json({ message: 'Score added successfully' }, { status: 201 });

    } catch (error) {
        console.error("Failed to update leaderboard:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}