import Entity, {entityOptions} from "@/features/battle/entities/entity";
import { Wizard } from "@/features/battle/entities/wizard";
import Vector from "@/types/vector";
import { Collidable } from "../../collisions/collidable";
import { CollisionBody } from "../../collisions/collisionBody";
import { Circle } from "@/types/shapes/circle";
import { Sprite } from "../../rendering/sprite";

export type projectileOptions = entityOptions & {
    source: Entity;
    knockback: number;
    travelSpeed: number;
    startingVelocity: Vector;
    damage: number;
    sprite: Sprite;
}

export class Projectile extends Entity{
    knockback: Vector;
    source: Entity;
    damage: number;

    constructor(args: projectileOptions){
        super(args)
        this.sprite = args.sprite;
        this.physics = false;

        this.source = args.source

        this.collisionBody = new CollisionBody({
            owner: this,
            tight: new Circle({
                startingPosition: this.source.position,
                radius: 0.04
            })
        })

        this.knockback = new Vector({dx: this.velocity.dx, dy: this.velocity.dy, magnitude: args.knockback})
        this.damage = args.damage
    }

    onCollisionEnter(other: Collidable){
        if (other instanceof Wizard && other !== this.source){
            console.log("WIZARD HIT")
            other.applyForce(this.knockback)
            other.takeDamage(this.damage)
            this.engine.markForDestruction(this)
        }
    }
}