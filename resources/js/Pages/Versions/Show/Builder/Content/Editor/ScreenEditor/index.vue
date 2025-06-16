<template>

    <div>

        <template v-if="screen">

            <div class="flex items-end mb-4">

                <div class="flex flex-1 items-center">

                    <!-- Name Input -->
                    <DefaultInput v-model="screen.name" label="Screen Name" placeholder="Home" class="flex-1 mr-4"></DefaultInput>

                    <!-- Paste Screen Properties Badge -->
                    <PastePropertiesModal v-if="hasScreenPropertiesToPaste" class="mt-6 mr-4"></PastePropertiesModal>

                </div>

                <div class="flex items-center">

                    <!-- Dropdown Menu -->
                    <DefaultDropdown :menus="menus" class="mr-8">
                        <template #appendMenus>
                            <!-- Additional Menus-->
                            <CopyPropertiesModal></CopyPropertiesModal>
                        </template>
                    </DefaultDropdown>

                    <!-- Is First Display Screen Switch -->
                    <DefaultSwitch v-model="screen.first_display_screen" @update:modelValue="changeOnFirstDisplayScreen($event)" note="First Screen" :disabled="useVersionBuilder.builder.conditional_screens.active || screen.id == originalFirstDisplayScreenId">

                        <!-- Explainer -->
                        <template v-if="useVersionBuilder.builder.conditional_screens.active || screen.id == originalFirstDisplayScreenId" #info>
                            <WarningAlert>

                                <span v-if="useVersionBuilder.builder.conditional_screens.active">
                                    This functionality is currently disabled because you have enabled <span class="font-semibold text-blue-500">Conditional Screens</span> on the configuration settings.
                                </span>

                                <span v-if="screen.id == originalFirstDisplayScreenId">
                                    This functionality is currently disabled for this screen. Try to use this on other screens
                                </span>

                            </WarningAlert>
                        </template>

                    </DefaultSwitch>

                </div>

            </div>

            <DefaultTabs v-model="selectedTab" :tabs="tabs" class="mb-8"></DefaultTabs>

            <Transition name="fade" mode="out-in" :duration="250">

                <screenDisplays v-if="selectedTab == 1"></screenDisplays>
                <screenEvents v-else-if="selectedTab == 2"></screenEvents>
                <screenMarkers v-else-if="selectedTab == 3"></screenMarkers>
                <screenRepeat v-else-if="selectedTab == 4"></screenRepeat>

            </Transition>

        </template>

        <template v-else>

            <NoScreens></NoScreens>

        </template>

    </div>

</template>

<script>
    import NoScreens from './NoScreens';
    import ScreenEvents from './ScreenEvents';
    import ScreenRepeat from './ScreenRepeat';
    import screenMarkers from './ScreenMarkers';
    import ScreenDisplays from './ScreenDisplays';
    import DefaultTabs from '@components/Tabs/DefaultTabs';
    import WarningAlert from '@components/Alert/WarningAlert';
    import DefaultInput from '@components/Input/DefaultInput';
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultSwitch from '@components/Switch/DefaultSwitch';
    import DefaultDropdown from '@components/Dropdown/DefaultDropdown';
    import CopyPropertiesModal from './CopyProperties/CopyPropertiesModal';
    import PastePropertiesModal from './PasteProperties/PastePropertiesModal';

    export default {
        components: { NoScreens, ScreenEvents, ScreenRepeat, screenMarkers, ScreenDisplays, DefaultTabs, WarningAlert, DefaultInput, DefaultSwitch, DefaultDropdown, CopyPropertiesModal, PastePropertiesModal },
        data(){
            return {
                useVersionBuilder: useVersionBuilder(),
                originalFirstDisplayScreenId: null,
                hasScreenPropertiesToPaste: false,
                menus: [
                    {
                        label: 'Copy ID',
                        onclick: () => {

                            console.log(`screen id: ${this.screen.id}`);

                            //  Copy to clipboard
                            navigator.clipboard.writeText(this.screen.id).then(() => {
                                // Alert the user that the action took place.
                                this.$message({
                                    message: 'Copied the Screen ID',
                                    type: 'success'
                                });
                            });
                        }
                    },
                    {
                        label: 'Copy Name',
                        borders: ['b'],
                        onclick: () => {

                            console.log(`screen name: ${this.screen.name}`);

                            //  Copy to clipboard
                            navigator.clipboard.writeText(this.screen.name).then(() => {
                                // Alert the user that the action took place.
                                this.$message({
                                    message: 'Copied the Screen Name',
                                    type: 'success'
                                });
                            });
                        }
                    }
                ],
                selectedTab: 1,
                tabs: []
            }
        },
        computed: {
            screen() {
                return this.useVersionBuilder.selectedScreen
            },
            totalScreenDisplays(){
                return this.useVersionBuilder.totalScreenDisplays;
            },
            totalScreenEvents(){
                return this.useVersionBuilder.totalScreenEvents;
            },
            totalScreenMarkers(){
                return this.useVersionBuilder.totalScreenMarkers;
            },
        },
        watch: {
            'screen.repeat.active.selected_type': {
                handler: function (after, before) {
                    this.tabs = this.getTabs();
                },
                deep: true
            },
            screen() {
                this.tabs = this.getTabs();
            },
            totalScreenDisplays() {
                this.tabs = this.getTabs();
            },
            totalScreenEvents() {
                this.tabs = this.getTabs();
            },
            totalScreenMarkers() {
                this.tabs = this.getTabs();
            },
        },
        methods: {
            getTabs() {

                if( this.screen == null ) return [];

                const repeatActiveState = this.screen.repeat.active.selected_type;

                return [
                    {
                        count: this.totalScreenDisplays,
                        label: 'Displays',
                        value: 1
                    },
                    {
                        count: this.totalScreenEvents,
                        label: 'Events',
                        value: 2
                    },
                    {
                        count: this.totalScreenMarkers,
                        label: 'Markers',
                        value: 3
                    },
                    {
                        label: 'Repeat ('+repeatActiveState+')',
                        value: 4
                    }
                ];
            },
            changeOnFirstDisplayScreen(isSelected) {

                //  Foreach screen
                for(var x = 0; x < this.useVersionBuilder.screens.length; x++){

                    //  Disable the first display screen attribute for each screen except the current screen
                    if( this.useVersionBuilder.screens[x].id !== this.screen.id ){

                        /**
                         *  Disable first_display_screen attribute so that we only have
                         *  the current screen as the only screen with a true value.
                         */
                        this.useVersionBuilder.screens[x].first_display_screen = false;

                    }

                }

                //  If the current screen id and the original first display screen are two different screens
                if( this.screen.id !== this.originalFirstDisplayScreenId ) {

                    //  If the current screen was selected, but is then unselected again
                    if( isSelected == false) {

                        const index = this.useVersionBuilder.screens.findIndex((screen) => screen.id === this.originalFirstDisplayScreenId);

                        if( index >= 0 ) {

                            //  The set the original first display screen as the selected screen by default
                            this.useVersionBuilder.screens[index].first_display_screen = true;

                        }

                    }

                }

            }
        },
        created() {

            this.tabs = this.getTabs();
            this.hasScreenPropertiesToPaste = window.localStorage.getItem('screen_properties') !== null;

            //  Get the screen that is marked as the first display screen
            const originalFirstDisplayScreen = this.useVersionBuilder.screens.find((screen) => screen.first_display_screen);

            //  If this screen exists
            if( originalFirstDisplayScreen ) {

                //  Capture the screen id
                this.originalFirstDisplayScreenId = originalFirstDisplayScreen.id;

            }

        }
    };

</script>
