import Entity from "@/features/battle/entities/entity";
import { getDistance } from "@/utilities/mathUtils";
import Spell from "../spells/spell";
import { moveOptions } from "@/types/options";
import { entityOptions } from "@/types/options";
import { events } from "../events/eventManager";
import Position from "@/types/position";
import Vector from "@/types/vector";

const CIRCLING_SPEED = 0.9

type wizardOptions = entityOptions & {
    spells: Spell[],
    speed: number,
    prefferedPosition: Position,
    attackTarget?: Wizard
}

export class Wizard extends Entity{
    castTimers: number[] = [];
    spells: Spell[];
    attackTarget: Wizard | null = null;
    prefferedPosition: Position;
    moveTarget: Position;
    private _circling = false;
    private _speed: number;

    constructor(args: wizardOptions) {
        super(args)
        this.spells = args.spells;
        this._speed = args.speed;
        if (args.attackTarget) this.attackTarget = args.attackTarget;
        this.prefferedPosition = args.prefferedPosition; 
        this.moveTarget = this.prefferedPosition;
        this.velocity = new Vector({startPos: this.position, endPos: this.moveTarget, magnitude: this._speed})
        for (const spell of this.spells){
            this.castTimers.push(0)
        }
    }

    move(args: moveOptions): void{
        this.moveTarget = this.prefferedPosition;
        this._circling = false;

        if (this.attackTarget && (Math.abs(getDistance({from: this.attackTarget.position, to:this.prefferedPosition})) < Math.abs(getDistance({from: this.position, to:this.prefferedPosition})))) {
            this.moveTarget = this.attackTarget.position;
            this._circling = true;
        }

        this.velocity = new Vector({startPos: this.position, endPos: this.moveTarget, magnitude: this._speed})

        if (this._circling){
            this.velocity = new Vector({
                dx: this.velocity.dx + (-1 * CIRCLING_SPEED * this.velocity.dy),
                dy: this.velocity.dy + (CIRCLING_SPEED * this.velocity.dx),
                magnitude: this._speed
            })
        }
    }

    collideWith(e: Entity){
        if (e instanceof Wizard){
            const dx = e.x - this.x;
            const dy = e.y - this.y;

            const distance = getDistance({from:e.position, to:this.position});
            const overlap = this.width - distance; // how much they overlap

            const dirX = dx / distance; // direction from obj1 to obj2
            const dirY = dy / distance;

            this.x -= dirX * overlap / 2; // push them apart equally
            this.y -= dirY * overlap / 2;

            e.x += dirX * overlap / 2;
            e.y += dirY * overlap / 2;
        }
    }

    update(dt: number){
        super.update(dt)
        if (!this.dead && Math.abs(getDistance({from: this.position, to: this.prefferedPosition})) > 1) { this.dead = true}
        if (!this.attackTarget?.dead) {
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
    //     const dx = targetPosition.x - this.x;
    //     const dy = targetPosition.y - this.y;

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