import Entity from "./entity";
import { projectileOptions } from "@/types/options";
import { getDistance } from "@/utilities/mathUtils";
import { Wizard } from "./wizard";

export class Projectile extends Entity{
    knockback: number;
    source: Entity;

    xDir: number;
    yDir: number;

    xKnockback: number;
    yKnockback: number;

    constructor(args: projectileOptions){
        super(args)
        this.knockback = args.knockback
        this.source = args.source

        const xDiff = args.target.position.x - this.position.x
        const yDiff = args.target.position.y - this.position.y
        const targetDistance = getDistance(args.target.position, this.position)

        this.xDir = xDiff / targetDistance
        this.yDir = yDiff / targetDistance

        this.xKnockback = this.xDir * this.knockback
        this.yKnockback = this.yDir * this.knockback
    }

    collideWith(e: Entity): void {
        if (e instanceof Wizard && e !== this.source){
            e.applyKnockback(this.xKnockback, this.yKnockback)
            this.dead = true;
        }
    }
}

// export function fireProjectile(source: Entity, target: Wizard, image: HTMLImageElement, knockback: number, projectileSpeed: number, projectiles: Projectile[]) {
//     const dx = target.position.x - source.position.x;
//     const dy = target.position.y - source.position.y;

//     const distance = Math.sqrt(dx * dx + dy * dy);

//     if (distance > 0) {
//         const dirX = dx / distance;
//         const dirY = dy / distance;

//         projectiles.push(
//             new Projectile(
//                 source.position.x,
//                 source.position.y,
//                 dirX,
//                 dirY,
//             )
//         );
//     }
// }

// export function updateProjectiles(projectiles: Projectile[], dt: number) {
//     for (const projectile of projectiles) {
//         projectile.position.x += projectile.dx * projectile.travelSpeed * dt;
//         projectile.position.y += projectile.dy * projectile.travelSpeed * dt;

//         collideProjectile(projectile, projectile.target);
//     }

//     for (let i = projectiles.length - 1; i >= 0; i--) {
//         if (projectiles[i].dead) {
//             projectiles.splice(i, 1);
//         }
//     }
// }

// function collideProjectile(projectile: Projectile, wizard: Wizard) {
//     const dx = wizard.position.x - projectile.position.x;
//     const dy = wizard.position.y - projectile.position.y;

//     const distance = Math.sqrt(dx * dx + dy * dy);

//     if (distance < 0.13) {
//         wizard.kx += projectile.dx * projectile.knockback;
//         wizard.ky += projectile.dy * projectile.knockback;
//         projectile.dead = true;
//     }
// }