export class Wizard {
    constructor(x, y, image, fireDelay, knockback) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.kx = 0;
        this.ky = 0;
        this.image = image;
        this.fireTimer = 0;
        this.fireDelay = fireDelay;
        this.knockback = knockback;
    }

    moveToward(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) { // normalize direction
            const dirX = dx / distance;
            const dirY = dy / distance;
            
            this.dx = dirX * distance / 4; // speed proportional to distance
            this.dy = dirY * distance / 2;
        }
    }
}