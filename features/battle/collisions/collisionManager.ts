import { Circle } from "../shapes/circle";
import { Ellipse } from "../shapes/ellipse";
import { Scene } from "../scene";
import { Collider } from "../components/collider";
import { ColliderType } from "../components/collider";

interface Endpoint {
    readonly cb: Collider
    readonly isMin: boolean
    xPos: number
    slot: number
}

interface Handle {
    minEp: Endpoint
    maxEp: Endpoint
}

type RoundShape = Circle | Ellipse

function isRoundShape(shape: unknown): shape is RoundShape {
    return shape instanceof Circle || shape instanceof Ellipse
}

function getRadii(shape: RoundShape): { rx: number, ry: number } {
    return shape instanceof Circle
        ? { rx: shape.radius, ry: shape.radius }
        : { rx: shape.radiusX, ry: shape.radiusY }
}

/**
 * Center-to-center distance at which the two shapes just touch when one is
 * placed along the unit direction (ux, uy) from the other.
 *
 * Uses the same separation function as Ellipse.overlaps: the shapes are
 * separated at offset t*u when t^2 * max_s g(s) > 1, where g is concave in s.
 * So the touching distance is 1 / sqrt(max_s g(s)). For two circles this
 * collapses to radiusA + radiusB.
 */
function getContactDistance(a: RoundShape, b: RoundShape, ux: number, uy: number): number {
    if (a instanceof Circle && b instanceof Circle) {
        return a.radius + b.radius
    }

    const ra = getRadii(a)
    const rb = getRadii(b)

    const axx = ra.rx * ra.rx
    const ayy = ra.ry * ra.ry
    const bxx = rb.rx * rb.rx
    const byy = rb.ry * rb.ry

    const reach = (s: number): number =>
        (ux * ux) / (axx / (1 - s) + bxx / s) +
        (uy * uy) / (ayy / (1 - s) + byy / s)

    let lo = 0
    let hi = 1

    for (let i = 0; i < 50; i++) {
        const m1 = lo + (hi - lo) / 3
        const m2 = hi - (hi - lo) / 3

        if (reach(m1) < reach(m2)) lo = m1
        else hi = m2
    }

    return 1 / Math.sqrt(reach((lo + hi) / 2))
}

function handlePhysicsOverlap(colliderA: Collider, colliderB: Collider) {
    if (isRoundShape(colliderA.tight) && isRoundShape(colliderB.tight)) {
        const a = colliderA.tight
        const b = colliderB.tight

        // Direction from A's center to B's center
        const dx = b.position.x - a.position.x
        const dy = b.position.y - a.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Concentric shapes have no direction, so pick an arbitrary axis
        const ux = distance > 0 ? dx / distance : 1
        const uy = distance > 0 ? dy / distance : 0

        // Penetration depth along the center-to-center line
        const overlap = getContactDistance(a, b, ux, uy) - distance
        if (overlap <= 0) return

        const pushX = ux * overlap
        const pushY = uy * overlap

        colliderA.owner.position = {
            x: colliderA.owner.position.x - pushX / 2,
            y: colliderA.owner.position.y - pushY / 2
        }

        colliderB.owner.position = {
            x: colliderB.owner.position.x + pushX / 2,
            y: colliderB.owner.position.y + pushY / 2
        }
    }
}



export default class CollisionManager {
    scene: Scene;

    endpoints: Endpoint[] = [];
    handles = new Map<Collider, Handle>();
    collisionCandidates = new Map<number, { colliderA: Collider, colliderB: Collider }>
    activeCollisions = new Map<number, { colliderA: Collider, colliderB: Collider }>

    constructor(scene: Scene) {
        this.scene = scene;
    }

    update(dt: number): void {

        for (const c of this.scene.dirtyColliders) {
            if (this.handles.has(c)) { this.repositionCollider(c) }
        }

        let key: number;
        let tightBoxCollision: boolean;
        let colliderA: Collider;
        let colliderB: Collider;
        for (const candidate of this.collisionCandidates) {
            tightBoxCollision = candidate[1].colliderA.tight.overlaps(candidate[1].colliderB.tight)
            colliderA = candidate[1].colliderA
            colliderB = candidate[1].colliderB
            key = this.pairKey(colliderA, colliderB)
            if (this.activeCollisions.has(key)) {
                // The collsion was happening on the last update
                if (tightBoxCollision) {
                    // The Collision colliders are still overlapping -> collision continues -> Emit collision STAY
                    console.log(`EMIT COLLISION STAY [collider${candidate[1].colliderA.id} <-> collider${candidate[1].colliderB.id}]`)
                    if (colliderA.owner. == ColliderType.DYNAMIC && colliderB.physics) handlePhysicsOverlap(colliderA, colliderB)

                    if (colliderA.onCollisionStay) colliderA.onCollisionStay(colliderB.owner);
                    if (colliderB.onCollisionStay) colliderB.onCollisionStay(colliderA.owner);
                } else {
                    // The collision boxes are no longer overlaping -> collision ends -> Emit collision LEAVE
                    console.log(`EMIT COLLISION LEAVE [collider${candidate[1].colliderA.id} <-> collider${candidate[1].colliderB.id}]`)
                    this.activeCollisions.delete(key)

                    if (colliderA.onCollisionExit) colliderA.onCollisionExit(colliderB.owner);
                    if (colliderB.onCollisionExit) colliderB.onCollisionExit(colliderA.owner);
                }
            } else if (tightBoxCollision) {
                // The bodies are overlapping and they weren't last frame -> collision starts -> Emit collision ENTER
                console.log(`EMIT COLLISION ENTER [collider${candidate[1].colliderA.id} <-> collider${candidate[1].colliderB.id}]`)
                this.activeCollisions.set(key, candidate[1])

                if (colliderA.onCollisionEnter) colliderA.onCollisionEnter(colliderB.owner);
                if (colliderB.onCollisionEnter) colliderB.onCollisionEnter(colliderA.owner);
            }
        }

        // console.log("----------------------------------------------------------------------------------")
    }

    add(cb: Collider) {
        // if (cb.owner instanceof Combatant) this.tm.add(cb.owner)

        const newMinEp: Endpoint = { cb: cb, isMin: true, xPos: cb.fat.xMin, slot: -1 };
        const newMaxEp: Endpoint = { cb: cb, isMin: false, xPos: cb.fat.xMax, slot: -1 };

        let numSlots = this.endpoints.length;

        let i = 0;
        while (i < numSlots) {
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
        if (newMinEp.slot == -1) {
            this.endpoints.push(newMinEp)
            newMinEp.slot = i
            i++;
        }
        if (newMaxEp.slot == -1) {
            this.endpoints.push(newMaxEp)
            newMaxEp.slot = i
            i++;
        }

        const activeCollideres = new Set<Collider>
        let inAddedCollider = false;
        for (const ep of this.endpoints) {
            if (ep === newMaxEp) {
                break;
            } else if (ep === newMinEp) {
                inAddedCollider = true;
                for (const other of activeCollideres) this.registerCollisionCandidate(cb, other)
                continue;
            }
            if (ep.isMin) {
                if (inAddedCollider) this.registerCollisionCandidate(cb, ep.cb)
                activeCollideres.add(ep.cb)
            } else if (!inAddedCollider) {
                activeCollideres.delete(ep.cb)
            }
        }

        this.handles.set(cb, { minEp: newMinEp, maxEp: newMaxEp })

        this.correctEndpointSlots();
    }

    remove(cb: Collider): void {

        const handle = this.handles.get(cb)
        if (handle) {
            for (const cand of this.collisionCandidates) {
                if ((cand[1].colliderA == cb) || (cand[1].colliderB == cb)) {
                    this.collisionCandidates.delete(cand[0])
                }
            }

            this.endpoints.splice(handle.maxEp.slot, 1)
            this.endpoints.splice(handle.minEp.slot, 1)

            this.handles.delete(cb)

            this.correctEndpointSlots()
        }
    }

    private pairKey(cbA: Collider, cbB: Collider) {
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

        if (minEp.slot < maxEp.slot) {
            this.collisionCandidates.set(key, { colliderA: minEp.cb, colliderB: maxEp.cb })
        } else {
            this.collisionCandidates.delete(key);
            if (this.activeCollisions.has(key)) 
        }
    }

    private registerCollisionCandidate(cbA: Collider, cbB: Collider): void {
        const key = this.pairKey(cbA, cbB);
        this.collisionCandidates.set(key, { colliderA: cbA, colliderB: cbB });
    }

    // On a breach, after cb has created its new fatCollider
    private repositionCollider(cb: Collider): void {

        const handle = this.handles.get(cb)
        if (!handle) {
            console.error("[Error] Attempted to reposition unknown Collider");
            return;
        }

        const minEndpoint = handle.minEp;
        const maxEndpoint = handle.maxEp;
        const oldMin = minEndpoint.xPos;

        minEndpoint.xPos = cb.fat.xMin;
        maxEndpoint.xPos = cb.fat.xMax;

        if (cb.fat.xMin >= oldMin) {
            this.repositionEndpoint(maxEndpoint)
            this.repositionEndpoint(minEndpoint)
        } else {
            this.repositionEndpoint(minEndpoint)
            this.repositionEndpoint(maxEndpoint)
        }

        cb.dirty = false;

        // this.logHandles();
    }

    private repositionEndpoint(ep: Endpoint) {
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
        for (let i = 0; i < this.endpoints.length; i++) {
            this.endpoints[i].slot = i
        }
    }

    private logHandles() {
        let handles = "Handles:"
        for (const h of this.handles)
            handles += `\n > collider${h[0].id}: min(${h[1].minEp.slot}), max(${h[1].maxEp.slot})`

        console.log(handles)
    }

    private logEndpoints() {
        let endpoints = "Endpoints: "
        for (const ep of this.endpoints) {
            endpoints += ep.isMin ? `|${ep.xPos.toFixed(2)}(${ep.cb.id})` : ` (${ep.cb.id})${ep.xPos.toFixed(2)}|`
        }

        console.log(endpoints)
    }
}