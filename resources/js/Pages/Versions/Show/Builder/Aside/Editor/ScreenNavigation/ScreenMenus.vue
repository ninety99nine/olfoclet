<template>

    <div class="h-48 overflow-y-auto border bg-gray-50 rounded-md p-2 resize-y">

        <draggable
            tag="ul"
            :invertSwap="true"
            item-key="screen-menus"
            handle=".draggble-handle"
            ghost-class="bg-yellow-100"
            v-model="filteredScreens">

            <!-- Screen Menu -->
            <ScreenMenu v-for="(element, index) in filteredScreens" :index="index" :key="element.id" :screen="element" class="draggble-screen"></ScreenMenu>

            <!-- No Screens Placeholder -->
            <svg v-if="filteredScreens.length === 0" xmlns="http://www.w3.org/2000/svg" class="h-40 w-40 text-blue-100 m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>

        </draggable>

    </div>

</template>

<script>

    import ScreenMenu from "./ScreenMenu";
    import { VueDraggableNext } from 'vue-draggable-next';
    import { useVersionBuilder } from '@stores/VersionBuilder';

    export default {
        components: {
            draggable: VueDraggableNext,
            ScreenMenu
        },
        data() {
            return {
                useVersionBuilder: useVersionBuilder(),
            }
        },
        computed: {
            filteredScreens: {
                /**
                 *  For performance reasons we want to drag and drop on limited screen
                 *  information such as the screen id, name, e.t.c Dragging & dropping
                 *  the screen as is makes the web-app slow since we are not moving
                 *  just the screen, but the nested displays, events, and more,
                 *  which is a very heavy process. We can improve the drag and
                 *  drop experience by limiting the information we return per
                 *  filtered screen. However once we drag and drop, the same
                 *  minified screens are returned in the new order, but we
                 *  must order the non-minified versions of these screens.
                 *  This is why the setter method is used to handle this
                 *  before updating the new order of the screens.
                 */
                get() {
                    return this.useVersionBuilder.filteredScreens.map((screen) => {

                        //  Limit the screen information for performance reasons
                        return {
                            id: screen.id,
                            name: screen.name,
                            first_display_screen: screen.first_display_screen,
                            repeat: {
                                active: {
                                    selected_type: screen.repeat.active.selected_type
                                }
                            }
                        }

                    });
                },
                set(minifiedScreens) {

                    //  Allow re-ordering when the screen filtering input is empty
                    if( this.useVersionBuilder.filterScreenSearch == '' ) {

                        this.useVersionBuilder.builder.screens = minifiedScreens.map((minifiedScreen) => {
                            return this.useVersionBuilder.builder.screens.find(screen => screen.id === minifiedScreen.id);
                        });

                    }else{

                        this.$message({
                            message: 'You cannot reorder screens while searching',
                            type: 'warning'
                        });

                    }
                }
            }
        }
    };

</script>
