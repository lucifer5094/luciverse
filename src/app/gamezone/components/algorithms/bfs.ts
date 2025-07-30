// src/app/gamezone/components/algorithms/bfs.ts

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

// Breadth-First Search Algorithm
export function bfs(grid: Node[][], startNode: Node, finishNode: Node): Node[] {
    const visitedNodesInOrder: Node[] = [];
    let queue: Node[] = [];
    queue.push(startNode);
    startNode.isVisited = true;

    while (queue.length > 0) {
        const currentNode = queue.shift()!; // queue se pehla element nikalo
        visitedNodesInOrder.push(currentNode);

        if (currentNode === finishNode) return visitedNodesInOrder;

        const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of unvisitedNeighbors) {
            neighbor.isVisited = true;
            neighbor.previousNode = currentNode;
            queue.push(neighbor);
        }
    }
    return visitedNodesInOrder; // Agar path na mile
}

function getUnvisitedNeighbors(node: Node, grid: Node[][]): Node[] {
    const neighbors: Node[] = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

// Shortest path ko trace back karta hai
export function getNodesInShortestPathOrder(finishNode: Node): Node[] {
    const nodesInShortestPathOrder: Node[] = [];
    let currentNode: Node | null = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}