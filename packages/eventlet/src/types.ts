/**
 * Listener functions must adhere to this format.
 */
export type Listener<EventArgs extends unknown[] = []> = (...args: EventArgs) => void;

/**
 * An EmitControl permits emitting, which will trigger any registered listener functions.
 */
export type EmitControl<EventArgs extends unknown[] = []> = {
    readonly emit: (...args: Parameters<Listener<EventArgs>>) => void;
};

/**
 * Listener functions can be registered with an Emitter, which will then be called when it emits.
 */
export type Emitter<EventArgs extends unknown[] = []> = {
    /**
     * Add a listener that will be called when the Emitter emits.
     */
    readonly on: (listener: Listener<EventArgs>) => void;
    /**
     * Remove a listener from the set that will be called when the Emitter emits.  The listener must
     * be the same object reference that was used to register previously.
     */
    readonly off: (listener: Listener<EventArgs>) => void;
};
