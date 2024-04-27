import type { FC } from "react";
import type { FireworksDirector } from "../model/index.js";

export type FireworksViewProps = {
    readonly fireworksDirector: FireworksDirector;
};

export const FireworksView: FC<FireworksViewProps> = ({ fireworksDirector }) => {
    console.log(fireworksDirector);
    return (
        <canvas width={ 500 } height={ 500 }></canvas>
    );
};
