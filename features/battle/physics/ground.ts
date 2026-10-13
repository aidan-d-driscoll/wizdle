import { Position } from "@/types/position";
import { GameObject, ObjectOptions } from "../entities/gameObject";
import { CollisionBody } from "../collisions/collisionBody";
import { UpdateOptions } from "../scene";

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
}

export class GroundManager{
    groundTextures: GroundTexture[] = [];
    dirtyQueue: GameObject[] = [];

    add(gt: GroundTexture){
        this.groundTextures.push(gt)
    }

    remove(gt: GroundTexture){
        const idx = this.groundTextures.indexOf(gt)
        if(idx > -1){ this.groundTextures.splice(idx, 1) }
    }

    update(args: UpdateOptions){
        for (const obj of this.dirtyQueue){
            obj.ground = this.highestGroundAt(obj.position)
        }

        this.dirtyQueue.length = 0
    }

    highestGroundAt(position: Position): GroundTexture | null{
        for(let i = this.groundTextures.length-1; i >= 0; i--){
            if (this.groundTextures[i].cb?.tight.contains(position)) {
                return this.groundTextures[i];
            }  
        }
        return null
    }

    markDirty(obj: GameObject){
        this.dirtyQueue.push(obj)
    }
}