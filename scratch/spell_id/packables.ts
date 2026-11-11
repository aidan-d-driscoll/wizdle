import { definePackable } from "./packableFactory";
import { Schema } from "./types";
import { deserializeRawID, serializeRawID } from "@/lib/api_functions/utils";

const SPELL_TYPE = ["Bolt", "Beam"]
const DAMAGE_TYPE = ["Piercing", "Bludgeoning", "Slashing", "Fire"]

const CURRENT_USER = "Jamie"

const skillSchema: Schema = {
    bytes: 16,
    fields: {
        spell_type: { bits: 1 },
        cooldown: { bits: 8, min: 0.3, max: 2, step: 0.01 },
        damage: { bits: 5, min: 20, max: 100, step: 5 },
        damage_type: { bits: 2 }
    }
}

export class SkillDoc extends Object{
    _id!: string;
    private _createdAt?: Date;
    private _user?: string;

    get createdAt(): Date {
        if (this._createdAt) return this._createdAt

        this._createdAt = new Date()
        return this._createdAt
    }
    set createdAt(value: Date) {
        this._createdAt = value;
    }

    get user(): string {
        if (this._user) return this._user;
        
        this._user = CURRENT_USER;
        return this._user;
    }
    set user(value: string) {
        this._user = value;
    }
}

export class Skill extends definePackable(skillSchema){
    doc = new SkillDoc();

    activate(){
        console.log(SPELL_TYPE[this.values.spell_type] + " spell deals " + this.values.damage + " " + DAMAGE_TYPE[this.values.damage_type] + " damage!\n > On cooldown for " + this.values.cooldown + " seconds")
    }

    static fromDoc(doc: SkillDoc): Skill{
        const out = Skill.fromBytes(deserializeRawID(doc._id));
        out.doc = doc;
        return out;
    }
    
    toDoc(): SkillDoc{
        this.doc ={
            _id: serializeRawID(this.pack()),
            createdAt: this.doc.createdAt,
            user: this.doc.user
        }
        return this.doc;
    }
}