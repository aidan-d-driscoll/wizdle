type FieldSpec = { bits: number, min?: number, max?: number, step?: number}
type ByteValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

export type Schema = {
    bytes: ByteValue;
    fields: Record<string, FieldSpec>
}

export type ValueList<S extends Schema> = { [K in keyof S["fields"]]: number }

export class PackedRecord<S extends Schema> {
    constructor(
        private readonly schema: S,
        public values: ValueList<S>
    ){
        this.validate();
    }

    get totalBits(): number {
        return Object.values(this.schema.fields).reduce((n, f) => n + f.bits, 0);
    }

    private validate(): void {
        if (this.totalBits > (this.schema.bytes*8)){
            throw new RangeError(`${this.totalBits} bits cannot fit into ${this.schema.bytes} bytes`)
        }
        for (const [key, value] of Object.entries(this.values)){
            const spec = this.schema.fields[key];

            // Set optional spec fields to defaults
            spec.min = spec.min ?? 0;
            spec.max = spec.max ?? (((2**spec.bits)-1) + spec.min);
            spec.step = spec.step ?? 1;

            if (value < spec.min || value > spec.max){
                throw new RangeError(`Key: ${key} - ${value} outside of [${spec.min}, ${spec.max}]`);
            }

            if (Math.floor(value % spec.step) >= 1){
                console.log(value % spec.step)
                throw new RangeError(`Key: ${key} - ${value} does not fit into schema step: ${spec.step}`);
            }
        }
    }

    pack(): Uint8Array{
        const buf = new ArrayBuffer(this.schema.bytes);
        const out = new Uint8Array(buf);

        let currentByte = this.schema.bytes - 1;
        let freeBits = 8;

        for (const [key, value] of Object.entries(this.values)){
            const spec = this.schema.fields[key];
            const min = spec.min ?? 0;
            const step = spec.step ?? 1;

            let valueBits = spec.bits;
            let temp = Math.ceil((value-min)/step);

            while (valueBits > 0){
                const bits = Math.min(freeBits, valueBits)
                const mask = ((2**bits)-1)

                out[currentByte] |= (temp & mask) << (8-freeBits)

                freeBits -= bits;
                valueBits -= bits;
                temp >>= bits;

                if (freeBits <= 0){
                    currentByte -= 1;
                    freeBits = 8;
                }
            }
        }

        return out;
    }

    static unPack<S extends Schema>(schema: S, packed: Uint8Array): PackedRecord<S> {
        const out: Record<string, number> = {};

        let currentByte = schema.bytes - 1;
        let freeBits = 8;
        let temp = packed[currentByte]

        for(const [key, spec] of Object.entries(schema.fields)){
            const min = spec.min ?? 0;
            const step = spec.step ?? 1;

            out[key] = 0;
            let valueBits = spec.bits;
            let processedValueBits = 0;
            while(valueBits > 0){
                const bits = Math.min(freeBits, valueBits)
                const mask = ((2**bits)-1)

                out[key] |= (temp & mask) << processedValueBits

                processedValueBits += bits
                freeBits -= bits;
                valueBits -= bits;
                temp >>= bits;

                if (freeBits <= 0){
                    currentByte -= 1;
                    freeBits = 8;
                    temp = packed[currentByte]
                }
            }
            out[key] = (out[key] * step) + min
        }
        return new PackedRecord(schema, out as ValueList<S>);
    }
}