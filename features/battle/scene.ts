import Combatant from "@/features/battle/entities/combatant";
import CollisionManager from "./collisions/collisionManager";
import { Sprite } from "./rendering/sprite";
import { CollisionBody } from "./collisions/collisionBody";
import { Circle } from "./collisions/shapes/circle";
import { Entity } from "./entities/entity";
import { GameObject } from "./entities/gameObject";
import { TargetManager } from "./targeting/targetManager";
import { Wizard } from "./entities/wizard";
import { GroundManager, GroundTexture } from "./physics/ground";

const MIN_WATER_WIDTH = 40

const DEV_TOOLS_ENABLED = true;

const VISIBLE_COLLISION_BOXES = true;
const INITIAL_BATTLE_SPEED = 1;

export type UpdateOptions = {
    dt: number,

    scene: Scene
}

export class Scene{
    private running: boolean = false;
    readonly ctx!: CanvasRenderingContext2D;

    readonly cm: CollisionManager = new CollisionManager();
    readonly tm = new TargetManager();
    readonly gm = new GroundManager();

    private entities = new Set<Entity>
    private destructionQueue: Entity[] = []

    private animationFrameId: number | null = null;
    
    private prevTimestamp: number | null = null;

    private battlePaused: boolean = false;
    private battleSpeed: number = INITIAL_BATTLE_SPEED;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D

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

        const tombstone = new Image();
        tombstone.src = "/assets/tombstone.png";

        this.gm.add(
            new GroundTexture({
                scene: this,
                position: {x:0, y:0},
                friction: 0.0005,
                cb: new CollisionBody({
                    shape: new Circle({
                        radius: 0.88
                    })
                })
            })
        )

        this.add(new Wizard({
            scene: this,
            position: {x: 0.5, y: 0.5},
            team: 1,
            maxHP: 100,
            moveSpeed: 0.3,
            prefferedPosition: {x: 0, y: 0},
            cb: new CollisionBody({
                shape: new Circle({radius: 0.1})
            }),
            children: [
                new Sprite({
                    image: goldWizardArt,
                    width: 0.2,
                    height: 0.2
                })
            ],
            spells: [],
            name: "General Goldie"
        }))

        this.add(new Wizard({
            scene: this,
            position: {x: -0.5, y: -0.5},
            team: 2,
            maxHP: 100,
            moveSpeed: 0.3,
            prefferedPosition: {x: 0, y: 0},
            cb: new CollisionBody({
                shape: new Circle({radius: 0.1})
            }),
            children: [
                new Sprite({
                    image: grapeWizardArt,
                    width: 0.2,
                    height: 0.2
                })
            ],
            spells: [],
            name: "Grandpa Grape"
        }))

        if (DEV_TOOLS_ENABLED){
            this.battlePaused = true;

            canvas.addEventListener("mousedown", () => {
                this.battlePaused = !this.battlePaused; 
            });

            window.addEventListener('keydown', (event) => {
                const k = event.key.toLowerCase();

                switch (k) {
                    case 'arrowleft':
                        if (this.battlePaused) {
                            this.update({dt: -1/60, scene: this})
                            this.render()
                        } else {
                            this.battleSpeed = Math.max(0.001, this.battleSpeed-0.25);
                        }
                        break;
                    case 'arrowright':
                        if (this.battlePaused) {
                            this.update({dt: 1/60, scene: this})
                            this.render()
                        } else {
                            this.battleSpeed = Math.min(2, this.battleSpeed+0.25);
                        }
                        break;
                    case ' ':
                        this.battlePaused = !this.battlePaused; 
                    default:
                        return; 
                }
                event.preventDefault(); 
            });
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

        // reset previous timestamp for next dt calculation
        this.prevTimestamp = timestamp                          

        if(!this.battlePaused){
            dt *= this.battleSpeed;
            this.update({dt: dt, scene: this});
            this.render();
        } else {
            dt = 0
        }

        this.animationFrameId = requestAnimationFrame(this.frame)
    }

    /**
     * Performs sim logic that happens between updates
     * 
     * @param dt - Time passed since last update
     * @param scene - {@link Scene} instance that is being updated
     */
    private update(args: UpdateOptions) {
        console.log(this.gm.groundTextures)
        for(const e of this.entities){
            // every entity has an update function meant to manage frame-by-frame logic
            e.update(args)
        }

        this.cm.update(args)
        this.tm.update(args)

        this.processDestruction()
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

        for(const e of this.entities){
            e.render(this)
        }

        if(VISIBLE_COLLISION_BOXES){
            for(const cb of this.cm.handles.keys()){
                cb.render(this)
                //sprite(this.ctx, e.image, getScreenPosition(e.position, this.canvas), e.velocity.dx)
            }
        }
    }

    add(e: Entity){
        this.entities.add(e)
    }

    markForDestruction(e: Entity){
        this.destructionQueue.push(e)
    }

    private processDestruction(){
        if (this.destructionQueue.length === 0) return;

        for (const e of this.destructionQueue){
            if(e.parent) e.parent.children.delete(e)
            if(e instanceof GameObject && e.cb) this.cm.remove(e.cb)
            if(e instanceof Combatant) this.tm.remove(e)
            this.entities.delete(e)
        }

        this.destructionQueue.length = 0
    }
}