<template>

    <div class="pt-8 px-16 mt-4 pb-52">

        <Head :title="appPayload.name + ' - Version ' + versionPayload.number" />

        <div class="grid grid-cols-12 gap-8">

            <div class="col-span-3">

                <!-- Back Button -->
                <BackButton>Accounts</BackButton>

                <!-- Account Details -->
                <AccountDetails />

            </div>

            <div class="col-span-9">

                <!-- Tabs -->
                <DefaultTabs v-model="selectedTab" :tabs="tabs" class="mb-4 mx-20" color="blue"></DefaultTabs>

                <div class="bg-white rounded-md shadow-md hover:shadow-lg p-8">

                    <!-- Tab Content -->
                    <AccountSessions v-if="selectedTab == 'version.account.show'" />
                    <AccountNotifications v-else-if="selectedTab == 'account.notifications.show'" />
                    <AccountDatabaseEntries v-else-if="selectedTab == 'account.database.entries.show'" />
                    <AccountGlobalVariables v-else-if="selectedTab == 'account.global.variables.show'" />

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import BackButton from "./BackButton";
    import AccountDetails from "./Details";
    import { Head } from '@inertiajs/vue3';
    import AccountSessions from '@pages/Sessions/List';
    import DefaultTabs from '@components/Tabs/DefaultTabs';
    import AccountNotifications from '@pages/Notifications/List';
    import AccountDatabaseEntries from '@pages/DatabaseEntries/List';
    import AccountGlobalVariables from '@pages/GlobalVariables/List';

    export default {
        props: {
            appPayload: Object,
            versionPayload: Object,
            accountPayload: Object,
        },
        components: { Head, BackButton, AccountDetails, AccountSessions, AccountNotifications, AccountGlobalVariables, AccountDatabaseEntries, DefaultTabs },
        data() {
            return {
                tabs: this.getTabs(),
                refreshContentInterval: null,
            }
        },
        computed: {
            selectedTab: {
                get() {
                    return route().current();
                },
                set(routeName) {

                    if( route().current() === routeName ) return;

                    const url = route(routeName, {
                        project: this.route().params.project,
                        version: this.route().params.version,
                        account: this.route().params.account,
                        app: this.route().params.app,
                    });

                    const options = {
                        preserveScroll: true,
                        preserveState: false,
                        replace: true
                    };

                    this.$inertia.get(url, {}, options);

                }
            }
        },
        methods: {
            getTabs() {
                return [
                    {
                        label: 'Sessions',
                        value: 'version.account.show',
                        count: this.accountPayload.sessions_count
                    },
                    {
                        label: 'Notifications',
                        value: 'account.notifications.show',
                        count: this.accountPayload.session_notifications_count
                    },
                    {
                        label: 'Database Entries',
                        value: 'account.database.entries.show',
                        count: this.accountPayload.database_entries_count
                    },
                    {
                        label: 'Global Variables',
                        value: 'account.global.variables.show',
                        count: this.accountPayload.global_variables_count
                    }
                ];
            }
        }
    };

</script>
