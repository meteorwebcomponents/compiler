Package.describe({
  documentation: 'README.md',
  git: "https://github.com/meteorwebcomponents/compiler.git",
  name: "mwc:compiler",
  summary: "Use polymer as the default templating engine instead of blaze.",
  version: "1.1.11"
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
  use:['mwc:extensions@0.0.2'],
  sources: [
    "plugin/mwc_compiler.js"
  ]
});
