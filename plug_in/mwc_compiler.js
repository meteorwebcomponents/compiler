var fs = Npm.require("fs");
var future = Npm.require('fibers/future');
var path = Npm.require("path");
var vulcanize = Npm.require("vulcanize");

Plugin.registerCompiler({
    extensions: ["mwc.json"],
    filenames: []
}, function() {
    // build & deploy

    var compiler = new MWC_Compiler();

    return compiler;
});

function MWC_Compiler() {
    // this._cacheByPackage = {};
}

MWC_Compiler.prototype.processFilesForTarget = function(files) {
    if (-1 < ["web.browser", "web.cordova"].indexOf(files[0].getArch()) && files[0].getBasename() == "config.mwc.json") {
        var mwcImportPath = path.resolve("./public/mwc.import.html");

        if (fs.existsSync(mwcImportPath)) {
            fs.unlinkSync(mwcImportPath);
        }

        files.forEach(function(file) {
            try {
                var config = JSON.parse(file.getContentsAsString());
            } catch (error) {
                file.error({
                    message: "failed to parse, " + error.message
                });

                return;
            }

            if (config.hasOwnProperty("append")) {
                config.append.forEach(function(item) {
                    var itemPath = path.resolve("./public/" + item.publicFilePath);

                    if (fs.existsSync(itemPath)) {
                        if (item.vulcanize) {
                            vulcanizer(path.resolve("./public"), item.publicFilePath, file);
                        } else {
                            append(file, fs.readFileSync(itemPath).toString("utf-8"));
                        }
                    }
                });
            }

            if (config.hasOwnProperty("import")) {
                if (config.import.publicFilePath.length) {
                    var data = "";

                    config.import.publicFilePath.forEach(function(item) {
                        var itemPath = path.resolve("./public/" + item);

                        if (fs.existsSync(itemPath)) {
                            data += '<link href="' + item + '" rel="import">';
                        }
                    });

                    if (data != "") {
                        if (config.import.vulcanize) {
                            fs.writeFileSync(mwcImportPath, "<head>" + data + "</head>");

                            vulcanizer(path.resolve("./public"), "mwc.import.html", mwcImportPath);

                            file.addHtml({
                                data: '<link href="/mwc.import.html" rel="import">',
                                section: "head"
                            });
                        } else {
                            file.addHtml({
                                data: data,
                                section: "head"
                            });
                        }
                    }
                }
            }
        });
    }
};

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
