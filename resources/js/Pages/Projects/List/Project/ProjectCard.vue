<template>

    <div :class="[showingOptions ? 'h-40' : 'h-32 delay-300']" class="bg-white p-6 border rounded-md cursor-pointer shadow-sm hover:shadow-lg hover:bg-blue-50 active:shadow-xl active:bg-white transition-height duration-250 ease-in-out"
        @mouseenter="showOptions" @mouseleave="hideOptions" @click="showProject">

        <div class="border-b border-dotted pb-4 mb-4">
            <h5 class="text-sm font-semibold tracking-tight text-gray-600">{{ project.name }}</h5>
        </div>

        <div class="flex justify-between">
            <div class="flex items-center">
                <el-tag v-if="project.apps_count == 0" type="warning" size="small">No apps</el-tag>
                <el-tag v-else size="small">{{ project.apps_count + (project.apps_count == 1 ? ' App' : ' Apps') }}</el-tag>
            </div>

            <div v-if="project.created_at" class="flex justify-between">
                <div class="flex items-center">
                    <span class="text-gray-400 text-xs mr-1 italic">Created &#8212; </span>
                    <span class="text-gray-500 text-xs">{{ moment(project.created_at).fromNow() }}</span>
                </div>
            </div>
        </div>

        <Transition name="slide-fade">

            <div v-show="showingOptions" class="flex justify-end mt-4">

                <template v-if="isShowingProjects">

                    <!-- Update Project Modal -->
                    <ManageProjectModal :project="project" @close="modalClosed" @open="modalOpened" mode="Update" class="mr-2"></ManageProjectModal>

                    <!-- Delete Project Modal -->
                    <ManageProjectModal :project="project" @close="modalClosed" @open="modalOpened" mode="Delete"></ManageProjectModal>

                </template>

                <template v-else>

                    <!-- Delete Project Modal -->
                    <ManageProjectModal :project="project" @close="modalClosed" @open="modalOpened" mode="Delete" class="mr-2"></ManageProjectModal>

                    <!-- Restore Project Modal -->
                    <ManageProjectModal :project="project" @close="modalClosed" @open="modalOpened" mode="Restore"></ManageProjectModal>

                </template>

            </div>

        </Transition>

    </div>

</template>

<script>

    import moment from 'moment'
    import ManageProjectModal from './../../Create/ManageProjectModal';

    export default {
        props: {
            project: Object
        },
        components: { ManageProjectModal },
        data() {
            return {
                moment: moment,
                modalIsClosed: true,
                showingOptions: false,
                isShowingProjects: false,
                isShowingTrashedProjects: false,
            }
        },
        watch:{
            /**
             *  Watch for changes on the page url
             */
            '$page.url': function (newUrl, oldUrl) {
                this.setActiveRoutes();
            }
        },
        methods: {
            showProject() {
                this.$inertia.get(route('project.show.with.apps', { project: this.project.id }));
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
            modalClosed() {
                this.modalIsClosed = true;
                this.hideOptions();
            },
            modalOpened() {
                this.modalIsClosed = false;
            },
            showOptions(){
                this.showingOptions = true;
            },
            hideOptions(){
                //  Hide options if the modal is closed
                if( this.modalIsClosed == true ) {
                    this.showingOptions = false;
                }
            }
        },
        created() {
            this.setActiveRoutes();
        }
    };

</script>
