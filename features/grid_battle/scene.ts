import { drawCircle, drawHex } from "@/lib/shapes/utils";
import { Grid } from "./grid/grid";

const DEV_TOOLS_ENABLED = true;
const INITIAL_BATTLE_SPEED = 1;

const HEX_WIDTH = 40

export class Scene{
    readonly canvas: HTMLCanvasElement;
    readonly gridCanvas: HTMLCanvasElement;

    private running: boolean = false;
    readonly ctx: CanvasRenderingContext2D;
    readonly gridCtx: CanvasRenderingContext2D;

    private animationFrameId: number | null = null;
    
    private prevTimestamp: number | null = null;

    private battlePaused: boolean = false;
    private battleSpeed: number = INITIAL_BATTLE_SPEED;

    grid!: Grid;

    constructor(canvas: HTMLCanvasElement, gridCanvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.gridCanvas = gridCanvas;

        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
        this.gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D

        this.ctx.imageSmoothingEnabled = false;
        this.gridCtx.imageSmoothingEnabled = false;
        
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
                            this.update(-1/120)
                            this.render()
                        } else {
                            this.battleSpeed = Math.max(0.001, this.battleSpeed-0.25);
                        }
                        break;
                    case 'arrowright':
                        if (this.battlePaused) {
                            this.update(1/120)
                            this.render()
                        } else {
                            this.battleSpeed = Math.min(2, this.battleSpeed+0.25);
                        }
                        break;
                    default:
                        return; 
                }
                event.preventDefault(); 
            });
        }
    }

    async start() {
        // prevents two instances from running at once
        if (this.running) return;

        this.grid = new Grid(3);
        this.grid.render(this.gridCtx, HEX_WIDTH);

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
     */
    private update(dt:number) {
        this.render()
    }

    private render() {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // this.ctx.fillStyle = "#838383"
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        drawCircle({ctx: this.ctx, x: 500, y: 500, radius: (HEX_WIDTH*(5/8)), fillColor: "#3d0c8b", borderWidth: 3})        
    }
}