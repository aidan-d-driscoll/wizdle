import { Position } from "@/types/position";
import { GameObject, ObjectOptions } from "../entities/gameObject";
import { CollisionBody } from "../collisions/collisionBody";

export type GroundTextureOptions = ObjectOptions & {
    friction: number;

    cb: CollisionBody;
}

export class GroundTexture extends GameObject{
    friction: number;

    constructor(args: GroundTextureOptions){
        super(args);

        this._cb = args.cb;

        this.friction = args.friction;
    }

    onCollisionEnter(other: GameObject): void {
        if (other.physics) {
            other.findNewGround()
        }
    }

    onCollisionExit(other: GameObject): void {
        if (other.physics) {
            other.findNewGround()
        }
    }
}

export class GroundManager{
    groundTextures: GroundTexture[] = [];

    add(gt: GroundTexture){
        this.groundTextures.push(gt)
    }

    remove(gt: GroundTexture){
        const idx = this.groundTextures.indexOf(gt)
        if(idx > -1){ this.groundTextures.splice(idx, 1) }
    }

    highestGroundAt(position: Position): GroundTexture | null {
        for(let i = this.groundTextures.length-1; i >= 0; i--){
            if (this.groundTextures[i].cb?.tight.contains(position)) return this.groundTextures[i]
        }
        return null;
    }
}