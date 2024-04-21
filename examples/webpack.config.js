import HtmlWebpackPlugin from "html-webpack-plugin";
// import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// const require = createRequire(import.meta.url);

export default {
    devtool: "inline-source-map",
    entry: {
        "index": {
            import: "./src/index.tsx",
        },
        "eventlet-example": {
            filename: "eventlet-example/[name].bundle.js",
            import: "./src/eventlet-example/index.ts",
        },
        "eventlet-pack-test": {
            filename: "eventlet-pack-test/[name].bundle.js",
            import: "./src/eventlet-pack-test/index.ts",
        },
        "events-pack-test": {
            filename: "events-pack-test/[name].bundle.js",
            import: "./src/events-pack-test/index.ts",
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
            chunks: ["eventlet-example"],
            filename: "eventlet-example/index.html",
            template: "./src/eventlet-example/index.html",
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
