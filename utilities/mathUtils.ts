import Position from "@/types/position"

export function getDistance({from, to}:{from: Position, to: Position}){
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    return Math.sqrt(dx * dx + dy * dy);
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