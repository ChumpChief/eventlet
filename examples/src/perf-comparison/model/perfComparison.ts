import { Eventlet } from "eventlet";
import { EventEmitter } from "events";

const ITERATION_COUNT = 100_000;
const MANY_EMIT_ITERATION_COUNT = 10;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const listeners: (() => void)[] = Array.from({ length: ITERATION_COUNT }, () => (() => {}));

export class PerfComparison {
    public readonly runRegisterUnregisterTestEventEmitter = () => {
        const eventEmitter = new EventEmitter();
        eventEmitter.setMaxListeners(0);
        const eventName = "a";

        const phase1StartTime = Date.now();
        for (let i = 0; i < ITERATION_COUNT; i++) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            const eventListener = () => {};
            eventEmitter.on(eventName, eventListener);
            eventEmitter.off(eventName, eventListener);
        }
        const phase1EndTime = Date.now();
        const phase1Duration = phase1EndTime - phase1StartTime;
        console.log(`runRegisterUnregisterTestEventEmitter phase 1: ${ phase1Duration }`);

        const phase2StartTime = Date.now();
        for (let i = 0; i < ITERATION_COUNT; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            eventEmitter.on(eventName, listeners[i]!);
        }
        const phase2EndTime = Date.now();
        const phase2Duration = phase2EndTime - phase2StartTime;
        console.log(`runRegisterUnregisterTestEventEmitter phase 2: ${ phase2Duration }`);

        const phase3StartTime = Date.now();
        // for (let i = ITERATION_COUNT - 1; i >= 0; i--) {
        for (let i = 0; i < ITERATION_COUNT; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            eventEmitter.off(eventName, listeners[i]!);
        }
        const phase3EndTime = Date.now();
        const phase3Duration = phase3EndTime - phase3StartTime;
        console.log(`runRegisterUnregisterTestEventEmitter phase 3: ${ phase3Duration }`);

        return phase1Duration + phase2Duration + phase3Duration;
    };

    public readonly runRegisterUnregisterTestEventlet = () => {
        const eventEmitter = new Eventlet();

        const phase1StartTime = Date.now();
        for (let i = 0; i < ITERATION_COUNT; i++) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            const eventListener = () => {};
            eventEmitter.add(eventListener);
            eventEmitter.remove(eventListener);
        }
        const phase1EndTime = Date.now();
        const phase1Duration = phase1EndTime - phase1StartTime;
        console.log(`runRegisterUnregisterTestEventlet phase 1: ${ phase1Duration }`);

        const phase2StartTime = Date.now();
        for (let i = 0; i < ITERATION_COUNT; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            eventEmitter.add(listeners[i]!);
        }
        const phase2EndTime = Date.now();
        const phase2Duration = phase2EndTime - phase2StartTime;
        console.log(`runRegisterUnregisterTestEventlet phase 2: ${ phase2Duration }`);

        const phase3StartTime = Date.now();
        // for (let i = ITERATION_COUNT - 1; i >= 0; i--) {
        for (let i = 0; i < ITERATION_COUNT; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            eventEmitter.remove(listeners[i]!);
        }
        const phase3EndTime = Date.now();
        const phase3Duration = phase3EndTime - phase3StartTime;
        console.log(`runRegisterUnregisterTestEventlet phase 3: ${ phase3Duration }`);

        return phase1Duration + phase2Duration + phase3Duration;
    };

    public readonly runEmitTestEventEmitter = () => {
        const eventEmitter = new EventEmitter();
        eventEmitter.setMaxListeners(0);
        const eventName = "a";
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventListener = () => {};
        eventEmitter.on(eventName, eventListener);

        const phase1StartTime = Date.now();
        for (let i = 0; i < ITERATION_COUNT; i++) {
            eventEmitter.emit(eventName);
        }
        const phase1EndTime = Date.now();
        const phase1Duration = phase1EndTime - phase1StartTime;
        console.log(`runEmitTestEventEmitter phase 1: ${ phase1Duration }`);

        eventEmitter.off(eventName, eventListener);
        for (let i = 0; i < ITERATION_COUNT; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            eventEmitter.on(eventName, listeners[i]!);
        }

        const phase2StartTime = Date.now();
        for (let i = 0; i < MANY_EMIT_ITERATION_COUNT; i++) {
            eventEmitter.emit(eventName);
        }
        const phase2EndTime = Date.now();
        const phase2Duration = phase2EndTime - phase2StartTime;
        console.log(`runEmitTestEventEmitter phase 2: ${ phase2Duration }`);

        return phase1Duration + phase2Duration;
    };

    public readonly runEmitTestEventlet = () => {
        const eventlet = new Eventlet();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventListener = () => {};
        eventlet.add(eventListener);

        const phase1StartTime = Date.now();
        for (let i = 0; i < ITERATION_COUNT; i++) {
            eventlet.emit();
        }
        const phase1EndTime = Date.now();
        const phase1Duration = phase1EndTime - phase1StartTime;
        console.log(`runEmitTestEventEmitter phase 1: ${ phase1Duration }`);

        eventlet.remove(eventListener);
        for (let i = 0; i < ITERATION_COUNT; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            eventlet.add(listeners[i]!);
        }

        const phase2StartTime = Date.now();
        for (let i = 0; i < MANY_EMIT_ITERATION_COUNT; i++) {
            eventlet.emit();
        }
        const phase2EndTime = Date.now();
        const phase2Duration = phase2EndTime - phase2StartTime;
        console.log(`runEmitTestEventEmitter phase 2: ${ phase2Duration }`);

        return phase1Duration + phase2Duration;
    };
}
