import Vector from "@/types/vector";
import { Projectile } from "./projectile";
import { moveOptions, projectileOptions } from "@/types/options";

type boltOptions = projectileOptions & {
    travelSpeed: number
}

export class Bolt extends Projectile {
    travelSpeed: number;

    constructor(args: boltOptions) {
        super(args)
        this.travelSpeed = args.travelSpeed;

        this.velocity = new Vector({startPos: this.position, endPos: this.target.position});
        this.velocity.magnitude = this.travelSpeed;
    }
}


