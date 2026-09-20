import Entity from "@/features/battle/entities/entity";
import { getDistance } from "@/utilities/mathUtils";
import Spell from "../spells/spell";
import { moveOptions } from "@/types/options";
import { entityOptions } from "@/types/options";
import { events } from "../events/eventManager";
import Position from "@/types/position";

const CIRCLING_SPEED = 0.5

type wizardOptions = entityOptions & {
    spells: Spell[],
    speed: number
    moveTarget: Position
}

export class Wizard extends Entity{
    castTimers: number[] = [];
    spells: Spell[];
    moveTarget: Position;
    private speed: number;

    constructor(args: wizardOptions) {
        super(args)
        this.image = args.image;
        this.spells = args.spells;
        this.speed = args.speed;
        this.moveTarget = args.moveTarget
        for (const spell of this.spells){
            this.castTimers.push(0)
        }
    }

    move(args: moveOptions){
        args.speed = this.speed
        if (this.target && (Math.abs(getDistance(this.target.position, this.moveTarget)) < Math.abs(getDistance(this.position, this.moveTarget)))) {
            args.targetPosition = this.target.position
        } else {
            args.targetPosition = this.moveTarget
        }
        super.move(args)

        const dx = args.targetPosition.x - this.position.x;
        const dy = args.targetPosition.y - this.position.y;

        const distance = getDistance(args.targetPosition, this.position);

        const xCircleAmount = 1 - (Math.abs(dx)/(Math.abs(dx)+Math.abs(dy)))
        const yCircleAmount = 1 - xCircleAmount

        const xCircleDirection = -1 * Math.sign(dy)
        const yCircleDirection = Math.sign(dx)

        if (distance > 0) { // normalize direction
            this.xVel = this.xVel + (this.speed * xCircleDirection * xCircleAmount * CIRCLING_SPEED);
            this.yVel = this.yVel + (this.speed * yCircleDirection * yCircleAmount * CIRCLING_SPEED);
        }
    }

    collideWith(e: Entity){
        if (e instanceof Wizard){
            const dx = e.position.x - this.position.x;
            const dy = e.position.y - this.position.y;

            const distance = getDistance(e.position, this.position);
            const overlap = this.width - distance; // how much they overlap

            const dirX = dx / distance; // direction from obj1 to obj2
            const dirY = dy / distance;

            this.position.x -= dirX * overlap / 2; // push them apart equally
            this.position.y -= dirY * overlap / 2;

            e.position.x += dirX * overlap / 2;
            e.position.y += dirY * overlap / 2;
        }
    }

    update(dt: number){
        super.update(dt)
        if (!this.dead && Math.abs(getDistance(this.position, this.moveTarget)) > 1) { this.dead = true}
        if (this.target && this.target.dead){
            this.target.position.x = (Math.random() * 2) - 1
            this.target.position.y = (Math.random() * 2) - 1
            this.speed = 0.5
        }
        if (this.target) {
            for(let i = 0; i < this.castTimers.length; i++){
                this.castTimers[i] += dt
                if (this.castTimers[i] >= this.spells[i].castTime){
                    events.emit("castSpell", {spell: this.spells[i], caster: this})
                    this.castTimers[i] -= this.spells[i].castTime
                }
            }
        }
        
    }

    // moveToward(targetPosition: Position) {
    //     const dx = targetPosition.x - this.position.x;
    //     const dy = targetPosition.y - this.position.y;

    //     const distance = getDistance(targetPosition, this.position);
    //     //const distance = Math.sqrt(Math.sqrt(dx * dx + dy * dy))

    //     const xCircleAmount = 1 - (Math.abs(dx)/(Math.abs(dx)+Math.abs(dy)))
    //     const yCircleAmount = 1 - xCircleAmount

    //     const xCircleDirection = -1 * Math.sign(dy)
    //     const yCircleDirection = Math.sign(dx)

    //     if (distance > 0) { // normalize direction
    //         this.xVel = dx / distance / 4 * this.speed + (this.speed * xCircleDirection * xCircleAmount * CIRCLING_SPEED);
    //         this.yVel = dy / distance / 4 * this.speed + (this.speed * yCircleDirection * yCircleAmount * CIRCLING_SPEED);
    //     }
    // }
}