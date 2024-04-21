import { type FC, useEffect, useState, useRef } from "react";
import type { ObservableColor } from "../model/index.js";

export type CircleViewProps = {
    readonly observableColor: ObservableColor;
};

export const CircleView: FC<CircleViewProps> = ({ observableColor }) => {
    const [circleColor, setCircleColor] = useState<string>(observableColor.colorString);
    // We need a consistent function reference to unregister with later
    const onColorChangeRef = useRef(() => {
        setCircleColor(observableColor.colorString);
    });
    useEffect(() => {
        observableColor.colorChanged.on(onColorChangeRef.current);
        return () => {
            observableColor.colorChanged.off(onColorChangeRef.current);
        };
    }, [observableColor]);
    return (
        <div>
            <div style={{
                display: "inline-block",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: circleColor,
            }}></div>
            <button onClick={ () => { observableColor.colorChanged.on(onColorChangeRef.current); } }>
                Start listening to hue changes
            </button>
            <button onClick={ () => { observableColor.colorChanged.off(onColorChangeRef.current); } }>
                Stop listening to hue changes
            </button>
        </div>
    );
};
