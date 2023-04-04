const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .extract()
    .vue()
    .postCss("resources/css/app.css", "public/css", [
        require("tailwindcss"),
    ])
    .copy('node_modules/flowbite/dist/flowbite.js', 'public/js/flowbite.js')
    .webpackConfig({
        resolve: {
            extensions: ['.vue', '.ts', '.js'],
            alias: {
                '@': __dirname + '/resources/js',
                '@pages': __dirname + '/resources/js/Pages',
                '@mixins': __dirname + '/resources/js/Mixins',
                '@stores': __dirname + '/resources/js/Stores',
                '@layouts': __dirname + '/resources/js/Layouts',
                '@components': __dirname + '/resources/js/Components',
                '@globalComponents': __dirname + '/resources/js/GlobalComponents',
                '@versionBuilder': __dirname + '/resources/js/Pages/Versions/Show/Builder',
                '@builderComponents': __dirname + '/resources/js/Pages/Versions/Show/Builder/Components',
                '@eventsEditor': __dirname + '/resources/js/Pages/Versions/Show/Builder/Content/Editor/EventsEditor',
                '@screenEditor': __dirname + '/resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor',
                '@markersEditor': __dirname + '/resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor',
                '@paginationEditor': __dirname + '/resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor'
            }
        },
    })
    .version();
