<template>

    <div>

        <div class="flex items-center justify-between mb-6">
            <h1 class="text-xl font-semibold text-gray-700 mb-2">Global Variables</h1>

            <div>

                <div class="flex divide-x border rounded-md py-2 px-6">
                    <div class="text-center text-xs m-auto">
                        <p class="mb-2 text-gray-400">Total</p>
                        <p :class="[(totalGlobalVariables == 0 ? 'text-gray-300' : 'text-blue-500')+' font-semibold text-lg']">{{ totalGlobalVariables }}</p>
                    </div>
                </div>
            </div>

        </div>

        <div class="flex items-end justify-between mb-6">

            <DefaultSelect v-if="projectOptions.length >= 2" v-model="selectedProject" :options="projectOptions" @change="onSelectProjectOption()" label="Project" placeholder="Select project" class="w-40"></DefaultSelect>

            <DefaultSelect v-if="appOptions.length >= 2" v-model="selectedApp" :options="appOptions" @change="onSelectAppOption()" label="App" placeholder="Select app" class="w-40"></DefaultSelect>

            <DefaultSelect v-if="versionOptions.length >= 2" v-model="selectedVersion" :options="versionOptions" @change="refreshContent()" label="Version" placeholder="Select version" class="w-40"></DefaultSelect>

            <DefaultSearchBar v-model="search" @onSearch="refreshContent()" placeholder="Search global variables" />

        </div>

        <div class="flex justify-center bg-blue-50 p-2 space-x-8">

            <DefaultCheckbox v-model="localHideDuplicateCells" @onChange="updateHideDuplicateCells" label="Remove Duplicates"></DefaultCheckbox>
            <DefaultCheckbox v-model="localPrettifyJson" @onChange="updatePrettifyJson" label="Prettify Metadata"></DefaultCheckbox>

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
        props: ['prettifyJson', 'hideDuplicateCells'],
        mixins: [ModelFilterMixin],
        components: { DefaultSelect, DefaultCheckbox, DefaultSearchBar },
        data() {
            return {

                localPrettifyJson: this.prettifyJson,
                localHideDuplicateCells: this.hideDuplicateCells,

                //  General stats
                totalGlobalVariables: this.$page.props.statistics.totalGlobalVariables,

                search: null,
                request: null,
                refreshContentInterval: null
            }
        },
        watch: {
            prettifyJson(newValue, oldValue) {
                this.localPrettifyJson = newValue;
            },
            localPrettifyJson(newValue, oldValue) {
                this.$emit('update:prettifyJson', newValue);
            },
            hideDuplicateCells(newValue, oldValue) {
                this.localHideDuplicateCells = newValue;
            },
            localHideDuplicateCells(newValue, oldValue) {
                this.$emit('update:hideDuplicateCells', newValue);
            }
        },
        methods: {
            updatePrettifyJson(value) {
                this.localPrettifyJson = value;
            },
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

                    //  /projects/1/apps/1/versions/1/accounts/1/global-variables
                    url = route('version.account.show', {
                        account: this.route().params.account,
                        project: this.selectedProject,
                        version: this.selectedVersion,
                        app: this.selectedApp,

                        //  Query params
                        page: this.route().params.page ?? 1,
                        search: this.search
                    });

                }else if(this.selectedProject !== 'any' && this.selectedApp !== 'any' && this.selectedVersion !== 'any') {

                    //  /projects/1/apps/1/versions/1/global-variables
                    url = route('version.global.variables.show', {
                        project: this.selectedProject,
                        version: this.selectedVersion,
                        app: this.selectedApp,

                        //  Query params
                        page: this.route().params.page ?? 1,
                        search: this.search
                    });

                }else if(this.selectedProject !== 'any' && this.selectedApp !== 'any') {

                    //  /projects/1/apps/1/global-variables
                    url = route('app.global.variables.show', {
                        project: this.selectedProject,
                        app: this.selectedApp,

                        //  Query params
                        page: this.route().params.page ?? 1,
                        search: this.search
                    });

                }else if(this.selectedProject !== 'any') {

                    //  /projects/1/global-variables
                    url = route('project.global.variables.show', {
                        project: this.selectedProject,

                        //  Query params
                        page: this.route().params.page ?? 1,
                        search: this.search
                    });

                }else{

                    //  /global-variables
                    url = route('global.variables.show', {
                        //  Query params
                        page: this.route().params.page ?? 1,
                        search: this.search
                    });

                }

                axios.get(url, config).then((response) => {

                    const statistics = response.data.statistics;
                    this.totalGlobalVariables = statistics.totalGlobalVariables;

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
