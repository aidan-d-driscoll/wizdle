import { Renderable, Updatable } from "./components/interfaces";
import { Entity } from "./entity";
import { GameObject } from "./gameObject";
import Vector from "./types/vector";
import { RenderLayer } from "./globals";
import { Sprite } from "./components/sprite";
import { Body, BodyType, ForceMode } from "./components/body";
import { Collider } from "./components/collider";
import { Ellipse } from "./shapes/ellipse";
import CollisionManager from "./collisions/collisionManager";

const DEV_TOOLS_ENABLED = true;

const VISIBLE_COLLISION_BOXES = true;
const INITIAL_BATTLE_SPEED = 1;

export class Scene{
    private running: boolean = false;
    readonly ctx!: CanvasRenderingContext2D;

    readonly dirtyColliders: Collider[] = [];

    readonly cm = new CollisionManager(this);
    // readonly tm = new TargetManager();
    // readonly gm = new GroundManager();

    private entities: Entity[] = [];
    readonly updatables = new Set<Updatable>;
    readonly renderables: Renderable[][] = Array.from({ length: RenderLayer.COUNT }, () => [])
    private destructionQueue: Entity[] = [];

    private animationFrameId: number | null = null;
    
    private prevTimestamp: number | null = null;

    private battlePaused: boolean = false;
    private battleSpeed: number = INITIAL_BATTLE_SPEED;
    showColliders = VISIBLE_COLLISION_BOXES;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D

        this.ctx.imageSmoothingEnabled = false;

        const arenaArt = new Image();
        arenaArt.src = "/assets/testing-assets/arena-orig.jpg";

        const purpleWizardArt = new Image();
        purpleWizardArt.src = "/assets/testing-assets/grape-omancer.png";

        const redWizardArt = new Image();
        redWizardArt.src = "/assets/testing-assets/blood-sorcerer.png"

        const blueWizardArt = new Image();
        blueWizardArt.src = "/assets/testing-assets/rain-mage.png"

        const tombstone = new Image();
        tombstone.src = "/assets/testing-assets/tombstone.png";

        const iceCircle = new Image();
        iceCircle.src = "/assets/testing-assets/ice_circle.png";

        const background = new GameObject({
            scene: this,
            position: {x: 0, y: 0}
        })

        background.add(new Sprite({
            image: arenaArt,
            width: 3.3,
            height: 3.5,
            renderHeight: -10
        }))

        const wizard1 = new GameObject({
            scene: this,
            position: {x:-0.4, y:0.1}
        })

        wizard1.add(new Sprite({
            offset: {x: -0.01, y: 0.09},
            image: purpleWizardArt,
            width: 0.2,
            height: 0.2,
            renderHeight: 1
        }))

        const wizBody = wizard1.add(new Body({
            bodyType: BodyType.DYNAMIC,
            bounce: 1,
            mass: 1
        }))

        wizard1.add(new Collider({
            shape: new Ellipse({
                position: wizard1.position,
                radiusX: 0.09,
                radiusY: 0.09
            })
        }))
        
        this.add(wizard1)

        wizBody.applyForce(new Vector({dx: 1.27, dy: 0}), ForceMode.IMPULSE)

        const wizard2 = new GameObject({
            scene: this,
            position: {x:0.0, y:-0.55}
        })

        wizard2.add(new Sprite({
            offset: {x: -0.01, y: 0.08},
            image: redWizardArt,
            width: 0.2,
            height: 0.2,
            renderHeight: 1
        }))

        const wizBody2 = wizard2.add(new Body({
            bodyType: BodyType.DYNAMIC,
            bounce: 1,
            mass: 2
        }))

        wizard2.add(new Collider({
            shape: new Ellipse({
                position: wizard2.position,
                radiusX: 0.09,
                radiusY: 0.09
            })
        }))
        
        this.add(wizard2)

        wizBody2.applyForce(new Vector({dx: 0, dy: 1.5}), ForceMode.IMPULSE)
        
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
                            this.update(-1/60)
                            this.render()
                        } else {
                            this.battleSpeed = Math.max(0.001, this.battleSpeed-0.25);
                        }
                        break;
                    case 'arrowright':
                        if (this.battlePaused) {
                            this.update(1/60)
                            this.render()
                        } else {
                            this.battleSpeed = Math.min(2, this.battleSpeed+0.25);
                        }
                        break;
                    case 'c':
                        this.showColliders = !this.showColliders;
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
            this.update(dt);
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
    private update(dt:number) {
        for(const up of this.updatables){
            // every entity has an update function meant to manage frame-by-frame logic
            up.update(dt)
        }

        this.cm.update(dt)
        // this.tm.update(args)
        // this.gm.update(args)
        this.dirtyColliders.length = 0;

        this.processDestruction()

        this.render()
    }

    private render() {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = "#838383"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        for (const layerList of this.renderables){ 
            for(const r of layerList) { r.render() }
        }
    }

    add(e: Entity){
        this.entities.push(e)
        for (const child of e.children) { this.add(child) }
    }

    markForDestruction(e: Entity){
        this.destructionQueue.push(e)
    }

    markDirty(c: Collider){
        this.dirtyColliders.push(c)
    }

    private processDestruction(){
        if (this.destructionQueue.length === 0) return;

        for (const e of this.destructionQueue){
            const idx = this.entities.indexOf(e)
            if(e.parent) e.parent.removeChild(e)
            // if(e instanceof GameObject && e.cb) this.cm.remove(e.cb)
            // if(e instanceof Combatant) this.tm.remove(e)
            this.entities.splice(idx, 1)
        }

        this.destructionQueue.length = 0
    }
}