(function() {
    var WATCHED_FILES, argv, compileIfNeeded, compileLessScript, findLessFiles, specs, usage, watcher_lib;
    usage = "Watch a directory and recompile .less styles if they change.\nUsage: less-inspector -p [prefix] -d [directory].";
    specs = require('optimist').usage(usage)["default"]('d', '.').describe('d', 'Specify which directory to scan.')["default"]('p', '').describe('p', 'Which prefix should the compiled files have? Default is style.less will be compiled to .less.style.css.').boolean('h').describe('h', 'Prints help')["default"]('f', '').boolean('f').describe('f', 'If defined, LESS will continue watch for all files but compile only specified file.').describe('o', 'Use only one mtime for all files.');

    if (specs.parse(process.argv).h) {
        specs.showHelp();
        process.exit();
    } else {
        argv = specs.argv;
    }

    watcher_lib = require('watcher_lib');

    findLessFiles = function(dir) {
        return watcher_lib.findFiles('*.less', dir, compileIfNeeded);
    };

    WATCHED_FILES = {};
    MTIME = 0;

    compileIfNeeded = function(file) {
        var current = new Date();
        if (argv.o && MTIME < current) {
            MTIME = current;
        } else if (argv.o) {
            return;
        }
        return watcher_lib.compileIfNeeded(WATCHED_FILES, file, compileLessScript);
    };

    compileLessScript = function(file) {
        var fnGetOutputFile;

        fnGetOutputFile = function(file) {
            return file.replace(/([^\/\\]+)\.less/, "" + argv.p + "$1.css");
        };

        if (argv.f) {
            file = argv.f;
        }
        return watcher_lib.compileFile("lessc -x " + file, file, fnGetOutputFile);
    };

    watcher_lib.startDirectoryPoll(argv.d, findLessFiles);

}).call(this);
