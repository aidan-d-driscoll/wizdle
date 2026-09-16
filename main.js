import { Wizard } from "/wizard.js";
import { clear, sprite, screen } from "./renderer.js";
import { fireProjectile, updateProjectiles } from "./projectile.js";


const BACKGROUND = "#c4b5b5";

const game = document.getElementById("game");

game.width = 1000;
game.height = 1000;

const ctx = game.getContext("2d");
ctx.imageSmoothingEnabled = false;


const wizardOne = new Image();
wizardOne.src = "assets/grape-omancer.png";

const wizardTwo = new Image();
wizardTwo.src = "assets/gilded-wizard.png";

const wizOne = new Wizard(0.75, -0.8, wizardOne, 0.125, 0.25);
const wizTwo = new Wizard(-0.75, 0.8, wizardTwo, 1.5, 3);


const projectileOne = new Image();
projectileOne.src = "assets/grape-shot.png";

const projectileTwo = new Image();
projectileTwo.src = "assets/gold-bolt.png";

const projectiles = [];


function collide(wiz1, wiz2) {
    const dx = wiz2.x - wiz1.x;
    const dy = wiz2.y - wiz1.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const radius = 0.16;
    const minDistance = radius * 2;

    if (distance > 0 && distance < minDistance) { 
        const overlap = minDistance - distance; // how much they overlap

        const dirX = dx / distance; // direction from wiz1 to wiz2
        const dirY = dy / distance;

        wiz1.x -= dirX * overlap / 2; // push them apart equally
        wiz1.y -= dirY * overlap / 2;

        wiz2.x += dirX * overlap / 2;
        wiz2.y += dirY * overlap / 2;
    }
}


function update() {
    wizOne.moveToward(wizTwo);
    wizTwo.moveToward(wizOne);

    wizOne.x += (wizOne.dx + wizOne.kx) * dt;
    wizOne.y += (wizOne.dy + wizOne.ky) * dt;

    wizTwo.x += (wizTwo.dx + wizTwo.kx) * dt;
    wizTwo.y += (wizTwo.dy + wizTwo.ky) * dt;

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

    const wizOneScreenPosition = screen(wizOne, game);
    sprite(ctx, wizOne.image, wizOneScreenPosition, wizOne.dx);

    const wizTwoScreenPosition = screen(wizTwo, game);
    sprite(ctx, wizTwo.image, wizTwoScreenPosition, wizTwo.dx);

    for (const projectile of projectiles) {
        const projectileScreenPosition = screen(projectile, game);
        sprite(ctx, projectile.image, projectileScreenPosition, projectile.dx);
    }

    setTimeout(frame, 1000 / FPS);
}

setTimeout(frame, 1000 / FPS); // start