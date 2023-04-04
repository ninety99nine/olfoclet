<template>

    <draggable
        group="events"
        :invertSwap="true"
        item-key="event-menus"
        handle=".draggble-handle"
        ghost-class="bg-yellow-100"
        v-model="filteredEvents">

        <!-- Event Menu -->
        <EventMenu v-for="(element, index) in filteredEvents" :index="index" :key="element.id" :event="element" :events="modelValue"></EventMenu>

        <!-- No Events Placeholder -->
        <NoEvents v-if="filteredEvents.length == 0" :events="modelValue"></NoEvents>

    </draggable>

</template>

<script>
    import NoEvents from './NoEvents';
    import EventMenu from "./EventMenu";
    import { VueDraggableNext } from 'vue-draggable-next';
    import { useVersionBuilder } from '@stores/VersionBuilder';

    export default {
        props: ['modelValue', 'searchTerm'],
        components: { draggable: VueDraggableNext, NoEvents, EventMenu },
        data() {
            return {
                useVersionBuilder: useVersionBuilder(),
            }
        },
        computed: {
            filteredEvents: {
                get() {

                    return this.modelValue.filter((event) => {

                        const matchesEventId = event.id.toLowerCase().includes(this.searchTerm.toLowerCase());
                        const matchesEventName = event.name.toLowerCase().includes(this.searchTerm.toLowerCase());
                        const matchesEventType = event.type.toLowerCase().includes(this.searchTerm.toLowerCase());

                        return (this.searchTerm == '' || matchesEventId || matchesEventName || matchesEventType);

                    })

                },
                set(events) {

                    //  Allow re-ordering when the event filtering input is empty
                    if( this.searchTerm == '' ) {

                        this.$emit('update:modelValue', events);

                    }else{

                        this.$message({
                            message: 'You cannot reorder events while searching',
                            type: 'warning'
                        });

                    }
                }
            }
        }
    };

</script>
