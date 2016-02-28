Package.describe({
  documentation: 'README.md',
  git: "https://github.com/meteorwebcomponents/compiler.git",
  name: "mwc:compiler",
  summary: "Use polymer as the default templating engine instead of blaze.",
  version: "1.1.29"
});

Package.on_use(function(api) {
  api.use("isobuild:compiler-plugin@1.0.0");
});

Package.registerBuildPlugin({
  name: "mwc_compiler",
  npmDependencies: {
    "chokidar": "1.2.0",
    "mkdirp": "0.5.0",
    'node-echo': '0.1.1',
    "vulcanize": "1.14.0"
  },
  use:["mwc:extensions@1.0.14","underscore@1.0.4"],
  sources: [
    "plugin/mwc_compiler.js"
  ]
});
