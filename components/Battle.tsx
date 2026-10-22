"use client";

import { useEffect, useRef } from "react";
import { Scene } from "@/features/battle/scene";

export function Battle() {
  const battleRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const battle = battleRef.current;
    if (!battle) return;

    const scene = new Scene(battle);
    scene.start();

    return () => {
      scene.stop();
    };
  }, []);

  return (
    <canvas
      ref={battleRef}
      width={1000}
      height={1000}
      className="bg-zinc-700 w-180 h-180"
    ></canvas>
  );
}
