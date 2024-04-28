import { type FC, useState } from "react";
import { PerfComparison } from "../model/index.js";

export type PerfComparisonViewProps = {
    readonly perfComparison: PerfComparison;
};

export const PerfComparisonView: FC<PerfComparisonViewProps> = ({ perfComparison }) => {
    const [registerUnregisterTestEventEmitterResults, setRegisterUnregisterTestEventEmitterResults] = useState<number[]>([]);
    const [registerUnregisterTestEventletResults, setRegisterUnregisterTestEventletResults] = useState<number[]>([]);
    const [emitTestEventEmitterResults, setEmitTestEventEmitterResults] = useState<number[]>([]);
    const [emitTestEventletResults, setEmitTestEventletResults] = useState<number[]>([]);

    const runRegisterUnregisterTestEventEmitter = () => {
        const result = perfComparison.runRegisterUnregisterTestEventEmitter();
        setRegisterUnregisterTestEventEmitterResults([result, ...registerUnregisterTestEventEmitterResults]);
    };

    const runRegisterUnregisterTestEventlet = () => {
        const result = perfComparison.runRegisterUnregisterTestEventlet();
        setRegisterUnregisterTestEventletResults([result, ...registerUnregisterTestEventletResults]);
    };

    const runEmitTestEventEmitter = () => {
        const result = perfComparison.runEmitTestEventEmitter();
        setEmitTestEventEmitterResults([result, ...emitTestEventEmitterResults]);
    };

    const runEmitTestEventlet = () => {
        const result = perfComparison.runEmitTestEventlet();
        setEmitTestEventletResults([result, ...emitTestEventletResults]);
    };

    return (
        <>
            <div>
                <button onClick={ runRegisterUnregisterTestEventEmitter }>Run registerUnregisterTestEventEmitter</button>
                { registerUnregisterTestEventEmitterResults.join(", ") }
            </div>
            <div>
                <button onClick={ runRegisterUnregisterTestEventlet }>Run registerUnregisterTestEventlet</button>
                { registerUnregisterTestEventletResults.join(", ") }
            </div>
            <div>
                <button onClick={ runEmitTestEventEmitter }>Run emitTestEventEmitter</button>
                { emitTestEventEmitterResults.join(", ") }
            </div>
            <div>
                <button onClick={ runEmitTestEventlet }>Run emitTestEventlet</button>
                { emitTestEventletResults.join(", ") }
            </div>
        </>
    );
};
