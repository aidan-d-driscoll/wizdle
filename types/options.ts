import Position from "./position"
import Entity, {entityOptions} from "@/features/battle/entities/entity"
import Vector from "./vector"

export type moveOptions = {
    speed?: number,
    targetPosition?: Position | undefined,
    dt: number
}