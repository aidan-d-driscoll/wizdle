import { Position } from "@/features/battle/types/position"

const EPSILON = 1e-9;

/** a ≈ b, within float noise */
export const approxEq = (a: number, b: number) => Math.abs(a - b) <= EPSILON;

/** a > b, ignoring float noise */
export const definitelyGreater = (a: number, b: number) => a - b > EPSILON;

/** true if x is a whole number, ignoring float noise */
export const isNearInteger = (x: number) => approxEq(x, Math.round(x));

export function getDistance({from, to}:{from: Position, to: Position}){ return Math.sqrt(getRawDistance({from, to})) }

export function getRawDistance({from, to}:{from: Position, to: Position}){
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    return dx * dx + dy * dy;
}

export function absMin(a: number, b: number){
    if (Math.abs(a) > Math.abs(b)){ return a } else { return b };
}

export function getRandomNumber({ min, max, step }: { min: number; max: number; step?: number }): number {
    if (!step) return Math.random() * (max - min) + min;

    const steps = Math.floor((max - min) / step + EPSILON);
    const k = Math.floor(Math.random() * (steps + 1));
    return Number((min + k * step).toPrecision(12));
}

export function setOptionalRandomNumber({value, min, max}:{value?: number, min: number, max: number}){
    if (!value) return getRandomNumber({min: min, max: max})
    else return value
}

export function softSign(value: number): number{
    return value/(value + Math.abs(value))
}

export function getRandomFromList<T>(list: T[]): T {
    const idx = getRandomNumber({min: 0, max: list.length-1, step: 1});
    return list[idx];
}