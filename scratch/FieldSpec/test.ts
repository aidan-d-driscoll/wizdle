import { Schema, ValueList } from "./types"

function toBinary<S extends Schema>(schema: Schema, values: ValueList<S>): Uint8Array{
    const buf = new ArrayBuffer(schema.bytes);
    const out = new Uint8Array(buf);

    let currentByte = schema.bytes - 1;
    let freeBits = 8;

    for (const [key, value] of Object.entries(values)){
        const spec = schema.fields[key];
        const min = spec.min ?? 0;
        const max = spec.max ?? (2**spec.bits)-1;
        const step = spec.step ?? 1;

        if (value < min || value > max){
            throw new RangeError(`${key} value outside of valid fields spec range`)
        }

        let valueBits = spec.bits;

        let bitValue = Math.ceil((value-min)/step);
        console.log(`Storing Key - ${key}: ${bitValue.toString(2).padStart(8, '0')}`)

        while (valueBits > 0){
            const bits = Math.min(freeBits, valueBits);
            console.log(`Bits: ${bits}`)
            const mask = (2**bits)-1;
            out[currentByte] |= (bitValue & mask) << (8-freeBits);
            console.log(`Temp: ${out[currentByte].toString(2).padStart(8, '0')}`)

            freeBits -= bits;
            valueBits -= bits;
            bitValue >>= bits;

            if (freeBits === 0){
                currentByte -= 1;
                freeBits = 8;
            }
        }
    }

    return out;
}

function fromBinary<S extends Schema>(schema: Schema, packed: Uint8Array): ValueList<S> {
    const out = new Map<string, number>();

    let currentByte = schema.bytes - 1;
    let freeBits = 8;
    let temp = packed[currentByte];

    for (const [key, spec] of Object.entries(schema.fields)){
        const spec = schema.fields[key];
        const min = spec.min ?? 0;
        const step = spec.step ?? 1;

        let valueBits = spec.bits;
        let value = 0;

        console.log(`Getting Key - ${key}`)

        while (valueBits > 0){
            const bits = Math.min(freeBits, valueBits);
            console.log(`Temp: ${temp.toString(2).padStart(8, '0')}`)
            console.log(`Bits: ${bits}`)
            const mask = (2**bits)-1;
            value |= (temp & mask) << (spec.bits - valueBits)

            freeBits -= bits;
            valueBits -= bits;
            temp >>= bits;

            if (freeBits === 0){
                currentByte -= 1;
                freeBits = 8;
                temp = packed[currentByte]
            }
        }
        value = (value * step) + min
        out.set(key, value);
        console.log(`Got Value: ${value}`)
    }

    return out.entries() as ValueList<S>;
}

const testSchema: Schema = {
    bytes: 4,
    fields: {
        cooldown: { bits: 8, min: 0.3, max: 2, step: 0.01},
        damage: { bits: 4, min: 20, max: 100, step: 5},
        size: { bits: 7, min: 1, max: 100},
        speed: { bits: 7, min: 1, max: 100}
    }
}

function main(){
    const bin = toBinary(testSchema, { cooldown: 1.56, damage: 55, size: 89, speed: 34})

    for (const byte of bin){
        console.log(byte.toString(2).padStart(8, '0'))
    }

    console.log(fromBinary(testSchema, bin))
}

main()