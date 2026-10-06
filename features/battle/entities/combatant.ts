import Position from "@/types/position";
import { GameObject, objectOptions } from "../objects/gameObject";
import { Engine, updateOptions } from "../engine";
import { getDistance } from "@/utilities/mathUtils";
import Vector from "@/types/vector";


const CIRCLING_SPEED = 1.2

export type combatantOptions = objectOptions & {
    team: number,

    maxHP: number,
    moveSpeed: number,
    prefferedPosition: Position
}

export default class Combatant extends GameObject {
    private _team: number;

    enemies = new Map<number, Combatant>;
    allies = new Map<number, Combatant>;
    attackTarget: Combatant | null = null;
    moveTarget: Position = {x:0, y:0};
    private prefferedPosition: Position;

    protected _maxHP: number;
    protected _currentHP: number;

    protected _moveSpeed: number;

    get currentHP(): number { return this._currentHP }
    set currentHP(value: number) { this._currentHP = Math.max(0, Math.min(value, this._maxHP)) }

    get moveSpeed(): number { return this._moveSpeed }
    set moveSpeed(value) { this._moveSpeed = Math.max(0, value) }

    get team(): number { return this._team }

    constructor(args: combatantOptions){
        super(args)

        this._team = args.team
        
        this.prefferedPosition = args.prefferedPosition;

        this.physics = true;
        this._maxHP = args.maxHP;
        this._currentHP = args.maxHP;

        this._moveSpeed = args.moveSpeed;
    }

    update(args: updateOptions){
        console.log(this.id + "->" + this.attackTarget?.id)
        console.log(this.enemies)

        this.moveTarget = this.prefferedPosition;
        let circling = false;

        if(!this.attackTarget){
            const value = this.enemies.entries().next().value;
            if (value) this.attackTarget = value[1];
        } else if (this.enemies.size > 1) {
            for (const enemy of this.enemies.values()){
                if (enemy.id !== this.attackTarget.id 
                    && Math.abs(getDistance({from: this.position, to: enemy.position})) < Math.abs(getDistance({from: this.position, to: this.attackTarget.position}))
                ){
                    this.attackTarget = enemy
                }
            }
        }

        if (this.attackTarget && (Math.abs(getDistance({from: this.attackTarget.position, to:this.prefferedPosition})) < Math.abs(getDistance({from: this.position, to:this.prefferedPosition})))) {
            this.moveTarget = this.attackTarget.position;
            circling = true;
        }
        
        if (Math.abs(getDistance({from: this.position, to: this.moveTarget})) > 0.1){
            this.velocity = new Vector({startPos: this.position, endPos: this.moveTarget, magnitude: this._moveSpeed})

            if (circling){
                this.velocity = new Vector({
                    dx: this.velocity.dx + this.velocity.dy * -1 * CIRCLING_SPEED,
                    dy: this.velocity.dy + this.velocity.dx * CIRCLING_SPEED,
                    magnitude: this._moveSpeed
                })
            }
        }

        super.update(args)
    }
}

