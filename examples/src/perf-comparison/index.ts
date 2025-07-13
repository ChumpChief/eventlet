import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { PerfComparison } from "./model/index.js";
import { PerfComparisonView } from "./view/index.js";

const perfComparison = new PerfComparison();

const appRootDiv = document.createElement("div");
appRootDiv.classList.add("app-root");
const reactRoot = createRoot(appRootDiv);
reactRoot.render(createElement(PerfComparisonView, { perfComparison }));

document.body.append(appRootDiv);
