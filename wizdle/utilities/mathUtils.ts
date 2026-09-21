import Position from "@/types/position"

export function getDistance({from, to}:{from: Position, to: Position}){
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    return Math.sqrt(dx * dx + dy * dy);
}

export function absMin(a: number, b: number){
    if (Math.abs(a) > Math.abs(b)){ return a } else { return b };
}