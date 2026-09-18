export class GameEngine{
    private animationFrameId: number | null = null
    private running: boolean = false

    constructor(private game: HTMLCanvasElement) {}

    start() {
        this.running = true
        this.loop()
    }

    stop() {
        this.running = false

        if (this.animationFrameId !== null){
            cancelAnimationFrame(this.animationFrameId)
        }
    }

    private loop = () => {
        if (!this.running) return

        this.update()
        this.render()

        this.animationFrameId = requestAnimationFrame(this.loop)
    }

    private update() {
        // Update game state
    }

    private render() {
        const ctx = this.game.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, this.game.width, this.game.height)

        // Draw game
    }
}