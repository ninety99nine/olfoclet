<template>

    <div class="pt-8 px-16 mt-4 pb-52">

        <Head :title="projectPayload.name" />

        <div class="flex justify-between">

            <!-- Back Button -->
            <BackButton>Projects</BackButton>

            <!-- Create App Modal -->
            <CreateOrUpdateAppModal></CreateOrUpdateAppModal>

        </div>

        <div class="grid grid-cols-12 gap-8">

            <div class="col-span-4">

                <!-- Update Project -->
                <UpdateProject :projectPayload="projectPayload" />

                <!-- Delete Project -->
                <DeleteProject :projectPayload="projectPayload" />

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
                                        <th v-for="(header, index) in headers" :key="index" scope="col" :class="['px-6 py-3', { 'text-center' : ['Version', 'Shortcode'].includes(header) }]">
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

                                    <AppList v-for="app in appsPayload.data" :key="app.id" :app="app"></AppList>

                                </tbody>

                            </table>

                            <div v-if="appsPayload.data.length == false" class="flex items-center bg-gray-50 p-8">
                                <span class="text-gray-500 text-xs">No Results</span>
                            </div>

                        </div>

                        <div v-else-if="view == 'grid'" class="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <!-- Apps -->
                            <AppCard v-for="app in appsPayload.data" :key="app.id" :app="app"></AppCard>

                            <!-- No Apps -->
                            <NoApps v-if="appsPayload.total == 0"></NoApps>

                        </div>

                    </Transition>

                    <div class="flex justify-end mt-10">

                        <!-- Pagination -->
                        <DefaultPagination :pagination="appsPayload" />

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import NoApps from './NoApps';
    import AppHeader from './AppHeader';
    import AppCard from './App/AppCard';
    import AppList from './App/AppList';
    import BackButton from "./BackButton";
    import UpdateProject from './UpdateProject';
    import DeleteProject from './DeleteProject';
    import { Head } from '@inertiajs/vue3';
    import DefaultPagination from "@components/Pagination/DefaultPagination";
    import CreateOrUpdateAppModal from './../../Apps/Create/CreateOrUpdateAppModal';

    export default {
        props: {
            projectPayload: Object,
            appsPayload: Object
        },
        components: { Head, DeleteProject, NoApps, AppCard, AppList, AppHeader, BackButton, UpdateProject, DeleteProject, DefaultPagination, CreateOrUpdateAppModal },
        data() {
            return {
                view: this.route().params.view ?? 'grid',
                headers: ['Name', 'Version', 'Shortcode', 'Description']
            }
        }
    };

</script>
