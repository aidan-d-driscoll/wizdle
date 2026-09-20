import { GameEvents } from "./gameEvents";

type Handler<Type> = (payload: Type) => void

class EventManager<Events extends object>{
    private listeners = new Map<keyof Events, Set<Handler<unknown>>>

    on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
        let handlers = this.listeners.get(event);
        if (!handlers) {
            handlers = new Set();
            this.listeners.set(event, handlers);
        }
        handlers.add(handler as Handler<unknown>);
        return () => this.off(event, handler)
    }

    off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void {
        const handlers = this.listeners.get(event);
        if (!handlers) return;
        handlers.delete(handler as Handler<unknown>);
        if (handlers.size === 0) this.listeners.delete(event);
    }

    emit<K extends keyof Events>(
        event: K,
        ...args: Events[K] extends void ? [] : [payload: Events[K]]
    ): void {
        const handlers = this.listeners.get(event);
        if (!handlers) return;
    
        const payload = args[0] as Events[K];
        // Copy so handlers can safely unsubscribe while we iterate.
        for (const handler of [...handlers]) {
        try {
            handler(payload);
        } catch (error) {
            // One bad listener shouldn't break the others.
            console.error(`Error in handler for "${String(event)}":`, error);
        }
        }
    }

    clear(event?: keyof Events): void {
        if (event === undefined) this.listeners.clear();
        else this.listeners.delete(event);
    }
}

export const events = new EventManager<GameEvents>