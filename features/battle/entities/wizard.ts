import Entity, { entityOptions } from "@/features/battle/entities/entity";
import { getDistance, setOptionalRandomNumber } from "@/utilities/mathUtils";
import Spell from "@/features/battle/spells/spell";
import Position from "@/types/position";
import Vector from "@/types/vector";
import { Collidable } from "../collisions/collidable";
import { CollisionBody } from "../collisions/collisionBody";
import { Circle } from "@/types/shapes/circle";
import { BoltSpell } from "../spells/boltSpell";
import { Sprite } from "../rendering/sprite";
import { Platform } from "../collisions/platform";

const CIRCLING_SPEED = 1.2

const MIN_MAX_HP = 200
const MAX_MAX_HP = 250

const MIN_SPEED = 0.20
const MAX_SPEED = 0.40

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
    spells: Spell[] = [];
    attackTarget: Wizard | null = null;
    prefferedPosition: Position;
    moveTarget: Position;
    private _circling = false;
    private _speed: number;

    name: string;

    private _maxHitPoints: number;
    private _currentHitPoints: number;

    collisionBody: CollisionBody;
    radius = 0.1;

    constructor(args: wizardOptions) {
        super(args)

        this.collisionBody = new CollisionBody({
            owner: this,
            tight: new Circle({
                startingPosition: this.position,
                radius: 0.08
            })
        })

        const spellArtNum = setOptionalRandomNumber({min: 0, max: 3.03})
        let spellArt = new Image();
        spellArt.src = "/assets/red-ray.png";

        if (spellArtNum < 1){
            spellArt = new Image();
            spellArt.src = "/assets/gold-bolt.png";
        } else if (spellArtNum < 2) {
            spellArt = new Image();
            spellArt.src = "/assets/blue-blast.png";
        } else if (spellArtNum < 3) {
            spellArt = new Image();
            spellArt.src = "/assets/red-ray.png";
        } else {
            spellArt = new Image();
            spellArt.src = "/assets/grape-shot.png";
        }

        this.spells = [new BoltSpell({
            owner: this,
            knockback: (spellArtNum > 3) ? 50 : undefined,
            travelSpeed: (spellArtNum > 3) ? 2 : undefined,
            sprite: new Sprite({
                canvas: this.engine.canvas,
                startingPosition: this.position,
                image: spellArt,
                width: 96,
                height: 96
            })
        })]

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

        console.log(this.toString())

    }

    move(): void{
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

    update(dt: number){
        super.update(dt)
        if (!this.dead && this._currentHitPoints <= 0) { this.engine.markForDestruction(this) }
        if (!this.attackTarget?.dead) {
            for(let i = 0; i < this.castTimers.length; i++){
                this.castTimers[i] += dt
                if (this.castTimers[i] >= this.spells[i].castTime){
                    const newCast = this.spells[i].newCast(this)
                    if(newCast) this.engine.addEntity(newCast)
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
    
    onCollisionExit(other: Collidable){
        if (other instanceof Platform){
            this.engine.markForDestruction(this)
        }
    }
}