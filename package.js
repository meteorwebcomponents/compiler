Package.describe({
  documentation: 'README.md',
  git: "https://github.com/meteorwebcomponents/compiler.git",
  name: "mwc:compiler",
  summary: "Use polymer as the default templating engine instead of blaze.",
  version: "1.1.49"
});

Package.on_use(function(api) {
  api.use("underscore@1.0.4", "server");
  api.addFiles("mwc_compiler.js", ["server"]);
  api.export("MWC_Compiler");
  api.export("vulcanizer");
  api.versionsFrom("1.0");

});
Npm.depends({
  "chokidar": "1.2.0",
  "mkdirp": "0.5.0",
  'node-echo': '0.1.1',
  "vulcanize": "1.14.0"

})

Package.registerBuildPlugin({
  name: "initializing-compiler",
  use: [
    'underscore@1.0.4'
  ],
  sources: [
    'plugin/init_compiler.js'
  ],
  npmDependencies: {
    'mkdirp': '0.5.0',
    'node-echo': '0.1.1',
    'js-beautify': '1.5.5'
  }
});


