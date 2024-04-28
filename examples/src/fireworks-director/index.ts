import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { FireworksDirector } from "./model/index.js";
import { FireworksView } from "./view/index.js";

const start = (): void => {
    const fireworksDirector = new FireworksDirector();

    const contentDiv = document.getElementById("content") as HTMLDivElement;
    const reactRoot = createRoot(contentDiv);
    reactRoot.render(createElement(FireworksView, { fireworksDirector }));
};

start();
