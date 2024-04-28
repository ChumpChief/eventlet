import { Emitter, Eventlet } from "eventlet";
import { ObservableHue } from "./hueCycler.js";

export type ObservableColor = {
    readonly colorString: string,
    readonly colorChanged: Emitter,
};

export class HueColorAdapter {
    private readonly _colorChanged = new Eventlet();
    public get colorChanged(): Emitter {
        return this._colorChanged;
    }

    public constructor(private readonly observableHue: ObservableHue) {
        this.observableHue.hueChanged.add(() => {
            this._colorChanged.emit();
        });
    }

    public get colorString() {
        return `hsl(${ this.observableHue.hue } 100% 50%)`;
    }
}
