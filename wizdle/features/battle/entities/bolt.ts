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
        this.target = args.target;

        this.xVel = this.xDir * this.travelSpeed
        this.yVel = this.yDir * this.travelSpeed

    }

    move(args: moveOptions): void{}
}


