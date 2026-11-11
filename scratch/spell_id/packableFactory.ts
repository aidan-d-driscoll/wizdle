import { definitelyGreater, isNearInteger } from "@/lib/utilities/mathUtils";
import { CompiledField, PackableConstructor, Schema, ValueList } from "./types";
import { getRandomNumber } from "@/lib/utilities/mathUtils";

const MAX_FIELD_BITS = 53;
const MAX_BYTES = 16;

function compileSchema(schema: Schema): CompiledField[]{
    if (!Number.isInteger(schema.bytes) || schema.bytes < 1 || schema.bytes > MAX_BYTES) {
        throw new RangeError(`bytes must be an integer in [1, 16], got ${schema.bytes}`);
    }

    let offset = 0;
    const fields: CompiledField[] = [];

    for (const [key, spec] of Object.entries(schema.fields)){
        if (!Number.isInteger(spec.bits) || spec.bits < 1 || spec.bits > MAX_FIELD_BITS) {
            throw new RangeError(`Field ${key}: bits must be an integer in [1, ${MAX_FIELD_BITS}]`);
        }

        const min = spec.min ?? 0;
        const step = spec.step ?? 1;
        if (!(step > 0)) throw new RangeError(`Field ${key}: step must be > 0`);

        const maxRaw = 2 ** spec.bits - 1;
        const maxRepresentable = min + maxRaw * step;
        const max = spec.max ?? maxRepresentable;

        if (definitelyGreater(max, maxRepresentable)){
            throw new RangeError(`Field ${key}: max ${max} cannot be represented in ${spec.bits} bits (limit ${maxRepresentable})`);
        }
        if (max < min) throw new RangeError(`Field ${key}: max < min`);

        fields.push({ key, offset: BigInt(offset), bits: spec.bits, min, max, step, maxRaw });
        offset += spec.bits

        if (offset > schema.bytes * 8) {
            throw new RangeError(`${offset} bits cannot fit into ${schema.bytes} bytes`);
        }
    }
    return fields;
}

function toRaw(spec: CompiledField, value: number): number {
    if (Number.isNaN(value)){
        throw new TypeError(`Field ${spec.key}: ${value} is not a number`);
    }
    if (value < spec.min || value > spec.max) {
        throw new RangeError(`Field ${spec.key}: ${value} outside of [${spec.min}, ${spec.max}]`);
    }

    const raw = Math.round((value - spec.min) / spec.step);
    if (!isNearInteger(raw)){
        throw new RangeError(`Field ${spec.key}: ${value} does not align to step ${spec.step} (from ${spec.min})`);
    }
    return raw;
}

function fromRaw(f: CompiledField, raw: number): number {
    return Number((f.min + raw * f.step).toPrecision(12));
}

function bytesToBig(bytes: Uint8Array): bigint{
    let out = BigInt(0);
    for (const b of bytes) out = (out << BigInt(8)) | BigInt(b);
    return out;
}

function bigToBytes(n: bigint, length: number): Uint8Array {
    const out = new Uint8Array(length);
    for (let i = length - 1; i >= 0; i--) {
        out[i] = Number(n & BigInt(0xff));
        n >>= BigInt(8);
    }
    return out;
}

export function definePackable<S extends Schema>(schema: S){
    const layout = compileSchema(schema);
    const totalBits = layout.reduce((n, f) => n + f.bits, 0)
    const idLimit = BigInt(1) << BigInt(schema.bytes * 8)

    return class Packable {
        static readonly schema: S = schema;
        static readonly byteLength = schema.bytes;
        static readonly totalBits = totalBits;

        readonly values: Readonly<ValueList<S>>;
        readonly doc: Record<string, any> = {};

        constructor(values: ValueList<S>){
            const known = new Set(layout.map((field) => field.key))
            for (const key of Object.keys(values)){
                if (!known.has(key)) throw new RangeError(`Unknown field: ${key}`);
            }

            for (const f of layout) {
                toRaw(f, values[f.key]); // validates; throws on missing/invalid
            }
            this.values = Object.freeze({...values});
        }

        static fromBytes<R>(this: PackableConstructor<S, R>, bytes: Uint8Array): R {
            if (bytes.length !== schema.bytes) {
                throw new RangeError(`Expected ${schema.bytes} bytes, got ${bytes.length}`);
            }
            const acc = bytesToBig(bytes);
            const out: Record<string, number> = {};
            for (const f of layout) {
                const raw = Number((acc >> f.offset) & ((BigInt(1) << BigInt(f.bits)) - BigInt(1)));
                out[f.key] = fromRaw(f, raw);
            }
            return new this(out as ValueList<S>);
        }

        static fromID<R>(this: PackableConstructor<S, R>, id: bigint | number): R {
            const big = BigInt(id);
            if (big < BigInt(0) || big >= idLimit) {
                throw new RangeError(`ID ${id} does not fit in ${schema.bytes} bytes`);
            }
            return (Packable.fromBytes as typeof Packable.fromBytes<R>).call(
                this,
                bigToBytes(big, schema.bytes)
            );
        }

        static generateRandom<R>(this: PackableConstructor<S, R>): R{
            let id = BigInt(0);
            for (const f of layout) {
                const value = getRandomNumber({max: f.max, min: f.min, step: f.step})
                const raw = toRaw(f, value);
                id |= BigInt(raw) << f.offset;
            }
            return (Packable.fromID as typeof Packable.fromID<R>).call(
                this,
                id
            );
        }

        toId(): bigint {
            let out = BigInt(0);
            for (const f of layout) {
                const raw = toRaw(f, (this.values as Record<string, number>)[f.key]);
                out |= BigInt(raw) << f.offset;
            }
            return out;
        }

        pack(): Uint8Array {
            return bigToBytes(this.toId(), schema.bytes);
        }

        /** Immutable update: returns a new instance of the same class. */
        updateValues(changes: Partial<ValueList<S>>): this {
            const Ctor = this.constructor as PackableConstructor<S, this>;
            return new Ctor({ ...this.values, ...changes } as ValueList<S>);
        }
    }
}

