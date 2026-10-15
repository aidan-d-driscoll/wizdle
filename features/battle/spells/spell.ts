import { setOptionalRandomNumber } from "@/features/battle/utilities/mathUtils";
import Combatant from "@/features/battle/entities/combatant";
import { Sprite } from "../rendering/sprite";
import { Scene, UpdateOptions } from "../scene";
import { Fillbar } from "../ui_elements/fillbar";
import { HexColor } from "../utilities/renderingUtils";

const CAST_TIME_INFLUENCE = 0.5

const MIN_CAST_TIME = 1;
const MAX_CAST_TIME = 3;

const MIN_KNOCKBACK = 0.7 * MIN_CAST_TIME;
const MAX_KNOCKBACK = 0.9 * MIN_CAST_TIME;

const MIN_DAMAGE = 3 * MIN_CAST_TIME;
const MAX_DAMAGE = MIN_DAMAGE * 5 * MIN_CAST_TIME;

export type spellOptions = {
    caster: Combatant;
    sprite: Sprite,
    knockback?: number,
    castTime?: number,
    damage?: number

    castBarColor?: HexColor
}

export default abstract class Spell{
    caster: Combatant;

    sprite: Sprite;
    knockback: number;   
    spellQuality: number;
    damage: number;

    dead = false;

    castTime: number;
    castTimer: number;

    castBar: Fillbar;

    constructor(args:spellOptions){
        this.caster = args.caster;

        this.sprite = args.sprite;

        this.castTimer = 0;
        this.castTime = setOptionalRandomNumber({value: args.castTime, min: MIN_CAST_TIME, max: MAX_CAST_TIME})

        this.castBar = new Fillbar({
            maxValue: this.castTime,
            startingValue: 0,
            renderHeight: 1,
            color: args.castBarColor ? args.castBarColor : "#1cb2d8",
            width: 0.1,
            height: 0.02
        })

        // scales other values based on cast time. Higher cast time = more powerful
        this.spellQuality = Math.pow((this.castTime / MIN_CAST_TIME), CAST_TIME_INFLUENCE);

        this.knockback = setOptionalRandomNumber({value: args.knockback, min: MIN_KNOCKBACK, max: MAX_KNOCKBACK}) * this.spellQuality

        this.damage = setOptionalRandomNumber({value: args.damage, min: MIN_DAMAGE, max: MAX_DAMAGE}) * this.spellQuality
    }

    update(args: UpdateOptions){
        this.castTimer += args.dt
        if(this.castTimer >= this.castTime){
            if(this.caster.nearestEnemy){
                this.newCast(this.caster, args.scene)
                this.castTimer -= this.castTime
            } else { this.castTimer = this.castTime }
            
        }
        this.castBar.value = this.castTimer
    }

    abstract newCast(source: Combatant, scene: Scene): void;
}