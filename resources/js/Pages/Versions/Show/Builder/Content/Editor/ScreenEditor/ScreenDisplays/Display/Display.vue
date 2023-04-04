<template>

    <div>

        <div class="flex items-end mb-6">

            <!-- Name -->
            <DefaultInput v-model="display.name" placeholder="Home" class="flex-1 mr-4"></DefaultInput>

            <div class="flex">

                <!-- Color Picker -->
                <DefaultColorPicker v-model="display.hexColor"></DefaultColorPicker>

                <!-- Is First Display Switch -->
                <DefaultSwitch v-model="display.first_display" @update:modelValue="changeOnFirstDisplay($event)" note="First Display" :disabled="screen.conditional_displays.active" class="flex items-center ml-8">

                    <!-- Explainer -->
                    <template v-if="screen.conditional_displays.active" #info>
                        <WarningAlert>

                            <span>
                                This functionality is currently disabled because you have enabled <span class="font-semibold text-blue-500">Conditional Displays</span> on this screen.
                            </span>

                        </WarningAlert>
                    </template>

                </DefaultSwitch>

            </div>

        </div>

        <DefaultTabs v-model="selectedTab" :tabs="tabs" class="mb-8" color="green"></DefaultTabs>

        <!--
            Since the display instruction is always the first component to show, let's use the v-show directive
            to allow the wrapping parent SlideUpDown component to calculate this component height to enable
            the smooth slide up and down transition. The rest of the components can use the v-if directive.
          -->

        <Transition name="fade" mode="out-in" :duration="250">
            <DisplayInstruction v-if="selectedTab == 1" :display="display"></DisplayInstruction>
            <DisplayAction v-else-if="selectedTab == 2" :display="display"></DisplayAction>
            <DisplayEvents v-else-if="selectedTab == 3" :display="display"></DisplayEvents>
            <DisplayMarkers v-else-if="selectedTab == 4" :display="display"></DisplayMarkers>
            <DisplayPagination v-else-if="selectedTab == 5" :display="display"></DisplayPagination>
            <DisplayNavigation v-else-if="selectedTab == 6" :display="display"></DisplayNavigation>
        </Transition>
    </div>

</template>

<script>
    import DisplayAction from './DisplayAction';
    import DisplayEvents from './DisplayEvents';
    import DisplayMarkers from './DisplayMarkers';
    import DisplayNavigation from './DisplayNavigation';
    import DisplayPagination from './DisplayPagination';
    import DisplayInstruction from './DisplayInstruction';
    import DefaultTabs from '@components/Tabs/DefaultTabs';
    import WarningAlert from '@components/Alert/WarningAlert';
    import DefaultInput from '@components/Input/DefaultInput';
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultSwitch from '@components/Switch/DefaultSwitch';
    import DefaultColorPicker from '@components/ColorPicker/DefaultColorPicker';

    export default {
        props: ['display'],
        components: { DisplayInstruction, DisplayAction, DisplayNavigation, DisplayEvents, DisplayMarkers, DisplayPagination, DefaultTabs, WarningAlert, DefaultInput, DefaultSwitch, DefaultColorPicker },
        data(){
            return {
                screen: useVersionBuilder().selectedScreen,
                useVersionBuilder: useVersionBuilder(),
                originalFirstDisplayId: null,
                selectedTab: 1,
                tabs: [],
            }
        },
        watch: {
            totalDisplayEvents() {
                this.tabs = this.getTabs();
            },
            totalDisplayNavigations() {
                this.tabs = this.getTabs();
            },
        },
        computed: {
            totalDisplayEvents() {
                return this.display.content.events.on_enter.collection.length
                     + this.display.content.events.on_leave.collection.length
                     + this.display.content.events.on_response.collection.length;
            },
            totalDisplayNavigations() {
                return this.display.content.screen_repeat_navigation.forward_navigation.length
                     + this.display.content.screen_repeat_navigation.backward_navigation.length;
            },
            totalDisplayMarkers() {
                return this.display.content.markers.length;
            }
        },
        methods: {
            getTabs() {

                return [
                    {
                        label: 'Instruction',
                        value: 1
                    },
                    {
                        label: 'Action',
                        value: 2
                    },
                    {
                        count: this.totalDisplayEvents,
                        label: 'Events',
                        value: 3
                    },
                    {
                        count: this.totalDisplayMarkers,
                        label: 'Markers',
                        value: 4
                    },
                    {
                        label: 'Pagination',
                        value: 5
                    },
                    {
                        count: this.totalDisplayNavigations,
                        label: 'Navigation',
                        value: 6
                    }
                ];
            },
            changeOnFirstDisplay(isSelected) {

                //  Foreach display
                for(var x = 0; x < this.screen.displays.length; x++){

                    //  Disable the first display attribute for each display except the current display
                    if( this.screen.displays[x].id !== this.display.id ){

                        /**
                         *  Disable first_display attribute so that we only have the
                         *  current display as the only display with a true value.
                         */
                        this.screen.displays[x].first_display = false;

                    }

                }

                //  If the current display id and the original first display are two different displays
                if( this.display.id !== this.originalFirstDisplayId ) {

                    //  If the current display was selected, but is then unselected again
                    if( isSelected == false) {

                        const index = this.screen.displays.findIndex((display) => display.id === this.originalFirstDisplayId);

                        if( index >= 0 ) {

                            //  The set the original first display as the selected screen by default
                            this.screen.displays[index].first_display = true;

                        }

                    }

                }

            }
        },
        created() {

            this.tabs = this.getTabs();

            //  Get the screen that is marked as the first display
            const originalFirstDisplay = this.screen.displays.find((display) => display.first_display);

            //  If this screen exists
            if( originalFirstDisplay ) {

                //  Capture the screen id
                this.originalFirstDisplayId = originalFirstDisplay.id;

            }

        }
    };

</script>
