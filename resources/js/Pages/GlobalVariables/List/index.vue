<template>

    <div :class="{ 'pt-8 px-16 mt-4 pb-52' : !showingAccount }">

        <template v-if="!showingAccount">

            <Head v-if="appPayload && versionPayload" :title="appPayload.name + ' - Version ' + versionPayload.number + ' Global Variables'" />
            <Head v-else-if="appPayload" :title="appPayload.name + ' Global Variables'" />
            <Head v-else title="Global Variables" />

            <div class="flex justify-between">

                <!-- Back Button -->
                <BackButton>Versions</BackButton>

            </div>

        </template>

        <!-- Explainer -->
        <PrimaryAlert class="mb-6">
            Showing subscriber global variables captured
            <span v-if="route().current() === 'global.variables.show'">
                on
                <span class="font-semibold text-green-500">several projects</span>
            </span>

            <span v-if="route().current() === 'project.global.variables.show'">
                for services running on the
                <span class="font-semibold text-green-500">{{ projectPayload.name }}</span>
                project
            </span>

            <span v-if="route().current() === 'app.global.variables.show'">
                for services running on the
                <span class="font-semibold text-green-500">{{ appPayload.name }}</span>
                app
            </span>

            <span v-if="route().current() === 'version.global.variables.show'">
                for services running on
                <span class="font-semibold text-green-500">{{ appPayload.name }}</span>
                version
                <span class="font-semibold text-green-500">{{ versionPayload.number }}</span>
            </span>

        </PrimaryAlert>

        <div :class="{ 'p-8 bg-white rounded-md shadow-md hover:shadow-lg' : !showingAccount }">

            <!-- App Header -->
            <Header v-model:hideDuplicateCells="hideDuplicateCells" v-model:prettifyJson="prettifyJson" :showingAccount="showingAccount" @response="handleResponse" @isLoading="isLoading = $event" />

            <div class="shadow-md">

                <table class="w-full text-sm text-left text-gray-500">

                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <!-- Table Header Columns Names -->
                            <th v-for="(header, index) in headers" :key="index" scope="col"
                                :class="['px-6 py-3',
                                    { 'whitespace-nowrap text-right' : ['Updated', 'Created'].includes(header) },
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

                        <!-- Global Variable -->
                        <TableRow v-for="(globalVariable, index) in globalVariablesPayload.data" :key="globalVariable.id"
                                :hideDuplicateCells="hideDuplicateCells" :prettifyJson="prettifyJson"
                                :versionPayload="versionPayload" :globalVariable="globalVariable"
                                :projectPayload="projectPayload" :appPayload="appPayload"
                                :globalVariables="globalVariablesPayload.data"
                                :headers="headers" :index="index">
                        </TableRow>

                        <!-- No Global Variable -->
                        <tr v-if="globalVariablesPayload.data.length == false">
                            <td colspan="7" class="bg-gray-50 p-8">
                                <span class="text-gray-500 text-xs">No Global Variables</span>
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>

            <div class="flex justify-end mt-10">

                <!-- Pagination -->
                <DefaultPagination :pagination="globalVariablesPayload" />

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
                prettifyJson: false,
                hideDuplicateCells: false,
                headers: this.getHeaders(),
                appPayload: this.$page.props.appPayload,
                showingAccount: this.checkIfShowingAccount(),
                projectPayload: this.$page.props.projectPayload,
                versionPayload: this.$page.props.versionPayload,
                globalVariablesPayload: this.$page.props.globalVariablesPayload,
            }
        },
        watch:{
            /**
             *  Watch for changes on the page props
             */
            '$page.props': function (newUrl, oldUrl) {
                this.globalVariablesPayload = this.$page.props.globalVariablesPayload;
            }
        },
        methods: {
            getHeaders() {

                //  If the global variables are viewed from the account menu, then we need to show the following
                var headers = ['Number', 'Metadata', 'Updated', 'Created'];

                if( route().current() === 'global.variables.show' ) {
                    headers.unshift('Project', 'App', 'Version');
                }else if( route().current() === 'project.global.variables.show' ) {
                    headers.unshift('App', 'Version');
                }else if( route().current() === 'app.global.variables.show' ) {
                    headers.unshift('Version');
                }else if( route().current() === 'version.global.variables.show' ) {

                }

                return headers;

            },
            handleResponse(payload) {
                this.appPayload = payload.appPayload;
                this.projectPayload = payload.projectPayload;
                this.versionPayload = payload.versionPayload;
                this.globalVariablesPayload = payload.globalVariablesPayload;
            },
            checkIfShowingAccount() {
                return route().current() === 'version.account.show';
            }
        }
    };

</script>
