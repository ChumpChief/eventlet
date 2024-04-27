import { Emitter, Eventlet } from "eventlet";

// Width of canvas, just using a const for now, maybe take as an argument to FireworksDirector later.
const FIELD_WIDTH = 500;

export type vec2 = { x: number, y: number };

type PhysicsTickListener = (elapsedTimeMs: number) => void;
const physicsClock = new Eventlet<PhysicsTickListener>();
let requestId: number | undefined;

const getPhysicsClock = () => {
    // If we haven't started the clock yet, do so.
    if (requestId === undefined) {
        // TODO: Better typing
        let lastTime: number = document.timeline.currentTime as number;
        const tickPhysics = (currentTime: number) => {
            const elapsedTimeMs = currentTime - lastTime;

            physicsClock.emit(elapsedTimeMs);

            lastTime = currentTime;
            requestId = requestAnimationFrame(tickPhysics);
        };
        requestId = requestAnimationFrame(tickPhysics);
    }

    return physicsClock;
};

export type ExplodedListener = (radius: number, color: string) => void;

export class Firework {
    public readonly position: vec2;
    public readonly velocity: vec2;

    private readonly _exploded = new Eventlet<ExplodedListener>();
    public get exploded(): Emitter<ExplodedListener> {
        return this._exploded;
    }

    private readonly explode = () => {
        getPhysicsClock().off(this.tickPhysics);
        const radius = Math.random() * 50;
        const hue = Math.random() * 360;
        const color = `hsl(${ hue } 100% 50%)`;
        this._exploded.emit(radius, color);
        console.log("boom!");
    };

    private readonly tickPhysics = (elapsedTimeMs: number) => {
        const elapsedTimeS = elapsedTimeMs / 1000;
        this.position.x += this.velocity.x * elapsedTimeS;
        this.position.y += this.velocity.y * elapsedTimeS;
        this.velocity.y -= 3 * elapsedTimeS;
    };

    public constructor(position: vec2) {
        this.position = position;
        const x = (Math.random() * 6) - 3;
        const y = (Math.random() * 20) + 10;
        this.velocity = { x, y };
        getPhysicsClock().on(this.tickPhysics);
        setTimeout(this.explode, (Math.random() * 2000) + 2000);
    }
}

export type LaunchedListener = (firework: Firework) => void;

export class FireworksDirector {
    private readonly _launched = new Eventlet<LaunchedListener>();
    public get launched() {
        return this._launched;
    }

    private readonly launch = () => {
        const x = Math.random() * FIELD_WIDTH;
        const firework = new Firework({ x, y: 0 });
        this._launched.emit(firework);
        console.log("whoosh!");
    };

    private readonly startLaunching = () => {
        const launchAndRepeat = () => {
            this.launch();
            setTimeout(launchAndRepeat, (Math.random() * 2000) + 500);
        };
        setTimeout(launchAndRepeat, (Math.random() * 2000) + 500);
    };

    public constructor() {
        this.startLaunching();
    }
}
