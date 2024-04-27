import type { FC } from "react";
import type { ObservableColor } from "../model/index.js";
import { CircleView } from "./circleView.js";

export type AppViewProps = {
    readonly observableColors: ObservableColor[];
};

export const AppView: FC<AppViewProps> = ({ observableColors }) => {
    const circleViews = observableColors.map(
        (observableColor, index) => <CircleView observableColor={ observableColor } key={ index } />,
    );
    return (
        <div>
            { circleViews }
        </div>
    );
};
