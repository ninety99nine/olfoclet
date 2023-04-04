<template>

    <div :class="{ 'pt-8 px-16 mt-4 pb-52' : !showingAccount }">

        <template v-if="!showingAccount">

            <Head v-if="appPayload && versionPayload" :title="appPayload.name + ' - Version ' + versionPayload.number + ' Sessions'" />
            <Head v-else-if="appPayload" :title="appPayload.name + ' Sessions'" />
            <Head v-else title="Sessions" />

            <div class="flex justify-between">

                <!-- Back Button -->
                <BackButton>Versions</BackButton>

            </div>

        </template>

        <!-- Explainer -->
        <PrimaryAlert class="mb-6">
            Showing subscriber sessions captured
            <span v-if="route().current() === 'sessions.show'">
                on
                <span class="font-semibold text-green-500">several projects</span>
            </span>

            <span v-if="route().current() === 'project.sessions.show'">
                for services running on the
                <span class="font-semibold text-green-500">{{ projectPayload.name }}</span>
                project
            </span>

            <span v-if="route().current() === 'app.sessions.show'">
                for services running on the
                <span class="font-semibold text-green-500">{{ appPayload.name }}</span>
                app
            </span>

            <span v-if="route().current() === 'version.sessions.show'">
                for services running on
                <span class="font-semibold text-green-500">{{ appPayload.name }}</span>
                version
                <span class="font-semibold text-green-500">{{ versionPayload.number }}</span>
            </span>

        </PrimaryAlert>

        <div :class="{ 'p-8 bg-white rounded-md shadow-md hover:shadow-lg' : !showingAccount }">

            <!-- App Header -->
            <Header v-model:hideDuplicateCells="hideDuplicateCells" :showingAccount="showingAccount" @response="handleResponse" @isLoading="isLoading = $event" />

            <div class="shadow-md">

                <table class="w-full text-sm text-left text-gray-500">

                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <!-- Table Header Columns Names -->
                            <th v-for="(header, index) in headers" :key="index" scope="col"
                                :class="['px-6 py-3',
                                    { 'whitespace-nowrap text-right' : header == 'Created Date' },
                                    { 'text-center' : (header == 'Interactions') }
                                ]">
                                <span>{{ header }}</span>
                            </th>
                        </tr>
                    </thead>

                    <!-- Table Body -->
                    <tbody class="relative">

                        <!-- Loading overlay -->
                        <LoaderOverlay :show="isLoading" />

                        <!-- Session -->
                        <TableRow v-for="(session, index) in sessionsPayload.data" :key="session.id"
                                :projectPayload="projectPayload" :appPayload="appPayload"
                                :versionPayload="versionPayload" :session="session"
                                :sessions="sessionsPayload.data" :index="index"
                                :hideDuplicateCells="hideDuplicateCells"
                                :headers="headers">
                        </TableRow>

                        <!-- No Sessions -->
                        <tr v-if="sessionsPayload.data.length == false">
                            <td colspan="7" class="bg-gray-50 p-8">
                                <span class="text-gray-500 text-xs">No Sessions</span>
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>

            <div class="flex justify-end mt-10">

                <!-- Pagination -->
                <DefaultPagination :pagination="sessionsPayload" />

            </div>

        </div>

    </div>

</template>

<script>

    import Header from './Header';
    import TableRow from './TableRow';
    import BackButton from "./BackButton";
    import { Head } from '@inertiajs/vue3';
    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import LoaderOverlay from "@components/Loader/LoaderOverlay";
    import DefaultPagination from "@components/Pagination/DefaultPagination";

    export default {
        components: { Head, TableRow, Header, BackButton, PrimaryAlert, LoaderOverlay, DefaultPagination },
        data() {
            return {
                isLoading: false,
                hideDuplicateCells: false,
                headers: this.getHeaders(),
                appPayload: this.$page.props.appPayload,
                showingAccount: this.checkIfShowingAccount(),
                projectPayload: this.$page.props.projectPayload,
                versionPayload: this.$page.props.versionPayload,
                sessionsPayload: this.$page.props.sessionsPayload,
            }
        },
        watch:{
            /**
             *  Watch for changes on the page props
             */
            '$page.props': function (newUrl, oldUrl) {
                this.sessionsPayload = this.$page.props.sessionsPayload;
            }
        },
        methods: {
            getHeaders() {

                //  If the sessions are viewed from the account menu, then we need to show the following
                var headers = ['Request', 'Status', 'Interactions', 'Duration', 'Created Date'];

                if( route().current() === 'sessions.show' ) {
                    headers.unshift('Project', 'App', 'Version', 'Number', 'Origin');
                }else if( route().current() === 'project.sessions.show' ) {
                    headers.unshift('App', 'Version', 'Number', 'Origin');
                }else if( route().current() === 'app.sessions.show' ) {
                    headers.unshift('Version', 'Number', 'Origin');
                }else if( route().current() === 'version.sessions.show' ) {
                    headers.unshift('Number', 'Origin');
                }

                return headers;

            },
            handleResponse(payload) {
                this.appPayload = payload.appPayload;
                this.projectPayload = payload.projectPayload;
                this.versionPayload = payload.versionPayload;
                this.sessionsPayload = payload.sessionsPayload;
            },
            checkIfShowingAccount() {
                return route().current() === 'version.account.show';
            }
        }
    };

</script>
