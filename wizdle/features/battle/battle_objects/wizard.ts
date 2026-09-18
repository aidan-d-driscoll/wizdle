import BattleObject from "@/features/battle/BattleObject";
import Position from "@/types/position";

export class Wizard extends BattleObject{
    image!: HTMLImageElement;
    fireTimer!: number;
    fireDelay!: number;
    knockback!: number;

    constructor(starting_x: number, starting_y: number, image: HTMLImageElement, fireDelay: number, knockback: number) {
        super(starting_x, starting_y)
        this.image = image;
        this.fireTimer = 0;
        this.fireDelay = fireDelay;
        this.knockback = knockback;
    }

    moveToward(targetPosition: Position) {
        const dx = targetPosition.x - this.position.x;
        const dy = targetPosition.y - this.position.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) { // normalize direction
            const dirX = dx / distance;
            const dirY = dy / distance;
            
            this.dx = dirX * distance / 4; // speed proportional to distance
            this.dy = dirY * distance / 2;
        }
    }
}