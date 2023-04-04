<template>

    <div class="pt-8 mt-4 mb-40">

        <Head title="Projects" />

        <div class="flex items-center justify-between w-2/3 m-auto mb-12">
            <h1 class="text-xl font-semibold text-gray-700">{{ isShowingProjects ? 'Projects' : 'Trashed Projects' }}</h1>

            <div class="flex items-center space-x-8">
                <div class="flex items-center space-x-2">
                    <DefaultSwitch :value="isShowingTrashedProjects" @change="toggleProjects()" note="Show trashed projects" :disabled="isChangingRoute"></DefaultSwitch>
                    <NumberBadge v-if="totalTrashedProjects" :count="totalTrashedProjects" inActiveStyle="bg-blue-50 text-blue-500 border border-blue-300"></NumberBadge>
                </div>
                <DefaultSearchBar v-model="search" @onSearch="startSearch" placeholder="Search projects" />
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-2/3 m-auto mb-12">

            <ProjectCard v-for="project in projectsPayload.data" :key="project.id" :project="project"></ProjectCard>

        </div>

        <div v-if="projectsPayload.total == 0" class="w-1/4 m-auto bg-white rounded-sm border border-dashed border-gray-400 p-5">
            <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <div>
                    <p class="text-gray-800 text-md mb-1">{{ isShowingProjects ? 'No Projects': 'No Trashed Projects' }}</p>
                    <p class="text-gray-600 text-xs mb-8">
                        {{ isShowingProjects ? 'Get started by creating your first project': 'You don\'t have any trashed projects' }}
                    </p>
                </div>
            </div>
            <div class="flex justify-end">

                <!-- Create App Modal -->
                <ManageProjectModal></ManageProjectModal>

            </div>
        </div>

        <div class="flex justify-end w-2/3 m-auto mb-40">

            <DefaultPagination v-if="projectsPayload.total > 0" :pagination="projectsPayload" />

        </div>

    </div>

</template>

<script>

import DefaultPagination from "@components/Pagination/DefaultPagination";
import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";
import ManageProjectModal from "./../Create/ManageProjectModal";
import DefaultSwitch from "@components/Switch/DefaultSwitch";
import PrimaryButton from "@components/Button/PrimaryButton";
import NumberBadge from '@components/Badges/NumberBadge';
import ProjectCard from './Project/ProjectCard';
import { Head } from '@inertiajs/vue3';
import moment from 'moment'

export default {
    props: {
        projectsPayload: Object
    },
    components: { Head, DefaultPagination, DefaultSearchBar, DefaultSwitch, PrimaryButton, NumberBadge, ManageProjectModal, ProjectCard },
    data() {
        return {
            moment: moment,
            isChangingRoute: false,
            isShowingProjects: false,
            isShowingTrashedProjects: false,
            search: this.route().params.search,
            totalTrashedProjects: this.$page.props.totalTrashedProjects
        }
    },
    watch:{
        /**
         *  Watch for changes on the page props
         */
        '$page.props': function (newUrl, oldUrl) {
            this.totalTrashedProjects = this.$page.props.totalTrashedProjects
        },
        /**
         *  Watch for changes on the page url
         */
        '$page.url': function (newUrl, oldUrl) {
            this.setActiveRoutes();
        }
    },
    methods: {
        showProject(project) {
            this.$inertia.get(route('project.show.with.apps', { project: project.id }));
        },
        startSearch(search) {
            const routeName = this.isShowingProjects ? 'projects.show' : 'trashed.projects.show';
            this.$inertia.get(route(routeName), { search: search }, {
                preserveScroll: true,
                preserveState: true,
                replace: true
            });
        },
        setActiveRoutes() {
            this.isShowingProjects = this.checkIfShowingProjects();
            this.isShowingTrashedProjects = this.checkIfShowingTrashedProjects();
        },
        checkIfShowingProjects() {
            return route().current('projects.show');
        },
        checkIfShowingTrashedProjects() {
            return route().current('trashed.projects.show');
        },
        toggleProjects(){
            this.isShowingTrashedProjects ? this.showProjects() : this.showTrashedVersions();
        },
        showProjects() {
            this.changeRoute(route('projects.show'));
        },
        showTrashedVersions() {
            this.changeRoute(route('trashed.projects.show'));
        },
        changeRoute(url) {

            this.isChangingRoute = true;

            /**
             *  Wait for the switch to complete its sliding animation before we navigate to the given url.
             *  This is so that the switch animation is smoother. The slide transition is 150ms as seen
             *  on the ".toggle-bg:after" CSS style of the rendered DefaultSwitch component
             */
            setTimeout(() => {

                this.$inertia.get(url, {}, {
                    preserveScroll: true,
                    replace: true
                });

            }, 150);

        }
    },
    created() {
        this.setActiveRoutes();
    }
};

</script>
