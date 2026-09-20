"use client";

import { useEffect, useRef } from "react";
import { Engine } from "./engine";

export function Battle() {
  const battleRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const battle = battleRef.current;
    if (!battle) return;

    const engine = new Engine(battle);
    engine.start();

    return () => {
      engine.stop();
    };
  }, []);

  return (
    <canvas
      ref={battleRef}
      width={1000}
      height={1000}
      className="bg-zinc-700 w-120 h-120"
    ></canvas>
  );
}
