import Entity from "./entity";
import { projectileOptions } from "@/types/options";
import { Wizard } from "./wizard";
import Vector from "@/types/vector";
import { events } from "../events/eventManager";

export class Projectile extends Entity{
    knockback: Vector;
    source: Entity;
    damage: number;

    constructor(args: projectileOptions){
        args.frictionless = true
        super(args)
        this.source = args.source

        this.knockback = new Vector({dx: this.velocity.dx, dy: this.velocity.dy, magnitude: args.knockback})
        this.damage = args.damage
    }

    collideWith(e: Entity): void {
        if (e instanceof Wizard && e !== this.source){
            e.applyForce(this.knockback)
            e.takeDamage(this.damage)
            events.emit("takeDamage", {damage: this.damage, target: e})
            this.dead = true;
        }
    }
}