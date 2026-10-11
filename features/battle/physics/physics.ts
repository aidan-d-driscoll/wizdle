import Vector from "@/types/vector";
import { Ground } from "../collisions/ground";

export interface Physics {
    id: number
    flying: boolean
    forces: Vector

    grounds: Ground[]

    applyForce(newForce: Vector): void;
}