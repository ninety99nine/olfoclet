<template>

    <!-- Cascade Or Code Editor -->
    <CascadeOrCodeEditor v-model="localModelValue" v-model:selectedValues="selectedValues" :options="options" :label="label" :placeholder="placeholder"></CascadeOrCodeEditor>

</template>

<script>

import { useVersionBuilder } from '@stores/VersionBuilder';
import CascadeOrCodeEditor from '@components/CascadeOrCodeEditor/CascadeOrCodeEditor';

export default {
    components: { CascadeOrCodeEditor },
    props: {
        modelValue: Object,
        label: {
            type: String,
            default: 'Link'
        },
        showDisplays: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String,
            default: 'Select screen or display'
        }
    },
    data(){
        return {
            selectedValues: [],
            localModelValue: this.modelValue,
            useVersionBuilder: useVersionBuilder()
        }
    },
    watch: {
        modelValue(newValue, oldValue) {
            this.localModelValue = newValue;
        },
        localModelValue(newValue, oldValue) {
            this.$emit('update:modelValue', newValue);
        }
    },
    computed: {

        options() {

            var options = [];

            //  Set the screen options
            const screenOptions = this.useVersionBuilder.screens.map((screen) => {
                return {
                    value: screen.id,
                    label: screen.name
                }
            });

            //  Add the screen options
            options.push({
                label: 'Screens',
                value: 'screens',
                children: screenOptions
            });

            const selectedScreen = this.useVersionBuilder.selectedScreen;

            if( selectedScreen && this.showDisplays ) {

                //  Set the display options
                const displayOptions = selectedScreen.displays.map((display) => {
                    return {
                        value: display.id,
                        label: display.name
                    }
                });

                //  Add the display options
                options.push({
                    label: 'Displays',
                    value: 'displays',
                    children: displayOptions
                });

            }

            return options;

        },
    },
    methods: {
        setSelectedScreenOrDisplay(id) {

            if( id ) {

                if( id.includes('screen_') ) {

                    //  Set the selected screen
                    this.selectedValues = ['screens', id];

                }else if( id.includes('display_') ) {

                    //  Set the selected display
                    this.selectedValues = ['displays', id];

                }

            }

        }
    },
    created() {
        this.setSelectedScreenOrDisplay(this.modelValue.text);
    }
}

</script>
