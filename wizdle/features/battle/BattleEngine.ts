import { Wizard } from "./battle_objects/wizard";
import { Projectile, fireProjectile, updateProjectiles } from "./battle_objects/projectile";
import BattleObject from "./BattleObject";
import { getScreenPosition, sprite } from "./rendering";

export class BattleEngine{
    private running: boolean = false;
    private ctx!: CanvasRenderingContext2D;

    private wizard1!: Wizard;
    private wizard2!: Wizard;

    private projectile1Art!: HTMLImageElement
    private projectile2Art!: HTMLImageElement

    private animationFrameId: number | null = null;
    
    
    private prevTimestamp: number | null = null;
    private projectiles: Projectile[] = [];

    constructor(private battle: HTMLCanvasElement) {
        try{
            this.ctx = this.battle.getContext("2d") as CanvasRenderingContext2D
            if (!this.ctx){
                throw new Error("Invalid canvas context")
            }

            this.ctx.imageSmoothingEnabled = false;

            const wizard1Art = new Image();
            wizard1Art.src = "/assets/grape-omancer.png";

            const wizard2Art = new Image();
            wizard2Art.src = "/assets/gilded-wizard.png";

            this.projectile1Art = new Image();
            this.projectile1Art.src = "/assets/grape-shot.png";

            this.projectile2Art = new Image();
            this.projectile2Art.src = "/assets/gold-bolt.png";

            this.wizard1 = new Wizard(0.75, -0.8, wizard1Art, 0.125, 0.25);
            this.wizard2 = new Wizard(-0.75, 0.8, wizard2Art, 1.5, 3);

        } catch (error) {
            console.error("Error initializing Battle: " + error)
        }
    }

    start() {
        if (this.running) return;

        this.running = true
        this.prevTimestamp = null;
        requestAnimationFrame(this.frame);
    }

    stop() {
        this.running = false

        if (this.animationFrameId !== null){
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.prevTimestamp = null
    }

    private frame = (timestamp:number) => {
        if (!this.running) return

        if (this.prevTimestamp === null) {
            this.prevTimestamp = timestamp;
        }

        const dt = (timestamp - this.prevTimestamp) / 1000
        this.prevTimestamp = timestamp

        console.log("frame")

        this.update(dt)
        this.render()

        this.animationFrameId = requestAnimationFrame(this.frame)
    }

    private update(dt: number) {
        this.wizard1.moveToward(this.wizard2.position);
        this.wizard2.moveToward(this.wizard1.position);

        this.wizard1.position.x += (this.wizard1.dx + this.wizard1.kx) * dt;
        this.wizard1.position.y += (this.wizard1.dy + this.wizard1.ky) * dt;

        this.wizard2.position.x += (this.wizard2.dx + this.wizard2.kx) * dt;
        this.wizard2.position.y += (this.wizard2.dy + this.wizard2.ky) * dt;

        this.wizard1.kx *= 0.9;
        this.wizard1.ky *= 0.9;

        this.wizard2.kx *= 0.9;
        this.wizard2.ky *= 0.9;

        this.wizard1.fireTimer += dt;
        this.wizard2.fireTimer += dt;

        if (this.wizard1.fireTimer >= this.wizard1.fireDelay) {
            fireProjectile(this.wizard1, this.wizard2, this.projectile1Art, this.wizard1.knockback, this.projectiles);
            this.wizard1.fireTimer = 0;
        }

        if (this.wizard2.fireTimer >= this.wizard2.fireDelay) {
            fireProjectile(this.wizard2, this.wizard1, this.projectile2Art, this.wizard2.knockback, this.projectiles);
            this.wizard2.fireTimer = 0;
        }

        updateProjectiles(this.projectiles, dt);

        this.handleCollision(this.wizard1, this.wizard2);
    }

    private render() {
        this.ctx?.clearRect(0, 0, this.battle.width, this.battle.height)

        const wizard1ScreenPosition = getScreenPosition(this.wizard1.position, this.battle);
        sprite(this.ctx, this.wizard1.image, wizard1ScreenPosition, this.wizard1.dx);

        const wizard2ScreenPosition = getScreenPosition(this.wizard2.position, this.battle);
        sprite(this.ctx, this.wizard2.image, wizard2ScreenPosition, this.wizard2.dx);

        for (const projectile of this.projectiles) {
            const projectileScreenPosition = getScreenPosition(projectile.position, this.battle);
            sprite(this.ctx, projectile.image, projectileScreenPosition, projectile.dx);
        }
    }

    private handleCollision(obj1: BattleObject, obj2: BattleObject) {
        const dx = obj2.position.x - obj1.position.x;
        const dy = obj2.position.y - obj1.position.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const radius = 0.16;
        const minDistance = radius * 2;

        if (distance > 0 && distance < minDistance) { 
            const overlap = minDistance - distance; // how much they overlap

            const dirX = dx / distance; // direction from obj1 to obj2
            const dirY = dy / distance;

            obj1.position.x -= dirX * overlap / 2; // push them apart equally
            obj1.position.y -= dirY * overlap / 2;

            obj2.position.x += dirX * overlap / 2;
            obj2.position.y += dirY * overlap / 2;
        }
    }


}