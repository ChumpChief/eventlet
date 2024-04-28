// import { Eventlet } from "eventlet";
// import { EventEmitter } from "events";

import { EventEmitter } from "events";

export class PerfComparison {
    public readonly runRegisterUnregisterTestEventEmitter = () => {
        const ITERATION_COUNT = 10_000_000;
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

        const listeners: (() => void)[] = [];
        listeners.length = ITERATION_COUNT;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        listeners.fill(() => {});

        const phase2StartTime = Date.now();
        for (let i = 0; i < ITERATION_COUNT; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            eventEmitter.on(eventName, listeners[i]!);
        }
        const phase2EndTime = Date.now();
        const phase2Duration = phase2EndTime - phase2StartTime;
        console.log(`runRegisterUnregisterTestEventEmitter phase 2: ${ phase2Duration }`);

        const phase3StartTime = Date.now();
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
        return 3;
    };

    public readonly runEmitTestEventEmitter = () => {
        return 3;
    };

    public readonly runEmitTestEventlet = () => {
        return 3;
    };
}
