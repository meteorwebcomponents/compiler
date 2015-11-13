Plugin.registerCompiler({
    extensions: ["html"],
    filenames: []
}, function() {
    var compiler = new MWC_Compiler();

    return compiler;
});

function MWC_Compiler() {}

MWC_Compiler.prototype.processFilesForTarget = function(files) {
    files.forEach(function(file) {
        console.log(file.getDisplayPath());

        file.addHtml({
            data: file.getContentsAsString(),
            section: "body"
        });
    });
};
