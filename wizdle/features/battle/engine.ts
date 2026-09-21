import { Wizard } from "./entities/wizard";
import Spell from "./spells/spell";
import Entity from "./entities/entity";
import { getScreenPosition, sprite } from "./rendering";
import Position from "@/types/position";
import { getDistance } from "@/utilities/mathUtils";
import { events } from "./events/eventManager";
import { BoltSpell } from "./spells/boltSpell";
import { AuraSpell } from "./spells/auraSpell";

const MIN_WATER_WIDTH = 40

export class Engine{
    private running: boolean = false;
    private ctx!: CanvasRenderingContext2D;
    private centerRingPosition!: Position;

    private entities: Entity[] = []

    private grapeShotArt!: HTMLImageElement
    private goldBoltArt!: HTMLImageElement

    private animationFrameId: number | null = null;
    
    private prevTimestamp: number | null = null;

    constructor(private battleCanvas: HTMLCanvasElement) {
        try{
            this.ctx = this.battleCanvas.getContext("2d") as CanvasRenderingContext2D
            if (!this.ctx){
                throw new Error("Invalid canvas context")
            }

            this.ctx.imageSmoothingEnabled = false;

            const wizard1Art = new Image();
            wizard1Art.src = "/assets/grape-omancer.png";

            const wizard2Art = new Image();
            wizard2Art.src = "/assets/gilded-wizard.png";

            const grapeShotArt = new Image();
            grapeShotArt.src = "/assets/grape-shot.png";

            const goldBoltArt = new Image();
            goldBoltArt.src = "/assets/gold-bolt.png";
            
            const blueBlastArt = new Image();
            blueBlastArt.src = "/assets/blue-blast.png";

            const redRayArt = new Image();
            redRayArt.src = "/assets/red-ray.png";

            const aura1Art = new Image();
            aura1Art.src = "/assets/aura-of-death.png";

            const hollowPurple = new Image();
            hollowPurple.src = "/assets/hollow-purple.png";

            this.centerRingPosition = {x: 0, y: 0};

            const spell1 = new BoltSpell({image: blueBlastArt, knockback: 0.11, castTime: 0.21, travelSpeed: 2.5})
            const spell4 = new BoltSpell({image: redRayArt, knockback: 0.11, castTime: 0.37, travelSpeed: 2.2})
            const spell3 = new BoltSpell({image: grapeShotArt, knockback: 20, castTime: 30, travelSpeed: 1.8})
            const text = new AuraSpell({image: hollowPurple, knockback: 0, castTime: 25, duration: 6, yOffset: 0.1})
            const prefire = new AuraSpell({image: grapeShotArt, knockback: 0, castTime: 25, duration: 5, yOffset: -0.05})
            const wizard1 = new Wizard({startingPosition: {x:0.55, y:-0.55}, image: wizard1Art, spells: [spell1, spell3, spell4, text, prefire], speed: 0.25, width: 0.3, moveTarget: this.centerRingPosition});

            const spell2 = new BoltSpell({image: goldBoltArt, knockback: 1.4, castTime: 1, travelSpeed: 2})
            const wizard2 = new Wizard({startingPosition: {x:-0.55, y:0.55}, image: wizard2Art, spells: [spell2], speed: 0.3, width: 0.3, moveTarget: this.centerRingPosition});

            wizard1.target = wizard2
            wizard2.target = wizard1

            this.entities.push(wizard1)
            this.entities.push(wizard2)

            events.on("collision", ({entity1, entity2}) => {
                this.handleCollision(entity1, entity2)
            })

            events.on("castSpell", ({spell, caster}) => {
                this.createSpellProjectile(spell, caster)
            })

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

        let dt = (timestamp - this.prevTimestamp) / 1000        // Get amount of time passed in seconds

        dt = Math.min(dt, 0.1);                                  // cap time passed at 0.1 seconds

        this.prevTimestamp = timestamp                          // rest previous timestampf or next dt calculation

        this.update(dt)
        this.render()

        this.animationFrameId = requestAnimationFrame(this.frame)
    }

    private update(dt: number) {
        

        for(let i = 0; i < this.entities.length; i++){
            const e = this.entities[i]
            if (e.dead) this.entities.splice(i, 1)
            else {
                e.move({dt: dt})
                this.detectCollisions(e)
            }
        }

        for(const e of this.entities){
            e.update(dt)
        }
    }

    private render() {
        this.ctx?.clearRect(0, 0, this.battleCanvas.width, this.battleCanvas.height)

        this.ctx.fillStyle = "#049c9c"
        this.ctx.fillRect(0, 0, this.battleCanvas.width, this.battleCanvas.height)

        // --- DRAW A FILLED CIRCLE ---
        this.ctx.beginPath();          // Reset path for the next shape
        this.ctx.arc(0.5*this.battleCanvas.width, 0.5*this.battleCanvas.width, (0.5*this.battleCanvas.width-MIN_WATER_WIDTH), 0, 2 * Math.PI);
        this.ctx.fillStyle = "#66645e";    // Set fill color
        this.ctx.fill();               // Render the filled shape

        for(const e of this.entities){
            sprite(this.ctx, e.image, getScreenPosition(e.position, this.battleCanvas), e.velocity.dx)
        }
    }

    private detectCollisions(e1: Entity){
        for(const e2 of this.entities){
            if (getDistance(e1.position, e2.position) < e1.width && e1 !== e2){
                events.emit("collision", {entity1: e1, entity2: e2})
            }
        }
    }

    private handleCollision(e1: Entity, e2: Entity){
        e1.collideWith(e2)
    }

    private createSpellProjectile(spell: Spell, caster: Wizard){
        const projectile = spell.newCast(caster)
        if (projectile) this.entities.push(projectile)
    }

    private cleanupDeadEntities() {
    }


}