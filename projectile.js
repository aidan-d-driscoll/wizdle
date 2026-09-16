export class Projectile {
    constructor(x, y, dx, dy, image, knockback, target) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.image = image;
        this.knockback = knockback;
        this.target = target;
        this.dead = false;
    }
}

export function fireProjectile(wizard, target, image, knockback, projectiles) {
    const dx = target.x - wizard.x;
    const dy = target.y - wizard.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        const dirX = dx / distance;
        const dirY = dy / distance;

        projectiles.push(
            new Projectile(
                wizard.x,
                wizard.y,
                dirX * 1.5,
                dirY * 1.5,
                image,
                knockback,
                target
            )
        );
    }
}

export function updateProjectiles(projectiles, dt) {
    for (const projectile of projectiles) {
        projectile.x += projectile.dx * dt;
        projectile.y += projectile.dy * dt;

        collideProjectile(projectile, projectile.target);
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        if (projectiles[i].dead) {
            projectiles.splice(i, 1);
        }
    }
}

function collideProjectile(projectile, wizard) {
    const dx = wizard.x - projectile.x;
    const dy = wizard.y - projectile.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 0.2) {
        wizard.kx += projectile.dx * projectile.knockback;
        wizard.ky += projectile.dy * projectile.knockback;
        projectile.dead = true;
    }
}