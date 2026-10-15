import { Position } from "@/features/battle/types/position";
import { GameObject, ObjectOptions } from "../entities/gameObject";
import { UpdateOptions } from "../scene";
import { getRawDistance, setOptionalRandomNumber,  } from "@/features/battle/utilities/mathUtils";
import Vector from "@/features/battle/types/vector";
import { CollisionBody } from "../collisions/collisionBody";
import { Fillbar } from "../ui_elements/fillbar";

const CIRCLING_SPEED = 0.45

export type CombatantOptions = ObjectOptions & {
    cb: CollisionBody;

    team: number,

    maxHP?: number,
    moveSpeed?: number,
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

    protected _healthbar: Fillbar;

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

        this._maxHP = setOptionalRandomNumber({value: args.maxHP, min: 90, max: 110});
        this._currentHP = this._maxHP

        this._moveSpeed = setOptionalRandomNumber({value: args.moveSpeed, min: 0.95, max: 1.25 })
        this.maxVelocity = this.moveSpeed;

        this._healthbar = new Fillbar({
            maxHP: this._maxHP,
            renderHeight: 1,
            offset: {x:0, y: 0.17},
            color: "#99FF99"
        })
        this.addChild(this._healthbar)
    }

    update(args: UpdateOptions){
        if(!this.dead) {
            this.moveTarget = this.prefferedPosition;
            let circling = false;

            if (this.nearestEnemy && (getRawDistance({from: this.nearestEnemy.position, to:this.prefferedPosition}) < this.rawDistanceTo(this.prefferedPosition))) {
                this.moveTarget = this.nearestEnemy.position;
                circling = true;
            }
            
            if (this.distanceTo(this.moveTarget) > 0.06){
                this.movementForce = new Vector({startPos: this.position, endPos: this.prefferedPosition, magnitude: this._moveSpeed})

                if (circling){
                    this.movementForce = new Vector({
                        dx: this.movementForce.dx * (1-CIRCLING_SPEED) + this.movementForce.dy * -1 * CIRCLING_SPEED,
                        dy: this.movementForce.dy * (1-CIRCLING_SPEED) + this.movementForce.dx * CIRCLING_SPEED,
                        magnitude: this._moveSpeed
                    })
                }
            }
        }

        super.update(args)
    }

    takeDamage(dmg: number) {
        this.currentHP -= dmg
        this._healthbar.setHealth(this._currentHP)
    }

    // onCollisionExit(other: Collidable){
    //     if (other instanceof Platform){
    //         this.dead = true;
    //     }
    // }
}

