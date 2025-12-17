import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type Algorithm = "astar" | "bfs" | "dfs" | "ucs" | "ids";
export type GamePhase = "menu" | "solving" | "moving" | "completed";

export interface Position {
  x: number;
  z: number;
}

export interface MazeCell {
  x: number;
  z: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPath: boolean;
  isVisited: boolean;
}

interface MazeState {
  phase: GamePhase;
  selectedAlgorithm: Algorithm | null;
  maze: MazeCell[][];
  mazeWidth: number;
  mazeHeight: number;
  startPos: Position;
  endPos: Position;
  path: Position[];
  visitedCells: Position[];
  ballPosition: Position;
  pathIndex: number;
  
  setAlgorithm: (algo: Algorithm) => void;
  startGame: () => void;
  setPath: (path: Position[]) => void;
  setVisitedCells: (cells: Position[]) => void;
  startMoving: () => void;
  moveBall: () => boolean;
  complete: () => void;
  restart: () => void;
  generateMaze: () => void;
}

const MAZE_WIDTH = 15;
const MAZE_HEIGHT = 15;

function createMaze(): { maze: MazeCell[][], start: Position, end: Position } {
  const maze: MazeCell[][] = [];
  
  for (let z = 0; z < MAZE_HEIGHT; z++) {
    maze[z] = [];
    for (let x = 0; x < MAZE_WIDTH; x++) {
      maze[z][x] = {
        x,
        z,
        isWall: false,
        isStart: false,
        isEnd: false,
        isPath: false,
        isVisited: false,
      };
    }
  }
  
  for (let x = 0; x < MAZE_WIDTH; x++) {
    maze[0][x].isWall = true;
    maze[MAZE_HEIGHT - 1][x].isWall = true;
  }
  for (let z = 0; z < MAZE_HEIGHT; z++) {
    maze[z][0].isWall = true;
    maze[z][MAZE_WIDTH - 1].isWall = true;
  }
  
  const walls = [
    [2, 1], [2, 2], [2, 3], [2, 5], [2, 6], [2, 7], [2, 9], [2, 10], [2, 11],
    [4, 3], [4, 4], [4, 5], [4, 7], [4, 8], [4, 9], [4, 11], [4, 12], [4, 13],
    [5, 3], [5, 9],
    [6, 1], [6, 3], [6, 5], [6, 6], [6, 7], [6, 9], [6, 11],
    [7, 5], [7, 11],
    [8, 1], [8, 2], [8, 3], [8, 5], [8, 7], [8, 8], [8, 9], [8, 11], [8, 12], [8, 13],
    [9, 7],
    [10, 1], [10, 2], [10, 3], [10, 5], [10, 6], [10, 7], [10, 9], [10, 10], [10, 11],
    [11, 3], [11, 9],
    [12, 3], [12, 5], [12, 6], [12, 7], [12, 9], [12, 11], [12, 12], [12, 13],
  ];
  
  walls.forEach(([z, x]) => {
    if (z < MAZE_HEIGHT && x < MAZE_WIDTH) {
      maze[z][x].isWall = true;
    }
  });
  
  const start: Position = { x: 1, z: 1 };
  const end: Position = { x: MAZE_WIDTH - 2, z: MAZE_HEIGHT - 2 };
  
  maze[start.z][start.x].isStart = true;
  maze[start.z][start.x].isWall = false;
  maze[end.z][end.x].isEnd = true;
  maze[end.z][end.x].isWall = false;
  
  return { maze, start, end };
}

const initialMaze = createMaze();

export const useMaze = create<MazeState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    selectedAlgorithm: null,
    maze: initialMaze.maze,
    mazeWidth: MAZE_WIDTH,
    mazeHeight: MAZE_HEIGHT,
    startPos: initialMaze.start,
    endPos: initialMaze.end,
    path: [],
    visitedCells: [],
    ballPosition: initialMaze.start,
    pathIndex: 0,
    
    setAlgorithm: (algo) => set({ selectedAlgorithm: algo }),
    
    startGame: () => {
      const state = get();
      if (state.selectedAlgorithm) {
        set({ phase: "solving" });
      }
    },
    
    setPath: (path) => {
      const { maze } = get();
      const newMaze = maze.map(row => row.map(cell => ({ ...cell, isPath: false })));
      path.forEach(pos => {
        if (newMaze[pos.z] && newMaze[pos.z][pos.x]) {
          newMaze[pos.z][pos.x].isPath = true;
        }
      });
      set({ path, maze: newMaze });
    },
    
    setVisitedCells: (cells) => {
      const { maze } = get();
      const newMaze = maze.map(row => row.map(cell => ({ ...cell, isVisited: false })));
      cells.forEach(pos => {
        if (newMaze[pos.z] && newMaze[pos.z][pos.x]) {
          newMaze[pos.z][pos.x].isVisited = true;
        }
      });
      set({ visitedCells: cells, maze: newMaze });
    },
    
    startMoving: () => set({ phase: "moving", pathIndex: 0 }),
    
    moveBall: () => {
      const { path, pathIndex } = get();
      if (pathIndex < path.length) {
        set({ 
          ballPosition: path[pathIndex], 
          pathIndex: pathIndex + 1 
        });
        return true;
      }
      return false;
    },
    
    complete: () => set({ phase: "completed" }),
    
    restart: () => {
      const newMaze = createMaze();
      set({
        phase: "menu",
        selectedAlgorithm: null,
        maze: newMaze.maze,
        startPos: newMaze.start,
        endPos: newMaze.end,
        path: [],
        visitedCells: [],
        ballPosition: newMaze.start,
        pathIndex: 0,
      });
    },
    
    generateMaze: () => {
      const newMaze = createMaze();
      set({
        maze: newMaze.maze,
        startPos: newMaze.start,
        endPos: newMaze.end,
        ballPosition: newMaze.start,
        path: [],
        visitedCells: [],
        pathIndex: 0,
      });
    },
  }))
);
