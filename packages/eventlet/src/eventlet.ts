import type { EmitControl, Emitter, UntypedListener } from "./types.js";

/**
 * Eventlet supports a minimal typed event pattern.  It is designed to be used as either a standalone object
 * which emits events, or as a member property of a class that emits events.  It should not be used as a superclass
 * for a class which will emit events.
 */
export class Eventlet<Listener extends UntypedListener = () => void> implements EmitControl<Listener>, Emitter<Listener> {
    private readonly listeners = new Set<Listener>();
    public readonly emit = (...args: Parameters<Listener>) => {
        // Set is specified to iterate in insertion order
        for (const listener of this.listeners) {
            listener(...args);
        }
    };

    public readonly on = (listener: Listener) => {
        this.listeners.add(listener);
    };

    public readonly off = (listener: Listener) => {
        this.listeners.delete(listener);
    };
}
