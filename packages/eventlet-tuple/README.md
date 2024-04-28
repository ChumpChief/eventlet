# Eventlet

Eventlet is a minimal typed event library.

It is designed to be used as either a standalone object which emits events, or as a member property of a class that emits events.

```ts
// Event listener parameters can be strongly typed.
const ev = new Eventlet<[greeting: string, subject: string]>();
ev.add((greeting, subject) => console.log(`${ greeting }, ${ subject }!`));
ev.emit("Hello", "world"); // "Hello, world!"
```

The ability to emit is typed separately from the ability to register listeners, making it easy to hide emit capabilities from your public interfaces.

```ts
class ClassWithChangingProperty {
    private _prop = "";
    public get prop() {
        return this._prop;
    }
    public set prop(newValue: string) {
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

Note that each Eventlet is designed to be used for a single event type.  For a scenario with multiple event types, use multiple Eventlets.

Eventlet should not be used as a superclass.  Instead add an Eventlet as a member property of the class that will use it.
