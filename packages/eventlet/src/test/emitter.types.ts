import {
    // EmitControl,
    type Emitter,
    // type Eventlet,
    type UntypedListener,
} from "../index.js";

/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */

declare let untyped: UntypedListener;
untyped = () => {};
untyped = (foo: string) => {};
// Non-void functions are assignable to void functions, so this is allowed
untyped = (bar: number) => 3;
// @ts-expect-error
untyped = 3;
// @ts-expect-error
untyped = undefined;
// @ts-expect-error
untyped = null;

untyped();
untyped("hello");

declare let emitter: Emitter;
emitter = { add: () => {}, remove: () => {} };
// @ts-expect-error
emitter = { add: (listener: string) => {}, remove: () => {} };
// @ts-expect-error
emitter = { add: () => {}, remove: (listener: string) => {} };
// An emitter that satisfies Emitter<(foo: string) => void> will also satisfy Emitter<() => void>
// Listeners registered expecting Emitter<() => void> will just be ignoring the foo string.
emitter = { add: (listener: (foo: string) => void) => {}, remove: () => {} };
emitter = { add: () => {}, remove: (listener: (foo: string) => void) => {} };
// Listener should return void (this is returning an object {})
// @ts-expect-error
emitter = { add: (listener: () => {}) => {}, remove: () => {} };
// @ts-expect-error
emitter = { add: () => {}, remove: (listener: () => {}) => {} };
// @ts-expect-error
emitter = { add: () => {} };
// @ts-expect-error
emitter = { remove: () => {} };

emitter.add(() => {});
emitter.remove(() => {});
// @ts-expect-error
emitter.add((foo: string) => {});
// @ts-expect-error
emitter.remove((foo: string) => {});
// Non-void functions are assignable to void functions, so this is allowed
emitter.add(() => 3);
emitter.remove(() => "hi");

type TestListenerType = (foo: string, bar: number) => void;
declare let emitter2: Emitter<TestListenerType>;
// Ignoring the added/removed listener wouldn't be a good implementation, but it's not type-broken
emitter2 = { add: () => {}, remove: () => {} };
// @ts-expect-error
emitter2 = { add: (listener: string) => {}, remove: () => {} };
// @ts-expect-error
emitter2 = { add: () => {}, remove: (listener: string) => {} };
emitter2 = {
    add: (listener: (foo: string, bar: number) => void) => {},
    remove: (listener: (foo: string, bar: number) => void) => {},
};
// Listeners registered against the Emitter<TestListenerType> expect bar to be defined.
// The usage below implies the emitter won't be passing a defined bar when the listener is called.
// @ts-expect-error
emitter2 = { add: (listener: (foo: string) => void) => {}, remove: () => {} };
// @ts-expect-error
emitter2 = { add: () => {}, remove: (listener: (foo: string) => void) => {} };
// This Emitter would provide an extra parameter that users of the Emitter<TestListenerType> will
// just be ignoring (since they can only register listeners with foo and bar parameters)
emitter2 = {
    add: (listener: (foo: string, bar: number, woz: boolean) => void) => {},
    remove: (listener: (foo: string, bar: number, woz: boolean) => void) => {},
};
// Optional implies sometimes we wouldn't provide bar, but the users of Emitter<TestListenerType>
// would be surprised by that.
emitter2 = {
    // @ts-expect-error
    add: (listener: (foo: string, bar?: number) => void) => {},
    // @ts-expect-error
    remove: (listener: (foo: string, bar?: number) => void) => {},
};

emitter2.add(() => {});
emitter2.add((foo: string) => {});
emitter2.add((foo: string, bar: number) => {});
// @ts-expect-error
emitter2.add((foo: string, bar: number, woz: boolean) => {});
// @ts-expect-error
emitter2.add((foo: number, bar: number) => {});
// @ts-expect-error
emitter2.add((foo: string, bar: string) => {});
emitter2.remove(() => {});
emitter2.remove((foo: string) => {});
emitter2.remove((foo: string, bar: number) => {});
// @ts-expect-error
emitter2.remove((foo: string, bar: number, woz: boolean) => {});
// @ts-expect-error
emitter2.remove((foo: number, bar: number) => {});
// @ts-expect-error
emitter2.remove((foo: string, bar: string) => {});
