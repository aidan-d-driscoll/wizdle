export interface Collidable{
    id:number;

    onCollisionEnter?(other: Collidable): void;
    onCollisionStay?(other: Collidable): void;
    onCollisionExit?(other: Collidable): void;
}