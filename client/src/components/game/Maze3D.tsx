import { useMemo } from "react";
import * as THREE from "three";
import { useMaze } from "@/lib/stores/useMaze";

const CELL_SIZE = 1;
const WALL_HEIGHT = 1;

export function Maze3D() {
  const { maze, mazeWidth, mazeHeight } = useMaze();
  
  const offsetX = -(mazeWidth * CELL_SIZE) / 2 + CELL_SIZE / 2;
  const offsetZ = -(mazeHeight * CELL_SIZE) / 2 + CELL_SIZE / 2;
  
  const { walls, floor, startMarker, endMarker, pathCells, visitedCells } = useMemo(() => {
    const wallsArr: { x: number; z: number }[] = [];
    const pathArr: { x: number; z: number }[] = [];
    const visitedArr: { x: number; z: number }[] = [];
    let startPos = { x: 0, z: 0 };
    let endPos = { x: 0, z: 0 };
    
    for (let z = 0; z < mazeHeight; z++) {
      for (let x = 0; x < mazeWidth; x++) {
        const cell = maze[z][x];
        if (cell.isWall) {
          wallsArr.push({ x, z });
        }
        if (cell.isStart) {
          startPos = { x, z };
        }
        if (cell.isEnd) {
          endPos = { x, z };
        }
        if (cell.isPath && !cell.isStart && !cell.isEnd) {
          pathArr.push({ x, z });
        }
        if (cell.isVisited && !cell.isPath && !cell.isStart && !cell.isEnd && !cell.isWall) {
          visitedArr.push({ x, z });
        }
      }
    }
    
    return {
      walls: wallsArr,
      floor: { width: mazeWidth * CELL_SIZE, height: mazeHeight * CELL_SIZE },
      startMarker: startPos,
      endMarker: endPos,
      pathCells: pathArr,
      visitedCells: visitedArr,
    };
  }, [maze, mazeWidth, mazeHeight]);
  
  return (
    <group>
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[floor.width, floor.height]} />
        <meshStandardMaterial color="#2a2a3a" />
      </mesh>
      
      {walls.map((wall, idx) => (
        <mesh
          key={`wall-${idx}`}
          position={[
            wall.x * CELL_SIZE + offsetX,
            WALL_HEIGHT / 2,
            wall.z * CELL_SIZE + offsetZ
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[CELL_SIZE * 0.95, WALL_HEIGHT, CELL_SIZE * 0.95]} />
          <meshStandardMaterial color="#4a4a5a" />
        </mesh>
      ))}
      
      {visitedCells.map((cell, idx) => (
        <mesh
          key={`visited-${idx}`}
          position={[
            cell.x * CELL_SIZE + offsetX,
            0.02,
            cell.z * CELL_SIZE + offsetZ
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[CELL_SIZE * 0.9, CELL_SIZE * 0.9]} />
          <meshStandardMaterial color="#ff6b6b" transparent opacity={0.4} />
        </mesh>
      ))}
      
      {pathCells.map((cell, idx) => (
        <mesh
          key={`path-${idx}`}
          position={[
            cell.x * CELL_SIZE + offsetX,
            0.03,
            cell.z * CELL_SIZE + offsetZ
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[CELL_SIZE * 0.9, CELL_SIZE * 0.9]} />
          <meshStandardMaterial color="#4ecdc4" transparent opacity={0.6} />
        </mesh>
      ))}
      
      <mesh
        position={[
          startMarker.x * CELL_SIZE + offsetX,
          0.05,
          startMarker.z * CELL_SIZE + offsetZ
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[CELL_SIZE * 0.4, 32]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      
      <mesh
        position={[
          endMarker.x * CELL_SIZE + offsetX,
          0.05,
          endMarker.z * CELL_SIZE + offsetZ
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[CELL_SIZE * 0.4, 32]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}
