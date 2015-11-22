Package.describe({
    documentation: null,
    git: "https://github.com/meteorwebcomponents/compiler.git",
    name: "mwc:compiler",
    summary: "mwc compiler",
    version: "1.1.7"
});

Package.onUse(function(api) {
    api.use("isobuild:compiler-plugin@1.0.0");

    api.versionsFrom("1.0");
});

Package.registerBuildPlugin({
    name: "mwc_compiler",
    npmDependencies: {
        "chokidar": "1.2.0",
        "mkdirp": "0.5.0",
        "vulcanize": "1.14.0"
    },
    sources: [
        "plugin/mwc_compiler.js"
    ]
});
