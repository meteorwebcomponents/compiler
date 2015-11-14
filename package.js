Package.describe({
    documentation: "README.md",
    git: "https://github.com/meteorwebcomponents/compiler.git",
    name: "mwc:compiler",
    summary: "mwc compiler",
    version: "0.0.3"
});

Package.onUse(function(api) {
    api.use("isobuild:compiler-plugin@1.0.0");
});

Package.registerBuildPlugin({
    name: "mwc_compiler",
    npmDependencies: {
        "vulcanize": "1.14.0"
    },
    sources: [
        "plug_in/mwc_compiler.js"
    ]
});
