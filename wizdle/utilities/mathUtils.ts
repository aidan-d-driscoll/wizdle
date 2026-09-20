import Position from "@/types/position"

export function getDistance(a: Position, b: Position){
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(Math.sqrt(dx * dx + dy * dy));
}

export function absMin(a: number, b: number){
    if (Math.abs(a) > Math.abs(b)){ return a } else { return b };
}