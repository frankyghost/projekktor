module.exports = function (grunt) {

  "use strict";
 
  var dest = 'dest/',
    name = grunt.option('name') || '',
    version = (name!='') ? grunt.option('ver') + "." + name : grunt.option('ver') || '',  
    distpaths = [
      "dist/projekktor-" + version + ".js",
      "dist/projekktor-" + version + ".min.map",
      "dist/projekktor-" + version + ".min.js"
    ],    
    filesUglify = {},
    filesPreUglify = {},
    gzip = require("gzip-js"),
    readOptionalJSON = function (filepath) {
      var data = {};
      try {
        data = grunt.file.readJSON(filepath);
      } catch (e) {}
      return data;
    },
    srcHintOptions = readOptionalJSON("src/.jshintrc");

  filesPreUglify["dist/projekktor-" + version + ".pre-min.js"] = ["dist/projekktor-" + version + ".js"];
  filesUglify["dist/projekktor-" + version + ".min.js"] = ["dist/projekktor-" + version + ".pre-min.js"];
  dest = dest + name + "/"
  grunt.file.mkdir(dest);
  
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    dst: readOptionalJSON("dist/.destination.json"),
    compare_size: {
      files: ["dist/projekktor-" + version + ".js", "dist/projekktor-" + version + ".min.js"],
      options: {
        compress: {
          gz: function (contents) {
            return gzip.zip(contents, {}).length;
          }
        },
        cache: "dist/.sizecache.json"
      }
    },
    build: {
      all: {
        dest: "dist/projekktor-" + version + ".js",
        src: [
          "src/controller/projekktor.js",
          "src/controller/projekktor.config.js",
          "src/controller/projekktor.utils.js",
          "src/controller/projekktor.plugininterface.js",
          "src/models/player.js",
          "src/models/player.NA.js",
          {flag: "playlist", src: "src/models/player.playlist.js" },
          "src/models/player.audio.video.js",
          "src/models/player.audio.video.vlc.js",
          {flag: "jwflash", src: "src/models/player.video.jwflash.js", alt: "src/models/player.audio.video.osmf.js" },         
          {flag: "jarisflash", src: "src/models/player.audio.video.flash.js", alt: "src/models/player.audio.video.osmf.js" },         
          {flag: "youtube", src: "src/models/player.youtube.js" },
          {flag: "html", src: "src/models/player.image.html.js" },
          "src/plugins/projekktor.display.js",
          "src/plugins/projekktor.controlbar.js",
          "src/plugins/projekktor.contextmenu.js",
          {user:true, flag: "plugins/ima", src: "plugins/projekktor.ima.js" },
          {user:true, flag: "plugins/logo", src: "plugins/projekktor.logo.js" },
          {user:true, flag: "plugins/postertitle", src: "plugins/projekktor.postertitle.js" },
          {user:true, flag: "plugins/share", src: "plugins/projekktor.share.js" },
          {user:true, flag: "plugins/tracking", src: "plugins/projekktor.tracking.js" },
          {user:true, flag: "plugins/tracks", src: "plugins/projekktor.tracks.js" },
          {user:true, flag: "plugins/audioslideshow", src: "plugins/projekktor.audioslideshow.js" }
        ]
      }
    },    
    jshint: {
      dist: {
        src: ["dist/projekktor-" + version + ".js"],
        options: srcHintOptions
      },
      grunt: {
        src: ["Gruntfile.js"],
        options: {
          jshintrc: ".jshintrc"
        }
      },
      tests: {
        // TODO: Once .jshintignore is supported, use that instead.
        // issue located here: https://github.com/gruntjs/grunt-contrib-jshint/issues/1
        src: ["test/data/{test,testinit,testrunner}.js", "test/unit/**/*.js"],
        options: {
          jshintrc: "test/.jshintrc"
        }
      }
    },

    watch: {
      files: ["<%= jshint.grunt.src %>", "<%= jshint.tests.src %>", "src/**/*.js"],
      tasks: "dev"
    },

    "pre-uglify": {
      all: {
        files: filesPreUglify,
        options: {
          banner: "/*! Projekktor v<%= pkg.version %> | " + "http://www.projekktor.com | " + "Copyright 2010, 2011, Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com | " + "GNU General Public License - http://www.projekktor.com/license/\n" + "//@ sourceMappingURL=projekktor.min.map\n" + "*/"
        }
      }
    },
    uglify: {
      all: {
        files: filesUglify,
        options: {
          // Keep our hard-coded banner
          preserveComments: "some",
          sourceMap: "dist/projekktor-" + version + ".min.map",
          sourceMappingURL: "projekktor-" + version + ".min.map",
          report: "min",
          beautify: {
            ascii_only: true
          },
          compress: {
            hoist_funs: false,
            join_vars: false,
            loops: false,
            unused: false
          },
          mangle: {
            // saves some bytes when gzipped
            except: ["undefined"]
          }
        }
      }
    },
    clean: {
      build: {
        src: [dest]
      }
    },
    readme: {
        src: 'dist/readme.html',  // source template file
        dest: dest + 'readme.html',  // destination file (usually index.html)
        version: version,
        name: name
    },
    copy: {
      main: {
        files: [
          // includes files within path
          // {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},
          // includes files within path and its sub-directories
          {expand: true, flatten: true, src: ['dist/*' + version + '*'], dest: dest},
          {expand: true, flatten: true, src: ['dist/media/*'], dest: dest + 'media/'},
          {expand: true, src: ['themes/**'], dest: dest},
          {expand: true, src: ['readme.html'], dest: dest},
          {expand: true, flatten: true, src: ['libs/jquery-1.9.1.min.js'], dest: dest}
          // makes all src relative to cwd
          // {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},
          // flattens results to a single level
          // {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'}
        ]
      }
    },
    compress: {
      main: {
        options: {
          archive: dest + "projekktor-" + version + '.zip'
        },
        files: [
          //{src: ['path/*'], dest: 'internal_folder/', filter: 'isFile'}, // includes files in path
          // {src: ['dest/**'], dest: ''}, // includes files in path and its subdirs
          {expand: true, cwd: dest, src: ['**'], dest: ''}, // makes all src relative to cwd
          //{flatten: true, src: ['path/**'], dest: 'internal_folder4/', filter: 'isFile'} // flattens results to a single level
        ]
      }
    }    
  });
  
  
  grunt.registerTask( "readme", "Generate readme.html depending on configuration", function() {
      var conf = grunt.config('readme'),
          tmpl = grunt.file.read(conf.src);

      grunt.file.write(conf.dest, grunt.template.process(tmpl));

      grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
  });  

  // Special "alias" task to make custom build creation less grawlix-y
  grunt.registerTask("custom", function () {
    var done = this.async(),
      args = [].slice.call(arguments),
      modules = args.length ? args[0].replace(/,/g, ":") : "";

    // Translation example
    //
    //   grunt custom:+ajax,-dimensions,-effects,-offset
    //
    // Becomes:
    //
    //   grunt build:*:*:+ajax:-dimensions:-effects:-offset

    grunt.log.writeln("Creating custom build..." + version + "\n");

    grunt.util.spawn({
      grunt: true,
      args: ["--ver=" + version, "update_submodules", "build:*:" + modules, "pre-uglify", "uglify", "dist:*", "compare_size", "clean", "copy", "readme", "compress"]
    }, function (err, result) {
      if (err) {
        grunt.log.writeln(err + " "+ result);
        // grunt.verbose.error();
        // done(err);
        return;
      }

      grunt.log.writeln(result.stdout.replace("Done, without errors.", ""));

      done();
    });

  });

  // Special concat/build task to handle various build requirements
  grunt.registerMultiTask(
    "build",
    "Concatenate source (include/exclude modules with +/- flags), embed date/version",

  function () {
    // Concat specified files.
    var compiled = "",
      modules = this.flags,
      optIn = !modules["*"],
      explicit = optIn || Object.keys(modules).length > 1,
      name = this.data.dest,
      src = this.data.src,
      deps = {},
      excluded = {},
      version = grunt.config("pkg.version"),
      excluder = function (flag, needsFlag) {
        // optIn defaults implicit behavior to weak exclusion
        if (optIn && !modules[flag] && !modules["+" + flag]) {
          excluded[flag] = false;
        }

        // explicit or inherited strong exclusion
        if (excluded[needsFlag] || modules["-" + flag]) {
          excluded[flag] = true;

          // explicit inclusion overrides weak exclusion
        } else if (excluded[needsFlag] === false && (modules[flag] || modules["+" + flag])) {

          delete excluded[needsFlag];

          // ...all the way down
          if (deps[needsFlag]) {
            deps[needsFlag].forEach(function (subDep) {
              modules[needsFlag] = true;
              excluder(needsFlag, subDep);
            });
          }
        }
      };

    // append commit id to version
    if (process.env.COMMIT) {
      version += " " + process.env.COMMIT;
    }

    // figure out which files to exclude based on these rules in this order:
    //  dependency explicit exclude
    //  > explicit exclude
    //  > explicit include
    //  > dependency implicit exclude
    //  > implicit exclude
    // examples:
    //  *                  none (implicit exclude)
    //  *:*                all (implicit include)
    //  *:*:-html           all except css and dependents (explicit > implicit)
    //  *:*:-html:+youtube  same (excludes effects because explicit include is trumped by explicit exclude of dependency)
    //  *:+youtube         none except effects and its dependencies (explicit include trumps implicit exclude of dependency)
    src.forEach(function (filepath, index) {
      // check for user plugins
      var user = filepath.user;
      if (user && filepath.src) {
        if (!grunt.file.exists(filepath.src)) {
          delete src[index];
          return;
        }
      }

      var flag = filepath.flag;

      if (flag) {
        excluder(flag);

        // check for dependencies
        if (filepath.needs) {
          deps[flag] = filepath.needs;
          filepath.needs.forEach(function (needsFlag) {
            excluder(flag, needsFlag);
          });
        }
      }
    });

    // append excluded modules to version
    if (Object.keys(excluded).length) {
      version += " -" + Object.keys(excluded).join(",-");
      // set pkg.version to version with excludes, so minified file picks it up
      grunt.config.set("pkg.version", version);
    }

    // conditionally concatenate source
    src.forEach(function (filepath) {
      var flag = filepath.flag,
        specified = false,
        omit = false,
        messages = [];

      if (flag) {
        if (excluded[flag] !== undefined) {
          messages.push([
              ("Excluding " + flag).red,
              ("(" + filepath.src + ")").grey
            ]);
          specified = true;
          omit = !filepath.alt;
          if (!omit) {
            flag += " alternate";
            filepath.src = filepath.alt;
          }
        }
        if (excluded[flag] === undefined) {
          messages.push([
              ("Including " + flag).green,
              ("(" + filepath.src + ")").grey
            ]);

          // If this module was actually specified by the
          // builder, then set the flag to include it in the
          // output list
          if (modules["+" + flag]) {
            specified = true;
          }
        }

        filepath = filepath.src;

        // Only display the inclusion/exclusion list when handling
        // an explicit list.
        //
        // Additionally, only display modules that have been specified
        // by the user
        if (explicit && specified) {
          messages.forEach(function (message) {
            grunt.log.writetableln([27, 30], message);
          });
        }
      }

      if (!omit) {
        compiled += grunt.file.read(filepath);
      }
    });

    // Embed Version
    // Embed Date
    compiled = compiled.replace(/@VERSION/g, version)
    // yyyy-mm-ddThh:mmZ
    .replace(/@DATE/g, (new Date()).toISOString().replace(/:\d+\.\d+Z$/, "Z"));

    // Write concatenated source to file
    grunt.file.write(name, compiled);

    // Fail task if errors were logged.
    if (this.errorCount) {
      return false;
    }

    // Otherwise, print a success message.
    grunt.log.writeln("File '" + name + "' created.");
  });

  // Process files for distribution
  grunt.registerTask("dist", function () {
    var stored, flags, paths, fs, nonascii;

    // Check for stored destination paths
    // ( set in dist/.destination.json )
    stored = Object.keys(grunt.config("dst"));

    // Allow command line input as well
    flags = Object.keys(this.flags);

    // Combine all output target paths
    paths = [].concat(stored, flags).filter(function (path) {
      return path !== "*";
    });

    // Ensure the dist files are pure ASCII
    fs = require("fs");
    nonascii = false;

    distpaths.forEach(function (filename) {
      var i, c,
      text = fs.readFileSync(filename, "utf8");

      // Ensure files use only \n for line endings, not \r\n
      if (/\x0d\x0a/.test(text)) {
        var index = /\x0d\x0a/.exec(text).index;
        var subText = text.substring(0, index);
        var lines = subText.split(/\n/);
        grunt.log.writeln(filename + ": [" + lines.length + "] Incorrect line endings (\\r\\n)");
        nonascii = true;
      }

      // Ensure only ASCII chars so script tags don't need a charset attribute
      if (text.length !== Buffer.byteLength(text, "utf8")) {
        grunt.log.writeln(filename + ": Non-ASCII characters detected:");
        for (i = 0; i < text.length; i++) {
          c = text.charCodeAt(i);
          if (c > 127) {
            grunt.log.writeln("- position " + i + ": " + c);
            grunt.log.writeln("-- " + text.substring(i - 20, i + 20));
            break;
          }
        }
        nonascii = true;
      }

      // Modify map/min so that it points to files in the same folder;
      // see https://github.com/mishoo/UglifyJS2/issues/47
      if (/\.map$/.test(filename)) {
        text = text.replace(/"dist\//g, "\"");
        fs.writeFileSync(filename, text, "utf-8");

        // Use our hard-coded sourceMap directive instead of the autogenerated one (#13274; #13776)
      } else if (/\.min\.js$/.test(filename)) {
        i = 0;
        text = text.replace(/(?:\/\*|)\n?\/\/@\s*sourceMappingURL=.*(\n\*\/|)/g,

        function (match) {
          if (i++) {
            return "";
          }
          return match;
        });
        fs.writeFileSync(filename, text, "utf-8");
      }

      // Optionally copy dist files to other locations
      paths.forEach(function (path) {
        var created;

        if (!/\/$/.test(path)) {
          path += "/";
        }

        created = path + filename.replace("dist/", "");
        grunt.file.write(created, text);
        grunt.log.writeln("File '" + created + "' created.");
      });
    });

    return !nonascii;
  });

  // Work around grunt-contrib-uglify sourceMap issues (jQuery #13776)
  grunt.registerMultiTask("pre-uglify", function () {
    var banner = this.options().banner;

    this.files.forEach(function (mapping) {
      // Join src
      var input = mapping.src.map(function (file) {
        var contents = grunt.file.read(file);

        // Strip banners
        return contents.replace(/^\/\*!(?:.|\n)*?\*\/\n?/gm, "");
      }).join("\n");

      // Write temp file (with optional banner)
      grunt.file.write(mapping.dest, (banner || "") + input);
    });
  });

  // Load grunt tasks from NPM packages
  grunt.loadNpmTasks("grunt-contrib-clean");  
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-compare-size");
  grunt.loadNpmTasks("grunt-git-authors");
  grunt.loadNpmTasks("grunt-update-submodules");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // Default build that mirrors the Projekktor distribution
  grunt.registerTask("default", [
    "update_submodules",
    "build:*:*:+playlist:+youtube:+html:+vlc:-jwflash:-plugins/logo:-plugins/ima:-plugins/postertitle:-plugins/share:-plugins/tracking",
    "pre-uglify",
    "uglify",
    "dist:*",
    "compare_size",
    "clean",
    "copy",
    "readme",
    "compress"
  ]);

  // Build minimal -- only required plugins
  grunt.registerTask("build-minimal", ["update_submodules", "build", "pre-uglify", "uglify", "dist:*", "compare_size", "clean", "copy", "readme", "compress"]);

  // Build complete -- all plugins present
  grunt.registerTask("build-complete", ["update_submodules", "build:*:*", "pre-uglify", "uglify", "dist:*", "compare_size", "clean", "copy", "readme", "compress"]);

  // Minimal build
  grunt.registerTask("build-user", [
    "update_submodules",
    "build:*:*:+plugins/logo:+playlist:+plugins/ima:-plugins/postertitle:-plugins/share:-html:-vlc;-youtube:-jwflash:-plugins/tracking",
    "pre-uglify",
    "uglify",
    "dist:*",
    "compare_size",
    "clean",
    "copy",
    "readme",
    "compress"    
  ]);

  // Short list as a high frequency watch task
  grunt.registerTask("dev", ["selector", "build:*:*", "jshint"]);
};
