import Position from "@/types/position";

export function toScreenPosition(position: Position, canvas: HTMLCanvasElement) { // convert world coordinates (-1..1)
    return {
        x: (position.x + 1) / 2 * canvas.width,
        y: (1 - (position.y + 1) / 2) * canvas.height
    };
}

export function toScreenValue(value: number, canvas: HTMLCanvasElement) { // convert world coordinates (-1..1)
    return value * (canvas.width / 2);
}