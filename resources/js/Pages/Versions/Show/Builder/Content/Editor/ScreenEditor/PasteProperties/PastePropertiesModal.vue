<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        primaryText="Paste Properties"
        :primaryAction="pasteProperties">

        <!-- Modal Title -->
        <template v-slot:title>Paste Properties</template>

        <!-- Explainer -->
        <PrimaryAlert>
            <span class="text-justify">
                Select the preferred method to apply these screen properties
            </span>
        </PrimaryAlert>

        <DefaultSelect v-model="selectedOption" :options="options" label="Select Method" class="my-6"></DefaultSelect>

        <!-- Change Display Ids Switch -->
        <DefaultSwitch v-model="changeDisplayIds" note="Change display ids"></DefaultSwitch>

        <!-- Change Event Ids Switch -->
        <DefaultSwitch v-if="hasEvents()" v-model="changeEventIds" note="Change event ids" class="mt-6"></DefaultSwitch>

        <!-- Overide Select Events Conditionally -->
        <DefaultSwitch v-if="hasEvents()" v-model="overideConditionalEventLogic" note="Overide (Select events conditionally)" info="Turn on to overide the logic to select events conditionally" class="mt-6"></DefaultSwitch>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <SuccessBadge :clickable="true">Paste Properties</SuccessBadge>

        </template>

    </DefaultModal>

</template>

<script>

    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import SuccessBadge from "@components/Badges/SuccessBadge";
    import PrimaryButton from "@components/Button/PrimaryButton";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import DefaultSwitch from "@components/Switch/DefaultSwitch";

    export default {
        components: { PrimaryAlert, DefaultModal, SuccessBadge, PrimaryButton, DefaultSelect, DefaultSwitch },
        data() {
            return {
                selectedOption: 'Merge',
                options: [
                    {
                        label: 'Merge',
                    },
                    {
                        label: 'Replace',
                    }
                ],
                changeEventIds: true,
                changeDisplayIds: true,
                overideConditionalEventLogic: true,
                useVersionBuilder: useVersionBuilder(),
                screen: useVersionBuilder().selectedScreen,
            }
        },
        methods: {
            hasEvents() {

                var screenProperties = window.localStorage.getItem('screen_properties');
                screenProperties = JSON.parse(screenProperties);

                return Object.keys(screenProperties).includes('events');
            },
            pasteProperties(closeModal) {

                var screenProperties = window.localStorage.getItem('screen_properties');

                if( screenProperties !== null ) {

                    //  Convert to JSON object
                    screenProperties = JSON.parse(screenProperties);

                    let keys = Object.keys(screenProperties);
                    let values = Object.values(screenProperties);

                    //  Set the screen properties
                    for (let index = 0; index < keys.length; index++) {

                        let key = keys[index];
                        let value = values[index];

                        //  If the property is a list of displays and we should change the display ids
                        if(key === 'displays' && this.changeDisplayIds) {

                            value = value.map((display) => {

                                //  Clone the display to change the id
                                return this.useVersionBuilder.getClonedDisplay(display);

                            });

                        //  If the property is a list of events and we should change the event ids
                        }else if(key === 'events' && this.changeEventIds) {

                            value['on_enter']['collection'] = value['on_enter']['collection'].map((event) => {

                                //  Clone the event to change the id
                                return this.useVersionBuilder.getClonedEvent(event);

                            });

                            value['on_leave']['collection'] = value['on_leave']['collection'].map((event) => {

                                //  Clone the event to change the id
                                return this.useVersionBuilder.getClonedEvent(event);

                            });

                            value['on_response']['collection'] = value['on_response']['collection'].map((event) => {

                                //  Clone the event to change the id
                                return this.useVersionBuilder.getClonedEvent(event);

                            });

                        }

                        if( this.selectedOption == 'Merge' ) {

                            //  If the property is a list of events
                            if(key === 'events') {

                                this.screen[key]['on_enter']['collection'] = [
                                    ...this.screen[key]['on_enter']['collection'],
                                    ...value['on_enter']['collection']
                                ];

                                this.screen[key]['on_leave']['collection'] = [
                                    ...this.screen[key]['on_leave']['collection'],
                                    ...value['on_leave']['collection']
                                ];

                                this.screen[key]['on_response']['collection'] = [
                                    ...this.screen[key]['on_response']['collection'],
                                    ...value['on_response']['collection']
                                ];

                                if( this.overideConditionalEventLogic ) {
                                    this.screen[key]['on_enter']['conditional'] = value['on_enter']['conditional'];
                                    this.screen[key]['on_leave']['conditional'] = value['on_leave']['conditional'];
                                    this.screen[key]['on_response']['conditional'] = value['on_response']['conditional'];
                                }

                            }else{

                                //  Check if this value is an Array
                                if( Array.isArray(value) ) {

                                    //  Merge Array
                                    this.screen[key] = [
                                        ...this.screen[key],
                                        ...value
                                    ];

                                }else{

                                    //  Merge Object
                                    this.screen[key] = {
                                        ...this.screen[key],
                                        ...value
                                    };

                                }

                            }

                        }else if( this.selectedOption == 'Replace' ) {

                            this.screen[key] = value;

                        }

                    }

                    //  window.localStorage.removeItem('screen_properties');

                    //  this.hasScreenPropertiesToPaste = false;

                    this.$message({
                        message: 'Screen properties Pasted',
                        type: 'success'
                    });

                }

                closeModal();

            }
        }
    };

</script>
