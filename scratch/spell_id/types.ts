type FieldSpec = { bits: number, min?: number, max?: number, step?: number}
type ByteValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

export type CompiledField = {
    key: string;
    offset: bigint;
    bits: number;
    min: number;
    max: number;
    step: number;
    maxRaw: number;
}

export type Schema = {
    bytes: ByteValue;
    fields: Record<string, FieldSpec>
}

export type ValueList<S extends Schema> = { [K in keyof S["fields"]]: number }

export type PackableConstructor<S extends Schema, R = unknown> =
    new (values: ValueList<S>) => R;