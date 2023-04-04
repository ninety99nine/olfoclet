<template>

    <div class="pt-8 px-16 mt-4 pb-52">

        <Head :title="appPayload.name" />

        <div class="flex justify-between">

            <!-- Back Button -->
            <BackButton>{{ projectPayload.name }}</BackButton>

            <!-- Create App Modal -->
            <CreateOrUpdateVersionModal></CreateOrUpdateVersionModal>

        </div>

        <div class="grid grid-cols-12 gap-8">

            <div class="col-span-4">

                <!-- Update App -->
                <UpdateApp :appPayload="appPayload" />

                <!-- Endpoint Instructions -->
                <EndpointInstructions></EndpointInstructions>

                <!-- Delete App -->
                <DeleteApp :appPayload="appPayload" />

            </div>

            <div class="col-span-8 p-8 bg-white rounded-md shadow-md hover:shadow-lg">

                <!-- App Header -->
                <AppHeader :view="view" @updateView="view = $event" />

                <div>

                    <Transition name="fade" mode="out-in" :duration="250">

                        <div v-if="view == 'table'" class="shadow-md">

                            <table class="w-full text-sm text-left text-gray-500">

                                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <!-- Table Header Columns Names -->
                                        <th v-for="(header, index) in headers" :key="index" scope="col" :class="['px-6 py-3', { 'whitespace-nowrap' : header == 'Last Update' }]">
                                            <span>{{ header }}</span>
                                        </th>

                                        <!-- Table Header Action -->
                                        <th scope="col" class="px-6 py-3">
                                            <span class="sr-only">Action</span>
                                        </th>
                                    </tr>
                                </thead>

                                <!-- Table Body -->
                                <tbody>

                                    <VersionList v-for="version in appVersionsPayload.data" :key="version.id" :version="version" :appPayload="appPayload"></VersionList>

                                </tbody>

                            </table>

                            <div v-if="appVersionsPayload.data.length == false" class="flex items-center bg-gray-50 p-8">
                                <span class="text-gray-500 text-xs">No Results</span>
                            </div>

                        </div>

                        <div v-else-if="view == 'grid'" class="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <!-- Apps -->
                            <VersionCard v-for="version in appVersionsPayload.data" :key="version.id" :version="version" :appPayload="appPayload"></VersionCard>

                            <!-- No Apps -->
                            <NoVersions v-if="appVersionsPayload.total == 0"></NoVersions>

                        </div>

                    </Transition>

                    <div class="flex justify-end mt-10">

                        <!-- Pagination -->
                        <DefaultPagination :pagination="appVersionsPayload" />

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import UpdateApp from './UpdateApp';
    import DeleteApp from './DeleteApp';
    import AppHeader from './AppHeader';
    import NoVersions from './NoVersions';
    import BackButton from "./BackButton";
    import { Head } from '@inertiajs/vue3';
    import VersionCard from './Version/VersionCard';
    import VersionList from './Version/VersionList';
    import EndpointInstructions from "./EndpointInstructions";
    import DefaultPagination from "@components/Pagination/DefaultPagination";
    import CreateOrUpdateVersionModal from './../../Versions/Create/CreateOrUpdateVersionModal';

    export default {
        props: {
            appPayload: Object,
            projectPayload: Object,
            appVersionsPayload: Object,
        },
        components: { Head, NoVersions, VersionCard, VersionList, EndpointInstructions, AppHeader, BackButton, UpdateApp, DeleteApp, DefaultPagination, CreateOrUpdateVersionModal },
        data() {
            return {
                view: this.route().params.view ?? 'grid',
                headers: ['Version', 'Last Update', 'Description']
            }
        }
    };

</script>
