<template>

    <draggable
        :invertSwap="true"
        item-key="markers"
        handle=".draggble-handle"
        ghost-class="bg-yellow-100"
        v-model="filteredMarkers">

        <!-- Marker Menu -->
        <Marker v-for="(element, index) in filteredMarkers" :index="index" :key="element.id" :marker="element" :markers="modelValue"></Marker>

        <!-- No Markers Placeholder -->
        <NoMarkers v-if="filteredMarkers.length == 0" :markers="modelValue"></NoMarkers>

    </draggable>

</template>

<script>
    import Marker from "./Marker";
    import NoMarkers from './NoMarkers';
    import { VueDraggableNext } from 'vue-draggable-next';

    export default {
        props: ['modelValue', 'searchTerm'],
        components: { draggable: VueDraggableNext, NoMarkers, Marker },
        data() {
            return {}
        },
        computed: {
            filteredMarkers: {
                get() {

                    return this.modelValue.filter((marker) => {

                        //  Check if the marker matches the search term
                        const matchesSearchTerm = marker.toLowerCase().includes(this.searchTerm);

                        return (this.searchTerm == '' || matchesSearchTerm);

                    })

                },
                set(markers) {

                    //  Allow re-ordering when the markers filtering input is empty
                    if( this.searchTerm == '' ) {

                        this.$emit('update:modelValue', markers);

                    }else{

                        this.$message({
                            message: 'You cannot reorder markers while searching',
                            type: 'warning'
                        });

                    }
                }
            }
        }
    };

</script>
