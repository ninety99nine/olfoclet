<template>

    <div class="pt-8 px-16 mt-4 pb-52">

        <Head v-if="appPayload && versionPayload" :title="appPayload.name + ' - Version ' + versionPayload.number + ' Accounts'" />
        <Head v-else-if="appPayload" :title="appPayload.name + ' Accounts'" />
        <Head v-else title="Accounts" />

        <div class="flex justify-between">

            <!-- Back Button -->
            <BackButton>Versions</BackButton>

        </div>

        <!-- Explainer -->
        <PrimaryAlert class="mb-6">
            Showing subscriber accounts created
            <span v-if="route().current() === 'accounts.show'">
                on
                <span class="font-semibold text-green-500">several projects</span>
            </span>

            <span v-if="route().current() === 'project.accounts.show'">
                for services running on the
                <span class="font-semibold text-green-500">{{ projectPayload.name }}</span>
                project
            </span>

            <span v-if="route().current() === 'app.accounts.show'">
                for services running on the
                <span class="font-semibold text-green-500">{{ appPayload.name }}</span>
                app
            </span>

            <span v-if="route().current() === 'version.accounts.show'">
                for services running on
                <span class="font-semibold text-green-500">{{ appPayload.name }}</span>
                version
                <span class="font-semibold text-green-500">{{ versionPayload.number }}</span>
            </span>

        </PrimaryAlert>

        <div class="p-8 bg-white rounded-md shadow-md hover:shadow-lg">

            <!-- App Header -->
            <Header v-model:hideDuplicateCells="hideDuplicateCells" @response="handleResponse" @isLoading="isLoading = $event" />

            <div :class="['shadow-md overflow-x-auto', { 'pb-6' : accountsPayload.data.length }]">

                <table class="w-full text-sm text-left text-gray-500">

                    <thead class="text-xs text-gray-700 uppercase bg-blue-100">
                        <tr>
                            <!-- Table Header Columns Names -->
                            <th v-for="(header, index) in headers" :key="index" scope="col"
                                :class="['px-6 py-3', 'whitespace-nowrap',
                                    { 'text-center' : (['Sessions', 'Notifications', 'Database Entries', 'Global Variables'].includes(header)) }
                                ]">
                                <span>{{ header }}</span>
                            </th>
                        </tr>
                    </thead>

                    <!-- Table Body -->
                    <tbody class="relative">

                        <!-- Loading overlay -->
                        <LoaderOverlay :show="isLoading" />

                        <!-- Account -->
                        <TableRow v-for="account in accountsPayload.data" :key="account.id"
                                :projectPayload="projectPayload" :appPayload="appPayload"
                                :versionPayload="versionPayload" :account="account"
                                :hideDuplicateCells="hideDuplicateCells"
                                :headers="headers">
                        </TableRow>

                        <tr v-if="accountsPayload.data.length == false">
                            <td colspan="7" class="bg-gray-50 p-8">
                                <span class="text-gray-500 text-xs">No Accounts</span>
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>

            <div class="flex justify-end mt-10">

                <!-- Pagination -->
                <DefaultPagination :pagination="accountsPayload" />

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
                response: null,
                isLoading: false,
                hideDuplicateCells: false,
                appPayload: this.$page.props.appPayload,
                projectPayload: this.$page.props.projectPayload,
                versionPayload: this.$page.props.versionPayload,
                accountsPayload: this.$page.props.accountsPayload,
            }
        },
        computed: {
            headers(){

                var headers = ['Number', 'Origin', 'Sessions', 'Notifications', 'Database Entries', 'Global Variables', 'Created Date'];

                if( route().current() === 'accounts.show' ) {
                    headers.splice(1, 0, ...['Project', 'App', 'Version']);
                }else if( route().current() === 'project.accounts.show' ) {
                    headers.splice(1, 0, ...['App', 'Version']);
                }else if( route().current() === 'app.accounts.show' ) {
                    headers.splice(1, 0, ...['Version']);
                }

                return headers;

            }
        },
        methods: {
            handleResponse(payload) {
                this.appPayload = payload.appPayload;
                this.projectPayload = payload.projectPayload;
                this.versionPayload = payload.versionPayload;
                this.accountsPayload = payload.accountsPayload;
            }
        }
    };

</script>
