import { BeamData, MissileData, SpellData } from "./types";

export abstract class Spell<S extends SpellData>{
    data: S;

    constructor(data: S){
        this.data = data;
    }

    abstract cast(): void;
}

export class Beam extends Spell<BeamData>{
    cast(){
        console.log(`Hocus Beamus`)
        console.log(`Width: ${this.data.width}`)
    }
}

export class Missile extends Spell<MissileData>{
    cast(){
        console.log(`Abraca-missile`)
        console.log(`Speed: ${this.data.speed}`)
    }
}