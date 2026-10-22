import { Position } from "@/features/battle/types/position";
import { Collider, ColliderOptions } from "../Collider";
import { UpdateOptions } from "../../scene";

export type GroundTextureOptions = ColliderOptions & {
    friction: number;
}

export class GroundTexture extends Collider{
    friction: number;

    constructor(args: GroundTextureOptions){
        super(args);

        this.friction = args.friction;
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

    update(args: UpdateOptions){
        for (const body of args.scene.dirtyColliders){
            body.parent.ground = this.highestGroundAt(body.position)
        }
    }

    highestGroundAt(position: Position): GroundTexture | null{
        for(let i = this.groundTextures.length-1; i >= 0; i--){
            if (this.groundTextures[i].tight.contains(position)) {
                return this.groundTextures[i];
            }  
        }
        return null
    }
}