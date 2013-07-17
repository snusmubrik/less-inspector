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
    fs = require('fs');

    findLessFiles = function(dir) {
        return watcher_lib.findFiles('*.less', dir, compileIfNeeded);
    };

    WATCHED_FILES = {};
    MTIME = new Date();

    compileIfNeeded = function(file) {
        fs.stat(file, function(err, stats) {
            var old_mtime = WATCHED_FILES[file];
            var new_mtime = new Date(stats.mtime);

            var should_compile = false;
            if (argv.o) {
                should_compile = MTIME < new_mtime;
            } else {
                if (!old_mtime) {
                    should_compile = true;
                } else if (new_mtime > old_mtime) {
                    should_compile = true;
                } else {
                    should_compile = false
                }
            }

            WATCHED_FILES[file] = new_mtime;

            if (should_compile) {
                compileLessScript(file)
            }

        });
    };

    compileLessScript = function(file) {
        MTIME = new Date();
        var fnGetOutputFile;

        fnGetOutputFile = function(file) {
            return file.replace(/([^\/\\]+)\.less/, "" + argv.p + "$1.css");
        };

        if (argv.f) {
            file = argv.f;
        }
        return watcher_lib.compileFile("lessc -x " + file, file, fnGetOutputFile);
    };

    if (argv.o && argv.f) {
        compileLessScript(argv.f);
    }

    watcher_lib.startDirectoryPoll(argv.d, findLessFiles);

}).call(this);
