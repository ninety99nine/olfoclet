<template>

    <draggable
        :invertSwap="true"
        item-key="display-menus"
        handle=".draggble-handle"
        ghost-class="bg-yellow-100"
        v-model="filteredScreenDisplays">

        <!-- Display Menu -->
        <DisplayMenu v-for="(element, index) in filteredScreenDisplays" :index="index" :key="element.id" :display="element" class="draggble-display"></DisplayMenu>

        <!-- No Displays Placeholder -->
        <NoDisplays v-if="filteredScreenDisplays.length == 0"></NoDisplays>

    </draggable>

</template>

<script>

    import NoDisplays from './NoDisplays';
    import DisplayMenu from "./DisplayMenu";
    import { VueDraggableNext } from 'vue-draggable-next';
    import { useVersionBuilder } from '@stores/VersionBuilder';

    export default {
        components: { draggable: VueDraggableNext, NoDisplays, DisplayMenu },
        data() {
            return {
                useVersionBuilder: useVersionBuilder(),
            }
        },
        computed: {
            filteredScreenDisplays: {
                get() {
                    return this.useVersionBuilder.filteredScreenDisplays;
                },
                set(displays) {

                    //  Allow re-ordering when the display filtering input is empty
                    if( this.useVersionBuilder.filterDisplaySearch == '' ) {

                        this.useVersionBuilder.selectedScreen.displays = displays;

                    }else{

                        this.$message({
                            message: 'You cannot reorder displays while searching',
                            type: 'warning'
                        });

                    }
                }
            }
        }
    };

</script>
