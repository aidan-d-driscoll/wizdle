"use client"

import { useEffect, useRef } from "react"
import { GameEngine } from "./GameEngine"

export function Game() {
    const gameRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const game = gameRef.current
        if (!game) return

        const engine = new GameEngine(game)
        engine.start()

        return () => {
            engine.stop()
        }
    })

    return <canvas ref={gameRef} className="bg-zinc-700 w-120 h-120"></canvas>
}