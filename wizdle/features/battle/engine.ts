import { Wizard } from "@/features/battle/entities/wizard";
import Spell from "@/features/battle/spells/spell";
import Entity from "@/features/battle/entities/entity";
import { getScreenPosition, sprite } from "@/features/battle/rendering/rendering";
import Position from "@/types/position";
import { getDistance } from "@/utilities/mathUtils";
import { events } from "@/features/battle/events/eventManager";
import { BoltSpell } from "@/features/battle/spells/boltSpell";

const MIN_WATER_WIDTH = 40

export class Engine{
    private running: boolean = false;
    private ctx!: CanvasRenderingContext2D;
    private centerRingPosition!: Position;

    private entities: Entity[] = []

    private animationFrameId: number | null = null;
    
    private prevTimestamp: number | null = null;

    constructor(private battleCanvas: HTMLCanvasElement) {
        try{
            this.ctx = this.battleCanvas.getContext("2d") as CanvasRenderingContext2D
            if (!this.ctx){
                throw new Error("Invalid canvas context")
            }

            this.ctx.imageSmoothingEnabled = false;

            const grapeWizardArt = new Image();
            grapeWizardArt.src = "/assets/grape-omancer.png";

            const goldWizardArt = new Image();
            goldWizardArt.src = "/assets/gilded-wizard.png";

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

            const hollowPurpleText = new Image();
            hollowPurpleText.src = "/assets/hollow-purple.png";

            // Use the center of the ring to give the wizards a preffered position
            this.centerRingPosition = {x: 0, y: 0};

            const spell1 = new BoltSpell({image: blueBlastArt})
            const wizard1 = new Wizard({
                name: "grandpa grape",
                startingPosition: {x:0.55, y:-0.55}, 
                image: grapeWizardArt, spells: [spell1], 
                width: 0.10, 
                prefferedPosition: this.centerRingPosition
            });

            const spell2 = new BoltSpell({image: redRayArt})
            const wizard2 = new Wizard({
                name: "general goldie",
                startingPosition: {x:-0.55, y:0.55}, 
                image: goldWizardArt, 
                spells: [spell2],
                width: 0.10,
                prefferedPosition: this.centerRingPosition
            });

            wizard1.attackTarget = wizard2
            wizard2.attackTarget = wizard1

            this.entities.push(wizard1)
            this.entities.push(wizard2)

            // this lets wizards "access" the engine to create the spell effect entities without exporting the engine class
            events.on("castSpell", ({spell, caster}) => {
                this.createSpellEffect(spell, caster)
            })

        } catch (error) {
            console.error("Error initializing Battle: " + error)
        }
    }

    start() {
        // prevents two instances from running at once
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

    // runs every frame of the animation
    private frame = (timestamp:number) => {
        if (!this.running) return

        if (this.prevTimestamp === null) {
            // the first timestamp will come in null, set it to the time on the first displayed frame instead
            this.prevTimestamp = timestamp;
        }

        // Get amount of time passed in seconds
        let dt = (timestamp - this.prevTimestamp) / 1000        

        // cap time passed at 0.1 seconds
        dt = Math.min(dt, 0.1);                                  

        // rest previous timestampf or next dt calculation
        this.prevTimestamp = timestamp                          

        this.update(dt)
        this.render()

        this.animationFrameId = requestAnimationFrame(this.frame)
    }

    private update(dt: number) {
        for(let i = 0; i < this.entities.length; i++){
            const e = this.entities[i]
            if (e.dead) this.entities.splice(i, 1)
            else {
                // every entity will have an update function meant to manage frame-by-frame logic
                e.update(dt)

                // check if this entity is colliding with anything and create a collision event when true
                this.detectCollisions(e)
            }
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
        // compare the distanc between every entity and every other entity
        for(const e2 of this.entities){
            // if widths overlap
            if (e1 !== e2 && getDistance({from: e1.position, to: e2.position}) < e1.width){
                // each entity handles its own collision logic
                e1.collideWith(e2)
            }
        }
    }

    // allows anything to emit a "castSpell" event and have a spell effect added to the entity list
    private createSpellEffect(spell: Spell, caster: Wizard){
        const projectile = spell.newCast(caster)
        if (projectile) this.entities.push(projectile)
    }


}