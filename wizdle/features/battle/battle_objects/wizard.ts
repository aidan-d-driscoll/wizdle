import BattleObject from "@/features/battle/BattleObject";
import Position from "@/types/position";

export class Wizard extends BattleObject{
    position!: Position;
    fireTimer: number = 0;
    fireDelay!: number;
    image!: HTMLImageElement;
    knockback!: number;

    constructor(
        starting_x: number, 
        starting_y: number,
        image: HTMLImageElement, 
        fireDelay: number,
        knockback: number, 
        private speed: number = 1
    ) {
        super(starting_x, starting_y)
        this.image = image;
        this.fireDelay = fireDelay;
        this.knockback = knockback;
    }

    moveToward(targetPosition: Position) {
        const dx = targetPosition.x - this.position.x;
        const dy = targetPosition.y - this.position.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) { // normalize direction
            const dirX = dx / distance / 4 * this.speed;
            const dirY = dy / distance / 4 * this.speed;
            
            this.dx = dirX; // speed proportional to distance
            this.dy = dirY;
        }
    }
}