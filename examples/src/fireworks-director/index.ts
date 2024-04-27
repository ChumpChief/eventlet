import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { HueColorAdapter, HueCycler } from "./model/index.js";
import { AppView } from "./view/index.js";

const start = (): void => {
    const hueCycler = new HueCycler();
    const hueColorAdapters = Array.from({ length: 5 }, () => new HueColorAdapter(hueCycler));

    const contentDiv = document.getElementById("content") as HTMLDivElement;
    const reactRoot = createRoot(contentDiv);
    reactRoot.render(createElement(AppView, { observableColors: hueColorAdapters }));
};

start();
