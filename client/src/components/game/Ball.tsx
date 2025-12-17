import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMaze } from "@/lib/stores/useMaze";

const CELL_SIZE = 1;
const BALL_RADIUS = 0.3;
const MOVE_SPEED = 3;

export function Ball() {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const currentPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastMoveTimeRef = useRef(0);
  
  const { 
    ballPosition, 
    phase, 
    path, 
    pathIndex,
    moveBall, 
    complete,
    mazeWidth,
    mazeHeight,
    startPos
  } = useMaze();
  
  const offsetX = -(mazeWidth * CELL_SIZE) / 2 + CELL_SIZE / 2;
  const offsetZ = -(mazeHeight * CELL_SIZE) / 2 + CELL_SIZE / 2;
  
  useEffect(() => {
    const x = startPos.x * CELL_SIZE + offsetX;
    const z = startPos.z * CELL_SIZE + offsetZ;
    currentPosRef.current.set(x, BALL_RADIUS, z);
    targetRef.current.set(x, BALL_RADIUS, z);
    if (meshRef.current) {
      meshRef.current.position.set(x, BALL_RADIUS, z);
    }
  }, [startPos, offsetX, offsetZ]);
  
  useEffect(() => {
    const x = ballPosition.x * CELL_SIZE + offsetX;
    const z = ballPosition.z * CELL_SIZE + offsetZ;
    targetRef.current.set(x, BALL_RADIUS, z);
  }, [ballPosition, offsetX, offsetZ]);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const current = currentPosRef.current;
    const target = targetRef.current;
    const distance = current.distanceTo(target);
    
    if (distance > 0.01) {
      const step = Math.min(MOVE_SPEED * delta, distance);
      current.lerp(target, step / distance);
      meshRef.current.position.copy(current);
      
      const rotationSpeed = step / BALL_RADIUS;
      meshRef.current.rotation.x += rotationSpeed;
    } else {
      current.copy(target);
      meshRef.current.position.copy(current);
      
      if (phase === "moving") {
        const now = state.clock.elapsedTime;
        if (now - lastMoveTimeRef.current > 0.15) {
          lastMoveTimeRef.current = now;
          const hasMore = moveBall();
          if (!hasMore && pathIndex >= path.length) {
            complete();
          }
        }
      }
    }
  });
  
  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
      <meshStandardMaterial 
        color="#ffcc00" 
        metalness={0.3} 
        roughness={0.4}
        emissive="#ffcc00"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}
