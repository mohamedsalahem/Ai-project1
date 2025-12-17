import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMaze } from "@/lib/stores/useMaze";

const CELL_SIZE = 1;

export function Camera() {
  const { camera } = useThree();
  const { ballPosition, mazeWidth, mazeHeight, phase } = useMaze();
  
  const offsetX = -(mazeWidth * CELL_SIZE) / 2 + CELL_SIZE / 2;
  const offsetZ = -(mazeHeight * CELL_SIZE) / 2 + CELL_SIZE / 2;
  
  const targetPosRef = useRef(new THREE.Vector3());
  const targetLookRef = useRef(new THREE.Vector3());
  
  useFrame(() => {
    if (phase === "moving") {
      const ballX = ballPosition.x * CELL_SIZE + offsetX;
      const ballZ = ballPosition.z * CELL_SIZE + offsetZ;
      
      targetPosRef.current.set(ballX, 8, ballZ + 8);
      targetLookRef.current.set(ballX, 0, ballZ);
      
      camera.position.lerp(targetPosRef.current, 0.05);
      
      const currentLook = new THREE.Vector3();
      camera.getWorldDirection(currentLook);
      currentLook.add(camera.position);
      currentLook.lerp(targetLookRef.current, 0.05);
      camera.lookAt(targetLookRef.current);
    } else {
      camera.position.set(0, 15, 12);
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
}
