<template>

    <nav v-if="projectId" class="flex justify-between px-16 bg-blue-50 shadow-md border-t">

        <!-- Navigation Breadcrubs -->
        <ol class="inline-flex items-center">

            <template v-for="(menu, index) in menus" :key="index">

                <li :style="{ marginBottom: '-0.1em' }"
                    :class="['border-b hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 text-blue-500 inline-flex items-center h-full',  menu.active ? 'border-blue-500 bg-blue-50 pointer-arrow arrow-blue' : 'border-transparent']">

                    <Link :href="menu.href" class="inline-flex items-center text-sm py-4 pr-4 px-2 cursor-pointer">

                        <!-- Menu Name -->
                        <span>{{ menu.name }}</span>

                    </Link>

                </li>

            </template>

        </ol>

        <div v-if="versionId" class="flex items-center border-r border-l border-gray-200 px-4">
            <span class="text-blue-500 font-bold text-md">
                {{ app.short_code.primary_code }}
            </span>
        </div>

    </nav>

</template>

<script>

    import { Link } from "@inertiajs/vue3";

    export default {
        components: { Link },
        data(){
            return {
                appId: this.route().params.app,
                projectId: this.route().params.project,
                versionId: this.route().params.version,

                project: this.$page.props.projectPayload,
                version: this.$page.props.versionPayload,
                app: this.$page.props.appPayload,

                showingApps: false,
                showingBuilder: false,
                showingVersions: false,
                showingAccounts: false,
                showingSessions: false,
                showingNotifications: false,
                showingGlobalVariables: false,
                showingDatabaseEntries: false,
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
            }
        },
        computed: {
            menus() {

                if( this.versionId ) {

                    return [
                        {
                            name: 'Builder',
                            href: route('version.show', { project: this.projectId, app: this.appId, version: this.versionId }),
                            active: this.showingBuilder,
                            show: this.versionId
                        },
                        {
                            name: 'Accounts',
                            href: route('version.accounts.show', { project: this.projectId, app: this.appId, version: this.versionId }),
                            active: this.showingAccounts,
                            show: true
                        },
                        {
                            name: 'Sessions',
                            href: route('version.sessions.show', { project: this.projectId, app: this.appId, version: this.versionId }),
                            active: this.showingSessions,
                            show: true
                        },
                        {
                            name: 'Global Variables',
                            href: route('version.global.variables.show', { project: this.projectId, app: this.appId, version: this.versionId }),
                            active: this.showingGlobalVariables,
                            show: true
                        },
                        /*
                        {
                            name: 'Notifications',
                            href: route('notifications.show', { project: this.projectId, app: this.appId, version: this.versionId }),
                            active: this.showingNotifications,
                            show: this.versionId
                        },
                        {
                            name: 'Database Entries',
                            href: route('database.entries.show', { project: this.projectId, app: this.appId, version: this.versionId }),
                            active: this.showingGlobalVariables,
                            show: this.versionId
                        },
                        {
                            name: 'Global Variables',
                            href: route('global.variables.show', { project: this.projectId, app: this.appId, version: this.versionId }),
                            active: this.showingDatabaseEntries,
                            show: this.versionId
                        }
                        */
                    ];

                }else if( this.appId ) {

                    return [
                        {
                            name: 'Versions',
                            href: route('app.show.with.versions', { project: this.projectId, app: this.appId  }),
                            active: this.showingVersions,
                            show: true
                        },
                        {
                            name: 'Accounts',
                            href: route('app.accounts.show', { project: this.projectId, app: this.appId }),
                            active: this.showingAccounts,
                            show: true
                        },
                        {
                            name: 'Sessions',
                            href: route('app.sessions.show', { project: this.projectId, app: this.appId }),
                            active: this.showingSessions,
                            show: true
                        },
                        {
                            name: 'Global Variables',
                            href: route('app.global.variables.show', { project: this.projectId, app: this.appId }),
                            active: this.showingGlobalVariables,
                            show: true
                        },
                        /*
                        {
                            name: 'Notifications',
                            href: route('notifications.show', { project: this.projectId, app: this.appId }),
                            active: this.showingNotifications
                        },
                        {
                            name: 'Database Entries',
                            href: route('database.entries.show', { project: this.projectId, app: this.appId }),
                            active: this.showingGlobalVariables
                        },
                        {
                            name: 'Global Variables',
                            href: route('global.variables.show', { project: this.projectId, app: this.appId }),
                            active: this.showingDatabaseEntries
                        }
                        */
                    ];

                }else if( this.projectId ) {

                    return [
                        {
                            name: 'Apps',
                            href: route('project.show.with.apps', { project: this.projectId }),
                            active: this.showingApps,
                            show: true
                        },
                        {
                            name: 'Accounts',
                            href: route('project.accounts.show', { project: this.projectId }),
                            active: this.showingAccounts,
                            show: true
                        },
                        {
                            name: 'Sessions',
                            href: route('project.sessions.show', { project: this.projectId }),
                            active: this.showingSessions,
                            show: true
                        },
                        {
                            name: 'Global Variables',
                            href: route('project.global.variables.show', { project: this.projectId }),
                            active: this.showingGlobalVariables,
                            show: true
                        },
                        /*
                        {
                            name: 'Notifications',
                            href: route('notifications.show', { project: this.projectId }),
                            active: this.showingNotifications,
                            show: this.versionId
                        },
                        {
                            name: 'Database Entries',
                            href: route('database.entries.show', { project: this.projectId }),
                            active: this.showingGlobalVariables,
                            show: this.versionId
                        },
                        {
                            name: 'Global Variables',
                            href: route('global.variables.show', { project: this.projectId }),
                            active: this.showingDatabaseEntries,
                            show: this.versionId
                        }
                        */
                    ];

                }else {

                    return [];

                }
            }
        },
        methods: {
            setActiveRoutes() {
                this.showingApps = this.checkIfShowingApps();
                this.showingVersions = this.checkIfShowingVersions();

                this.showingBuilder = this.checkIfShowingBuilder();
                this.showingAccounts = this.checkIfShowingAccounts();
                this.showingSessions = this.checkIfShowingSessions();
                this.showingNotifications = this.checkIfShowingNotifications();
                this.showingDatabaseEntries = this.checkIfShowingDatabaseEntries();
                this.showingGlobalVariables = this.checkIfShowingGlobalVariables();
            },
            checkIfShowingApps() {
                return route().current('project.show.with.apps', { project: this.projectId }) ||
                       route().current('project.show.with.trashed.apps', { project: this.projectId });
            },
            checkIfShowingVersions() {
                return route().current('app.show.with.versions', { project: this.projectId, app: this.appId }) ||
                       route().current('app.show.with.trashed.versions', { project: this.projectId, app: this.appId });
            },
            checkIfShowingBuilder() {
                return route().current('version.show', { project: this.projectId, app: this.appId, version: this.versionId });
            },
            checkIfShowingAccounts() {
                return route().current('project.accounts.show', { project: this.projectId }) ||
                       route().current('app.accounts.show', { project: this.projectId, app: this.appId }) ||
                       route().current('version.accounts.show', { project: this.projectId, app: this.appId, version: this.versionId }) ||
                       route().current('version.account.show', { project: this.projectId, app: this.appId, version: this.versionId }) ||
                       route().current('account.sessions.show', { project: this.projectId, app: this.appId, version: this.versionId }) ||
                       route().current('account.notifications.show', { project: this.projectId, app: this.appId, version: this.versionId }) ||
                       route().current('account.database.entries.show', { project: this.projectId, app: this.appId, version: this.versionId });
            },
            checkIfShowingSessions() {
                return route().current('project.sessions.show', { project: this.projectId }) ||
                       route().current('app.sessions.show', { project: this.projectId, app: this.appId }) ||
                       route().current('version.sessions.show', { project: this.projectId, app: this.appId, version: this.versionId }) ||
                       route().current('version.session.show', { project: this.projectId, app: this.appId, version: this.versionId });
            },
            checkIfShowingGlobalVariables() {
                return route().current('project.global.variables.show', { project: this.projectId }) ||
                       route().current('app.global.variables.show', { project: this.projectId, app: this.appId }) ||
                       route().current('version.global.variables.show', { project: this.projectId, app: this.appId, version: this.versionId }) ||
                       route().current('version.global.variable.show', { project: this.projectId, app: this.appId, version: this.versionId });
            },
            checkIfShowingNotifications() {
                return route().current('notifications.show', { project: this.projectId, app: this.appId, version: this.versionId }) ||
                       route().current('notification.show', { project: this.projectId, app: this.appId, version: this.versionId });
            },
            checkIfShowingDatabaseEntries() {
                return route().current('database.entries.show', { project: this.projectId, app: this.appId, version: this.versionId }) ||
                       route().current('database.entry.show', { project: this.projectId, app: this.appId, version: this.versionId });
            }
        },
        created() {
            this.setActiveRoutes();
        }
    };

</script>
