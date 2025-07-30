'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCw, Trophy } from 'lucide-react'; 
import { bfs, getNodesInShortestPathOrder } from './algorithms/bfs';

// --- Interfaces ---
interface Node {
    row: number;
    col: number;
    isStart: boolean;
    isFinish: boolean;
    isWall: boolean;
    distance: number;
    isVisited: boolean;
    previousNode: Node | null;
}

interface ScoreEntry {
    name: string;
    score: number;
}

// --- Constants ---
const GRID_ROWS = 20;
const GRID_COLS = 35;
const START_NODE_ROW = 10, START_NODE_COL = 5;
const FINISH_NODE_ROW = 10, FINISH_NODE_COL = 29;

// --- Leaderboard Component ---
const Leaderboard = ({ scores }: { scores: ScoreEntry[] }) => (
    <div className="w-full md:w-64 md:ml-8 mt-8 md:mt-0 p-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-xl font-bold text-primary flex items-center gap-2"><Trophy /> Leaderboard</h3>
        <ol className="list-decimal list-inside mt-2 space-y-1">
            {scores.length > 0 ? scores.map((entry, index) => (
                <li key={index} className="text-sm flex justify-between">
                    <span>{entry.name}</span>
                    <span className="font-bold">{entry.score} steps</span>
                </li>
            )) : <p className="text-gray-400">Be the first to score!</p>}
        </ol>
    </div>
);

// --- Main Game Component ---
const AlgoRhythmSection = () => {
    const [grid, setGrid] = useState<Node[][]>([]);
    const [isMousePressed, setIsMousePressed] = useState(false);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [leaderboardScores, setLeaderboardScores] = useState<ScoreEntry[]>([]); 
    const [pathFound, setPathFound] = useState(false);
    const [score, setScore] = useState(0);

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchLeaderboard();
        const initialGrid = createInitialGrid();
        setGrid(initialGrid);
    }, []);

    useEffect(() => {
        if (pathFound && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [pathFound]);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('/api/gamezone/leaderboard');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setLeaderboardScores(data); 
        } catch (error) {
            console.error("Failed to fetch leaderboard", error);
        }
    };
    
    const createInitialGrid = (): Node[][] => {
        const grid: Node[][] = [];
        for (let row = 0; row < GRID_ROWS; row++) {
            const currentRow: Node[] = [];
            for (let col = 0; col < GRID_COLS; col++) {
                currentRow.push(createNode(row, col));
            }
            grid.push(currentRow);
        }
        return grid;
    };
    
    const createNode = (row: number, col: number): Node => ({
        row, col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        isWall: false, distance: Infinity, isVisited: false, previousNode: null,
    });

    const handleMouseDown = (row: number, col: number) => {
        if (isVisualizing) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
        setIsMousePressed(true);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (!isMousePressed || isVisualizing) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
    };

    const handleMouseUp = () => setIsMousePressed(false);
    
    const getNewGridWithWallToggled = (grid: Node[][], row: number, col: number): Node[][] => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        if (node.isStart || node.isFinish) return newGrid;
        const newNode = { ...node, isWall: !node.isWall };
        newGrid[row][col] = newNode;
        return newGrid;
    };

    const animateShortestPath = (nodesInShortestPathOrder: Node[]) => {
        if (nodesInShortestPathOrder.length === 0) {
            setIsVisualizing(false);
            return;
        }
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
                if (nodeElement) nodeElement.classList.add('node-shortest-path');
            }, 50 * i);
        }
        setTimeout(() => setIsVisualizing(false), 50 * nodesInShortestPathOrder.length);
        
        setScore(nodesInShortestPathOrder.length);
        setPathFound(true);
    };

    const visualizeBfs = () => {
        if (isVisualizing) return;
        setIsVisualizing(true);
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = bfs(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => animateShortestPath(nodesInShortestPathOrder), 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
                if (nodeElement) nodeElement.classList.add('node-visited');
            }, 10 * i);
        }
    };

    const handleReset = () => {
        if (isVisualizing) return;
        for (const row of grid) {
            for (const node of row) {
                const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
                if (nodeElement) nodeElement.classList.remove('node-visited', 'node-shortest-path');
            }
        }
        const newGrid = createInitialGrid();
        setGrid(newGrid);
        setPathFound(false);
        setScore(0);
    };

    const submitScore = async (e: React.FormEvent) => {
        e.preventDefault();
        const playerName = (e.target as HTMLFormElement).playerName.value;
        if (!playerName || !score) return;

        await fetch('/api/gamezone/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName, score }),
        });
        
        handleReset();
        fetchLeaderboard();
    };

    return (
        <div className="flex flex-col md:flex-row items-start justify-center w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
            >
                <h2 className="text-3xl font-bold mb-4">AlgoRhythm Pathfinding</h2>
                
                <div className="h-12 flex items-center mb-4">
                    {pathFound ? (
                        <form onSubmit={submitScore} className="flex gap-2">
                            <input 
                                ref={nameInputRef}
                                name="playerName" 
                                className="px-2 py-1 bg-gray-700 rounded" 
                                placeholder="Enter your name" 
                                required 
                            />
                            <button type="submit" className="px-4 py-1 bg-primary text-white rounded">Submit Score: {score}</button>
                        </form>
                    ) : (
                        <div className="flex gap-4">
                            <button onClick={visualizeBfs} disabled={isVisualizing} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-800 disabled:cursor-not-allowed">
                                <Play className="w-5 h-5"/> Visualize BFS
                            </button>
                            <button onClick={handleReset} disabled={isVisualizing} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-800">
                                <RotateCw className="w-5 h-5"/> Reset Board
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid border-2 border-gray-600" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
                    {grid.map((row, rowIndex) => (
                        row.map((node, nodeIndex) => {
                            const { row, col, isStart, isFinish, isWall } = node;
                            return (
                                <div
                                    key={`${rowIndex}-${nodeIndex}`}
                                    id={`node-${row}-${col}`}
                                    className={`w-5 h-5 md:w-6 md:h-6 border-t border-r border-gray-800 ${isStart ? 'bg-green-500' : ''} ${isFinish ? 'bg-red-500' : ''} ${isWall ? 'bg-gray-500' : ''}`}
                                    onMouseDown={() => handleMouseDown(row, col)}
                                    onMouseEnter={() => handleMouseEnter(row, col)}
                                    onMouseUp={handleMouseUp}
                                ></div>
                            );
                        })
                    ))}
                </div>
                <p className="mt-4 text-gray-400">Click and drag on the grid to create walls.</p>
            </motion.div>

            <Leaderboard scores={leaderboardScores} />
        </div>
    );
};

export default AlgoRhythmSection;