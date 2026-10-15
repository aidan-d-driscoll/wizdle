import { setOptionalRandomNumber } from "@/features/battle/utilities/mathUtils";
import Combatant from "@/features/battle/entities/combatant";
import { Sprite } from "../rendering/sprite";
import { Scene } from "../scene";

const CAST_TIME_INFLUENCE = 0.5

const MIN_CAST_TIME = 0.8;
const MAX_CAST_TIME = 3;

const MIN_KNOCKBACK = 1 * MIN_CAST_TIME;
const MAX_KNOCKBACK = 1.3 * MIN_CAST_TIME;

const MIN_DAMAGE = 4 * MIN_CAST_TIME;
const MAX_DAMAGE = MIN_DAMAGE * 5 * MIN_CAST_TIME;

export type spellOptions = {
    caster: Combatant;
    sprite: Sprite,
    knockback?: number,
    castTime?: number,
    damage?: number
}

export default abstract class Spell{
    caster: Combatant;

    sprite: Sprite;
    knockback: number;
    castTime: number;
    spellQuality: number;
    damage: number;

    dead = false;

    constructor(args:spellOptions){
        this.caster = args.caster;

        this.sprite = args.sprite;

        this.castTime = setOptionalRandomNumber({value: args.castTime, min: MIN_CAST_TIME, max: MAX_CAST_TIME})

        // scales other values based on cast time. Higher cast time = more powerful
        this.spellQuality = Math.pow((this.castTime / MIN_CAST_TIME), CAST_TIME_INFLUENCE);

        this.knockback = setOptionalRandomNumber({value: args.knockback, min: MIN_KNOCKBACK, max: MAX_KNOCKBACK}) * this.spellQuality

        this.damage = setOptionalRandomNumber({value: args.damage, min: MIN_DAMAGE, max: MAX_DAMAGE}) * this.spellQuality
    }

    abstract newCast(source: Combatant, scene: Scene): void;
}