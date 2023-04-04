<template>

    <div class="p-4 rounded-lg bg-gray-50 shadow-md border">

        <div class="flex items-center justify-between border-b border-dotted pb-4 mb-4">

            <!-- Display Search Bar -->
            <DefaultSearchBar v-model="useVersionBuilder.filterDisplaySearch" placeholder="Search displays" />

            <div class="flex items-center">

                <!-- Paste Display -->
                <Transition name="fade">
                    <SuccessBadge v-if="hasDisplayToPaste" @click.stop="pasteDisplay()" :clickable="true" class="mr-4">Paste Display</SuccessBadge>
                </Transition>

                <!-- Add Display Button & Modal -->
                <CreateDisplayModal v-if="screen.displays.length" mode="create"></CreateDisplayModal>

            </div>

        </div>

        <!-- Conditional Displays Code Editor -->
        <SwitchAndCodeEditor
            v-model="screen.conditional_displays" max_height="200px" class="mb-4"
            info="Write code to conditionally select the first display to show when this screen is loaded. This works by returning the Display ID."
            note="Select displays conditionally">
        </SwitchAndCodeEditor>

        <!-- Display Menus -->
        <DisplayMenus></DisplayMenus>

    </div>

</template>

<script>

import DisplayMenus from "./DisplayMenus.vue";
import { useVersionBuilder } from "@stores/VersionBuilder";
import CodeEditor from "@components/CodeEditor/CodeEditor";
import SuccessBadge from "@components/Badges/SuccessBadge";
import CreateDisplayModal from "./Create/CreateDisplayModal";
import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar.vue";
import SwitchAndCodeEditor from "@components/SwitchAndCodeEditor/SwitchAndCodeEditor";

export default {
    components: { DefaultSearchBar, CreateDisplayModal, CodeEditor, SuccessBadge, DisplayMenus, SwitchAndCodeEditor },
    data() {
        return {
            setInterval: null,
            hasDisplayToPaste: false,
            useVersionBuilder: useVersionBuilder()
        }
    },
    computed: {
        screen() {
            return this.useVersionBuilder.selectedScreen
        }
    },
    methods: {
        pasteDisplay() {

            var display = window.localStorage.getItem('display');

            if( display !== null ) {

                //  Convert to JSON object
                display = JSON.parse(display);

                //  Clone to change the display id
                display = this.useVersionBuilder.getClonedDisplay(display);

                //  Add display
                this.screen.displays.push(display);

                window.localStorage.removeItem('display');

                this.hasDisplayToPaste = false;

                this.$message({
                    message: 'Display Pasted',
                    type: 'success'
                });

            }

        },
        checkPastableDisplay() {

            const display = window.localStorage.getItem('display');

            this.hasDisplayToPaste = (display !== null);

        }
    },
    created() {

        //  Run every 1 second
        this.setInterval = setInterval(() => {

            this.checkPastableDisplay();

        }, 1000);

    },
    beforeUnmount() {
        clearInterval(this.setInterval);
    }
}
</script>
