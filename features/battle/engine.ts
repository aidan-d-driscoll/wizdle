import Combatant from "@/features/battle/entities/combatant";
import Position from "@/types/position";
import CollisionManager from "./collisions/collisionManager";
import { Sprite } from "./rendering/sprite";
import { GameObject } from "./objects/gameObject";
import Vector from "@/types/vector";

const MIN_WATER_WIDTH = 40

const DEV_TOOLS_ENABLED = true;
/*
 * Dev tool options:
 * * Click the canvas: Pause game
 * * Left arrow: reduce playback speed
 * * Right arrow: increase playback speed
 * * Spacebar: play 1 frame (can be used to start new playback)
 */

const VISIBLE_COLLISION_BOXES = false;
const INITIAL_BATTLE_SPEED = 1;

export type updateOptions = {
    dt: number,
    scene: Engine
}

export class Engine{
    private running: boolean = false;
    readonly ctx!: CanvasRenderingContext2D;

    private cm: CollisionManager = new CollisionManager();

    private objects = new Map<number, GameObject>
    private destructionQueue: GameObject[] = []
    readonly _teams = new Map<number, Map<number,Combatant>>

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
                scene: this,
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
                ]
            })

            const wizard2 = new Combatant({
                scene: this,
                team: 2, 
                position: {x:-0.5, y:0.5},
                visible: true,
                velocity: new Vector({dx: 0, dy: 0}),
                maxHP: 100,
                moveSpeed: 0.3,
                prefferedPosition: {x:0, y:0},
                sprites: [
                    new Sprite({
                        image: goldWizardArt,
                        width: 0.2,
                        height: 0.2
                    })
                ]
            })

            this.addStaticSprite(new Sprite({
                image: tombstone,
                height: 0.2,
                width: 0.2
            }), {x: 0.5, y: 0.5})
            
            this.addObject(wizard1)
            this.addObject(wizard2)

            // this.addEntity(new Platform({
            //     engine: this,
            //     startingPosition: {x:0, y:0}
            // }))

            // this.addEntity(new Wizard({
            //     engine: this,
            //     startingPosition: {x: 0.5, y: 0.5},   
            //     spells: [], 
            //     name: "Grandpa Grape", 
            //     prefferedPosition: {x:0, y:0},
            //     sprite: new Sprite({
            //         position: {x: 0.5, y: 0.5},
            //         image: grapeWizardArt,
            //         width: 96,
            //         height: 96,
            //         canvas: this.canvas,
            //     })
            // }))

            // this.addEntity(new Wizard({
            //     engine: this,
            //     startingPosition: {x: -0.5, y: -0.5},
            //     spells: [], 
            //     name: "General Goldie", 
            //     prefferedPosition: {x:0, y:0},
            //     sprite: new Sprite({
            //         startingPosition: {x: -0.5, y: -0.5},
            //         image: goldWizardArt,
            //         width: 96,
            //         height: 96,
            //         canvas: this.canvas,
            //     })
            // }))

            // this.entities[1].attackTarget = this.entities[2]
            // this.entities[2].attackTarget = this.entities[1]

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

            if (DEV_TOOLS_ENABLED){
                this.battlePaused = true;

                canvas.addEventListener("mousedown", () => {
                    this.battlePaused = !this.battlePaused; 
                });
    
                window.addEventListener('keydown', (event) => {
                    switch (event.key) {
                        case 'ArrowLeft':
                            this.battleSpeed = Math.max(0.1, this.battleSpeed-0.1);
                            break;
                        case 'ArrowRight':
                            this.battleSpeed = Math.min(5, this.battleSpeed+0.1);
                            break;
                        case ' ':
                            if (this.battlePaused) {
                                this.update({dt: 1/60, scene: this})
                                this.render()
                            }
                        default:
                            return; // Quit when other keys are pressed
                    }
                
                    // Optional: Prevent default browser behavior (like scrolling)
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
            this.update({dt: dt, scene: this});
            this.render();
        } else {
            dt = 0
        }

        this.animationFrameId = requestAnimationFrame(this.frame)
    }

    private update(args: updateOptions) {
        for(const obj of this.objects){
            // every entity will have an update function meant to manage frame-by-frame logic
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
                cb.renderOnto(this.canvas, this.ctx)
                //sprite(this.ctx, e.image, getScreenPosition(e.position, this.canvas), e.velocity.dx)
            }
        }
    }

    addObject(obj: GameObject){
        this.objects.set(obj.id, obj)

        if (obj instanceof Combatant){
            let allyTeam = this._teams.get(obj.team)

            if (!allyTeam){
                this._teams.set(obj.team, new Map<number, Combatant>)
                allyTeam = this._teams.get(obj.team)
            }

            if (allyTeam){
                allyTeam.set(obj.id, obj)
                obj.allies = allyTeam
            }

            this.updateTeams()
        }

        
        // if(e.collisionBody) {
        //     this.cm.add(e.collisionBody)
        // }
    }

    updateTeams() {
        for (const obj of this.objects.values()){
            if(obj instanceof Combatant){
                for (const team of this._teams){
                    if(team[0] !== obj.team) { 
                        
                        obj.enemies = new Map([...obj.enemies, ...team[1]])
                    }
                    else { obj.allies = team[1] }
                }
            }
        }
    }

    addStaticSprite(sp: Sprite, pos: Position){
        this.addObject(new GameObject({
            scene: this,
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