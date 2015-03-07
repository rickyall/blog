module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
      },
      //css 合并
      css: {
        src: ['public/stylesheets/*.css'],
        dest: 'public/stylesheets/<%= pkg.name %>.css'
      },

      //js 合并
      js: {
        src: ['public/javascripts/*.js'],
        dest: 'public/javascripts/<%= pkg.name %>.js'
      }
    },



    //压缩css
    cssmin:{

      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        separator: ';'
      },

      css: {
        files: {
          'public/<%= pkg.name %>.min.css': ['<%= concat.css.dest %>']
        }
      }
    },
    



    //压缩js
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
        }
      }
    },

   

    jshint: {
      files: ['Gruntfile.js'],
      options: {
        //这里是覆盖JSHint默认配置的选项
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-css');
  

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['jshint', 'concat','cssmin', 'uglify']);

};