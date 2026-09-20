import { Position } from "@/types/position";

export function clear(ctx: CanvasRenderingContext2D | null, battle: HTMLCanvasElement, background: string) { // clear the getScreenPosition before rendering each frame
    if (!ctx){
        throw new Error("Invalid battle context.")
    }
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, battle.width, battle.height);
}

export function sprite(ctx: CanvasRenderingContext2D, image: HTMLImageElement, position: Position, xVel: number) {  // draw a sprite at a getScreenPosition position
    const size = 96;

    ctx.save();

    if (xVel > 0) {
        ctx.translate(position.x, position.y);
        ctx.scale(-1, 1);

        ctx.drawImage(
            image,
            -size / 2,
            -size / 2,
            size,
            size
        );
    } else {
        ctx.drawImage(
            image,
            position.x - size / 2,
            position.y - size / 2,
            size,
            size
        );
    }

    ctx.restore();
}

export function getScreenPosition(position: Position, battle: HTMLCanvasElement) { // convert world coordinates (-1..1)
    return {
        x: (position.x + 1) / 2 * battle.width,
        y: (1 - (position.y + 1) / 2) * battle.height
    };
}