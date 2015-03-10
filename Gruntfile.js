// Generated on 2014-02-20 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	var modRewrite = require('connect-modrewrite');
	var fs = require('fs')
	// Define the configuration for all the tasks
	grunt.initConfig({
		nggettext_extract: {
			pot: {
				files: {
					'po/templates.pot': ['<%= yeoman.app %>/{,*/}*.html'],
				}
			}
		},
		
		nggettext_compile: {
			all: {
				options: {
					module: 'tradity'
				},
				files: {
					'<%= yeoman.app %>/js/translations.js': ['po/*.po']
				}
			}
		},
		
		unMarkupPo: {
			files: {
				src: [
					'po/templates.pot'
				],
				dest: 'po/templates-stripped.pot'
			}
		},
		
		reMarkupPo: {
			files: {
				src: [
					'po/templates.pot',
					'po/templates-stripped.po',
				],
				dest: 'po/templates.po'
			}
		},
		
		// Project settings
		yeoman: {
			// configurable paths
			app: require('./bower.json').appPath || 'app',
			dist: 'dist'
		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= yeoman.app %>/js/{,*/}*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: true
				}
			},
			jsTest: {
				files: ['test/spec/{,*/}*.js'],
				tasks: ['newer:jshint:test', 'karma']
			},
			styles: {
				files: ['<%= yeoman.app %>/css/{,*/}*.css','<%= yeoman.app %>/less/{,*/}*.less'],
				tasks: ['less:dev','newer:copy:styles', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= yeoman.app %>/{,*/}*.html',
					'.tmp/css/{,*/}*.css',
					'<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: '0.0.0.0',
				livereload: 35729,
				middleware: function (connect, options) {
					var middlewares = [];
					var directory = options.directory || options.base[options.base.length - 1];
				
					middlewares.push(function(req,res,next){
						if (req.url.indexOf('/js/common/') != -1)
							var fileStream = fs.createReadStream('../common/'+req.url.substring(req.url.lastIndexOf("/") + 1,req.url.length)).pipe(res);
						else
							next();
					})

					// enable Angular's HTML5 mode
					middlewares.push(modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.woff|\\.png$ /index.html [L]']));

					if (!Array.isArray(options.base)) {
						options.base = [options.base];
					}
					options.base.forEach(function(base) {
						// Serve static files.
						middlewares.push(connect.static(base));
					});

					

					// Make directory browse-able.
					middlewares.push(connect.directory(directory));

					return middlewares;
				}
			},
			livereload: {
				options: {
					open: true,
					base: [
						'.tmp',
						'<%= yeoman.app %>'
					]
				}
			},
			test: {
				options: {
					port: 9001,
					base: [
						'.tmp',
						'test',
						'<%= yeoman.app %>'
					]
				}
			},
			dist: {
				options: {
					base: '<%= yeoman.dist %>'
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/js/{,*/}*.js'
			],
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/spec/{,*/}*.js']
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/*',
						'!<%= yeoman.dist %>/.git*'
					]
				}]
			},
			server: '.tmp',
			doc: 'docs/*'
		},
		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/css/',
					src: '{,*/}*.css',
					dest: '.tmp/css/'
				}]
			}
		},

		// Automatically inject Bower components into the app
		'bower-install': {
			app: {
				html: '<%= yeoman.app %>/index.html',
				ignorePath: '<%= yeoman.app %>/'
			}
		},





		// Renames files for browser caching purposes
		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/templates/{,*/}*.html',
						'<%= yeoman.dist %>/js/{,*/}*.js',
						'<%= yeoman.dist %>/css/{,*/}*.css',
						'<%= yeoman.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
						'<%= yeoman.dist %>/css/fonts/*'
					]
				}
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: '<%= yeoman.app %>/index.html',
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/css/{,*/}*.css'],
			js: ['<%= yeoman.dist %>/js/{,*/}*.js'],
			ngInclude: ['<%= yeoman.dist %>/{,*/}*.html'],
			options: {
				assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/img'],
				patterns: {
					js: [[/[\s'"]((?:templates|img|css|js)\/[^\s'"]+)[\s'"]/gm, 'Update js references to files']],
					ngInclude: [[/(?:<ng-include[^\>]+src|<[^\>]+ng-include)=['"]{2}([^"']+)["']{2}/gm, 'Update ng-include direct source file references']]
				}
			}
		},

		// The following *-min tasks produce minified files in the dist folder"
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/img',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%= yeoman.dist %>/img'
				}]
			}
		},
		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/img',
					src: '{,*/}*.svg',
					dest: '<%= yeoman.dist %>/img'
				}]
			}
		},
		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: false, // https://github.com/kangax/html-minifier/issues/178
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>',
					src: ['*.html', 'templates/{,*/}*.html'],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},

		// Allow the use of non-minsafe AngularJS files. Automatically makes it
		// minsafe compatible so Uglify does not destroy the ng references
		ngmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/concat/js',
					src: '*.js',
					dest: '.tmp/concat/js'
				}]
			}
		},

		// Replace Google CDN references
		cdnify: {
			dist: {
				html: ['<%= yeoman.dist %>/*.html']
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'*.{ico,png,txt,html,php,json}',
						'templates/{,*/}*.html',
						'bower_components/**/*',
						'img/{,*/}*.{webp}',
						'fonts/{,*/}*',
						'js/buildstamp.js',
						'js/jit/**/*'
					]
				}, {
					expand: true,
					cwd: '.tmp/img',
					dest: '<%= yeoman.dist %>/img',
					src: ['generated/*']
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= yeoman.app %>/css',
				dest: '.tmp/css/',
				src: '{,*/}*.css'
			},
			css: {
				expand: true,
				dest: '<%= yeoman.dist %>/css',
				cwd: '.tmp/concat/css/',
				src: 'main.css'
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'copy:styles'
			],
			test: [
				'copy:styles'
			],
			dist: [
				'copy:styles',
				'imagemin',
				'svgmin'
			]
		},

		// By default, your `index.html`'s <!-- Usemin block --> will take care of
		// minification. These next options are pre-configured if you do not wish
		// to use the Usemin blocks.
		// cssmin: {
		//   dist: {
		//     files: {
		//       '<%= yeoman.dist %>/css/main.css': [
		//         '.tmp/css/{,*/}*.css',
		//         '<%= yeoman.app %>/css/{,*/}*.css'
		//       ]
		//     }
		//   }
		// },
		uglify: {
			lzma: {
				files: {
					'.tmp/lzma_worker.js': [
						'<%= yeoman.app %>/bower_components/lzma-js/src/lzma_worker.js'
					]
				}
			}
		},
		// concat: {
		//   dist: {}
		// },

		// Test settings
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},
		
		stringwrap: {
			files: {
				src: [
					'.tmp/lzma_worker.js'
				],
				dest: '<%= yeoman.app %>/js/lzma_worker.wrap.js'
			}
		},
		
		createconfig: {
			files: {
				src: [
					'<%= yeoman.app %>/js/config.global.json',
					'<%= yeoman.app %>/js/config.local.json'
				],
				dest: '<%= yeoman.app %>/js/config.js'
			}
		},
		less: {
			dev: {
				paths: ['<%= yeoman.app %>/less', '<%= yeoman.app %>/css'],
				files: {
					'<%= yeoman.app %>/css/style.css': "<%= yeoman.app %>/less/main.less"
				}
			},
			build: {
				compress: true,
				paths: ['<%= yeoman.app %>/less', '<%= yeoman.app %>/css'],
				files: {
					'<%= yeoman.app %>/css/style.css': "<%= yeoman.app %>/less/main.less"
				}
			},
		},
		ngdocs: {
			tradity: {
				src: [
					'<%= yeoman.app %>/js/controllers/*.js',
					'<%= yeoman.app %>/js/directives/*.js',
					'<%= yeoman.app %>/js/services/*.js'
				],
				title: 'Tradity Documentation'
			}
		},
	});

	grunt.registerMultiTask('stringwrap', 'Wrap file contents as string', function() {
		this.files.forEach(function(file) {
			var j = '';
			
			file.src.forEach(function(f) {
				j += ('var ' + f.replace(/^(.*\/)?([^\/]+)$/, '$2').replace(/[^\w]/g, '_').replace(/_+/g, '_') + 
					' = ' + JSON.stringify(grunt.file.read(f)));
			});
			
			grunt.file.write(file.dest, j);
			grunt.log.writeln('Written wrapped result to ' + file.dest);
		});
	});
	
	function stripTabs(msgid) { return msgid.replace(/^\s*|\s*$/gm, ''); }
	
	grunt.registerMultiTask('unMarkupPo', 'Strip unneccessary markup from pot file', function() {
		var pofile = require('pofile');
		var remarkup = require('remarkup');
		
		this.files.forEach(function(file) {
			var pot = pofile.parse(grunt.file.read(file.src));
			var rm = new remarkup.ReMarkup();
			
			for (var i = 0; i < pot.items.length; ++i)
				pot.items[i].msgid = rm.unMarkup(stripTabs(pot.items[i].msgid));
			
			grunt.file.write(file.dest, pot.toString());
		});
	});
	
	grunt.registerMultiTask('reMarkupPo', 'Re-add markup from pot file to po file', function() {
		var pofile = require('pofile');
		var munkres = require('munkres-js');
		var remarkup = require('remarkup');
		var Levenshtein = require('levenshtein');
		
		this.files.forEach(function(file) {
			var pot = pofile.parse(grunt.file.read(file.src[0]));
			var po  = pofile.parse(grunt.file.read(file.src[1]));
			
			var rm = new remarkup.ReMarkup();
			
			/* compute the levenshtein distances between all
			 * unMarkupped .pot entries and the msgids
			 * in the stripped .po file */
			var distanceMatrix = [];
			for (var i = 0; i < pot.items.length; ++i) {
				distanceMatrix[i] = [];
				for (var j = 0; j < po.items.length; ++j)
					distanceMatrix[i][j] = new Levenshtein(
						rm.unMarkup(stripTabs(pot.items[i].msgid)),
						po.items[j].msgid).distance;
			}
			
			var m = new munkres.Munkres();
			var indices = m.compute(distanceMatrix);
		
			for (var k = 0; k < indices.length; ++k) {
				var ci = indices[k][0], cj = indices[k][1];
				
				po.items[cj].msgid = pot.items[ci].msgid;
				for (var l = 0; l < po.items[cj].msgstr.length; ++l)
					po.items[cj].msgstr[l] = rm.reMarkup(pot.items[ci].msgid, po.items[cj].msgstr[l]);
			}
			
			grunt.file.write(file.dest, po.toString());
		});
	});
	
	grunt.registerMultiTask('createconfig', 'Merge global and local config', function() {
		this.files.forEach(function(file) {
			var j = {};
			
			file.src.forEach(function(f) {
				j = grunt.util._.extend(j, grunt.file.readJSON(f));
			});
			
			var s = 'angular.module("' + j._module + '")\n';
			Object.keys(j).forEach(function(key) {
				var macroStyleKey = key.replace(/[A-Z]/g, function(m) { return '_' + m.toLowerCase(); }).toUpperCase();
				
				s += '\t.constant("' + macroStyleKey + '", ' + JSON.stringify(j[key]) + ')\n';
			});
			s += ';\n';
			
			grunt.file.write(file.dest, s);
			grunt.log.writeln('Written config to ' + file.dest);
		});
	});

	grunt.registerTask('serve', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'bower-install',
			'concurrent:server',
			'autoprefixer',
			'less:dev',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('server', function () {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve']);
	});

	grunt.registerTask('test', [
		'clean:server',
		'concurrent:test',
		'autoprefixer',
		'connect:test',
		'karma'
	]);

	grunt.registerTask('doc', [
		'clean:doc',
		'ngdocs'
	]);

	grunt.registerTask('build', [
		'nggettext_extract',
		'nggettext_compile',
		'clean:dist',
		'bower-install',
		'createconfig',
		'uglify:lzma',
		'stringwrap',
		'less:build',
		'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		'concat',
		'ngmin',
		'copy:dist',
		'cdnify',
		//'cssmin',
		'uglify:generated',
		'rev',
		'usemin',
		'htmlmin',
		'copy:css'
	]);

	grunt.registerTask('default', [
		'serve'
	]);
};
