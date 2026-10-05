import Position from "@/types/position";

export interface Collidable{
    id:number;
    position:Position;
    physics:boolean;

    onCollisionEnter?(other: Collidable): void;
    onCollisionStay?(other: Collidable): void;
    onCollisionExit?(other: Collidable): void;
}