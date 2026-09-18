import { Wizard } from "./wizard.ts";
import { clear, sprite, screen } from "./renderer.ts";
import { fireProjectile, Projectile, updateProjectiles } from "./projectile.ts";


const BACKGROUND = "#c4b5b5";

try{
    const game = document.getElementById("game") as HTMLCanvasElement;

    if (!(game instanceof HTMLCanvasElement)) {
        throw new Error("Game canvas (#game) was not found.");
    }

    game.width = 1000;
    game.height = 1000;

    const ctx = game.getContext("2d") as CanvasRenderingContext2D;

    if (!ctx){
        throw new Error("Invalid game context.")
    }

    ctx.imageSmoothingEnabled = false;

    const wizOneArt = new Image();
    wizOneArt.src = "assets/grape-omancer.png";

    const wizTwoArt = new Image();
    wizTwoArt.src = "assets/gilded-wizard.png";

    const wizOne = new Wizard(0.75, -0.8, wizOneArt, 0.125, 0.25);
    const wizTwo = new Wizard(-0.75, 0.8, wizTwoArt, 1.5, 3);

    const projectileOne = new Image();
    projectileOne.src = "assets/grape-shot.png";

    const projectileTwo = new Image();
    projectileTwo.src = "assets/gold-bolt.png";

    const projectiles: Projectile[] = [];

    function collide(wiz1: Wizard, wiz2: Wizard) {
        const dx = wiz2.position.x - wiz1.position.x;
        const dy = wiz2.position.y - wiz1.position.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const radius = 0.16;
        const minDistance = radius * 2;

        if (distance > 0 && distance < minDistance) { 
            const overlap = minDistance - distance; // how much they overlap

            const dirX = dx / distance; // direction from wiz1 to wiz2
            const dirY = dy / distance;

            wiz1.position.x -= dirX * overlap / 2; // push them apart equally
            wiz1.position.y -= dirY * overlap / 2;

            wiz2.position.x += dirX * overlap / 2;
            wiz2.position.y += dirY * overlap / 2;
        }
    }


    function update() {
        wizOne.moveToward(wizTwo.position);
        wizTwo.moveToward(wizOne.position);

        wizOne.position.x += (wizOne.dx + wizOne.kx) * dt;
        wizOne.position.y += (wizOne.dy + wizOne.ky) * dt;

        wizTwo.position.x += (wizTwo.dx + wizTwo.kx) * dt;
        wizTwo.position.y += (wizTwo.dy + wizTwo.ky) * dt;

        wizOne.kx *= 0.9;
        wizOne.ky *= 0.9;

        wizTwo.kx *= 0.9;
        wizTwo.ky *= 0.9;

        wizOne.fireTimer += dt;
        wizTwo.fireTimer += dt;

        if (wizOne.fireTimer >= wizOne.fireDelay) {
            fireProjectile(wizOne, wizTwo, projectileOne, wizOne.knockback, projectiles);
            wizOne.fireTimer = 0;
        }

        if (wizTwo.fireTimer >= wizTwo.fireDelay) {
            fireProjectile(wizTwo, wizOne, projectileTwo, wizTwo.knockback, projectiles);
            wizTwo.fireTimer = 0;
        }

        updateProjectiles(projectiles, dt);

        collide(wizOne, wizTwo);
    }


    const FPS = 60;
    const dt = 1 / FPS;

    function frame() { // main loop

        update();
        clear(ctx, game, BACKGROUND);

        const wizOneScreenPosition = screen(wizOne.position, game);
        sprite(ctx, wizOne.image, wizOneScreenPosition, wizOne.dx);

        const wizTwoScreenPosition = screen(wizTwo.position, game);
        sprite(ctx, wizTwo.image, wizTwoScreenPosition, wizTwo.dx);

        for (const projectile of projectiles) {
            const projectileScreenPosition = screen(projectile.position, game);
            sprite(ctx, projectile.image, projectileScreenPosition, projectile.dx);
        }

        setTimeout(frame, 1000 / FPS);
    }

    setTimeout(frame, 1000 / FPS); // start

} catch (error) {
    console.error("Failed to initialize game:", error);
}




