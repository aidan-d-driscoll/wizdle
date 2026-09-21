import Position from "./position"
import Entity from "@/features/battle/entities/entity"
import Vector from "./vector"

export type moveOptions = {
    speed?: number,
    targetPosition?: Position | undefined,
    dt: number
}

export type entityOptions = {
    startingPosition: Position,
    image: HTMLImageElement,
    width: number,
    startingVelocity?: Vector
}

export type projectileOptions = entityOptions & {
    source: Entity;
    knockback: number;
    travelSpeed: number;
    startingVelocity: Vector;
}

export type spellOptions = {
    image: HTMLImageElement,
    knockback: number,
    castTime: number,
}