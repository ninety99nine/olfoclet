<template>

    <nav  class="flex justify-between px-12 bg-white shadow-md" aria-label="Breadcrumb">

        <!-- Navigation Breadcrubs -->
        <ol class="inline-flex items-center">

            <!-- Logo -->
            <li>
                <Link :href="route('projects.show')" class="block py-2 mx-6 cursor-pointer">
                    <Logo />
                </Link>
            </li>

            <template v-for="(menu, index) in menus" :key="index">

                <li v-if="menu.show === true" :style="{ marginBottom: '-0.1em' }"
                    :class="['border-b hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 text-blue-500 inline-flex items-center h-full',  menu.active ? 'border-blue-500 bg-blue-50 pointer-arrow arrow-blue' : 'border-transparent']">

                    <Link :href="menu.href" class="inline-flex items-center text-sm py-4 pr-4 px-2 cursor-pointer">

                        <!-- Projects Icon -->
                        <svg v-if="index === 0" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>

                        <!-- Arrow Icon -->
                        <svg v-if="showArrow(index)" class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                        </svg>

                        <!-- Menu Name -->
                        <span>{{ menu.name }}</span>

                    </Link>

                </li>

            </template>

        </ol>

        <div class="flex items-center mt-1">

            <!-- Create App Modal -->
            <ManageProjectModal></ManageProjectModal>

            <!-- Profile Dropdown -->
            <ProfileDropdown class="ml-4"></ProfileDropdown>

        </div>

    </nav>

</template>

<script>

    import { Link } from "@inertiajs/vue3";
    import Logo from "@components/Logo/Logo";
    import { useForm } from '@inertiajs/vue3';
    import ProfileDropdown from './ProfileDropdown';
    import DefaultButton from "@components/Button/DefaultButton";
    import ManageProjectModal from "@pages/Projects/Create/ManageProjectModal";

    export default {
        components: { Link, Logo, useForm, DefaultButton, ManageProjectModal, ProfileDropdown },
        data() {
            return {
                form: useForm({
                    name: '',
                    online: true,
                    description: '',
                    offline_message: 'This service is currently not available'
                }),
                appId: this.route().params.app,
                projectId: this.route().params.project,
                versionId: this.route().params.version,
                project: this.$page.props.projectPayload,
                version: this.$page.props.versionPayload,
                app: this.$page.props.appPayload,

                showingProjects: null,
                showingAccounts: null,
                showingSessions: null,
                showingGlobalVariables: null,
                showingReports: null,

                showingProjectApps: null,
                showingProjectAccounts: null,
                showingProjectSessions: null,
                showingProjectGlobalVariables: null,

                showingAppVersions: null,
                showingAppAccounts: null,
                showingAppSessions: null,
                showingAppGlobalVariables: null,

                showingVersionBuilder: null,
                showingVersionAccounts: null,
                showingVersionSessions: null,
                showingVersionGlobalVariables: null,
            }
        },
        watch:{
            /**
             *  Watch for changes on the page url
             */
            '$page.url': function (newUrl, oldUrl) {
                this.projectId = this.route().params.project;
                this.versionId = this.route().params.version;
                this.appId = this.route().params.app;

                this.project = this.$page.props.projectPayload;
                this.version = this.$page.props.versionPayload;
                this.app = this.$page.props.appPayload;

                this.setActiveRoutes();
            },
            /**
             *  Watch for changes on the page props
             */
            '$page.props': function (newUrl, oldUrl) {
                this.project = this.$page.props.projectPayload;
                this.version = this.$page.props.versionPayload;
                this.app = this.$page.props.appPayload;

                this.setActiveRoutes();
            }
        },
        computed: {
            menus() {
                var menus = [
                    {
                        name: 'Projects',
                        href: route('projects.show'),
                        active: this.showingProjects,
                        show: true
                    },
                    {
                        name: 'Accounts',
                        href: route('accounts.show'),
                        active: this.showingAccounts,
                        show: !this.projectId
                    },
                    {
                        name: 'Sessions',
                        href: route('sessions.show'),
                        active: this.showingSessions,
                        show: !this.projectId
                    },
                    {
                        name: 'Global Variables',
                        href: route('global.variables.show'),
                        active: this.showingGlobalVariables,
                        show: !this.projectId
                    },
                    {
                        name: 'Reports',
                        href: route('reports.show'),
                        active: this.showingReports,
                        show: !this.projectId
                    }
                ];

                if( this.projectId ) {
                    menus.push({
                        name: this.project.name,
                        href: route('project.show.with.apps', { project: this.projectId }),
                        active: this.showingProjectApps || this.showingProjectAccounts || this.showingProjectSessions || this.showingProjectGlobalVariables,
                        show: true
                    })
                }

                if( this.appId ) {
                    menus.push({
                        name: this.app.name,
                        href: route('app.show.with.versions', { project: this.projectId, app: this.appId }),
                        active: this.showingAppVersions || this.showingAppAccounts || this.showingAppSessions || this.showingAppGlobalVariables,
                        show: true
                    })
                }

                if( this.versionId ) {
                    menus.push({
                        name: this.version.number,
                        href: route('version.show', { project: this.projectId, app: this.appId, version: this.versionId }),
                        active: this.showingVersionBuilder || this.showingVersionAccounts || this.showingVersionSessions || this.showingVersionGlobalVariables,
                        show: true
                    })
                }

                return menus;
            }
        },
        methods: {
            showArrow(index) {
                return index > 0 &&
                (
                    this.showingProjectApps || this.showingProjectAccounts || this.showingProjectSessions || this.showingProjectGlobalVariables ||
                    this.showingAppVersions || this.showingAppAccounts || this.showingAppSessions ||
                    this.showingVersionBuilder || this.showingVersionAccounts || this.showingVersionSessions ||
                    this.showingVersionGlobalVariables
                );
            },
            createApp(closeModal) {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to create project
                this.form.post(route('projects.create'), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'Project created successfully',
                            type: 'success'
                        });
                        self.form.reset();
                        closeModal();
                    },
                    onError: (errors) => {
                        self.$message({
                            message: 'Sorry, we found some mistakes',
                            type: 'error'
                        });
                    },
                });

            },
            cancelCreateApp() {

                //  Clear existing errors
                this.form.clearErrors();

                //  Reset the form
                this.form.reset();

            },
            setActiveRoutes() {
                this.showingProjects = this.checkIfShowingProjects();
                this.showingAccounts = this.checkIfShowingAccounts();
                this.showingSessions = this.checkIfShowingSessions();
                this.showingGlobalVariables = this.checkIfShowingGlobalVariables();
                this.showingReports = this.checkIfShowingReports();

                this.showingProjectApps = this.checkIfShowingProjectApps();
                this.showingProjectAccounts = this.checkIfShowingProjectAccounts();
                this.showingProjectSessions = this.checkIfShowingProjectSessions();
                this.showingProjectGlobalVariables = this.checkIfShowingProjectGlobalVariables();

                this.showingAppVersions = this.checkIfShowingAppVersions();
                this.showingAppAccounts = this.checkIfShowingAppAccounts();
                this.showingAppSessions = this.checkIfShowingAppSessions();
                this.showingAppGlobalVariables = this.checkIfShowingAppGlobalVariables();

                this.showingVersionBuilder = this.checkIfShowingVersionBuilder();
                this.showingVersionAccounts = this.checkIfShowingVersionAccounts();
                this.showingVersionSessions = this.checkIfShowingVersionSessions();
                this.showingVersionGlobalVariables = this.checkIfShowingVersionGlobalVariables();
            },
            checkIfShowingProjects() {
                return route().current('projects.show') ||
                       route().current('trashed.projects.show');
            },
            checkIfShowingAccounts() {
                return route().current('accounts.show');
            },
            checkIfShowingSessions() {
                return route().current('sessions.show');
            },
            checkIfShowingGlobalVariables() {
                return route().current('global.variables.show');
            },
            checkIfShowingReports() {
                return route().current('reports.show');
            },
            checkIfShowingProjectApps() {
                return route().current('project.show.with.apps', { project: this.projectId }) ||
                       route().current('project.show.with.trashed.apps', { project: this.projectId });
            },
            checkIfShowingProjectAccounts() {
                return route().current('project.accounts.show', { project: this.projectId });
            },
            checkIfShowingProjectSessions() {
                return route().current('project.sessions.show', { project: this.projectId });
            },
            checkIfShowingProjectGlobalVariables() {
                return route().current('project.global.variables.show', { project: this.projectId });
            },
            checkIfShowingAppVersions() {
                return route().current('app.show.with.versions', { project: this.projectId, app: this.appId }) ||
                       route().current('app.show.with.trashed.versions', { project: this.projectId, app: this.appId });
            },
            checkIfShowingAppAccounts() {
                return route().current('app.accounts.show', { project: this.projectId, app: this.appId });
            },
            checkIfShowingAppSessions() {
                return route().current('app.sessions.show', { project: this.projectId, app: this.appId });
            },
            checkIfShowingAppGlobalVariables() {
                return route().current('app.global.variables.show', { project: this.projectId, app: this.appId });
            },
            checkIfShowingVersionBuilder() {
                return route().current('version.show', { project: this.projectId, app: this.appId, version: this.versionId });
            },
            checkIfShowingVersionAccounts() {
                return route().current('version.accounts.show', { project: this.projectId, app: this.appId, version: this.versionId }) ||
                       route().current('version.account.show', { project: this.projectId, app: this.appId, version: this.versionId });
            },
            checkIfShowingVersionSessions() {
                return route().current('version.sessions.show', { project: this.projectId, app: this.appId, version: this.versionId }) ||
                       route().current('version.session.show', { project: this.projectId, app: this.appId, version: this.versionId });
            },
            checkIfShowingVersionGlobalVariables() {
                return route().current('version.global.variables.show', { project: this.projectId, app: this.appId, version: this.versionId }) ||
                       route().current('version.global.variable.show', { project: this.projectId, app: this.appId, version: this.versionId });
            },
        },
        created() {
            this.setActiveRoutes();
        }
    };

</script>

<style scoped>

    nav > ol > li.pointer-arrow {
        position: relative;
    }

    nav > ol > li.pointer-arrow::before {
        left: 0;
        right: 0;
        width: 12px;
        content: "";
        margin: auto;
        bottom: -8px;
        height: 12px;
        border: 1px solid;
        position: absolute;
        vertical-align: middle;
        transform: rotate(45deg);
    }

    nav > ol > li.arrow-gray::before {
        border-right-color: transparent;
        border-bottom-color: transparent;
        background-color: rgb(235 245 255);
        border-top-color: rgb(229, 231, 235);
        border-left-color: rgb(229, 231, 235);
    }

    nav > ol > li.arrow-blue::before {
        bottom: -6px;
        border-top-color: transparent;
        border-left-color: transparent;
        background-color: rgb(235 245 255);
        border-right-color: rgb(63 131 248);
        border-bottom-color: rgb(63 131 248);
    }

    nav > ol > li.pointer-arrow:hover::before {
        bottom: -6px;
        border-top-color: transparent;
        border-left-color: transparent;
        border-right-color: rgb(63 131 248);
        border-bottom-color: rgb(63 131 248);
    }

</style>
