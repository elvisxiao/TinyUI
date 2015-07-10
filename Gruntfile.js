module.exports = function(grunt) {
    // 构建任务配置
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        distName: 'oc-1.0',
        //js 合并
        concat : {
            js : {
                src  : ['public/js/**/**.js'],
                dest : 'public/<%= distName %>/oc.js'
            },
            css: {
                src  : ['public/<%= distName %>/tmp/css/lib/**/**.css'],
                dest : 'public/<%= distName %>/oc.css'
            },
            pagecss: {
                src  : ['public/<%= distName %>/tmp/css/**.css'],
                dest : 'public/<%= distName %>/site.css'
            }
        },

        //browserify
        browserify: {
            js: {
                src: 'public/js/lib/index.js',
                dest: 'public/<%= distName %>/oc.js'
            }
        },

        //js 压缩
        uglify : {
            options : {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build : {
                src : 'public/<%= distName %>/oc.js',
                dest : 'public/<%= distName %>/oc.min.js'
            }
        },

        //针对stylus
        stylus: {
            build : {
                options: {
                    linenos: false,
                    compress: false
                },
                files: [
                    {
                        expand: true,
                        cwd: 'public',
                        src: ['css/lib/**/**.styl'],
                        dest: 'public/<%= distName %>/tmp/',
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: 'public',
                        src: ['css/**.styl'],
                        dest: 'public/<%= distName %>/tmp/',
                        ext: '.css'
                    }
                ]
            }
        },

        autoprefixer : {
           dist : {
                files : { 'public/<%= distName %>/oc.css' : 'public/<%= distName %>/oc.css' } 
            } 
        },

        //合并压缩css
        cssmin: {
            build: {
                files: {'public/<%= distName %>/oc.css': 'public/<%= distName %>/oc.css'}
            }
        },

        //针对jade
        jade: {
            compile: {
                options: {
                    data: {}
                },
                files: [{
                    expand: true,
                    cwd: 'views',
                    src: ['**/**.jade'],
                    dest: 'public/html',
                    ext: '.html'
                }]
            }
        },  

        //清理不需要的文件
        clean: {
            build: {
                src: [ 'public/dest' ]
            },
            stylesheets: {
                src: [ 'public/<%= distName %>/tmp/css']
            },
            scripts: {
                src: [ 'public/<%= distName %>/**/*.js', 'public/doc/*']
            },
        },
        
        //自动处理
        watch: {
            css: {
                files: 'public/css/**/**.styl',
                tasks: ['clean:stylesheets', 'stylus', 'concat:css', 'concat:pagecss', 'autoprefixer', 'cssmin'],
                options: {
                    livereload: '<%= pkg.name %>1',
                }
            },
            js: {
                files: 'public/js/lib/**/**.js',
                tasks: ['clean:scripts', 'browserify', 'uglify'],
                // tasks: ['clean:scripts', 'browserify', 'uglify', 'jsdoc'],
            }
        },

        //js文档
        jsdoc : {
            dist : {
                src: ['public/js/lib/**/**.js'], 
                options: {
                    destination: 'public/doc'
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-autoprefixer');

    //定义任务
    // grunt.registerTask(
    //     'default', 
    //     'Watches the project for changes, automatically builds them and runs a server.', 
    //     ['clean:build', 'stylus', 'cssmin', 'concat', 'uglify']
    // );
    grunt.registerTask(
        'default', 
        'Watches the project for changes, automatically builds them and runs a server.', 
        ['watch']
    );

};