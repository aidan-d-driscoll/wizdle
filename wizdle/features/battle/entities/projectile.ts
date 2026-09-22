import Entity from "./entity";
import { projectileOptions } from "@/types/options";
import { Wizard } from "./wizard";
import Vector from "@/types/vector";

export class Projectile extends Entity{
    knockback: Vector;
    source: Entity;

    constructor(args: projectileOptions){
        args.frictionless = true
        super(args)
        this.source = args.source

        this.knockback = new Vector({dx: this.velocity.dx, dy: this.velocity.dy, magnitude: args.knockback})
    }

    collideWith(e: Entity): void {
        if (e instanceof Wizard && e !== this.source){
            e.applyForce(this.knockback)
            this.dead = true;
        }
    }
}

// export function fireProjectile(source: Entity, target: Wizard, image: HTMLImageElement, knockback: number, projectileSpeed: number, projectiles: Projectile[]) {
//     const dx = target.x - source.x;
//     const dy = target.y - source.y;

//     const distance = Math.sqrt(dx * dx + dy * dy);

//     if (distance > 0) {
//         const dirX = dx / distance;
//         const dirY = dy / distance;

//         projectiles.push(
//             new Projectile(
//                 source.x,
//                 source.y,
//                 dirX,
//                 dirY,
//             )
//         );
//     }
// }

// export function updateProjectiles(projectiles: Projectile[], dt: number) {
//     for (const projectile of projectiles) {
//         projectile.x += projectile.dx * projectile.travelSpeed * dt;
//         projectile.y += projectile.dy * projectile.travelSpeed * dt;

//         collideProjectile(projectile, projectile.target);
//     }

//     for (let i = projectiles.length - 1; i >= 0; i--) {
//         if (projectiles[i].dead) {
//             projectiles.splice(i, 1);
//         }
//     }
// }

// function collideProjectile(projectile: Projectile, wizard: Wizard) {
//     const dx = wizard.x - projectile.x;
//     const dy = wizard.y - projectile.y;

//     const distance = Math.sqrt(dx * dx + dy * dy);

//     if (distance < 0.13) {
//         wizard.kx += projectile.dx * projectile.knockback;
//         wizard.ky += projectile.dy * projectile.knockback;
//         projectile.dead = true;
//     }
// }