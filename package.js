Package.describe({
    git: "https://github.com/meteorwebcomponents/compiler.git",
    name: "mwc:compiler",
    summary: "mwc compiler",
    version: "0.0.1"
});

Package.onUse(function(api) {
    api.use("isobuild:compiler-plugin@1.0.0");
});

Package.registerBuildPlugin({
    name: "mwc_compiler",
    npmDependencies: {},
    sources: [
        "plug_in/mwc_compiler.js"
    ]
});
