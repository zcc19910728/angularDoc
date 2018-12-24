/**
 * Created by kangdaye on 16/6/17.
 */

var minPath = '../resMin/',
    staticPath = '../static/';

var cssPath = staticPath + 'css/',
    webInclude = '../WEB-INF/seller/include/';

var jsPath = staticPath + 'js/',
    jsLibsPath = jsPath + 'libs/',
    jQLibsPath = jsLibsPath + 'jQLibs/',
    ngLibsPath = jsLibsPath + 'ngLibs/',
    jsWidgetPath = jsPath + 'widget/',
    jsModelsPath = [    //每个模块的model+controller
        jsPath + 'app.js',
        jsPath + 'controller.js',
        jsPath + 'directive.js',
        jsPath + 'factory.js',
        jsPath + 'filter.js',
        jsPath + 'service.js',
        jsPath + 'run/**/**.js',
        jsPath + 'model/**/**/**.js'
    ],
    cssModelsPath = [
        cssPath + 'iconfont.css',
        cssPath + 'common.css',
        cssPath + 'theme.css',
        jsWidgetPath + '**/**/**.css',
        jsLibsPath + '**/**/**.css',
        ngLibsPath + '**/**.css'
    ];

//压缩的js路径
var jsMinPath = minPath + 'js/';

//打包的js
var libsMix1 = [
    jsLibsPath + 'jquery-1.8.3.min.js',
    jsLibsPath + 'angular.js',
    ngLibsPath + '**/**.js'
];
var libsMix2 = [
    jQLibsPath + '**/**.js',

    '!' + jsWidgetPath + 'czMobile/{dist,gruntfile.js,GruntFile.js,GulpFile.js}',
    jsWidgetPath + '**/*.js',
    jsWidgetPath + 'czMobile/src/js/czMobile.all.js'
];

var babelrc = {
    plugins: [
        // es2015
        'transform-es2015-template-literals',
        'transform-es2015-arrow-functions',
        'check-es2015-constants',
        'transform-es2015-block-scoped-functions',
        'transform-es2015-block-scoping',
        'transform-es2015-classes',
        'transform-es2015-computed-properties',
        'transform-es2015-destructuring',
        'transform-es2015-duplicate-keys',
        'transform-es2015-for-of',
        'transform-es2015-function-name',
        'transform-es2015-literals',
        // 'transform-es2015-modules-commonjs', // conflict with grid.js
        'transform-es2015-object-super',
        'transform-es2015-parameters',
        'transform-es2015-shorthand-properties',
        'transform-es2015-spread',
        'transform-es2015-sticky-regex',
        'transform-es2015-typeof-symbol',
        'transform-es2015-unicode-regex',
        'transform-regenerator',

        // es2016
        'transform-exponentiation-operator',

        // es2017
        'babel-plugin-syntax-trailing-function-commas',
        'transform-async-to-generator',
    ]
};

module.exports = {
    minPath : minPath,
    staticPath : staticPath,

    webInclude : webInclude,

    jsPath : jsPath,
    jsLibsPath : jsLibsPath,
    jQLibsPath : jQLibsPath,
    ngLibsPath : ngLibsPath,
    jsWidgetPath : jsWidgetPath,
    jsModelsPath : jsModelsPath,
    cssModelsPath : cssModelsPath,

    jsMinPath : jsMinPath,
    libsMix1 : libsMix1,
    libsMix2 : libsMix2,
    babelrc: babelrc,
};
