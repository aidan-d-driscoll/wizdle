import { CollisionBox } from "./collisionBox";

interface Endpoint {
    readonly cb: CollisionBox
    readonly isMin: boolean
    xPos: number
    slot: number
}

interface Handle {
    minEp: Endpoint
    maxEp: Endpoint
}

export default class CollisionManager{
    endpoints: Endpoint[] = [];
    handles = new Map<CollisionBox, Handle>();
    collisionCandidates = new Map<number, {boxA: CollisionBox, boxB: CollisionBox}>

    update(): void {
        for (const cb of this.handles.keys()){
            if(cb.dirty){
                this.repositionCollisionBox(cb)
            }
        }

        this.logEndpoints()

        let cands = "Collision candidates: "
        let c;
        for (const key of this.collisionCandidates.keys()){
            c = this.collisionCandidates.get(key)
            if (c) cands += `\n > box${c.boxA.id} <-> box${c.boxB.id}`
        }

        console.log(cands +"\n")

        for (const candidate of this.collisionCandidates){
            if(candidate[1].boxA.tight.overlaps(candidate[1].boxB.tight))
                console.log(`EMIT COLLISION EVENT PLACEHOLDER [box${candidate[1].boxA.id} <-> box${candidate[1].boxB.id}]`)
        }
        console.log("----------------------------------------------------------------------------------")
    }    

    add(cb: CollisionBox){
        const newMinEp: Endpoint = {cb: cb, isMin: true, xPos: cb.fat.xMin, slot: -1};
        const newMaxEp: Endpoint = {cb: cb, isMin: false, xPos: cb.fat.xMax, slot: -1};

        const numSlots = this.endpoints.length;

        let i = 0;
        while(i < numSlots){
            if (newMinEp.slot == -1 && cb.fat.xMin < this.endpoints[i].xPos) {
                newMinEp.slot = i
                this.endpoints.splice(i, 0, newMinEp)
                i++;
            }
            if (newMinEp.slot !== -1 && cb.fat.xMax < this.endpoints[i].xPos) {
                newMaxEp.slot = i
                this.endpoints.splice(i, 0, newMaxEp)
                break;
            }
            i++;
        }
        if (newMinEp.slot == -1){
            this.endpoints.push(newMinEp)
            newMinEp.slot = i
            i++;
        }
        if (newMaxEp.slot == -1){
            this.endpoints.push(newMaxEp)
            newMaxEp.slot = i
            i++;
        }
        
        this.handles.set(cb, {minEp: newMinEp, maxEp: newMaxEp})

        this.correctEndpointSlots();

        this.logEndpoints()
    }

    remove(cb: CollisionBox): void{
        const handle = this.handles.get(cb)
        if (handle){
            this.endpoints.splice(handle.maxEp.slot, 1)
            this.endpoints.splice(handle.minEp.slot, 1)

            this.handles.delete(cb)

            this.correctEndpointSlots()
        }
    }

    private pairKey(cbA: CollisionBox, cbB: CollisionBox){
        const x = cbA.id < cbB.id ? cbA.id : cbB.id;
        const y = cbA.id < cbB.id ? cbB.id : cbA.id;
        return x + y * y;
    }

    private swap(epA: Endpoint, epB: Endpoint): void {
        this.endpoints[epA.slot] = epB
        this.endpoints[epB.slot] = epA

        const temp = epA.slot;
        epA.slot = epB.slot;
        epB.slot = temp;

        if (epA.cb.id === epB.cb.id) return;
        if (epA.isMin === epB.isMin) return;

        const minEp = epA.isMin ? epA : epB;
        const maxEp = epA.isMin ? epB : epA;
        const key = this.pairKey(minEp.cb, maxEp.cb);

        if (minEp.slot < maxEp.slot){
            this.collisionCandidates.set(key, {boxA: epA.cb, boxB: epB.cb})
        } else this.collisionCandidates.delete(key);
    }

    // On a breach, after cb has created its new fatBox
    private repositionCollisionBox(cb: CollisionBox): void{

        const handle = this.handles.get(cb)
        if (!handle) {
            console.error("[Error] Attempted to reposition unknown CollisionBox");
            return;
        }

        const minEndpoint = handle.minEp;
        const maxEndpoint = handle.maxEp;
        const oldMin = minEndpoint.xPos;
        
        minEndpoint.xPos = cb.fat.xMin;
        maxEndpoint.xPos = cb.fat.xMax;

        if (cb.fat.xMin >= oldMin){
            this.repositionEndpoint(maxEndpoint)
            this.repositionEndpoint(minEndpoint)
        } else {
            this.repositionEndpoint(minEndpoint)
            this.repositionEndpoint(maxEndpoint)
        }

        cb.dirty = false;

        // this.logHandles();
    }

    private repositionEndpoint(ep: Endpoint){
        this.walkEndpointLeft(ep);
        this.walkEndpointRight(ep);
    }

    private walkEndpointLeft(ep: Endpoint): void {
        let idx = ep.slot - 1;
        while (idx >= 0 && ep.xPos < this.endpoints[idx].xPos) {
            this.swap(ep, this.endpoints[idx]);
            idx--;
        }
    }

    private walkEndpointRight(ep: Endpoint): void {
        let idx = ep.slot + 1;
        while (idx < this.endpoints.length && ep.xPos > this.endpoints[idx].xPos) {
            this.swap(ep, this.endpoints[idx]);
            idx++;
        }
    }

    private correctEndpointSlots() {
        for(let i = 0; i < this.endpoints.length; i++){
            this.endpoints[i].slot = i
        }
    }

    private logHandles() {
        let handles = "Handles:"
        for (const h of this.handles)
            handles += `\n > box${h[0].id}: min(${h[1].minEp.slot}), max(${h[1].maxEp.slot})`

        console.log(handles)
    }

    private logEndpoints() {
        let endpoints = "Endpoints: "
        for(const ep of this.endpoints){
            endpoints += ep.isMin ? `|${ep.xPos.toFixed(2)}(${ep.cb.id})` : ` (${ep.cb.id})${ep.xPos.toFixed(2)}|`
        }

        console.log(endpoints)
    }
}