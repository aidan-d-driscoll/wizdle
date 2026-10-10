import { insertionSorted } from "@/utilities/sortUtils";
import Combatant from "../entities/combatant";

export class TargetManager{
    combatants: Combatant[] = []

    add(cmb: Combatant){
        this.combatants.push(cmb)

        for (const other of this.combatants){
            if(cmb.team === other.team){
                cmb.allies.push(other)
                other.allies.push(cmb)
            } else {
                cmb.enemies.push(other)
                other.enemies.push(cmb)
            }
        }

        this.repositionCombatant(cmb)
    }

    remove(cmb: Combatant){

    }

    repositionCombatant(cmb: Combatant){
        cmb.allies = insertionSorted(cmb.allies, (peer) => cmb.compDistanceTo(peer))
        cmb.enemies = insertionSorted(cmb.enemies, (peer) => cmb.compDistanceTo(peer))

        this.reposition(cmb, cmb.allies, o => o.allies)
        this.reposition(cmb, cmb.enemies, o => o.enemies)
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