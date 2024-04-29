import type { EmitControl, Emitter, Listener } from "./types.js";

/**
 * Eventlet supports a minimal typed event pattern.  It is designed to be used as either a standalone object
 * which emits events, or as a member property of a class that emits events.  It should not be used as a superclass
 * for a class which will emit events.
 */
export class Eventlet<EventArgs extends unknown[] = []> implements EmitControl<EventArgs>, Emitter<EventArgs> {
    private readonly listeners = new Set<Listener<EventArgs>>();
    public readonly emit = (...args: EventArgs) => {
        // Set is specified to iterate in insertion order
        for (const listener of this.listeners) {
            listener(...args);
        }
    };

    public readonly add = (listener: Listener<EventArgs>) => {
        this.listeners.add(listener);
    };

    public readonly remove = (listener: Listener<EventArgs>) => {
        this.listeners.delete(listener);
    };
}
