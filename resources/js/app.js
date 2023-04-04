import './bootstrap';
import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import AuthDashboardLayout from "./Layouts/AuthDashboard/AuthDashboardLayout";

//  Import pinia: https://pinia.vuejs.org/getting-started.html#installation
import { createPinia } from 'pinia'

//  Import Element (Vue Components): https://element.eleme.io
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

//  Import VueHighcharts (Vue Components): https://www.npmjs.com/package/@adrianbrs/vue3-highcharts
import VueHighcharts from 'vue3-highcharts';

//  Components that must be registered Globally
import EventsEditor from "@eventsEditor";
import KeyValueInput from "@globalComponents/KeyValueInput";

createInertiaApp({
  /**
   *    Normally we would resolve each page as follows:
   *
   *    resolve: name => require(`./Pages/${name}`),
   *
   *    However we need to wrap each page within a layout.
   *    A layout typically slots the page content between
   *    the layout header and layout footer components
   */
  resolve: async name => {

    /**
     *  Lets capture the page that must be loaded.
     *
     *  Because we are using import() instead of require(),
     *  the import() returns a promise that we must wait to
     *  resolve before we can access the default property.
     *
     *  Using "let page = import(`./Pages/${name}.vue`).default" instead of
     *  "let page = (await import(`./Pages/${name}.vue`)).default" would
     *  cause the following error:
     *
     *  Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'layout')
     *
     *  So we need to await, then access the default property
     */
    let page = (await import(`./Pages/${name}.vue`)).default

    /**
     *  Check if the page has a custom layout
     *
     *  Pages such as the "Auth/Login/Show.vue" and the "Auth/Register/Show.vue"
     *  already have the layout property set to "GuestDashboardLayout", this is
     *  why we are first making this check. If we find out that the page does
     *  not have any layout already set, then implement the
     *  "AuthDashboardLayout" by default.
     */
    if( !page.layout ) {

        //  Set the "AuthDashboardLayout" by default
        page.layout = AuthDashboardLayout;

    }

    //  Return the page
    return page;

  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })

        //  Components that must be registered Globally
        .component('EventsEditor', EventsEditor)
        .component('KeyValueInput', KeyValueInput)

        /**
         *  The mixin below allows us to offer ziggy support so that
         *  we can utilize the route() heler to access laravel named
         *  routes.
         *
         *  Reference 1: https://github.com/tighten/ziggy
         *  Reference 2: https://laracasts.com/discuss/channels/laravel/i-am-lost-with-ziggy-vue-3-setup
         */
        .mixin({ methods: { route: window.route } })
        .use(createPinia())
        .use(VueHighcharts)
        .use(ElementPlus)
        .use(plugin)
        .mount(el)
  },
  progress: {
    color: 'blue',
    showSpinner: true
  },
})

