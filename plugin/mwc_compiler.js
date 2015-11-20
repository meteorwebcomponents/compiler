var chokidar = Npm.require("chokidar"),
    fs = Npm.require("fs"),
    mkdirp = Npm.require("mkdirp"),
    path = Npm.require("path"),
    vulcanize = Npm.require("vulcanize");

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
    var mwcFile = "mwc_compiler.html",
        publicFolder = path.resolve("./public"),
        restartOnEdit = [],
        watcherFolder = null;

    for (var A = 0; A < files.length; A++) {
        if (-1 < ["web.browser" /*, "web.cordova"*/ ].indexOf(files[A].getArch()) && files[A].getBasename() == "compiler.mwc.json") {
            var file = files[A];

            try {
                var compiler = JSON.parse(file.getContentsAsString());
            } catch (error) {
                file.error({
                    message: "failed to parse, " + error.message
                });

                return;
            }

            if (compiler.hasOwnProperty("root")) {
                var mwcRootPath = path.resolve(compiler.root);

                if (fs.existsSync(mwcRootPath)) {
                    if (!watcherFolder) {
                        watcherFolder = mwcRootPath;
                    }

                    if (compiler.hasOwnProperty("append")) {
                        compiler.append.forEach(function(item) {
                            var itemPath = path.resolve(mwcRootPath, item);

                            if (fs.existsSync(itemPath)) {
                                vulcanizer(mwcRootPath, item, file);

                                if (restartOnEdit.indexOf(itemPath) == -1) {
                                    restartOnEdit.push(itemPath);
                                }
                            } else {
                                file.error({
                                    message: "@append " + itemPath + " notFound"
                                });
                            }
                        });
                    }

                    if (compiler.hasOwnProperty("import")) {
                        var data = "";

                        compiler.import.forEach(function(item) {
                            var itemPath = path.resolve(mwcRootPath, item);

                            if (fs.existsSync(itemPath)) {
                                data += '<link href="' + item + '" rel="import">';
                            } else {
                                file.addHtml({
                                    data: '<link href="' + item + '" rel="import">',
                                    section: "head"
                                });
                            }
                        });

                        if (data != "") {
                            if (!fs.existsSync(publicFolder)) {
                                mkdirp.sync(publicFolder);
                            }

                            var mwcPath = path.resolve(mwcRootPath, mwcFile),
                                mwcPathPublic = path.resolve(publicFolder, mwcFile);

                            fs.writeFileSync(mwcPath, "<head>" + data + "</head>");

                            if (!fs.existsSync(mwcPathPublic) || fs.readFileSync(mwcPathPublic).toString("utf-8") == "") {
                                vulcanizer(mwcRootPath, mwcFile, mwcPathPublic);
                            }

                            file.addHtml({
                                data: '<link href="/' + mwcFile + '" rel="import">',
                                section: "head"
                            });
                        }
                    }
                } else {
                    file.error({
                        message: "can't find root, " + mwcRootPath
                    });
                }
            } else {
                file.error({
                    message: "property root[polymer project absolute/relative path] required"
                });
            }
        }
    }

    if (watcher) {
        watcher.close();
    }

    if (watcherFolder) {
        watcher = chokidar.watch(watcherFolder, {
            // ignored: /[\/\\]\./,
            ignoreInitial: true
        });

        watcher.on("all", function(event, A) {
            if (mwcFile != path.basename(A)) {
                if (!fs.existsSync(publicFolder)) {
                    mkdirp.sync(publicFolder);
                }

                var mwcPath = path.resolve(watcherFolder, mwcFile),
                    mwcPathPublic = path.resolve(publicFolder, mwcFile);

                if (-1 < restartOnEdit.indexOf(A)) {
                    fs.writeFileSync(mwcPathPublic, "");
                } else {
                    if (fs.existsSync(mwcPath)) {
                        vulcanizer(watcherFolder, mwcFile, mwcPathPublic);
                    } else {
                        fs.writeFileSync(mwcPathPublic, "");
                    }
                }
            }
        });
    }
};

function vulcanizer(root, target, destination) {
    // var wait = new future();

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

        // wait.return(true);
    });

    // return wait.wait();
}

Plugin.registerCompiler({
    extensions: ["mwc.json"],
    filenames: []
}, function() {
    var compiler = new MWC_Compiler();

    return compiler;
});
