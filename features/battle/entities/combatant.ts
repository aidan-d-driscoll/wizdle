import { Position } from "@/types/position";
import { GameObject, ObjectOptions } from "../entities/gameObject";
import { UpdateOptions } from "../scene";
import { getRawDistance, setOptionalRandomNumber,  } from "@/utilities/mathUtils";
import Vector from "@/types/vector";
import { CollisionBody } from "../collisions/collisionBody";

const CIRCLING_SPEED = 1.2

export type CombatantOptions = ObjectOptions & {
    cb: CollisionBody;

    team: number,

    maxHP: number,
    moveSpeed: number,
    prefferedPosition: Position
}

export default class Combatant extends GameObject{
    private _team: number;

    enemies: Combatant[] = [];
    nearestEnemy: Combatant | null = null;
    
    allies: Combatant[] = [];
    nearestAlly: Combatant | null = null;
    
    moveTarget: Position = {x:0, y:0};
    private prefferedPosition: Position;

    protected _maxHP: number;
    protected _currentHP: number;

    protected _moveSpeed: number;

    get currentHP(): number { return this._currentHP }
    set currentHP(value: number) { 
        this._currentHP = Math.max(0, Math.min(value, this._maxHP))
        if(this._currentHP <= 0) this.destroy();
    }

    get moveSpeed(): number { return this._moveSpeed }
    set moveSpeed(value) { this._moveSpeed = Math.max(0, value) }

    get team(): number { return this._team }

    constructor(args: CombatantOptions){
        super(args)

        args.scene.tm.add(this)

        this._team = args.team
        
        this.prefferedPosition = args.prefferedPosition;
        this.moveTarget = this.prefferedPosition;

        this.physics = true;
        this._maxHP = args.maxHP;
        this._currentHP = args.maxHP;

        this._moveSpeed = setOptionalRandomNumber({value: args.moveSpeed, min: 0.15, max: 0.25 })
    }

    update(args: UpdateOptions){
        if(!this.dead) {
            if (this._cb?.dirty) args.scene.tm.markDirty(this)

            this.moveTarget = this.prefferedPosition;
            let circling = false;

            if (this.nearestEnemy && (getRawDistance({from: this.nearestEnemy.position, to:this.prefferedPosition}) < this.rawDistanceTo(this.prefferedPosition))) {
                this.moveTarget = this.nearestEnemy.position;
                circling = true;
            }
            
            if (this.distanceTo(this.moveTarget) > 0.08){
                this.velocity = new Vector({startPos: this.position, endPos: this.moveTarget, magnitude: this._moveSpeed})

                if (circling){
                    this.velocity = new Vector({
                        dx: this.velocity.dx + this.velocity.dy * -1 * CIRCLING_SPEED,
                        dy: this.velocity.dy + this.velocity.dx * CIRCLING_SPEED,
                        magnitude: this._moveSpeed
                    })
                }
            }
        }
        super.update(args)
    }

    takeDamage(dmg: number) {
        this.currentHP -= dmg
    }

    // onCollisionExit(other: Collidable){
    //     if (other instanceof Platform){
    //         this.dead = true;
    //     }
    // }
}

