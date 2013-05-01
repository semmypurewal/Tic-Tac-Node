module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            files: ["*.js", "controllers/*.js", "models/*.js", "helpers/*.js"]
        },

        simplemocha: {
            options: {

            },
            
            all: { src: ["spec/**/*.js"] }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-simple-mocha");

    grunt.registerTask("default", ["jshint", "simplemocha"]);
};


