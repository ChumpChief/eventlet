/**
 * The untyped listener is the least-constrained listener type Eventlet will accept.  Prefer to define a strict listener type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UntypedListener = (...args: any[]) => void;

/**
 * An EmitControl permits emitting, which will trigger any registered listener functions.
 */
export type EmitControl<Listener extends UntypedListener = () => void> = {
    readonly emit: (...args: Parameters<Listener>) => void;
};

export type SupportedOptions = {
    once: boolean;
};

/**
 * Listener functions can be registered with an Emitter, which will then be called when it emits.
 */
export type Emitter<Listener extends UntypedListener = () => void> = {
    /**
     * Add a listener that will be called when the Emitter emits.
     */
    readonly add: (listener: Listener, options?: SupportedOptions) => void;
    /**
     * Remove a listener from the set that will be called when the Emitter emits.  The listener must
     * be the same object reference that was used to register previously.
     */
    readonly remove: (listener: Listener) => void;
};
