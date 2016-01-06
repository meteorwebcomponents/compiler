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

function MWC_Compiler() {
    this.compilerFileName = "compiler.mwc.json";
    this.mwcFile = "mwc_compiler.html";
    this.watcherFolder = null;
    this.publicFolder = path.resolve("./public");
}

MWC_Compiler.prototype.processFilesForTarget = function(files) {
    var _this = this;

    if (-1 < ["web.browser", "web.cordova"].indexOf(files[0].getArch())) {
        var restartOnEdit = [],
            watcherFolder = null;

        files.forEach(function(file) {
            if (file.getBasename() == _this.compilerFileName) {
                try {
                    var json = JSON.parse(file.getContentsAsString());
                } catch (error) {
                    file.error({
                        message: "failed to parse, " + error.message
                    });

                    return;
                }

                if (json.hasOwnProperty("root")) {
                    var mwcRootPath = path.resolve(json.root);

                    if (fs.existsSync(mwcRootPath)) {
                        if (watcherFolder) {
                            file.error({
                                message: "more than one " + _this.compilerFileName + " found"
                            });

                            return;
                        } else {
                            watcherFolder = mwcRootPath;
                        }

                        if (json.hasOwnProperty("append")) {
                            json.append.forEach(function(item) {
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

                        if (json.hasOwnProperty("import")) {
                            var data = "";

                            json.import.forEach(function(item) {
                                var itemPath = path.resolve(mwcRootPath, item);

                                if (fs.existsSync(itemPath)) {
                                    data += '<link href="' + item + '" rel="import">';
                                } else {
                                    file.addHtml({
                                        data: '<link href="' + item + '" rel="import">',
                                        section: "head"
                                    });

                                    console.log("can't find " + itemPath + ", added @head");
                                }
                            });

                            if (data != "") {
                                data = "<head>" + data + "</head>";

                                if (!fs.existsSync(_this.publicFolder)) {
                                    mkdirp.sync(_this.publicFolder);
                                }

                                var mwcPath = path.resolve(mwcRootPath, _this.mwcFile),
                                    mwcPathPublic = path.resolve(_this.publicFolder, _this.mwcFile);

                                if (!fs.existsSync(mwcPath) || !fs.existsSync(mwcPathPublic) || fs.readFileSync(mwcPath).toString("utf-8") != data) {
                                    fs.writeFileSync(mwcPath, data);

                                    vulcanizer(mwcRootPath, _this.mwcFile, mwcPathPublic);
                                }

                                file.addHtml({
                                    data: '<link href="/' + _this.mwcFile + '" rel="import">',
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
        });

        if (_this.watcherFolder != watcherFolder) {
            _this.watcherFolder = watcherFolder;

            if (watcher) {
                watcher.close();
            }

            watcher = chokidar.watch(_this.watcherFolder, {
                // ignored: /[\/\\]\./,
                ignoreInitial: true
            });

            watcher.on("all", function(event, A) {
                if (_this.mwcFile != path.basename(A)) {
                    if (!fs.existsSync(_this.publicFolder)) {
                        mkdirp.sync(_this.publicFolder);
                    }

                    var mwcPathPublic = path.resolve(_this.publicFolder, _this.mwcFile);

                    if (-1 < restartOnEdit.indexOf(A)) {
                        fs.appendFileSync(mwcPathPublic, " ");
                    } else {
                        if (fs.existsSync(path.resolve(_this.watcherFolder, _this.mwcFile))) {
                            vulcanizer(_this.watcherFolder, _this.mwcFile, mwcPathPublic);
                        } else {
                            fs.appendFileSync(mwcPathPublic, " ");
                        }
                    }
                }
            });
        }
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