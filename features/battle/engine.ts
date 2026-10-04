import { Wizard } from "@/features/battle/entities/wizard";
import Spell from "@/features/battle/spells/spell";
import Entity from "@/features/battle/entities/entity";
import { getScreenPosition, sprite } from "@/features/battle/rendering/rendering";
import Position from "@/types/position";
import { getDistance } from "@/utilities/mathUtils";
import { events } from "@/features/battle/events/eventManager";
import { BoltSpell } from "@/features/battle/spells/boltSpell";
import { Sprite } from "./rendering/sprite";
import { CollisionBody } from "./collisions/collisionBody";
import CollisionManager from "./collisions/collisionManager";
import { Circle } from "@/types/shapes/circle";

const MIN_WATER_WIDTH = 40

const VISIBLE_COLLISION_BOXES = true;

export class Engine{
    private running: boolean = false;
    private ctx!: CanvasRenderingContext2D;
    private centerRingPosition!: Position;

    private cm: CollisionManager = new CollisionManager();

    private entities: Entity[] = []
    private sprites: Sprite[] = []
    private CollisionBodyes: CollisionBody[] = []

    private animationFrameId: number | null = null;
    
    private prevTimestamp: number | null = null;

    private battlePaused: boolean = true;

    constructor(private canvas: HTMLCanvasElement) {
        try{
            this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
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

            this.addEntity(new Wizard({
                startingPosition: {x: 0.5, y: 0.5},  
                width: 96, 
                height: 96, 
                spells: [], 
                name: "Grandpa Grape", 
                prefferedPosition: {x:0, y:0},
                sprite: new Sprite({
                    startingPosition: {x: 0.5, y: 0.5},
                    image: grapeWizardArt,
                    width: 96,
                    height: 96,
                    canvas: this.canvas,
                }),
                CollisionBody: new CollisionBody({
                    tight: new Circle({
                        startingPosition: {x: 0.5, y: 0.5}, 
                        radius: 0.1
                    })
                })
            }))

            this.addEntity(new Wizard({
                startingPosition: {x: -0.5, y: -0.5},  
                width: 96, 
                height: 96, 
                spells: [], 
                name: "General Goldie", 
                prefferedPosition: {x:0, y:0},
                sprite: new Sprite({
                    startingPosition: {x: -0.5, y: -0.5},
                    image: goldWizardArt,
                    width: 96,
                    height: 96,
                    canvas: this.canvas,
                }),
                CollisionBody: new CollisionBody({
                    tight: new Circle({
                        startingPosition: {x: 0.5, y: 0.5}, 
                        radius: 0.1
                    })
                    // startingPosition: {x: -0.5, y: -0.5},
                    // width: 0.15,
                    // height:0.2
                })
            }))

            this.entities[0].attackTarget = this.entities[1]
            this.entities[1].attackTarget = this.entities[0]

            // const spell1 = new BoltSpell({image: blueBlastArt})
            // const wizard1 = new Wizard({
            //     name: "grandpa grape",
            //     startingPosition: {x:0.55, y:-0.55}, 
            //     image: grapeWizardArt, spells: [spell1], 
            //     width: 0.10, 
            //     prefferedPosition: this.centerRingPosition
            // });

            // const spell2 = new BoltSpell({image: redRayArt})
            // const wizard2 = new Wizard({
            //     name: "general goldie",
            //     startingPosition: {x:-0.55, y:0.55}, 
            //     image: goldWizardArt, 
            //     spells: [spell2],
            //     width: 0.10,
            //     prefferedPosition: this.centerRingPosition
            // });

            // wizard1.attackTarget = wizard2
            // wizard2.attackTarget = wizard1

            // this.entities.push(wizard1)
            // this.entities.push(wizard2)

            // this lets wizards "access" the engine to create the spell effect entities without exporting the engine class
            // events.on("castSpell", ({spell, caster}) => {
            //     this.createSpellEffect(spell, caster)
            // })
            canvas.addEventListener("mousedown", () => { 
                console.log("pause click!")
                this.battlePaused = !this.battlePaused; 
            });

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

        if(!this.battlePaused){
            this.update(dt);
            this.render();
        } else {
            dt = 0
        }

        this.animationFrameId = requestAnimationFrame(this.frame)
    }

    private update(dt: number) {
        for(let i = 0; i < this.entities.length; i++){
            const e = this.entities[i]
            if (e.dead) this.entities.splice(i, 1)
            else {
                // every entity will have an update function meant to manage frame-by-frame logic
                e.update(dt)
            }
        }

        this.cm.update()
    }

    private render() {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = "#049c9c"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        // --- DRAW A FILLED CIRCLE ---
        this.ctx.beginPath();          // Reset path for the next shape
        this.ctx.arc(0.5*this.canvas.width, 0.5*this.canvas.width, (0.5*this.canvas.width-MIN_WATER_WIDTH), 0, 2 * Math.PI);
        this.ctx.fillStyle = "#66645e";    // Set fill color
        this.ctx.fill();               // Render the filled shape

        for(const sp of this.sprites){
            sp.renderOnto(this.canvas, this.ctx)
            //sprite(this.ctx, e.image, getScreenPosition(e.position, this.canvas), e.velocity.dx)
        }

        if(VISIBLE_COLLISION_BOXES){
            for(const cb of this.CollisionBodyes){
                cb.renderOnto(this.canvas, this.ctx)
                //sprite(this.ctx, e.image, getScreenPosition(e.position, this.canvas), e.velocity.dx)
            }
        }
    }

    private addEntity(e: Entity){
        this.entities.push(e);
        if (e.sprite) this.sprites.push(e.sprite)
        if (e.CollisionBody){
            this.CollisionBodyes.push(e.CollisionBody)
            this.cm.add(e.CollisionBody)
        }
    }
}