<template>

    <div class="pt-8 px-16 mt-4 pb-52">

        <Head v-if="appPayload && versionPayload" :title="appPayload.name + ' - Version ' + versionPayload.number + ' Reports'" />
        <Head v-else-if="appPayload" :title="appPayload.name + ' Reports'" />
        <Head v-else title="Reports" />

        <div class="flex justify-between">

            <!-- Back Button -->
            <BackButton>Versions</BackButton>

        </div>

        <div class="flex justify-between items-center my-4">

            <!-- Date -->
            <div class="flex space-x-2 bg-white text-xs text-gray-500 rounded-t-md border-b py-6 px-8 -mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span v-if="dateRangeText">Showing {{ dateRangeText }}</span>
                <div class="border-l border-gray-300"></div>
                <span v-if="dateRangeComparisonText">Compared to {{ dateRangeComparisonText }}</span>
            </div>

            <div class="flex space-x-8">

                <!-- Switch -->
                <DefaultSwitch v-model="showComparisons" note="Show comparisons"></DefaultSwitch>

                <!-- Date Selector -->
                <DefaultSelect v-model="dateType" :options="dateTypes" @change="refreshContent()" class="w-60"></DefaultSelect>

            </div>

        </div>

        <div :class="['bg-white rounded-tr-md rounded-b-md shadow-md p-8 mb-4 relative overflow-hidden transition-all']">

            <!-- Explainer -->
            <PrimaryAlert class="mb-8">
                Showing reports of
                <span v-if="route().current() === 'reports.show'">
                    <span class="font-semibold text-green-500">several projects</span>
                </span>

                <span v-if="route().current() === 'project.reports.show'">
                    services running on the
                    <span class="font-semibold text-green-500">{{ projectPayload.name }}</span>
                    project
                </span>

                <span v-if="route().current() === 'app.reports.show'">
                    services running on the
                    <span class="font-semibold text-green-500">{{ appPayload.name }}</span>
                    app
                </span>

                <span v-if="route().current() === 'version.reports.show'">
                    services running on
                    <span class="font-semibold text-green-500">{{ appPayload.name }}</span>
                    version
                    <span class="font-semibold text-green-500">{{ versionPayload.number }}</span>
                </span>

            </PrimaryAlert>

            <div class="grid grid-cols-4 gap-4">

                <div v-for="(overviewStat, index) in overviewStats" :key="index" class="col-span-1 relative text-center bg-blue-50 border border-blue-300 rounded-md pt-5 pb-3 hover:shadow-lg cursor-pointer">

                    <h4 :class="['text-blue-400 text-sm mb-2 whitespace-pre-wrap', overviewStat.hasOwnProperty('comparison_total') ? 'mb-2' : 'mb-6']">{{ overviewStat.title }}</h4>

                    <div v-if="overviewStat.subtitle" class="absolute top-2 right-2">
                        <InfoPopover class="text-center">
                            <p class="text-xs text-gray-600 break-normal" v-html="overviewStat.subtitle"></p>
                        </InfoPopover>
                    </div>

                    <span class="text-blue-400 font-semibold text-xl">{{ overviewStat.total }}</span>

                    <template v-if="overviewStat.hasOwnProperty('comparison_total')">

                        <span class="text-gray-400 text-xs">
                            <span class="mx-2">/</span>
                            <span>{{ overviewStat.comparison_total }}</span>
                        </span>

                        <div class="flex justify-center text-xs border-t border-blue-200 border-dashed pt-4 mt-2">
                            <div :class="['flex justify-center', { 'text-green-500': overviewStat.show_positive_arrow, 'text-red-500': overviewStat.show_negative_arrow, 'text-blue-400': (!overviewStat.show_positive_arrow && !overviewStat.show_negative_arrow) }]">
                                <svg v-if="overviewStat.show_positive_arrow" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7l4-4m0 0l4 4m-4-4v18" />
                                </svg>
                                <svg v-if="overviewStat.show_negative_arrow" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                                </svg>
                                <span>{{ overviewStat.comparison_percentage }}%</span>
                            </div>
                        </div>

                    </template>

                </div>

            </div>

            <div class="flex items-center absolute top-8 right-8 cursor-pointer text-gray-400" @click="toggleExpandOverview()">

                <span class="text-xs text-gray-400 mr-2">Click to {{ expandOverview ? 'minimize' : 'maximize' }} &#8212; </span>

                <svg v-if="expandOverview" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

            </div>

        </div>

        <div class="grid grid-cols-12 gap-4" :key="showComparisons">

            <!-- Charts -->
            <template v-for="(chartStat, index) in chartStats" :key="index">

                <div :class="[chartStat.hasOwnProperty('col_span') ? chartStat.col_span : 'col-span-4', 'bg-white rounded-md shadow-md relative p-8 mb-4']">

                    <div v-if="chartStat.hasOwnProperty('description')" class="absolute top-4 right-4">
                        <InfoPopover class="text-center">
                            <p class="text-xs text-gray-600 break-normal" v-html="chartStat.description"></p>
                        </InfoPopover>
                    </div>

                    <!-- Chart -->
                    <HighChart :report="chartStat" :showComparisons="showComparisons" />

                </div>

            </template>

        </div>

    </div>

</template>

<script>

    import axios from 'axios';
    import BackButton from "./BackButton";
    import HighChart from "./Charts/HighChart";
    import SlideUpDown from 'vue3-slide-up-down';
    import { Head } from '@inertiajs/vue3';
    import ModelFilterMixin from '@mixins/ModelFilterMixin';
    import InfoPopover from '@components/Popover/InfoPopover';
    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import DefaultSwitch from "@components/Switch/DefaultSwitch";

    export default {
        mixins: [ModelFilterMixin],
        components: { Head, HighChart, SlideUpDown, BackButton, PrimaryAlert, InfoPopover, DefaultSelect, DefaultSwitch },
        data() {
            return {
                dateType: 'Today',
                dateTypes: [
                    {
                        label: 'Today'
                    },
                    {
                        label: 'Yesterday'
                    },
                    {
                        label: 'This Week'
                    },
                    {
                        label: 'This Month'
                    },
                    {
                        label: 'This Year'
                    },
                    {
                        label: 'Last 7 days'
                    },
                    {
                        label: 'Last 14 days'
                    },
                    {
                        label: 'Last 30 days'
                    },
                    {
                        label: 'Last 60 days'
                    },
                    {
                        label: 'Last 90 days'
                    },
                    {
                        label: 'Last Week'
                    },
                    {
                        label: 'Last Month'
                    },
                    {
                        label: 'Last Year'
                    },
                    {
                        label: '2 years ago'
                    },
                    {
                        label: '3 years ago'
                    },
                    {
                        label: 'Custom'
                    }
                ],
                chartStats: [],
                overviewStats: [],
                expandOverview: true,
                showComparisons: true,
                appPayload: this.$page.props.appPayload,
                versionPayload: this.$page.props.versionPayload,
                reportPayload: this.$page.props.reportPayload,

                request: null
            }
        },
        computed: {
            dateRangeText() {
                return this.reportPayload.aboutReport.date_range_text;
            },
            dateRangeComparisonText() {
                return this.reportPayload.aboutReport.date_range_comparison_text;
            }
        },
        methods: {
            setChartStats() {
                this.chartStats = this.reportPayload.accountReport.charts;
            },
            setOverviewStats() {
                if( this.expandOverview ) {
                    this.overviewStats = this.reportPayload.accountReport.overview;
                }else{
                    this.overviewStats = this.reportPayload.accountReport.overview.slice(0, 4);
                }
            },
            toggleExpandOverview() {
                this.expandOverview = !this.expandOverview;
                this.setOverviewStats();
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

                if(this.selectedProject !== 'any' && this.selectedApp !== 'any' && this.selectedVersion !== 'any') {

                    //  /projects/1/apps/1/versions/1/reports
                    url = route('version.reports.show', {
                        project: this.selectedProject,
                        version: this.selectedVersion,
                        app: this.selectedApp,

                        //  Query params
                        page: this.route().params.page ?? 1,
                        date_type: this.dateType
                    });

                }else if(this.selectedProject !== 'any' && this.selectedApp !== 'any') {

                    //  /projects/1/apps/1/reports
                    url = route('app.reports.show', {
                        project: this.selectedProject,
                        app: this.selectedApp,

                        //  Query params
                        page: this.route().params.page ?? 1,
                        date_type: this.dateType
                    });

                }else if(this.selectedProject !== 'any') {

                    //  /projects/1/reports
                    url = route('project.reports.show', {
                        project: this.selectedProject,

                        //  Query params
                        page: this.route().params.page ?? 1,
                        date_type: this.dateType
                    });

                }else{

                    //  /reports
                    url = route('reports.show', {
                        //  Query params
                        page: this.route().params.page ?? 1,
                        date_type: this.dateType
                    });

                }

                axios.get(url, config).then((response) => {

                    this.reportPayload = response.data.reportPayload;

                    this.setChartStats();
                    this.setOverviewStats();

                    this.$emit('response', response.data);

                    //  Stop loader
                    this.$emit('isLoading', false);

                    //  Set the request to null to grant refreshing of content
                    this.request = null;

                });

            }
        },
        created() {
            this.setChartStats();
            this.setOverviewStats();
        }
    };

</script>
