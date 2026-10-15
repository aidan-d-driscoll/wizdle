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
import { getRandomFloat, setOptionalRandomNumber } from "@/features/battle/utilities/mathUtils";

const DEV_TOOLS_ENABLED = true;

const VISIBLE_COLLISION_BOXES = false;
const INITIAL_BATTLE_SPEED = 1;

export type UpdateOptions = {
    dt: number,

    scene: Scene
}

export class Scene{
    private running: boolean = false;
    readonly ctx!: CanvasRenderingContext2D;

    readonly dirtyQueue: GameObject[] = [];

    readonly cm: CollisionManager = new CollisionManager();
    readonly tm = new TargetManager();
    readonly gm = new GroundManager();

    private entities: Entity[] = []
    private destructionQueue: Entity[] = []

    private animationFrameId: number | null = null;
    
    private prevTimestamp: number | null = null;

    private battlePaused: boolean = false;
    private battleSpeed: number = INITIAL_BATTLE_SPEED;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D

        this.ctx.imageSmoothingEnabled = false;

        const arenaArt = new Image();
        arenaArt.src = "/assets/testing-assets/arena.jpg";

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

        this.add(new Sprite({
            position: {x: 0, y: 0},
            image: arenaArt,
            width: 3.1,
            height: 3.1,
            renderHeight: -1
        }))

        this.gm.add(
            new GroundTexture({
                scene: this,
                position: {x:0, y:0},
                friction: 1.5,
                cb: new CollisionBody({
                    shape: new Circle({
                        radius: 0.9
                    })
                })
            })
        )

        const iceWidth = setOptionalRandomNumber({min: 0.25, max: 0.55})
        const icePond = new GroundTexture({
            scene: this,
            position: {x:setOptionalRandomNumber({min:-0.1, max: 0.1}), y:setOptionalRandomNumber({min:-0.1, max: 0.1})},
            friction: 0.2,
            renderHeight: -0.1,
            cb: new CollisionBody({
                shape: new Circle({
                    radius: iceWidth
                })
            }),
            children: [
                new Sprite({
                    image: iceCircle,
                    width: iceWidth*2.1,
                    height: iceWidth*2.1
                })
            ]
        })

        this.add(icePond)

        this.gm.add(icePond)

        let wizardArtNum = getRandomFloat(0, 4)
        const wizardArt1 = new Image();
        
        if (wizardArtNum < 1){
            wizardArt1.src = "/assets/testing-assets/blood-sorcerer.png"
        } else if (wizardArtNum < 2){
            wizardArt1.src = "/assets/testing-assets/grass-druid.png"
        } else if (wizardArtNum < 3){
            wizardArt1.src = "/assets/testing-assets/rain-mage.png"
        } else{
            wizardArt1.src = "/assets/testing-assets/grape-omancer.png"
        }

        this.add(new Wizard({
            scene: this,
            position: {x: 0.5, y: 0.5},
            team: 1,
            renderHeight: 0.9,
            prefferedPosition: {x: 0, y: 0},
            cb: new CollisionBody({
                shape: new Circle({radius: 0.1})
            }),
            children: [
                new Sprite({
                    image: wizardArt1,
                    width: 0.2,
                    height: 0.2,
                    offset: {x: 0, y: 0.05}
                })
            ],
            spells: [],
            name: "Right-side Randy"
        }))

        wizardArtNum = getRandomFloat(0, 4)
        const wizardArt2 = new Image();
        
        if (wizardArtNum < 1){
            wizardArt2.src = "/assets/testing-assets/blood-sorcerer.png"
        } else if (wizardArtNum < 2){
            wizardArt2.src = "/assets/testing-assets/grass-druid.png"
        } else if (wizardArtNum < 3){
            wizardArt2.src = "/assets/testing-assets/rain-mage.png"
        } else{
            wizardArt2.src = "/assets/testing-assets/grape-omancer.png"
        }

        this.add(new Wizard({
            scene: this,
            position: {x: -0.5, y: -0.5},
            team: 2,
            renderHeight: 0.9,
            prefferedPosition: {x: 0, y: 0},
            cb: new CollisionBody({
                shape: new Circle({radius: 0.1})
            }),
            children: [
                new Sprite({
                    image: wizardArt2,
                    width: 0.2,
                    height: 0.2,
                    offset: {x: 0, y: 0.05}
                })
            ],
            spells: [],
            name: "Larry of the Left"
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
        for(const e of this.entities){
            // every entity has an update function meant to manage frame-by-frame logic
            e.update(args)
        }

        this.cm.update(args)
        this.tm.update(args)
        this.gm.update(args)
        this.dirtyQueue.length = 0;

        this.processDestruction()
    }

    private render() {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = "#0731b9"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

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
        this.entities.push(e)
        this.entities.sort((a,b) => {return a.renderHeight - b.renderHeight})
    }

    markForDestruction(e: Entity){
        this.destructionQueue.push(e)
    }

    markDirty(obj: GameObject){
        this.dirtyQueue.push(obj)
    }

    private processDestruction(){
        if (this.destructionQueue.length === 0) return;

        for (const e of this.destructionQueue){
            const idx = this.entities.indexOf(e)
            if(e.parent) e.parent.children.delete(e)
            if(e instanceof GameObject && e.cb) this.cm.remove(e.cb)
            if(e instanceof Combatant) this.tm.remove(e)
            this.entities.splice(idx, 1)
        }

        this.destructionQueue.length = 0
    }
}