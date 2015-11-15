var chokidar = Npm.require("chokidar");
var fs = Npm.require("fs");
var future = Npm.require('fibers/future');
var mkdirp = Npm.require("mkdirp");
var path = Npm.require("path");
var vulcanize = Npm.require("vulcanize");

var watcher = null;

function append(file, html) {
    var body = html.match(/<body[^>]*>((.|[\n\r])*)<\/body>/im),
        head = html.match(/<head[^>]*>((.|[\n\r])*)<\/head>/im);

    if (body) {
        file.addHtml({
            data: body[1],
            section: "body"
        });
    }

    if (head) {
        file.addHtml({
            data: head[1],
            section: "head"
        });
    }
}

function MWC_Compiler() {}

MWC_Compiler.prototype.processFilesForTarget = function(files) {
    var watcher_editable_file = "",
        watcher_opt = [];

    files.forEach(function(file) {
        if (file.getBasename() == "config.mwc.json") {
            try {
                var config = JSON.parse(file.getContentsAsString());
            } catch (error) {
                file.error({
                    message: "failed to parse, " + error.message
                });

                return;
            }

            if (config.hasOwnProperty("root")) {
                var mwcRootPath = path.resolve(config.root);

                if (fs.existsSync(mwcRootPath)) {
                    if (watcher_editable_file == "") {
                        watcher_editable_file = path.resolve(file.getPathInPackage());
                    }

                    if (watcher_opt.indexOf(mwcRootPath) == -1) {
                        watcher_opt.push(mwcRootPath);
                    }

                    if (-1 < ["web.browser", "web.cordova"].indexOf(file.getArch())) {
                        if (config.hasOwnProperty("append")) {
                            config.append.forEach(function(item) {
                                var itemPath = path.resolve(mwcRootPath, item);

                                if (fs.existsSync(itemPath)) {
                                    vulcanizer(mwcRootPath, item, file);
                                }
                            });
                        }

                        if (config.hasOwnProperty("import")) {
                            var data = "";

                            config.import.forEach(function(item) {
                                var itemPath = path.resolve(mwcRootPath, item);

                                if (fs.existsSync(itemPath)) {
                                    data += '<link href="' + item + '" rel="import">';
                                }
                            });

                            if (data != "") {
                                var mwcImportFile = ".mwc.import.html",
                                    publicFolder = path.resolve("./public");

                                if (!fs.existsSync(publicFolder)) {
                                    mkdirp.sync(publicFolder);
                                }

                                var mwcImportPath = path.resolve(mwcRootPath, mwcImportFile),
                                    mwcImportPathPublic = path.resolve(publicFolder, mwcImportFile);

                                fs.writeFileSync(mwcImportPath, "<head>" + data + "</head>");

                                vulcanizer(mwcRootPath, mwcImportFile, mwcImportPathPublic);

                                file.addHtml({
                                    data: '<link href="/' + mwcImportFile + '" rel="import">',
                                    section: "head"
                                });
                            }
                        }
                    }
                } else {
                    file.error({
                        message: "can't find root, " + mwcRootPath
                    });
                }
            } else {
                file.error({
                    message: "root property required"
                });
            }
        }
    });

    if (watcher) {
        watcher.close();
    }

    if (watcher_opt.length) {
        watcher = chokidar.watch(watcher_opt, {
            ignored: /[\/\\]\./,
            ignoreInitial: true
        });

        watcher.on("all", function(event, path) {
            fs.appendFileSync(watcher_editable_file, " ");
        });
    }
};

function vulcanizer(root, target, destination) {
    var wait = new future();

    vulcanize.setOptions({
        abspath: root,
        implicitStrip: true,
        inlineCss: true,
        inlineScripts: true,
        stripComments: true
    });

    vulcanize.process(target, function(error, html) {
        if (typeof(destination) == "string") {
            if (error) {
                console.log(error);
            } else {
                fs.writeFileSync(destination, html);
            }
        } else {
            if (error) {
                destination.error({
                    message: error.message
                });
            } else {
                append(destination, html);
            }
        }

        wait.return(true);
    });

    return wait.wait();
}

Plugin.registerCompiler({
    extensions: ["mwc.json"],
    filenames: []
}, function() {
    var compiler = new MWC_Compiler();

    return compiler;
});
