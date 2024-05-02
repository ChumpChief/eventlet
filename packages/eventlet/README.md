# Eventlet

Eventlet is a minimal typed event library.

It is designed to be used as either a standalone object which emits events, or as a member property of a class that emits events.  You can create an Eventlet and specify the listener signature like this:

```ts
const greeter = new Eventlet<(greeting: string, subject: string) => void>();
greeter.add((greeting, subject) => console.log(`${ greeting }, ${ subject }!`));
greeter.emit("Hello", "world"); // "Hello, world!"
```

The ability to emit is typed separately from the ability to register listeners (`EmitControl` vs. `Emitter`, respectively), making it easy to hide emit capabilities from your public interfaces:

```ts
class ClassWithChangingProperty {
    private _prop = 3;
    public get prop() {
        return this._prop;
    }
    public set prop(newValue: number) {
        this._prop = newValue;
        this._propChanged.emit();
    }

    // The default listener signature has no parameters if event typing is not provided.
    private _propChanged = new Eventlet();
    // The public interface can just expose the Emitter capability of the Eventlet.
    // This keeps its EmitControl capability private.
    public get propChanged(): Emitter {
        return this._propChanged;
    }
}
```

If you don't specify a listener signature, it defaults to `() => void`.

Listeners can be removed when they are no longer needed.  Pass the same function reference that was originally added.

```ts
type MessageReceivedListener = (message: string) => void;
const messageReceived = new Eventlet<MessageReceivedListener>();
const onMessageReceived = (message: string) => console.log(message);
messageReceived.add(onMessageReceived);
messageReceived.emit("Hello!"); // "Hello!"
// ...time passes...
messageReceived.remove(onMessageReceived);
```

## Usage recommendations

* Each Eventlet is designed to be used for a single event type.  For a scenario with multiple event types, use multiple Eventlets.
* Eventlet should not be used as a superclass.  Instead add an Eventlet as a member property of the class that will use it.
* Since references to the registered listeners are held by the Eventlet, it's important to remove them when they're no longer needed so they can be garbage collected appropriately.
