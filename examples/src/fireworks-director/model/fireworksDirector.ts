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
        const RADIUS_MINIMUM = 50;
        const RADIUS_VARIANCE = 100;

        getPhysicsClock().off(this.tickPhysics);
        const radius = (Math.random() * RADIUS_VARIANCE) + RADIUS_MINIMUM;
        const hue = Math.random() * 360;
        const color = `hsl(${ hue } 100% 50%)`;
        this._exploded.emit(radius, color);
        console.log("boom!");
    };

    private readonly tickPhysics = (elapsedTimeMs: number) => {
        const VERTICAL_DECELERATION = 50;

        const elapsedTimeS = elapsedTimeMs / 1000;
        this.position.x += this.velocity.x * elapsedTimeS;
        this.position.y += this.velocity.y * elapsedTimeS;
        this.velocity.y -= VERTICAL_DECELERATION * elapsedTimeS;
    };

    public constructor(position: vec2) {
        const HORIZONTAL_VARIANCE = 100;
        const VERTICAL_MINIMUM = 150;
        const VERTICAL_VARIANCE = 50;

        this.position = position;
        const x = (Math.random() * HORIZONTAL_VARIANCE) - (HORIZONTAL_VARIANCE / 2);
        const y = (Math.random() * VERTICAL_VARIANCE) + VERTICAL_MINIMUM;
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
        const LAUNCH_INTERVAL_MINIMUM = 700;
        const LAUNCH_INTERVAL_VARIANCE = 500;

        const launchAndRepeat = () => {
            this.launch();
            setTimeout(launchAndRepeat, (Math.random() * LAUNCH_INTERVAL_MINIMUM) + LAUNCH_INTERVAL_VARIANCE);
        };
        setTimeout(launchAndRepeat, (Math.random() * LAUNCH_INTERVAL_MINIMUM) + LAUNCH_INTERVAL_VARIANCE);
    };

    public constructor() {
        this.startLaunching();
    }
}
