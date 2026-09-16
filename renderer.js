export function clear(ctx, game, background) { // clear the screen before rendering each frame
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, game.width, game.height);
}

export function sprite(ctx, image, { x, y }, dx) {  // draw a sprite at a screen position
    const size = 128;

    ctx.save();

    if (dx > 0) {
        ctx.translate(x, y);
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
            x - size / 2,
            y - size / 2,
            size,
            size
        );
    }

    ctx.restore();
}

export function screen({ x, y }, game) { // convert world coordinates (-1..1)
    return {
        x: (x + 1) / 2 * game.width,
        y: (1 - (y + 1) / 2) * game.height
    };
}