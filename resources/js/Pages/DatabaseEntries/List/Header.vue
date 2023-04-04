<template>

    <div>

        <div class="flex items-center justify-between mb-6">
            <h1 class="text-xl font-semibold text-gray-700 mb-2">Database Entries</h1>
            <div class="flex divide-x border rounded-md py-2 px-6">
                <div class="text-center text-xs m-auto">
                    <p class="mb-2 text-gray-400">Total</p>
                    <p :class="[(totalDatabaseEntries == 0 ? 'text-gray-300' : 'text-blue-500')+' font-semibold text-lg']">{{ totalDatabaseEntries }}</p>
                </div>
            </div>
        </div>

        <div class="flex items-end justify-between mb-6">

            <DefaultSelect v-model="selectedVersion" :options="versionOptions" @change="refreshContent()" label="Filter by version" placeholder="Select version" class="w-40"></DefaultSelect>

            <DefaultSearchBar v-model="search" @onSearch="refreshContent()" placeholder="Search database entries" class="w-80" />

        </div>

        <div class="flex justify-center bg-blue-50 p-2">

            <DefaultCheckbox v-model="localPrettifyJson" @onChange="updatePrettifyJson" label="Prettify Metadata"></DefaultCheckbox>

        </div>

    </div>

</template>

<script>

    import axios from 'axios';
    import DefaultSelect from "@components/Select/DefaultSelect";
    import DefaultCheckbox from "@components/Checkbox/DefaultCheckbox";
    import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";

    export default {
        props: ['prettifyJson'],
        components: { DefaultCheckbox, DefaultSelect, DefaultSearchBar },
        data() {
            return {
                localPrettifyJson: this.prettifyJson,
                totalDatabaseEntries: this.$page.props.statistics.totalDatabaseEntries,

                selectedVersion: this.route().params.version,
                versionOptions: this.$page.props.versionOptions.map((option) => {
                    return {
                        label: option.number,
                        value: option.id
                    }
                }),

                search: null,
                request: null,
                refreshContentInterval: null,
            }
        },
        watch: {
            prettifyJson(newValue, oldValue) {
                this.localPrettifyJson = newValue;
            },
            localPrettifyJson(newValue, oldValue) {
                this.$emit('update:prettifyJson', newValue);
            }
        },
        methods: {
            updatePrettifyJson(value) {
                this.localPrettifyJson = value;
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

                if( route().current() === 'database.entries.show' ) {

                    url = route(route().current(), {
                        project: this.route().params.project,
                        app: this.route().params.app,
                        version: this.selectedVersion,

                        //  Query params
                        search: this.search,
                        page: this.route().params.page ?? 1
                    });

                }else if( route().current() === 'account.database.entries.show' ) {

                    url = route(route().current(), {
                        project: this.route().params.project,
                        account: this.route().params.account,
                        app: this.route().params.app,
                        version: this.selectedVersion,

                        //  Query params
                        search: this.search,
                        page: this.route().params.page ?? 1
                    });

                }

                axios.get(url, config).then((response) => {

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
