import type { EmitControl, Emitter, SupportedOptions, UntypedListener } from "./types.js";

type ListenerWithMetadata<Listener> = {
    listener: Listener;
} & SupportedOptions;

/**
 * Eventlet supports a minimal typed event pattern.  It is designed to be used as either a standalone object
 * which emits events, or as a member property of a class that emits events.  It should not be used as a superclass
 * for a class which will emit events.
 */
export class Eventlet<Listener extends UntypedListener = () => void> implements EmitControl<Listener>, Emitter<Listener> {
    private readonly listenersWithMetadata = new Set<ListenerWithMetadata<Listener>>();
    private readonly findFromListener = (listener: Listener) => {
        for (const listenerWithMetadata of this.listenersWithMetadata) {
            if (listenerWithMetadata.listener === listener) {
                return listenerWithMetadata;
            }
        }
        return undefined;
    };

    public readonly emit = (...args: Parameters<Listener>) => {
        // Set is specified to iterate in insertion order
        for (const listenerWithMetadata of this.listenersWithMetadata) {
            const { listener, once } = listenerWithMetadata;
            if (once) {
                this.listenersWithMetadata.delete(listenerWithMetadata);
            }
            listener(...args);
        }
    };

    public readonly add = (listener: Listener, options: SupportedOptions = { once: false }) => {
        if (this.findFromListener(listener) === undefined) {
            this.listenersWithMetadata.add({ listener, ...options });
        }
    };

    public readonly remove = (listener: Listener) => {
        const matchingListenerWithMetadata = this.findFromListener(listener);
        if (matchingListenerWithMetadata !== undefined) {
            this.listenersWithMetadata.delete(matchingListenerWithMetadata);
        }
    };
}
