import Entity from "@/features/battle/entities/entity";
import { getDistance, setOptionalRandomNumber } from "@/utilities/mathUtils";
import Spell from "../spells/spell";
import { moveOptions } from "@/types/options";
import { entityOptions } from "@/types/options";
import { events } from "../events/eventManager";
import Position from "@/types/position";
import Vector from "@/types/vector";

const CIRCLING_SPEED = 1.2

const MIN_MAX_HP = 30
const MAX_MAX_HP = 300

const MIN_SPEED = 0.25
const MAX_SPEED = 0.44

type wizardOptions = entityOptions & {
    spells: Spell[],
    speed?: number,
    prefferedPosition: Position,
    attackTarget?: Wizard,
    maxHitPoints?: number
    name: string
}

export class Wizard extends Entity{
    castTimers: number[] = [];
    spells: Spell[];
    attackTarget: Wizard | null = null;
    prefferedPosition: Position;
    moveTarget: Position;
    private _circling = false;
    private _speed: number;

    name: string;

    private _maxHitPoints: number;
    private _currentHitPoints: number;

    constructor(args: wizardOptions) {
        super(args)
        this.spells = args.spells;
        this._speed = setOptionalRandomNumber({value: args.speed, min: MIN_SPEED, max: MAX_SPEED})
        if (args.attackTarget) this.attackTarget = args.attackTarget;
        this.prefferedPosition = args.prefferedPosition; 
        this.moveTarget = this.prefferedPosition;
        this.velocity = new Vector({startPos: this.position, endPos: this.moveTarget, magnitude: this._speed})
        for (const spell of this.spells){
            this.castTimers.push(0)
        }

        this._maxHitPoints = setOptionalRandomNumber({value: args.maxHitPoints, min: MIN_MAX_HP, max: MAX_MAX_HP})
        this._currentHitPoints = this._maxHitPoints;

        this.name = args.name;

        events.on("takeDamage", ({damage, target}) => {
            this.logHP()
        })

        console.log(this.toString())

    }

    move(args: moveOptions): void{
        this.moveTarget = this.prefferedPosition;
        this._circling = false;

        if (this.attackTarget && (Math.abs(getDistance({from: this.attackTarget.position, to:this.prefferedPosition})) < Math.abs(getDistance({from: this.position, to:this.prefferedPosition})))) {
            this.moveTarget = this.attackTarget.position;
            this._circling = true;
        }
        if (Math.abs(getDistance({from: this.position, to: this.moveTarget})) > 0.1){
            this.velocity = new Vector({startPos: this.position, endPos: this.moveTarget, magnitude: this._speed})

            if (this._circling){
                this.velocity = new Vector({
                    dx: this.velocity.dx + this.velocity.dy * -1 * CIRCLING_SPEED,
                    dy: this.velocity.dy + this.velocity.dx * CIRCLING_SPEED,
                    magnitude: this._speed
                })
            }
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
        if (!this.dead && (Math.abs(getDistance({from: this.position, to: this.prefferedPosition})) > 1 || this._currentHitPoints <= 0)) { this.dead = true}
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

    takeDamage(dmg: number) {
        this._currentHitPoints -= dmg
    }

    toString(){
        let out = this.name + "\n > Max HP = " + this._maxHitPoints + "\n > speed: " + this._speed + "\n > spells:"
        for(const spell of this.spells)
            out += "\n   > " +spell.toString()
        return out
    }

    logHP(){
        console.log(this.name + ": " + this._currentHitPoints)
    }
}