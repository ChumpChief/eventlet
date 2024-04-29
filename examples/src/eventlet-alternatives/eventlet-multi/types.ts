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

export type MultiListenerType = Record<string, UntypedListener>;

/**
 * An MultiEmitControl permits emitting to multiple event types, which will trigger any registered listener functions.
 */
export type MultiEmitControl<MultiListener extends MultiListenerType> = {
    readonly emit: <EventName extends keyof MultiListener>(eventName: EventName, ...args: Parameters<MultiListener[EventName]>) => void;
};

/**
 * Listener functions for multiple event types can be registered with a MultiEmitter, which will then be called when it emits.
 */
export type MultiEmitter<MultiListener extends MultiListenerType> = {
    /**
     * Add a listener for the specified event type that will be called when the MultiEmitter emits.
     */
    readonly add: <EventName extends keyof MultiListener>(eventName: EventName, listener: MultiListener[EventName], options?: SupportedOptions) => void;
    /**
     * Remove a listener from the set that will be called when the MultiEmitter emits for the specified event type.
     * The listener must be the same object reference that was used to register previously.
     */
    readonly remove: <EventName extends keyof MultiListener>(eventName: EventName, listener: MultiListener[EventName]) => void;
};
