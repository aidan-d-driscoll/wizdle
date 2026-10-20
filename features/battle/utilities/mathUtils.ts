import { Position } from "@/features/battle/types/position"

export function getDistance({from, to}:{from: Position, to: Position}){ return Math.sqrt(getRawDistance({from, to})) }

export function getRawDistance({from, to}:{from: Position, to: Position}){
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    return dx * dx + dy * dy;
}

export function absMin(a: number, b: number){
    if (Math.abs(a) > Math.abs(b)){ return a } else { return b };
}

export function getRandomFloat(min: number, max: number): number {
  // Returns a value from min (inclusive) up to max (exclusive)
  return Math.random() * (max - min) + min;
}

export function setOptionalRandomNumber({value, min, max}:{value?: number, min: number, max: number}){
    if (!value) return getRandomFloat(min, max)
    else return value
}

export function softSign(value: number): number{
    return value/(value + Math.abs(value))
}