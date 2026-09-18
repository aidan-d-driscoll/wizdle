import GameObject from "./wizdle/components/gameObject";
import { Wizard } from "./wizard";

export class Projectile extends GameObject {
    image!: HTMLImageElement;
    knockback!: number;
    target!: Wizard;
    dead!: boolean;

    constructor(x: number, y: number, dx: number, dy: number, image: HTMLImageElement, knockback: number, target: Wizard) {
        super(x, y, dx, dy)
        this.image = image;
        this.knockback = knockback;
        this.target = target;
        this.dead = false;
    }
}

export function fireProjectile(source: GameObject, target: Wizard, image: HTMLImageElement, knockback: number, projectiles: Projectile[]) {
    const dx = target.position.x - source.position.x;
    const dy = target.position.y - source.position.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        const dirX = dx / distance;
        const dirY = dy / distance;

        projectiles.push(
            new Projectile(
                source.position.x,
                source.position.y,
                dirX * 1.5,
                dirY * 1.5,
                image,
                knockback,
                target
            )
        );
    }
}

export function updateProjectiles(projectiles: Projectile[], dt: number) {
    for (const projectile of projectiles) {
        projectile.position.x += projectile.dx * dt;
        projectile.position.y += projectile.dy * dt;

        collideProjectile(projectile, projectile.target);
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        if (projectiles[i].dead) {
            projectiles.splice(i, 1);
        }
    }
}

function collideProjectile(projectile: Projectile, wizard: Wizard) {
    const dx = wizard.position.x - projectile.position.x;
    const dy = wizard.position.y - projectile.position.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 0.2) {
        wizard.kx += projectile.dx * projectile.knockback;
        wizard.ky += projectile.dy * projectile.knockback;
        projectile.dead = true;
    }
}