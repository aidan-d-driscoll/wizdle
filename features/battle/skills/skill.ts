import { Schema } from "@/lib/binary_ids/types";
import { fromBinary } from "@/lib/binary_ids/utils";

export class Skill{
    static schema: Schema = {
        bytes: 4,
        fields: {
            cooldown: { bits: 8, min: 0.3, max: 2, step: 0.01},
            damage: { bits: 4, min: 20, max: 100, step: 5},
            size: { bits: 7, min: 1, max: 100},
            speed: { bits: 7, min: 1, max: 100}
        }
    }
    data: Record<string, number>

    constructor(id: Uint8Array){
        this.data = fromBinary(Skill.schema, id)
    }
}