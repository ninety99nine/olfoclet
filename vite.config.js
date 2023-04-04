const path = require('path');
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    resolve: {
        extensions: ['.vue', '.ts', '.js'],
        alias: {
            '@': '/resources/js',
            '@pages': '/resources/js/Pages',
            '@mixins': '/resources/js/Mixins',
            '@stores': '/resources/js/Stores',
            '@layouts': '/resources/js/Layouts',
            '@components': '/resources/js/Components',
            '@globalComponents': '/resources/js/GlobalComponents',
            '@versionBuilder': '/resources/js/Pages/Versions/Show/Builder',
            '@builderComponents': '/resources/js/Pages/Versions/Show/Builder/Components',
            '@eventsEditor': '/resources/js/Pages/Versions/Show/Builder/Content/Editor/EventsEditor',
            '@screenEditor': '/resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor',
            '@markersEditor': '/resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor',
            '@paginationEditor': '/resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor'
        }
    },
    plugins: [
        laravel({
            input: [
                'resources/js/app.js',
                /*
                 *  Note that the CSS is imported via JavaScript (app.js) as per the documetation
                 *  Reference: https://laravel.com/docs/10.x/vite#configuring-vite
                 */
                //  'resources/css/app.css',
            ],
            refresh: true,
        }),

        /**
         *  Use the "@vitejs/plugin-vue" plugin to build your front-end using the Vue framework
         *  Reference: https://laravel.com/docs/10.x/vite#vue
         */
        vue({
            template: {
                transformAssetUrls: {
                    // The Vue plugin will re-write asset URLs, when referenced
                    // in Single File Components, to point to the Laravel web
                    // server. Setting this to `null` allows the Laravel plugin
                    // to instead re-write asset URLs to point to the Vite
                    // server instead.
                    base: null,

                    // The Vue plugin will parse absolute URLs and treat them
                    // as absolute paths to files on disk. Setting this to
                    // `false` will leave absolute URLs un-touched so they can
                    // reference assets in the public directory as expected.
                    includeAbsolute: false,
                },
            },
        }),
    ]
});
