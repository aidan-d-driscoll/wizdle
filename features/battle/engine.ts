import Combatant from "@/features/battle/entities/combatant";
import { Position } from "@/types/position";
import CollisionManager from "./collisions/collisionManager";
import { Sprite } from "./rendering/sprite";
import { GameObject } from "./objects/gameObject";
import Vector from "@/types/vector";
import { CollisionBody } from "./collisions/collisionBody";
import { Circle } from "@/types/shapes/circle";

const MIN_WATER_WIDTH = 40

const DEV_TOOLS_ENABLED = true;

const VISIBLE_COLLISION_BOXES = true;
const INITIAL_BATTLE_SPEED = 1;

export type updateOptions = {
    dt: number,
    engine: Engine
}

export class Engine{
    private running: boolean = false;
    readonly ctx!: CanvasRenderingContext2D;

    private cm: CollisionManager = new CollisionManager();

    private objects = new Map<number, GameObject>
    private destructionQueue: GameObject[] = []

    private animationFrameId: number | null = null;
    
    private prevTimestamp: number | null = null;

    private battlePaused: boolean = false;
    private battleSpeed: number = INITIAL_BATTLE_SPEED;

    constructor(readonly canvas: HTMLCanvasElement) {
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

            const tombstone = new Image();
            tombstone.src = "/assets/tombstone.png";

            const wizard1 = new Combatant({
                engine: this,
                team: 1, 
                position: {x:0.5, y:-0.5},
                visible: true,
                velocity: new Vector({dx: 0, dy: 0}),
                maxHP: 100,
                moveSpeed: 0.2,
                prefferedPosition: {x:0, y:0},
                sprites: [
                    new Sprite({
                        image: grapeWizardArt,
                        width: 0.2,
                        height: 0.2
                    })
                ],
                collisionBody: new CollisionBody({
                    shape: new Circle({
                        radius: 0.1
                    })
                })
            })

            const wizard2 = new Combatant({
                engine: this,
                team: 2, 
                position: {x:-0.5, y:0.5},
                visible: true,
                velocity: new Vector({dx: 0, dy: 0}),
                maxHP: 100,
                moveSpeed: 0.201,
                prefferedPosition: {x:0, y:0},
                sprites: [
                    new Sprite({
                        image: goldWizardArt,
                        width: 0.2,
                        height: 0.2
                    })
                ],
                collisionBody: new CollisionBody({
                    shape: new Circle({
                        radius: 0.1
                    })
                })
            })
            
            this.addObject(wizard1)
            this.addObject(wizard2)

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
                                this.update({dt: -1/60, engine: this})
                                this.render()
                            } else {
                                this.battleSpeed = Math.max(0.001, this.battleSpeed-0.25);
                            }
                            break;
                        case 'arrowright':
                            if (this.battlePaused) {
                                this.update({dt: 1/60, engine: this})
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

        // reset previous timestamp for next dt calculation
        this.prevTimestamp = timestamp                          

        if(!this.battlePaused){
            dt *= this.battleSpeed;
            this.update({dt: dt, engine: this});
            this.render();
        } else {
            dt = 0
        }

        this.animationFrameId = requestAnimationFrame(this.frame)
    }

    private update(args: updateOptions) {
        for(const obj of this.objects){
            // every object has an update function meant to manage frame-by-frame logic
            obj[1].update(args)
        }

        this.cm.update()

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

        for(const sp of this.objects){
            sp[1].render(this)
        }

        if(VISIBLE_COLLISION_BOXES){
            for(const cb of this.cm.handles.keys()){
                cb.render(this)
                //sprite(this.ctx, e.image, getScreenPosition(e.position, this.canvas), e.velocity.dx)
            }
        }
    }

    addObject(obj: GameObject){
        this.objects.set(obj.id, obj)

        if (obj.cb) { this.cm.add(obj.cb) }
    }

    addStaticSprite(sp: Sprite, pos: Position){
        this.addObject(new GameObject({
            engine: this,
            position: pos,
            sprites: sp
        }))
    }

    markForDestruction(obj: GameObject){
        if (!obj.dead){
            obj.dead = true;
            this.destructionQueue.push(obj)
        }
    }

    private processDestruction(){
        if (this.destructionQueue.length === 0) return;

        for (const obj of this.destructionQueue){


            // if (e.sprite) this.sprites.delete(e.sprite.id)

            // if(e.collisionBody) {
            //     this.cm.remove(e.collisionBody)
            // }
        }
    }
}