import GameObject from "./wizdle/components/gameObject";
import { Position } from "./type";

export function clear(ctx: CanvasRenderingContext2D | null, game: HTMLCanvasElement, background: string) { // clear the screen before rendering each frame
    if (!ctx){
        throw new Error("Invalid game context.")
    }
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, game.width, game.height);
}

export function sprite(ctx: CanvasRenderingContext2D, image: HTMLImageElement, position: Position, dx: number) {  // draw a sprite at a screen position
    const size = 128;

    ctx.save();

    if (dx > 0) {
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

export function screen(position: Position, game: HTMLCanvasElement) { // convert world coordinates (-1..1)
    return {
        x: (position.x + 1) / 2 * game.width,
        y: (1 - (position.y + 1) / 2) * game.height
    };
}