import { CollisionBody } from "./collisionBody";
import { Collidable } from "./collidable";
import Vector from "@/types/vector";
import { Circle } from "@/types/shapes/circle";

interface Endpoint {
    readonly cb: CollisionBody
    readonly isMin: boolean
    xPos: number
    slot: number
}

interface Handle {
    minEp: Endpoint
    maxEp: Endpoint
}

function handlePhysicsOverlap(bodyA: CollisionBody, bodyB: CollisionBody){
    if(bodyA.tight instanceof Circle && bodyB.tight instanceof Circle){
        const push = new Vector({startPos: bodyA.tight.position, endPos: bodyB.tight.position})
        const overlap = bodyA.tight.radius + bodyB.tight.radius - push.magnitude;

        push.magnitude = overlap;

        bodyA.owner.position = {
            x: bodyA.owner.position.x - push.dx/2,
            y: bodyA.owner.position.y - push.dy/2
        }

        bodyB.owner.position = {
            x: bodyB.owner.position.x + push.dx/2,
            y: bodyB.owner.position.y + push.dy/2
        }
    }
}

export default class CollisionManager{
    endpoints: Endpoint[] = [];
    handles = new Map<CollisionBody, Handle>();
    collisionCandidates = new Map<number, {bodyA: CollisionBody, bodyB: CollisionBody}>
    activeCollisions = new Map<number, {bodyA: CollisionBody, bodyB: CollisionBody}>

    update(): void {

        for (const cb of this.handles.keys()){
            cb.update()
            if(cb.dirty){
                this.repositionCollisionBody(cb)
            }
        }

        let key: number;
        let tightBoxCollision: boolean;
        let bodyA: CollisionBody;
        let bodyB: CollisionBody;
        for (const candidate of this.collisionCandidates) {
            tightBoxCollision = candidate[1].bodyA.tight.overlaps(candidate[1].bodyB.tight)
            bodyA = candidate[1].bodyA
            bodyB = candidate[1].bodyB
            key = this.pairKey(bodyA, bodyB)
            if (this.activeCollisions.has(key)){
                // The collsion was happening on the last update
                if(tightBoxCollision){
                    // The Collision bodys are still overlapping -> collision continues
                    // console.log(`EMIT COLLISION STAY [body${candidate[1].bodyA.id} <-> body${candidate[1].bodyB.id}]`)
                    if(bodyA.owner.physics && bodyB.owner.physics) handlePhysicsOverlap(bodyA, bodyB)
                    else console.log("IGNORING PHYSICS")

                    if(bodyA.owner.onCollisionStay) bodyA.owner.onCollisionStay(bodyB.owner);
                    if(bodyB.owner.onCollisionStay) bodyB.owner.onCollisionStay(bodyA.owner);
                } else {
                    // The collision boxes are no longer overlaping -> collision ends
                    // console.log(`EMIT COLLISION LEAVE [body${candidate[1].bodyA.id} <-> body${candidate[1].bodyB.id}]`)
                    this.activeCollisions.delete(key)
                    if(bodyA.owner.onCollisionExit) bodyA.owner.onCollisionExit(bodyB.owner);
                    if(bodyB.owner.onCollisionExit) bodyB.owner.onCollisionExit(bodyA.owner);
                }
            } else if(tightBoxCollision) {
                // The objects are overlapping and they weren't last frame -> collision starts
                // console.log(`EMIT COLLISION ENTER [body${candidate[1].bodyA.id} <-> body${candidate[1].bodyB.id}]`)
                this.activeCollisions.set(key, candidate[1])

                if(bodyA.owner.onCollisionEnter) bodyA.owner.onCollisionEnter(bodyB.owner);
                if(bodyB.owner.onCollisionEnter) bodyB.owner.onCollisionEnter(bodyA.owner);
            }
        }
        
        // console.log("----------------------------------------------------------------------------------")
    }    

    add(cb: CollisionBody){
        const newMinEp: Endpoint = {cb: cb, isMin: true, xPos: cb.fat.xMin, slot: -1};
        const newMaxEp: Endpoint = {cb: cb, isMin: false, xPos: cb.fat.xMax, slot: -1};

        let numSlots = this.endpoints.length;

        let i = 0;
        while(i < numSlots){
            if (newMinEp.slot == -1 && cb.fat.xMin < this.endpoints[i].xPos) {
                newMinEp.slot = i
                this.endpoints.splice(i, 0, newMinEp)
                numSlots++;
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

        const activeBodyes = new Set<CollisionBody>
        let inAddedBody = false;
        for (const ep of this.endpoints){
            if (ep === newMaxEp){
                break;
            } else if (ep === newMinEp){
                inAddedBody = true;
                for (const other of activeBodyes) this.registerCollisionCandidate(cb, other)
                continue;
            }
            if (ep.isMin){
                if (inAddedBody) this.registerCollisionCandidate(cb, ep.cb)
                activeBodyes.add(ep.cb)
            } else if (!inAddedBody) {
                activeBodyes.delete(ep.cb)
            }
        }
        
        this.handles.set(cb, {minEp: newMinEp, maxEp: newMaxEp})

        this.correctEndpointSlots();

        // this.logEndpoints()
    }

    remove(cb: CollisionBody): void{
        const handle = this.handles.get(cb)
        if (handle){
            for (const cand of this.collisionCandidates){
                if ((cand[1].bodyA == cb) || (cand[1].bodyB == cb)){
                    this.collisionCandidates.delete(cand[0])
                }
            }

            this.endpoints.splice(handle.maxEp.slot, 1)
            this.endpoints.splice(handle.minEp.slot, 1)

            this.handles.delete(cb)

            this.correctEndpointSlots()
        }
    }

    private pairKey(cbA: CollisionBody, cbB: CollisionBody){
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
            this.collisionCandidates.set(key, {bodyA: minEp.cb, bodyB: maxEp.cb})
        } else this.collisionCandidates.delete(key);
    }

    private registerCollisionCandidate(cbA: CollisionBody, cbB: CollisionBody): void {
        const key = this.pairKey(cbA, cbB);
        this.collisionCandidates.set(key, {bodyA: cbA, bodyB: cbB});
    }

    // On a breach, after cb has created its new fatBody
    private repositionCollisionBody(cb: CollisionBody): void{

        const handle = this.handles.get(cb)
        if (!handle) {
            console.error("[Error] Attempted to reposition unknown CollisionBody");
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
            handles += `\n > body${h[0].id}: min(${h[1].minEp.slot}), max(${h[1].maxEp.slot})`

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