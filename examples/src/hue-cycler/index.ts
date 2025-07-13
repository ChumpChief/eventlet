import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { HueColorAdapter, HueCycler } from "./model/index.js";
import { AppView } from "./view/index.js";

const hueCycler = new HueCycler();
const hueColorAdapters = Array.from({ length: 5 }, () => new HueColorAdapter(hueCycler));

const appRootDiv = document.createElement("div");
appRootDiv.classList.add("app-root");
const reactRoot = createRoot(appRootDiv);
reactRoot.render(createElement(AppView, { observableColors: hueColorAdapters }));

document.body.append(appRootDiv);
