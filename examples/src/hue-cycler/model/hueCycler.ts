import { Emitter, Eventlet } from "eventlet";

export type ObservableHue = {
    readonly hue: number;
    readonly hueChanged: Emitter;
};

export class HueCycler implements ObservableHue {
    private _hue = 0;
    public get hue() {
        return this._hue;
    }
    private readonly _hueChanged = new Eventlet();
    public get hueChanged(): Emitter {
        return this._hueChanged;
    }

    public constructor() {
        setInterval(() => {
            this._hue += 60;
            this._hueChanged.emit();
        }, 500);
    }
}
