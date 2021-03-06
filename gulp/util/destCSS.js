var es = require('event-stream');
var util = require('gulp-util');
var gulp = require('gulp');

var config = require('../../app/config');
var buildCSS = require('../util/buildCSS');

module.exports = function () {
    var buildRules = [];

    var skins = config.skins;
    var packages = Object.keys(config.packages);
    var browsers = ['', 'ie8'];

    if (util.env.pkg || util.env.skin) {
        // Custom build
        buildRules = browsers.map(function (browser) {
            return {
                suffix: browser === 'ie8' ? 'ie8' : null,
                pkg: util.env.pkg || 'full',
                skin: util.env.skin || config.appConfig.defaultSkin,
                ie8: browser === 'ie8',
                isTest: global.isTestBuild
            };
        });
    } else {
        packages.forEach(function (pkg) {
            skins.forEach(function (skin) {
                browsers.forEach(function (browser) {
                    buildRules.push({
                        suffix: [pkg, skin, browser].join('.').replace(/\.$/, ''),
                        pkg: pkg,
                        skin: skin,
                        ie8: browser === 'ie8',
                        isTest: global.isTestBuild
                    });
                });
            });
        });
    }

    return buildRules.map(function (buildRule) {
        return buildCSS(buildRule).pipe(gulp.dest('dist/css/'));
    }).reduce(function (prev, next) {
        return es.merge(prev, next);
    });
};
