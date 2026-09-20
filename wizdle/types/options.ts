import Position from "./position"
import Entity from "@/features/battle/entities/entity"

export type moveOptions = {
    speed?: number,
    targetPosition?: Position | undefined,
    dt: number
}

export type entityOptions = {
    startingPosition: Position,
    image: HTMLImageElement,
    width: number,
    xVel?: number,
    yVel?: number,
    target?: Entity | null
}

export type projectileOptions = entityOptions & {
    source: Entity;
    knockback: number;
    target: Entity;
}

export type spellOptions = {
    image: HTMLImageElement,
    knockback: number,
    castTime: number,
}