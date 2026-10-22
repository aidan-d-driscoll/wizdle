import { insertionSorted } from "@/features/battle/utilities/sortUtils";
import Combatant from "../entities/combatant";
import { UpdateOptions } from "../scene";

export class TargetManager{
    combatants = new Set<Combatant>

    update(args: UpdateOptions){
        for (const cmb of args.scene.dirtyColliders){
            if(cmb instanceof Combatant && this.combatants.has(cmb)) this.repositionCombatant(cmb)
        }
    }

    add(cmb: Combatant){
        this.combatants.add(cmb);

        for (const other of this.combatants){
            if(cmb.team === other.team){
                cmb.allies.push(other);
                other.allies.push(cmb);
            } else {
                cmb.enemies.push(other);
                other.enemies.push(cmb);
            }
        }

        this.repositionCombatant(cmb);
    }

    remove(cmb: Combatant){
        this.combatants.delete(cmb)

        for(const other of this.combatants){
            let idx = other.allies.indexOf(cmb);
            if(idx !== -1) other.allies.splice(idx, 1);

            idx = other.enemies.indexOf(cmb);
            if(idx !== -1) other.enemies.splice(idx, 1);
        }
    }

    repositionCombatant(cmb: Combatant){
        cmb.allies = insertionSorted(cmb.allies, (peer) => cmb.rawDistanceTo(peer));
        cmb.enemies = insertionSorted(cmb.enemies, (peer) => cmb.rawDistanceTo(peer));

        cmb.nearestEnemy = cmb.enemies[0]
        cmb.nearestAlly = cmb.allies[0]

        this.reposition(cmb, cmb.allies, o => o.allies);
        this.reposition(cmb, cmb.enemies, o => o.enemies);
    }

    private reposition(cmb: Combatant, peers: Combatant[], listOf: (o:Combatant) => Combatant[]){
        for (const other of peers){
            if(other === cmb) continue;
            const list = listOf(other);
            const from = list.indexOf(cmb);
            if(from === -1) continue;

            if(this.walk(other, list, from) !== from){
                other.nearestEnemy = other.enemies[0]
                other.nearestAlly = other.allies[0]
            }
        }
        
    }

    private walk(cmb: Combatant, list: Combatant[], from: number): number{
        while(from > 0 && cmb.closest(list[from], list[from-1]) === list[from]){
            const temp = list[from]
            list[from] = list[from-1]
            list[from-1] = temp

            from--;
        }

        while(from < list.length-1 && cmb.closest(list[from], list[from+1]) === list[from]){
            const temp = list[from]
            list[from] = list[from+1]
            list[from+1] = temp

            from++;
        }

        return from
    }
}