module.exports = function (grunt) {
    var path = grunt.path = require('path');

    require('time-grunt')(grunt);
    var xml = grunt.xml = require('node-xml-lite');
    // config
    require('load-grunt-config')(grunt, {
        init: true,
        configPath: [
            path.join(process.cwd(), 'node_modules/vkz-grunt/dist/app'),
            path.join(process.cwd(), 'node_modules/vkz-grunt/dist/app/config'),
            path.join(process.cwd(), 'node_modules/vkz-grunt/dist/app/tasks'),
			path.join(process.cwd(), 'node_modules/vkz-grunt/dist/shared')
        ],
        jitGrunt: {
            staticMappings: {
                htmlbuild: 'grunt-html-build',
                ngtemplates: 'grunt-angular-templates',
                ngannotate: 'grunt-ng-annotate'
            }
        },
        data: {
            pkg: grunt.file.readJSON('package.json'),
            config: grunt.file.readJSON('config/config.json'),
            paths: {
                sharedAbsolute: path.join(process.cwd(), 'src/shared'),
                targetVersion: path.join(process.cwd(), 'src/versions/<%= config.targettedService %>'),
                versionsFolderAbsolute: path.join(process.cwd(), 'src/versions'),
            },
            isSupportedLanguageFile: function (filePath) {
                var supportedLanguages = grunt.config('config').supportedLanguages;

                var splittedFilePath = filePath.split("angular-locale_");
                var languageFileName = splittedFilePath[splittedFilePath.length - 1];
                var languageFile = languageFileName.replace(".js", "");

                var isFound = typeof supportedLanguages[languageFile] === "object";

                return isFound;
            },
            iosConfig: grunt.file.readJSON('config/ios/config.json'),
            appName: xml.parseString(grunt.file.read('config.xml')).childs[1].childs[0]
        }
    });
};