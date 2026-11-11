import { drawHex } from "@/lib/shapes/utils";
import { getRandomFromList } from "@/lib/utilities/mathUtils";

const ID_BITS = 10;
const MAX_RADIUS = (2**ID_BITS)-1

const TILE_COLORS = [
    "#4e6824",
    "#537024",
    "#526d28",
    "#456824",
    
]

interface Tile {
    q: number,
    r: number,
    color: string
}

export class Grid {
    radius: number;
    tiles = new Map<number, Tile>

    constructor(radius: number){
        if (radius > MAX_RADIUS){
            throw new RangeError(`Grid radius exceeds maximum: ${radius} > ${MAX_RADIUS}`)
        }

        this.radius = radius;

        for (let r = -radius; r <= radius; r++) {
            for (let q = -radius; q <= radius; q++) {
                const s = -q - r;
                
                if (Math.abs(q) <= radius && Math.abs(r) <= radius && Math.abs(s) <= radius) {
                    this.tiles.set(this.toKey(q, r), { 
                        q: q, r: r, color: getRandomFromList(TILE_COLORS)
                    });
                    console.log(`adding (${q},${r})`);
                }
            }
        }
    }

    private toKey(q: number, r: number): number {
        const mask = (1 << ID_BITS) - 1;
        const OFFSET = MAX_RADIUS >> 1; 
        return ((q + OFFSET) & mask) | (((r + OFFSET) & mask) << ID_BITS);
    }

    getTile(q: number, r: number): Tile | undefined {
        return this.tiles.get(this.toKey(q, r));
    }

    render(ctx: CanvasRenderingContext2D, tileRadius: number) {
        const xSpacing = Math.sqrt(3) * (tileRadius*1.1);
        const ySpacing = 1.5 * (tileRadius*1.1);
    
        for (const tile of this.tiles.values()) {
            const x = xSpacing * (tile.q + tile.r / 2);
            const y = ySpacing * tile.r;
    
            console.log(`rendering (${tile.r}, ${tile.q}) at (${x}, ${y}), color: ${tile.color}`);
            drawHex({
                ctx: ctx,
                x: 500 + x,
                y: 500 + y,
                radius: tileRadius,
                fillColor: tile.color
            });
        }
    
        console.log("-----------------------------------------");
    }
}