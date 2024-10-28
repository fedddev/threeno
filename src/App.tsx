import "./App.css";
// // @deno-types="@types/react"
import { useRef, useState, useEffect } from "react";
// @deno-types="@types/three"
import { Color, Mesh } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
// // @ts-expect-error Unable to infer type at the moment
// import reactLogo from "./assets/react.svg";

const App = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, 5]} />
      <Scene />
    </Canvas>
  );
};

const Scene = () => {
  const { result, sendMessageToWorker } = useHelloWorker();
  const cubeMesh = useRef<Mesh>();
  useFrame(({ clock }) => {
    cubeMesh.current.rotation.y = clock.getElapsedTime() / 2;
  });
  useEffect(() => {
    console.log("clicked", result, "times");
  }, [result]);
  return (
    <mesh ref={cubeMesh} onClick={() => sendMessageToWorker(result)}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color={new Color("red")} />
    </mesh>
  );
};

const useHelloWorker = () => {
  const [result, setResult] = useState<number>(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./workers/worker_one.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current.onmessage = (event: MessageEvent) => {
      setResult(event.data);
    };

    return () => {
      workerRef.current?.terminate();
    };
  });

  const sendMessageToWorker = (num: number) => {
    workerRef.current?.postMessage(num);
  };
  return { result, sendMessageToWorker };
};

export default App;
