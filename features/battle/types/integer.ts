export type Integer = number & { __brand: "Integer" }

export function integer(value: number): Integer {
    if (!Number.isInteger(value)) {
        throw new Error(`${value} is not an integer`)
    }
    return value as Integer;
}