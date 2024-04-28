import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { PerfComparison } from "./model/index.js";
import { PerfComparisonView } from "./view/index.js";

const start = (): void => {
    const perfComparison = new PerfComparison();

    const contentDiv = document.getElementById("content") as HTMLDivElement;
    const reactRoot = createRoot(contentDiv);
    reactRoot.render(createElement(PerfComparisonView, { perfComparison }));
};

start();
