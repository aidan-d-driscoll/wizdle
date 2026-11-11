"use client";

import { useEffect, useRef } from "react";
import { Scene } from "@/features/grid_battle/scene";

export function GridBattle() {
  const battleRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const battle = battleRef.current;
    const grid = gridRef.current;
    if (!battle || !grid) return;

    const scene = new Scene(battle, grid);
    scene.start();

    return () => {
      scene.stop();
    };
  }, []);

  return (
    <div className="relative w-[1000px] h-[1000px] bg-slate-900">
      <canvas
        ref={gridRef}
        width={1000}
        height={1000}
        className="absolute inset-0 z-0 pointer-events-none"
      ></canvas>
      <canvas
        ref={battleRef}
        width={1000}
        height={1000}
        className="absolute inset-0 z-10 bg-transparent"
      ></canvas>
    </div>
  );
}
