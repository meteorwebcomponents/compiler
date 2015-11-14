var fs = Npm.require("fs");
var path = Npm.require("path");

Plugin.registerCompiler({
    extensions: ["mwc.json"],
    filenames: []
}, function() {
    // build & deploy

    var compiler = new MWC_Compiler();

    return compiler;
});

function MWC_Compiler() {
    this._cacheByPackage = {};
}

MWC_Compiler.prototype.processFilesForTarget = function(files) {
    if (-1 < ["web.browser", "web.cordova"].indexOf(files[0].getArch()) && files[0].getBasename() == "config.mwc.json") {
        var packageName = files[0].getPackageName();

        if (!this._cacheByPackage.hasOwnProperty(packageName)) {
            this._cacheByPackage[packageName] = {
                files: {}
            };
        }

        files.forEach(function(file) {
            try {
                var config = JSON.parse(file.getContentsAsString());
            } catch (error) {
                file.error({
                    message: "failed to parse, " + error.message,
                });

                return;
            }

            if (config.hasOwnProperty("append")) {
                config.append.forEach(function(item) {
                    var itemPath = path.resolve('./public/' + item.publicFilePath);

                    // vulcanize

                    if (fs.existsSync(itemPath)) {
                        var data = fs.readFileSync(itemPath).toString("utf-8");

                        var body = data.match(/<body[^>]*>((.|[\n\r])*)<\/body>/im),
                            head = data.match(/<head[^>]*>((.|[\n\r])*)<\/head>/im);

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
                });
            }
        });
    }
};
