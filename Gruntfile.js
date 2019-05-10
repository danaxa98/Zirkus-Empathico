module.exports = function(grunt) {
	
	// Require it at the top and pass in the grunt instance
    require('jit-grunt')(grunt, {
        svgcss: 'grunt-svg-css'
    });
	require('time-grunt')(grunt);

    var cordovaEnv = function() {
       var env = {};
        for (var key in process.env) {
            if (process.env.hasOwnProperty(key)) {
                env[key] = process.env[key];
            }
        }
        env['ANDROID_AAPT_IGNORE'] = '!*.webm:!*.mp3:!*.mp4:!.svn:!.git:.*:<dir>_*:!CVS:!thumbs.db:!picasa.ini:!*.scc:*~:<dir>www/media/audios:!<dir>www/media/videos:!<dir>www/media/images/video_posters:<dir>www/media/images/faces:<dir>www/media/images/context_illustrations';
        return env;
    };
	
	// All configuration goes here 
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		// Accessibility Configuration
		accessibility: {
			options : {
				accessibilityLevel: 'WCAG2A',
				verbose: true
			},
			all : {
				files: [
					{
						cwd: 'build/',
						dest: 'reports/',
						expand: true,
						ext: '-report.txt',
						src: ['*.html']
					}
				]
			}
		},
		
		// Configuration for assemble
		assemble: {
			options: {
				data: 'source/assemble/data/**/*.{json,yml}',
				helpers: 'source/assemble/helpers/**/*.js',
				layoutdir: 'source/assemble/layouts/',
				partials: 'source/assemble/partials/**/*.{hbs,svg}'
			},
			dev: {
				files: [
					{
						cwd: 'source/assemble/pages/',
						dest: 'build/',
						expand: true,
						flatten: false,
						src: ['**/*.hbs']
					}
				]
			},
			dist: {
				files: [
					{
						cwd: 'source/assemble/pages/',
						dest: 'dist/',
						expand: true,
						flatten: false,
						src: ['**/*.hbs']
					}
				]
			}
		},
		
		// Configuration for autoprefixer
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 9']
			},
			dev: {
				options: {
					map: true
				},
				src: 'build/css/*.css'
			},
			dist: {
				src: 'dist/css/*.css'
			}
		},
		
		// Configuration for deleting files
		clean: {
			dev: {
				files: [
					{
						filter: 'isFile',
						src: ['build/**/*', '!build/bower_components/**/*', '!build/media/**/*']
					}
				]
			},
			dist: {
				files: [
					{
						filter: 'isFile',
						src: ['dist/**/*']
					}
				]
			},
			dist_js: {
				files: [
					{
						filter: 'isFile',
						src: ['dist/**/_*.js']
					}
				]
			},
			docs: {
				dist: ['jsdocs/**/*']
			}
		},
		
		// Configuration for compass
		compass: {
			options: {
				debugInfo: false,
				fontsDir: 'source/fonts',
				force: true,
				imagesDir: 'source/img',
				noLineComments: true,
				outputStyle: 'expanded', // minifying for dist will be done by grunt-contrib-cssmin
				raw: [
					'http_path = "/"',
					'Sass::Script::Number.precision = 8',
					'sass_options = {',
					'  :read_cache => true,',
					'}'
				].join("\n"),
				require: ['sass-globbing', 'compass/import-once'],
				sassDir: 'source/sass'
			},
			dev: {
				options: {
					cssDir: 'build/css',
					environment: 'development',
					javascriptsDir: 'build/js',
					sourcemap: true
				}
			},
			dist: {
				options: {
					cssDir: 'dist/css',
					environment: 'production',
					javascriptsDir: 'dist/js',
					sourcemap: false
				}
			}
		},
		
		// Configuration for run tasks concurrently
		concurrent: {
			dev: ['compass:dev', 'newer:assemble:dev'],
			dist: ['compass:dist', 'assemble:dist', 'imagemin:dist']
		},
		
		// Configuration for livereload
		connect: {
			livereload: {
				options: {
					base: 'build',
					hostname: '0.0.0.0',
					port: 9002,
					middleware: function(connect, options) {
						return [
							require('connect-livereload')({
								port: 35730
							}),
							connect.static(options.base),
							connect.directory(options.base)
						]
					}
				},
				files: {
					src: ['*/*.html']
				}
			}
		},
		
		// Configuration for copying files
		copy: {
			ajax: {
				cwd: 'source/ajax-content/',
				dest: 'dist/ajax-content/',
				expand: true,
				src: ['**/*']
			},
			favicon: {
				cwd: 'source/img/',
				dest: 'dist/img/',
				expand: true,
				src: ['**/*.ico']
			},
			fonts: {
				cwd: 'source/fonts/',
				dest: 'dist/fonts/',
				expand: true,
				src: ['**/*']
			},
            bower_components: {
                cwd: 'source/bower_components/',
                dest: 'dist/bower_components/',
                expand: true,
                src: ['**/*']
            },
            media: {
                cwd: 'source/media/',
                dest: 'dist/media/',
                expand: true,
                src: ['**/*']
            },
            svg_images: {
                cwd: 'source/img/',
                dest: 'dist/img/',
                expand: true,
                src: ['*.svg', '*.gif']
            },
			js: {
				cwd: 'source/js/',
				dest: 'dist/js/',
				expand: true,
				src: ['**/*']
			}
		},
		
		// Configuration for minifying css-files
		cssmin: {
			dist: {
				cwd: 'dist/css/',
				dest: 'dist/css/',
				expand: true,
				src: ['*.css']
			}
		},
		
		// Configuration for grouping media queries
		group_css_media_queries: {
			dist: {
				files: {
					'dist/css/styles.css': ['dist/css/styles.css']
				}
			}
		},
		
        // Configuration for creating SVG-Data-URIs
        svgcss: {
            options: {
                previewhtml: null,
                cssprefix: "%bg-data-svg-"
            },
            all: {
                files: {
                    'source/sass/svgcss/_icons-data-svg.scss': ['source/img/bgs/svgmin/*.svg']
                }
            }
        },
		
		// Configuration for validating html-files
		htmlhint: {
			options: {
				force: true,
				'attr-lowercase': false, // set to false because of svg-attribute 'viewBox'
				'attr-value-double-quotes': true,
				'attr-value-not-empty': true,
				'doctype-first': true,
				'doctype-html5': true,
				'id-class-value': true,
				'id-unique': true,
				'img-alt-require': true,
				'spec-char-escape': true,
				'src-not-empty': true,
				'style-disabled': true,
				'tag-pair': true,
				'tag-self-close': true,
				'tagname-lowercase': true
			},
			all: {
				src: ['*/*.html', '!jsdocs/**/*.html']
			}
		},
		
		// Configuration for optimizing image-files
		imagemin: {
			options: {
				optimizationLevel: 3
			},
            source: {
                files: [
                    {
                        cwd: 'source/img',
                        dest: 'source/img',
                        expand: true,
                        src: ['**/*.{jpg,png}']
                    },
                    {
                        cwd: 'source/media/images',
                        dest: 'source/media/images',
                        expand: true,
                        src: ['**/*.{jpg,png}']
                    }
                ]
            },
			dist: {
				files: [
					{
						cwd: 'dist/img/',
						dest: 'dist/img/',
						expand: true,
						src: ['**/*.{jpg,png}']
					}
				]
			}
		},
		
		// Configuration for documenting js-files
		jsdoc : {
			all: {
				options: {
					destination: 'jsdocs'
				},
				src: ['source/js/modules/**/*.js', 'source/js/README.md']
			}
		},
		
		// Configuration for validating js-files
		jshint: {
			options: {
				force: true,
				'asi': false,
				'bitwise': false,
				'boss': true,
				'browser': true,
				'curly': false,
				'eqeqeq': false,
				'eqnull': true,
				'evil': false,
				'forin': true,
				'immed': false,
				'indent': 4,
				'jquery': true,
				'laxbreak': true,
				'maxerr': 50,
				'newcap': false,
				'noarg': true,
				'noempty': false,
				'nonew': false,
				'nomen': false,
				'onevar': false,
				'plusplus': false,
				'regexp': false,
				'undef': false,
				'sub': true,
				'strict': false,
				'white': false
			},
			own: {
				options: {
					'-W015': true
				},
				src: [
					'source/js/init/*.js',
					'source/js/modules/**/*.js'
				]
			},
			all: {
				options: {
					'-W015': true,
					'-W089': true
				},
				src: [
					'source/js/**/*.js',
					'!source/js/vendor/**/*.js'
				]
			}
		},
		
		// Configuration for pagespeed
		pagespeed: {
			options: {
				nokey: true,
				url: "http://yoursite.com"
			},
			prod: {
				options: {
					locale: "de_DE",
					strategy: "desktop",
					threshold: 80,
					url: "http://yoursite.com"
				}
			},
			paths: {
				options: {
					locale: "de_DE",
					paths: ["/yourpage1.html", "/yourpage2.html"],
					strategy: "desktop",
					threshold: 80
				}
			}
		},
		
		// Configuration for measuring frontend performance
		phantomas: {
			all : {
				options : {
					indexPath: 'build/phantomas/',
					numberOfRuns: 10,
					url: 'http://0.0.0.0:9002/'
				}
			}
		},
		
		// Configuration for photobox
		photobox: {
			all: {
				options: {
					indexPath: 'build/photobox/',
					screenSizes: [ '320', '568', '768', '1024', '1280' ],
					urls: [ 'http://0.0.0.0:9002/index.html' ]
				}
			}
		},
		
		// Configuration for prettifying the html-code generated by assemble
		prettify: {
			options: {
				condense: false,
				indent: 1,
				indent_char: '	',
				indent_inner_html: false,
				preserve_newlines: true,
				unformatted: [
					"a",
					"b",
					"code",
					"em",
					"i",
					"mark",
					"strong",
					"pre"
				]
			},
			dev: {
				options: {
					brace_style: 'expand'
				},
				files: [
					{
						cwd: 'build/',
						dest: 'build/',
						expand: true,
						ext: '.html',
						src: ['*.html']
					}
				]
			},
			dist: {
				options: {
					brace_style: 'collapse'
				},
				files: [
					{
						cwd: 'dist/',
						dest: 'dist/',
						expand: true,
						ext: '.html',
						src: ['*.html']
					}
				]
			}
		},
		
		// Configuration for SCSS linting
		scsslint: {
			allFiles: [
				'source/sass/{blocks,extends,mixins,variables,styles.scss,_*.scss}'
			],
			options: {
				colorizeOutput: true,
				compact: true,
				config: '.scss-lint.yml',
				force: true
			}
		},

        shell: {
            options: {
                execOptions: {
                    cwd: './wrapper/',
                    env: cordovaEnv(),
                    maxBuffer: 1024 * 1024 * 64
                }
            },
            cordovaRun: {
                command: './../node_modules/.bin/cordova run --device'
            },
            cordovaPrepare: {
                command: './../node_modules/.bin/cordova prepare'
            },
            cordovaBuild: {
                command: './../node_modules/.bin/cordova build'
            },
            adbMkdir: {
                command: 'adb shell "mkdir -p /sdcard/ZirkusEmpathico"'
            },
            adbRestartMedia: {
                command: 'adb shell stop media && adb shell start media'
            },
            adbPushAudios: {
                command: 'adb push ../source/media/audios/. /sdcard/ZirkusEmpathico/media/audios/'
            },
            adbPushImages: {
                command: 'adb push ../source/media/images/. /sdcard/ZirkusEmpathico/media/images/'
            },
            adbPushVideos: {
                command: 'adb push ../source/media/videos/. /sdcard/ZirkusEmpathico/media/videos/'
            }
        },

		// Configuration for string-replacing the svgcss output
		'string-replace': {
			datasvg: {
				files: {
					'source/sass/icons/_icons-data-svg.scss': 'source/sass/svgcss/_icons-data-svg.scss'
				},
				options: {
					replacements: [{
						pattern: /.%bg-data-svg-/g,
						replacement: '%bg-data-svg-'
					}]
				}
			}
		},
		
		// Configuration for optimizing SVG-files
		svgmin: {
			options: {
				 plugins: [
					{ cleanupAttrs: true },
					{ cleanupEnableBackground: true },
					{ cleanupIDs: true },
					{ cleanupNumericValues: true },
					{ collapseGroups: true },
					{ convertColors: true },
					{ convertPathData: true },
					{ convertShapeToPath: true },
					{ convertStyleToAttrs: true },
					{ convertTransform: true },
					{ mergePaths: true },
					{ moveElemsAttrsToGroup: true },
					{ moveGroupAttrsToElems: true },
					{ removeComments: true },
					{ removeDoctype: true },
					{ removeEditorsNSData: true },
					{ removeEmptyAttrs: true },
					{ removeEmptyContainers: true },
					{ removeEmptyText: true },
					{ removeHiddenElems: true },
					{ removeMetadata: true },
					{ removeNonInheritableGroupAttrs: true },
					{ removeRasterImages: true },
					{ removeTitle: true },
					{ removeUnknownsAndDefaults: true },
					{ removeUnusedNS: true },
					{ removeUselessStrokeAndFill: false }, // Enabling this may cause small details to be removed
					{ removeViewBox: false }, // Keep the viewBox because that's where illustrator hides the SVG dimensions
					{ removeXMLProcInst: false }, // Enabling this breaks grunticon because it removes the XML header
					{ sortAttrs: true },
					{ transformsWithOnePath: false } // Enabling this breaks Illustrator SVGs with complex text
				]
			},
			bgs: {
				files: [
					{
						cwd: 'source/img/bgs',
						dest: 'source/img/bgs/svgmin',
						expand: true,
						ext: '.svg',
						src: ['*.svg']
					}
				]
			}
		},
		
		// Configuration for syncing files
		// Task does not remove any files and directories in 'dest' that are no longer in 'cwd'. :'(
		sync: {
			ajax: {
				files: [
					{
						cwd: 'source/ajax-content/',
						dest: 'build/ajax-content/',
						src: '**/*'
					}
				]
			},
			favicon: {
				files: [
					{
						cwd: 'source/img/',
						dest: 'build/img/',
						src: '**/*.ico'
					}
				]
			},
			fonts: {
				files: [
					{
						cwd: 'source/fonts/',
						dest: 'build/fonts/',
						src: '**/*'
					}
				]
			},
			js: {
				files: [
					{
						cwd: 'source/js/',
						dest: 'build/js/',
						src: '**/*'
					}
				]
			},
            img: {
                files: [
                    {
                        cwd: 'source/img/',
                        dest: 'build/img/',
                        src: ['*.svg', '*.gif']
                    }
                ]
            }
		},
		
		// Configuration for uglifying JS
		uglify: {
			dist: {
				options: {
					compress: {
						drop_console: true
					}
				},
				files: [
					{
						cwd: 'dist/js',
						dest: 'dist/js',
						expand: true,
						src: ['**/*.js', '!**/_*.js']
					}
				]
			}
		},

        symlink: {
            options: {
                overwrite: false
            },
            bower_components: {
                src: 'source/bower_components/',
                dest: 'build/bower_components/'
            },
            media: {
                src: 'source/media/',
                dest: 'build/media/'
            },
            wrapper: {
                src: 'build/',
                dest: 'wrapper/www'
            }
        },
		
		// Configuration for watching changes
		watch: {
			options: {
				livereload: 35730,
				spawn: true
			},
			css: {
				files: ['build/css/**/*.css']
			},
			scss: {
				files: ['source/sass/**/*.scss'],
				tasks: ['compass:dev', 'autoprefixer:dev'],
				options: {
					debounceDelay: 0,
					livereload: false
				}
			},
            videos: {
                files: ['source/videos/**/*'],
                tasks: ['generate:persons', 'sync:js'],
            },
			svg_bgs: {
				files: ['source/img/bgs/*.svg'],
				tasks: ['newer:svgmin:bgs', 'svgcss', 'string-replace']
			},
			sync_ajax: {
				files: ['source/ajax-content/**/*'],
				tasks: ['sync:ajax']
			},
			sync_fonts: {
				files: ['source/fonts/**/*'],
				tasks: ['sync:fonts']
			},
			sync_js: {
				files: ['source/js/**/*'],
				tasks: ['sync:js', 'jshint']
			},
            sync_svg: {
                files: ['source/img/*.svg'],
                tasks: ['sync:svg']
            },
			templates: {
				files: ['source/assemble/**/*.{json,hbs}'],
				tasks: ['newer:assemble:dev', 'prettify:dev', 'htmlhint'],
				options: {
					spawn: false
				}
			}
		}
	});

    // custom task for persons

    grunt.registerTask('generate:persons', 'Generate "source/js/data/Persons.js"', function() {
        var glob = require("glob");
        var path = require("path");
        var fs = require("fs");

        var getPosterName = function(person) {
            return [
                (person.isChild) ? "K" : "E",
                ((person.gender == "female") ? "w" : "m") + "_",
                person.name + "_",
                person.emotion,
                ((person.intensity === "") ? "" :  "_" + person.intensity),
                ((person.hint === "") ? "" :  "_" + person.hint),
                ".png"
            ].join("");
        };

        var done = this.async();
        var basePath = process.cwd() + "/source/media/videos/";
        glob(basePath + "{adults,children}/**/*.mp4", function (error, files) {
            if (error)
            {
                done(false);
                return ;
            }

            var entries = [];

            files.forEach(function(file)
            {
                var entryBaseName = path.basename(file);
                /** we have something like:
                 *  1 2            3       4    5
                 * Em_Schufatinski_neutral_high_mouth.mp4
                 * */
                var entryBaseNameWithIntensityMatch = entryBaseName.match(/^.(w|m)_([^_]+)_([^_]+)_([^_]+)_([^_]+)\.mp4$/);
                var isChild = !file.match(/\/adults\//);

                if (entryBaseNameWithIntensityMatch)
                {
                    var entry = {
                        "file": file.substr(basePath.length),
                        "name": entryBaseNameWithIntensityMatch[2],
                        "isChild": isChild,
                        "gender": (entryBaseNameWithIntensityMatch[1] == 'w' ? 'female' : 'male'),
                        "emotion": entryBaseNameWithIntensityMatch[3],
                        "intensity": entryBaseNameWithIntensityMatch[4],
                        "hint": entryBaseNameWithIntensityMatch[5]
                    };
                    entry["salutation"] = isChild ? 'child' : entry["gender"];
                    entry["fileName"] = getPosterName(entry);

                    entries.push(entry);
                    return ;
                }

                /* we have something like: Em_Schufatinski_neutral_mouth.mp4 */
                var entryBaseNameWithoutIntensityMatch = entryBaseName.match(/^.(w|m)_([^_]+)_([^_]+)_([^_]+)\.mp4$/);

                if (!entryBaseNameWithoutIntensityMatch)
                {
                    console.error('Cannot parse ' + file);
                    return ;
                }

                var entry = {
                    "file": file.substr(basePath.length),
                    "name": entryBaseNameWithoutIntensityMatch[2],
                    "isChild": isChild,
                    "gender": (entryBaseNameWithoutIntensityMatch[1] == 'w' ? 'female' : 'male'),
                    "emotion": entryBaseNameWithoutIntensityMatch[3],
                    "intensity": "",
                    "hint": entryBaseNameWithoutIntensityMatch[4]
                };

                entry["salutation"] = isChild ? 'child' : entry["gender"];
                entry["fileName"] = getPosterName(entry);

                entries.push(entry);
            });

            var personsFileBody = [
                'define(\'data/Persons\', [], function()',
                '{',
                '    "use strict";',
                '',
                '    return ' + JSON.stringify(entries, null, 4).replace(/\n/g, '\n    ') + ';',
                '});'
            ].join("\n");

            fs.writeFileSync(process.cwd() + '/source/js/data/Persons.js', personsFileBody);
            done(true);
        });
    });

    grunt.registerTask('generate:context', 'Generate "source/js/data/Context.js"', function() {
        var glob = require("glob");
        var path = require("path");
        var fs = require("fs");

        var done = this.async();
        var basePath = process.cwd() + "/source/media/videos/context/**/";
        glob(basePath + "*.mp4", function (error, files) {
            if (error)
            {
                done(false);
                return ;
            }

            var entries = [];

            files.forEach(function(file) {
                var entryBaseName = path.basename(file);

                var entryBaseNameWithIntensityAndContextAndGenderMatch =
                    entryBaseName.match(/^context_([^_]+)_([^_]+)_([^_]+)\.mp4$/);

                if (!entryBaseNameWithIntensityAndContextAndGenderMatch) {
                    /* we have something like: context_angry_apples.mp4 */
                    var entryBaseNameWithIntensityAndContextMatch =
                        entryBaseName.match(/^context_([^_]+)_([^_]+)\.mp4$/);

                    if (!entryBaseNameWithIntensityAndContextMatch) {
                        console.error('Cannot parse ' + file);
                        return;
                    }
                    else {
                        var entry = {
                            "file": entryBaseName,
                            "emotion": entryBaseNameWithIntensityAndContextMatch[1],
                            "context": entryBaseNameWithIntensityAndContextMatch[2]
                        };
                    }
                } else {
                    var entry = {
                        "file": entryBaseName,
                        "emotion": entryBaseNameWithIntensityAndContextAndGenderMatch[1],
                        "context": entryBaseNameWithIntensityAndContextAndGenderMatch[2],
                        "gender": entryBaseNameWithIntensityAndContextAndGenderMatch[3]
                    };
                }
                entries.push(entry);
            });

            var personsFileBody = [
                'define(\'data/Context\', [], function()',
                '{',
                '    "use strict";',
                '',
                    '    return ' + JSON.stringify(entries, null, 4).replace(/\n/g, '\n    ') + ';',
                '});'
            ].join("\n");

            fs.writeFileSync(process.cwd() + '/source/js/data/Context.js', personsFileBody);
            done(true);
        });
    });

    // Where we tell Grunt we plan to use this plug-in.
	// done by jit-grunt plugin loader
	
	
	// Where we tell Grunt what to do when we type "grunt" into the terminal.
	
	// Default -> Standard Build task
	grunt.registerTask('default', [
		'build'
	]);
	
	// Build task
	grunt.registerTask('build', [
		'dev',
		'connect:livereload',
		'watch'
	]);

	grunt.registerTask('dev', [
		'clean:dev',
        'generate:persons',
        'generate:context',
		'newer:svgmin',
		'svgcss',
		'string-replace',
		'concurrent:dev',
		'autoprefixer:dev',
        'symlink:bower_components',
        'symlink:media',
		'sync',
		'prettify:dev',
		'htmlhint',
		'jshint'
	]);
	
	// Distributing task
	grunt.registerTask('dist', [
		'clean:dist',
        'generate:persons',
        'generate:context',
		'clean:docs',
		'svgmin',
		'svgcss',
		'string-replace',
		'concurrent:dist',
		'autoprefixer:dist',
		'group_css_media_queries',
		'cssmin',
        'copy:svg_images',
		'copy:ajax',
        'copy:media',
        'copy:bower_components',
		'copy:favicon',
		'copy:fonts',
		'copy:js',
		'uglify',
		'clean:dist_js',
		'prettify:dist',
//		'htmlhint',
//		'accessibility',
		'jshint'
//		'jsdoc'
	]);

    grunt.registerTask('cordova:build', [
        'symlink:wrapper',
        'shell:cordovaPrepare',
        'shell:cordovaBuild'
    ]);

    grunt.registerTask('cordova:run', [
        'symlink:wrapper',
        'shell:cordovaPrepare',
        'shell:cordovaRun'
    ]);

    grunt.registerTask('cordova:syncAssets', [
        'shell:adbMkdir',
        'shell:adbPushAudios',
        'shell:adbPushImages',
        'shell:adbPushVideos',
        'shell:adbRestartMedia'
    ]);

    grunt.registerTask('setup-tablet', [
        'dev',
        'cordova:syncAssets',
        'cordova:run'
    ]);

    // HTMLHint task
	grunt.registerTask('check-html', [
		'htmlhint'
	]);
	
	// SCSSLint task
	grunt.registerTask('check-scss', [
		'scsslint'
	]);
	
	// JSHint task
	grunt.registerTask('check-js', [
		'jshint'
	]);
	
	// JSHint task
	grunt.registerTask('check-wcag2', [
		'accessibility'
	]);
	
	// Pagespeed task
	grunt.registerTask('measure-pagespeed', [
		'pagespeed'
	]);
	
	// Phantomas task
	grunt.registerTask('measure-performance', [
		'connect:livereload',
		'phantomas'
	]);
	
	// Photobox task
	grunt.registerTask('take-screenshots', [
		'connect:livereload',
		'photobox'
	]);
	
};
