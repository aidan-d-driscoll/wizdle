import { Position } from "@/features/battle/types/position";
import { GameObject, ObjectOptions } from "../gameObject";
import { getRawDistance, setOptionalRandomNumber,  } from "@/features/battle/utilities/mathUtils";
import Vector from "@/features/battle/types/vector";
import { Fillbar } from "../ui_elements/fillbar";
import { CollisionBody } from "../collisions/collisionBody";

const CIRCLING_SPEED = 0.35

export type CombatantOptions = ObjectOptions & {
    team: number,

    maxHP?: number,
    moveSpeed?: number,
    prefferedPosition?: Position,

    bumpDamage?: number,
    bumpKnockback?: number,

    sprites: Sprite[],
}

export default class Combatant extends GameObject{
    private _team: number;

    sprites: Sprite[];

    enemies: Combatant[] = [];
    nearestEnemy: Combatant | null = null;
    nearestEnemyDir: Vector | null = null;
    
    allies: Combatant[] = [];
    nearestAlly: Combatant | null = null;
    
    moveTarget: Position = {x:0, y:0};
    private prefferedPosition: Position | null = null;

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

    private _bumpDamage = 0;
    private _bumpKnockback = 0.0;

    constructor(args: CombatantOptions){
        super(args)

        args.scene.tm.add(this)

        this._team = args.team
        
        if(args.prefferedPosition) this.prefferedPosition = args.prefferedPosition;

        this.physics = true;

        this._maxHP = setOptionalRandomNumber({value: args.maxHP, min: 90, max: 110});
        this._currentHP = this._maxHP

        this._moveSpeed = setOptionalRandomNumber({value: args.moveSpeed, min: 0.95, max: 1.25 })
        this.maxVelocity = this.moveSpeed;

        this._healthbar = new Fillbar({
            maxValue: this._maxHP,
            renderHeight: 1,
            offset: {x:0, y: 0.17},
            color: "#99FF99",
            width: 0.2,
            height: 0.02
        })
        this.addChild(this._healthbar)

        this.sprites = args.sprites
        for (const sp of this.sprites){ this.addChild(sp) }

        if(args.bumpDamage) this._bumpDamage = args.bumpDamage
        if(args.bumpKnockback) this._bumpKnockback = args.bumpKnockback
    }

    update(args: UpdateOptions){
        if(!this.dead) {
            let circling = false;
            if(this.prefferedPosition){
                this.moveTarget = this.prefferedPosition;

                if (this.nearestEnemy && (getRawDistance({from: this.nearestEnemy.position, to:this.prefferedPosition}) < this.rawDistanceTo(this.prefferedPosition))) {
                    this.moveTarget = this.nearestEnemy.position;
                    circling = true;
                }
            } else {
                if(this.nearestEnemy) this.moveTarget = this.nearestEnemy.position
                else this.moveTarget = {x:0, y: 0}
            }

            if (this.distanceTo(this.moveTarget) > 0){
                this.movementForce = new Vector({startPos: this.position, endPos: this.moveTarget, magnitude: this._moveSpeed})

                if (circling){
                    this.movementForce = new Vector({
                        dx: this.movementForce.dx * (1-CIRCLING_SPEED) + this.movementForce.dy * -1 * CIRCLING_SPEED,
                        dy: this.movementForce.dy * (1-CIRCLING_SPEED) + this.movementForce.dx * CIRCLING_SPEED,
                        magnitude: this._moveSpeed
                    })
                }
            }
        }


        if (!this.nearestEnemy){
            this.nearestEnemyDir = null;
        } else {
            const newDir = new Vector({startPos: this.position, endPos: this.nearestEnemy.position})
            if(this.nearestEnemyDir && ((newDir.dx > 0) !== (this.nearestEnemyDir.dx > 0)))
                for (const sp of this.sprites){ sp.flipHorizontal() }
            this.nearestEnemyDir = newDir
        }

        super.update(args)

        this.velocity = new Vector({
            dx: this.velocity.dx,
            dy: this.velocity.dy
        })
    }

    takeDamage(dmg: number) {
        this.currentHP -= dmg
        this._healthbar.value = this._currentHP
    }

    bumpAttack(other: Combatant) {
        other.takeDamage(this._bumpDamage)
        if (this._bumpKnockback > 0) other.applyKnockback(new Vector({startPos: this.position, endPos: other.position, magnitude: this._bumpKnockback}))
    }

    onCollisionEnter(other: GameObject){
        if(other instanceof Combatant){
            this.bumpAttack(other)
        }
    }

    
}

