import HtmlWebpackPlugin from "html-webpack-plugin";
// import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// const require = createRequire(import.meta.url);

export default {
    devtool: "source-map",
    entry: {
        "index": {
            import: "./src/index.tsx",
        },
        "eventlet-pack-test": {
            filename: "eventlet-pack-test/[name].bundle.js",
            import: "./src/eventlet-pack-test/index.ts",
        },
        "events-pack-test": {
            filename: "events-pack-test/[name].bundle.js",
            import: "./src/events-pack-test/index.ts",
        },
        "fireworks-director": {
            filename: "fireworks-director/[name].bundle.js",
            import: "./src/fireworks-director/index.ts",
        },
        "hue-cycler": {
            filename: "hue-cycler/[name].bundle.js",
            import: "./src/hue-cycler/index.ts",
        },
    },
    mode: "development",
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [{
                loader: "ts-loader",
                options: {
                    projectReferences: true,
                },
            }],
        }]
    },
    output: {
        filename: "[name].bundle.js",
        path: resolve(__dirname, "webpacked"),
        library: "[name]",
        libraryTarget: "umd",
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ["index"],
            template: "./src/index.html",
        }),
        new HtmlWebpackPlugin({
            chunks: ["fireworks-director"],
            filename: "fireworks-director/index.html",
            template: "./src/fireworks-director/index.html",
        }),
        new HtmlWebpackPlugin({
            chunks: ["hue-cycler"],
            filename: "hue-cycler/index.html",
            template: "./src/hue-cycler/index.html",
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        extensionAlias: {
            ".js": [".ts", ".tsx", ".js"],
            ".mjs": [".mts", ".mtsx", ".mjs"],
        },
        // fallback: { "events": require.resolve("events/") }
    },
}
