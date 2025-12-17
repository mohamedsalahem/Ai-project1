import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "@fontsource/inter";

import { Maze3D } from "./components/game/Maze3D";
import { Ball } from "./components/game/Ball";
import { Camera } from "./components/game/Camera";
import { Lights } from "./components/game/Lights";
import { AlgorithmMenu } from "./components/ui/AlgorithmMenu";
import { GameOverlay } from "./components/ui/GameOverlay";

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{
          position: [0, 15, 12],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: "default"
        }}
      >
        <color attach="background" args={["#1a1a2e"]} />
        
        <Lights />
        
        <Suspense fallback={null}>
          <Maze3D />
          <Ball />
          <Camera />
        </Suspense>
      </Canvas>
      
      <AlgorithmMenu />
      <GameOverlay />
    </div>
  );
}

export default App;
