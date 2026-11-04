type FieldSpec = { bits: number, min?: number, max?: number, step?: number}
type byteValue = 1 | 2 | 3 | 4

export type Schema = {
    bytes: byteValue,
    fields: Record<string, FieldSpec>
}

export type ValueList<S extends Schema> = {[K in keyof S["fields"]]: number}