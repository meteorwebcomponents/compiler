Package.describe({
    documentation: "README.md",
    git: "https://github.com/meteorwebcomponents/compiler.git",
    name: "mwc:compiler",
    summary: "mwc compiler",
    version: "0.0.5"
});

Package.onUse(function(api) {
    api.use("isobuild:compiler-plugin@1.0.0");
});

Package.registerBuildPlugin({
    name: "mwc_compiler",
    npmDependencies: {
        "chokidar": "1.2.0",
        "mkdirp": "0.5.0",
        "vulcanize": "1.14.0"
    },
    sources: [
        "plug_in/mwc_compiler.js"
    ]
});
