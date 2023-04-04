<template>

    <div>

        <h5 class="text-sm font-semibold tracking-tight text-gray-600 mb-4">
            <span>{{ origin == 'simulator' ? 'Simulator Logs' : 'Session Logs' }}</span>
            <NumberBadge v-if="totalLogs" :count="totalFilteredLogs" :active="false" class="ml-2"></NumberBadge>
        </h5>

        <template v-if="showLogs == true && totalLogs">

            <el-select v-model="selectedLogs" multiple placeholder="Select log types" class="w-full border rounded mb-4">
                <el-option-group v-for="group in availableLogs" :key="group.label" :label="group.label">

                    <el-option v-for="log in group.options" :key="log.value" :label="log.label + ' ('+log.count+')'" :value="log.value">
                        <div class="flex items-center justify-between mt-2">
                            <span class="text-xs">{{ log.label }}</span>
                            <span class="text-xs text-gray-400 mr-2">{{ log.count == 0 ? '' : '('+log.count+')' }}</span>
                        </div>
                    </el-option>

                </el-option-group>
            </el-select>

            <Transition name="fade" mode="out-in" appear>

                <div :key="renderkey" class="bg-sky-50 rounded-md p-4 overflow-y-auto border" :style="{ height: '30em' }">

                    <div class="relative space-y-4 text-xs">

                        <div v-for="(log, index) in filteredLogs" :key="index">

                            <!-- Hide Top Vertical Line Overflow -->
                            <div v-if="index == 0" class="relative z-10 bg-sky-50" :style="{ width: '20px', height: '20px', margin: '0 0 -3px -5px' }"></div>

                            <!-- Indicate the Screen -->
                            <div v-if="canShowScreenInfo(log)" class="flex relative right-4 z-10 rounded-r-md border border-l-0 border-blue-400 bg-blue-100 py-1 pl-3 pr-2 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="flex-none text-blue-500 h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span class="text-blue-500 font-semibold">{{ log.screen }}</span>
                            </div>

                            <!-- Indicate the Display -->
                            <div v-if="canShowDisplayInfo(log)" class="flex relative z-10 rounded-r-md border border-emerald-400 bg-emerald-100 py-1 px-2 mb-4 ml-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="flex-none text-emerald-500 h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span class="text-emerald-500 font-semibold">{{ log.display }}</span>
                            </div>

                            <!-- Log Information -->
                            <div class="flex relative z-10 items-center">
                                <span :class="['rounded-full mr-2 border flex-none', getLogClasses(log)]" :style="{ width: '10px', height: '10px' }"></span>
                                <span v-if="log.type == 'info'" v-html="log.description" class="text-xs text-gray-500"></span>
                                <span v-else-if="log.type == 'error'" v-html="log.description" class="text-xs text-red-400"></span>
                                <span v-else-if="log.type == 'warning'" v-html="log.description" class="text-xs text-yellow-400"></span>
                            </div>

                            <!-- Vertical Line -->
                            <div class="absolute z-0 top-0 bottom-0 border-l border-blue-400" :style="{ left: '4px' }"></div>

                        </div>

                        <div v-if="filteredLogs.length == 0" class="p-4 rounded-md border border-dashed border-gray-300">No Logs Found</div>

                    </div>
                </div>

            </Transition>

        </template>

        <div v-if="showLogs == true && totalLogs == 0">

            <PrimaryAlert>
                <!-- If the logs are related to the simulator -->
                <span v-if="origin == 'simulator'" class="text-justify">
                    Launch the Simulator to see the applicaiton logs in realtime
                </span>
                <!-- If the logs are related to the session -->
                <span v-if="origin == 'session'" class="text-justify">
                    This session does not have logs to show
                </span>
            </PrimaryAlert>

        </div>

        <div v-if="origin == 'simulator' && showLogs == false">

            <PrimaryAlert>
                <span class="text-justify">
                    Logs are currently disabled
                </span>
            </PrimaryAlert>

        </div>

    </div>

</template>

<script>

    import NumberBadge from '@components/Badges/NumberBadge';
    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import { useVersionBuilder } from "@stores/VersionBuilder";

    export default {
        props: {
            logs: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            origin: {
                type: String,
                default: 'session',
                validator(value) {
                    return ['simulator', 'session'].includes(value)
                }
            },
            showLogs: {
                type: Boolean,
                default: true
            },
        },
        components: { NumberBadge, PrimaryAlert },
        data() {
            return {
                renderkey: 1,
                screenNames: [],
                displayNames: [],
                useVersionBuilder: useVersionBuilder(),
                selectedLogs: ['info', 'warning', 'error']
            }
        },

        //  No reactive props below
        screenInfoListed: [],
        displayInfoListed: [],

        watch: {
            logs(newValue, oldValue) {

                this.$nextTick(() => {
                    this.$options.screenInfoListed = [];
                    this.$options.displayInfoListed = [];

                    this.screenNames = this.getScreenNames();
                    this.displayNames = this.getDisplayNames();
                });

                ++this.renderkey;

            }
        },
        computed: {
            totalLogs() {
                return this.logs.length;
            },
            filteredLogs() {
                if( this.totalLogs ) {
                    return this.logs.filter((log) => {
                        //  If the log matches the selected log types
                        return this.selectedLogs.includes(log.type) ||
                                //  If the log matches the selected screen name
                               this.selectedLogs.includes('screen-' + log.screen) ||
                                //  If the log matches the selected display name
                               this.selectedLogs.includes('display-' + log.display);
                    });
                }
                return [];
            },
            totalFilteredLogs() {
                return this.filteredLogs.length;
            },
            availableLogs() {
                return [
                    {
                        label: 'Status',
                        options: [
                            {
                                label: 'Info',
                                value: 'info',
                                count: this.logs.filter((log) => {
                                    return log.type == 'info';
                                }).length
                            },
                            {
                                label: 'Warnings',
                                value: 'warning',
                                count: this.logs.filter((log) => {
                                    return log.type == 'warning';
                                }).length
                            },
                            {
                                label: 'Errors',
                                value: 'error',
                                count: this.logs.filter((log) => {
                                    return log.type == 'error';
                                }).length
                            }
                        ]
                    },
                    {
                        label: 'Screens',
                        options: this.screenNames.map((screenName) => {
                            return {
                                label: screenName,
                                value: 'screen-' + screenName,
                                count: this.logs.filter((log) => {
                                    //  If the log matches the selected screen name
                                    return log.screen == screenName;
                                }).length
                            }
                        })
                    },
                    {
                        label: 'Displays',
                        options: this.displayNames.map((displayName) => {
                            return {
                                label: displayName,
                                value: 'display-' + displayName,
                                count: this.logs.filter((log) => {
                                    //  If the log matches the selected display name
                                    return log.display == displayName;
                                }).length
                            }
                        })
                    }
                ];
            },
        },
        methods: {
            getScreenNames() {
                if( this.logs ) {

                    const screenNames = this.logs.filter((log) => {
                        return log.screen !== null;
                    }).map((log) => {
                        return log.screen;
                    });

                    //  Remove duplicates
                    return _.uniqBy(screenNames);

                }

                return [];
            },
            getDisplayNames() {
                if( this.logs ) {

                    const displayNames = this.logs.filter((log) => {
                        return log.display !== null;
                    }).map((log) => {
                        return log.display;
                    });

                    //  Remove duplicates
                    return _.uniqBy(displayNames);

                }

                return [];
            },
            canShowScreenInfo(log) {
                if( log.screen === null || this.$options.screenInfoListed.includes(log.screen) ) {
                    return false;
                }else{
                    this.$options.screenInfoListed.push(log.screen);
                    return true;

                }
            },
            canShowDisplayInfo(log) {
                if( log.display === null || this.$options.displayInfoListed.includes(log.display) ) {
                    return false;
                }else{
                    this.$options.displayInfoListed.push(log.display);
                    return true;
                }
            },
            getLogClasses(log) {
                if( log.type === 'info' ) {
                    return 'bg-blue-100 border-blue-400';
                }else if( log.type === 'warning' ) {
                    return 'bg-yellow-100 border-yellow-500';
                }else if( log.type === 'error' ) {
                    return 'animate-bounce bg-red-100 border-red-500';
                }
            }
        },
        created() {
            this.screenNames = this.getScreenNames();
            this.displayNames = this.getDisplayNames();
        }
    };

</script>
