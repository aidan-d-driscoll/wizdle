import Position from "@/types/position";
import { CollisionBody } from "./collisionBody";
import Vector from "@/types/vector";

export interface Collidable{
    id:number;
    position:Position;
    physics:boolean;
    velocity:Vector;

    onCollisionEnter?(other: Collidable): void;
    onCollisionStay?(other: Collidable): void;
    onCollisionExit?(other: Collidable): void;
}