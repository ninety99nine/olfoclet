<template>

    <div class="pt-8 px-16 mt-4 pb-52">

        <Head :title="appPayload.name + ' - Version ' + versionPayload.number" />

        <div class="flex justify-between">

            <!-- Back Button -->
            <BackButton>Sessions</BackButton>

        </div>

        <div class="grid grid-cols-12 gap-8">

            <div class="col-span-3">

                <!-- Session Details -->
                <SessionDetails />

            </div>

            <div class="col-span-9 pt-4 p-8 bg-white rounded-md shadow-md hover:shadow-lg">

                <!-- Session Screens -->
                <SessionScreens />

                <!-- Session Logs -->
                <SessionLogs />

            </div>

        </div>

    </div>

</template>

<script>

    import BackButton from "./BackButton";
    import SessionLogs from "./SessionLogs";
    import SessionDetails from "./SessionDetails";
    import SessionScreens from "./SessionScreens";
    import { Head } from '@inertiajs/vue3';

    export default {
        props: {
            appPayload: Object,
            versionPayload: Object,
            sessionPayload: Object,
        },
        components: { BackButton, SessionLogs, SessionDetails, SessionScreens, Head },
        data() {
            return {
                refreshContentInterval: null
            }
        },
        methods: {
            refreshContent() {

                //  If the session is started or running then we can refresh the content
                if( [1, 2].includes(this.sessionPayload.request_type) ) {

                    const url = route('version.session.show', {
                        session: this.route().params.session,
                        version: this.route().params.version,
                        project: this.route().params.project,
                        app: this.route().params.app,
                    });

                    const options = {
                        preserveScroll: true,
                        preserveState: true,
                        replace: true
                    };

                    this.$inertia.get(url, {}, options);

                }else{
                    this.cleanUp();
                }

            },
            cleanUp() {
                clearInterval( this.refreshContentInterval );
                this.refreshContentInterval = null;
            }
        },
        created() {

            //  Keep refreshing this page content every 3 seconds
            this.refreshContentInterval = setInterval(function() {
                this.refreshContent();
            }.bind(this), 3000);

        },
        unmounted() {
            this.cleanUp();
        }
    };

</script>
