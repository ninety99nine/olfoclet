<template>

    <div>

        <div class="flex items-center justify-between mb-6">
            <h1 class="text-xl font-semibold text-gray-700 mb-2">Sessions</h1>

            <div>

                <div class="flex divide-x border rounded-md py-2 px-6">
                    <div class="text-center text-xs m-auto pr-6">
                        <p class="mb-2 text-gray-400">Total Sessions</p>
                        <p :class="[(totalSessions == 0 ? 'text-gray-300' : 'text-blue-500')+' font-semibold text-lg']">{{ totalSessions }}</p>
                    </div>
                    <div v-if="!showingAccount" class="text-center text-xs m-auto px-6">
                        <p class="mb-2 text-gray-400">Mobile</p>
                        <p class="text-gray-300 font-semibold text-lg">{{ totalMobileSessions }}</p>
                    </div>
                    <div v-if="!showingAccount" class="text-center text-xs m-auto px-6">
                        <p class="mb-2 text-gray-400">Simulator</p>
                        <p class="text-gray-300 font-semibold text-lg">{{ totalSimulatorSessions }}</p>
                    </div>
                    <div class="text-center text-xs m-auto px-6">
                        <p class="mb-2 text-gray-400">Fail</p>
                        <p :class="[(totalFailedSessions == 0 ? 'text-gray-300' : 'text-red-500')+' font-semibold text-lg']">{{ totalFailedSessions }}</p>
                    </div>
                    <div class="text-center text-xs m-auto pl-6">
                        <p class="mb-2 text-gray-400">Success</p>
                        <p :class="[(totalSuccessfulSessions == 0 ? 'text-gray-300' : 'text-green-500')+' font-semibold text-lg']">{{ totalSuccessfulSessions }}</p>
                    </div>
                </div>
            </div>

        </div>

        <div class="flex items-end justify-between mb-6">

            <DefaultSelect v-if="projectOptions.length >= 2" v-model="selectedProject" :options="projectOptions" @change="onSelectProjectOption()" label="Project" placeholder="Select project" class="w-40"></DefaultSelect>

            <DefaultSelect v-if="appOptions.length >= 2" v-model="selectedApp" :options="appOptions" @change="onSelectAppOption()" label="App" placeholder="Select app" class="w-40"></DefaultSelect>

            <DefaultSelect v-if="versionOptions.length >= 2" v-model="selectedVersion" :options="versionOptions" @change="refreshContent()" label="Version" placeholder="Select version" class="w-40"></DefaultSelect>

            <DefaultSelect v-if="!showingAccount" v-model="origin" :options="originOptions" @change="refreshContent()" label="Origin" placeholder="Select origin" class="w-40"></DefaultSelect>

            <DefaultSelect v-model="requestType" :options="requestTypeOptions" @change="refreshContent()" label="Request" placeholder="Select request" class="w-40"></DefaultSelect>

            <DefaultSelect v-model="status" :options="statusOptions" @change="refreshContent()" label="Status" placeholder="Select status" class="w-40"></DefaultSelect>

            <DefaultSearchBar v-model="search" @onSearch="refreshContent()" placeholder="Search sessions" />

        </div>

        <div class="flex justify-center bg-blue-50 p-2 space-x-8">

            <DefaultCheckbox v-model="localHideDuplicateCells" @onChange="updateHideDuplicateCells" label="Remove Duplicates"></DefaultCheckbox>

        </div>

    </div>

</template>

<script>

    import axios from 'axios';
    import ModelFilterMixin from '@mixins/ModelFilterMixin.vue';
    import DefaultSelect from "@components/Select/DefaultSelect";
    import DefaultCheckbox from "@components/Checkbox/DefaultCheckbox";
    import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";

    export default {
        props: ['showingAccount', 'hideDuplicateCells'],
        mixins: [ModelFilterMixin],
        components: { DefaultSelect, DefaultCheckbox, DefaultSearchBar },
        data() {
            return {

                localHideDuplicateCells: this.hideDuplicateCells,

                //  General stats
                totalSessions: this.$page.props.statistics.totalSessions,

                //  Status stats
                totalFailedSessions: this.$page.props.statistics.totalFailedSessions,
                totalSuccessfulSessions: this.$page.props.statistics.totalSuccessfulSessions,

                //  Origin stats
                totalMobileSessions: this.$page.props.statistics.totalMobileSessions,
                totalSimulatorSessions: this.$page.props.statistics.totalSimulatorSessions,

                origin: 'any',
                originOptions: [
                    {
                        label: 'Any',
                        value: 'any'
                    },
                    {
                        label: 'Mobile',
                        value: 'mobile'
                    },
                    {
                        label: 'Simulator',
                        value: 'simulator'
                    }
                ],

                requestType: 'any',
                requestTypeOptions: [
                    {
                        label: 'Any',
                        value: 'any'
                    },
                    {
                        label: 'Started',
                        value: '1'
                    },
                    {
                        label: 'Running',
                        value: '2'
                    },
                    {
                        label: 'Ended',
                        value: '3'
                    },
                    {
                        label: 'Timed Out',
                        value: '4'
                    }
                ],

                status: 'any',
                statusOptions: [
                    {
                        label: 'Any',
                        value: 'any'
                    },
                    {
                        label: 'Success',
                        value: 'success'
                    },
                    {
                        label: 'Fail',
                        value: 'fail'
                    }
                ],

                search: null,
                request: null,
                refreshContentInterval: null
            }
        },
        watch: {
            hideDuplicateCells(newValue, oldValue) {
                this.localHideDuplicateCells = newValue;
            },
            localHideDuplicateCells(newValue, oldValue) {
                this.$emit('update:hideDuplicateCells', newValue);
            }
        },
        methods: {
            updateHideDuplicateCells(value) {
                this.localHideDuplicateCells = value;
            },
            refreshContent(canCancel = true) {

                //  If we can't cancel the previous request that has not eneded, then deny refreshing of content
                if(canCancel == false && this.request) return;

                //  If we can cancel the previous
                if( canCancel == true ) {

                    //  If the request is cancellable, cancel the previous request
                    if(this.request) this.request.cancel();

                    //  Start loader
                    this.$emit('isLoading', true);

                }


                /**
                 *  Generate the axios cancel token to allow this request
                 *  to be cancelled if this action is required
                 *
                 *  Reference: https://stackoverflow.com/questions/50516438/cancel-previous-request-using-axios-with-vue-js
                 */
                const axiosSource = axios.CancelToken.source();
                this.request = { cancel: axiosSource.cancel };

                const config = {
                    cancelToken: axiosSource.token
                };

                var url;

                if(this.selectedProject !== 'any' && this.selectedApp !== 'any' && this.selectedVersion !== 'any' && this.route().params.account) {

                    //  /projects/1/apps/1/versions/1/accounts/1/sessions
                    url = route('version.account.show', {
                        account: this.route().params.account,
                        project: this.selectedProject,
                        version: this.selectedVersion,
                        app: this.selectedApp,

                        //  Query params
                        page: this.route().params.page ?? 1,
                        requestType: this.requestType,
                        origin: this.origin,
                        status: this.status,
                        search: this.search
                    });

                }else if(this.selectedProject !== 'any' && this.selectedApp !== 'any' && this.selectedVersion !== 'any') {

                    //  /projects/1/apps/1/versions/1/sessions
                    url = route('version.sessions.show', {
                        project: this.selectedProject,
                        version: this.selectedVersion,
                        app: this.selectedApp,

                        //  Query params
                        page: this.route().params.page ?? 1,
                        requestType: this.requestType,
                        origin: this.origin,
                        status: this.status,
                        search: this.search
                    });

                }else if(this.selectedProject !== 'any' && this.selectedApp !== 'any') {

                    //  /projects/1/apps/1/sessions
                    url = route('app.sessions.show', {
                        project: this.selectedProject,
                        app: this.selectedApp,

                        //  Query params
                        page: this.route().params.page ?? 1,
                        requestType: this.requestType,
                        origin: this.origin,
                        status: this.status,
                        search: this.search
                    });

                }else if(this.selectedProject !== 'any') {

                    //  /projects/1/sessions
                    url = route('project.sessions.show', {
                        project: this.selectedProject,

                        //  Query params
                        page: this.route().params.page ?? 1,
                        requestType: this.requestType,
                        origin: this.origin,
                        status: this.status,
                        search: this.search
                    });

                }else{

                    //  /sessions
                    url = route('sessions.show', {
                        //  Query params
                        page: this.route().params.page ?? 1,
                        requestType: this.requestType,
                        origin: this.origin,
                        status: this.status,
                        search: this.search
                    });

                }

                axios.get(url, config).then((response) => {

                    const statistics = response.data.statistics;
                    this.totalSessions = statistics.totalSessions,
                    this.totalFailedSessions = statistics.totalFailedSessions,
                    this.totalSuccessfulSessions = statistics.totalSuccessfulSessions,
                    this.totalMobileSessions = statistics.totalMobileSessions,
                    this.totalSimulatorSessions = statistics.totalSimulatorSessions,

                    this.$emit('response', response.data);

                    //  Stop loader
                    this.$emit('isLoading', false);

                    //  Set the request to null to grant refreshing of content
                    this.request = null;

                });

            },
            cleanUp() {
                clearInterval( this.refreshContentInterval );
                this.refreshContentInterval = null;
            }
        },
        created() {

            //  Keep refreshing this page content every 3 seconds
            this.refreshContentInterval = setInterval(function() {
                this.refreshContent(false);
            }.bind(this), 3000);

        },
        unmounted() {
            this.cleanUp()
        }
    };

</script>
