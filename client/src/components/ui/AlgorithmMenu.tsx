import { useMaze, Algorithm } from "@/lib/stores/useMaze";

const algorithms: { id: Algorithm; name: string; description: string }[] = [
  { id: "astar", name: "A* Search", description: "Uses heuristic to find optimal path efficiently" },
  { id: "bfs", name: "BFS", description: "Breadth-First Search - explores level by level" },
  { id: "dfs", name: "DFS", description: "Depth-First Search - explores as far as possible first" },
  { id: "ucs", name: "UCS", description: "Uniform Cost Search - finds lowest cost path" },
  { id: "ids", name: "IDS", description: "Iterative Deepening Search - combines DFS and BFS" },
];

export function AlgorithmMenu() {
  const { selectedAlgorithm, setAlgorithm, startGame, phase } = useMaze();
  
  if (phase !== "menu") return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Maze Pathfinder
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Select an algorithm to watch the ball navigate the maze
        </p>
        
        <div className="space-y-3 mb-6">
          {algorithms.map((algo) => (
            <button
              key={algo.id}
              onClick={() => setAlgorithm(algo.id)}
              className={`w-full p-4 rounded-lg text-left transition-all ${
                selectedAlgorithm === algo.id
                  ? "bg-blue-600 border-2 border-blue-400"
                  : "bg-gray-800 border-2 border-transparent hover:border-gray-600"
              }`}
            >
              <div className="font-semibold text-white">{algo.name}</div>
              <div className="text-sm text-gray-300">{algo.description}</div>
            </button>
          ))}
        </div>
        
        <button
          onClick={startGame}
          disabled={!selectedAlgorithm}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
            selectedAlgorithm
              ? "bg-green-600 hover:bg-green-500 text-white"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Start Solving
        </button>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span> Start
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> End
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Ball
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
