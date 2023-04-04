<template>

    <draggable
        :invertSwap="true"
        handle=".draggble-handle"
        item-key="navigation-menus"
        ghost-class="bg-yellow-100"
        v-model="filteredNavigations">

        <!-- Static Option -->
        <NavigationMenu v-for="(element, index) in filteredNavigations" :index="index" :key="element.id" :navigations="modelValue" :navigation="element"></NavigationMenu>

        <!-- No Static Options Placeholder -->
        <NoNavigations v-if="filteredNavigations.length == 0" :navigations="modelValue"></NoNavigations>

    </draggable>

</template>

<script>
    import { VueDraggableNext } from 'vue-draggable-next';
    import NoNavigations from './NoNavigations';
    import NavigationMenu from "./NavigationMenu";
    import { useVersionBuilder } from '@stores/VersionBuilder';

    export default {
        props: ['modelValue', 'searchTerm'],
        components: { draggable: VueDraggableNext, NoNavigations, NavigationMenu },
        data() {
            return {
                useVersionBuilder: useVersionBuilder(),
            }
        },
        computed: {
            filteredNavigations: {
                get() {

                    return this.modelValue.filter((navigation) => {

                        const matchesNavigationName = navigation.name.toLowerCase().includes(this.searchTerm.toLowerCase());

                        return (this.searchTerm == '' || matchesNavigationName);

                    })

                },
                set(navigations) {

                    //  Allow re-ordering when the navigation filtering input is empty
                    if( this.searchTerm == '' ) {

                        //  this.$emit('update', navigations);
                        this.$emit('update:modelValue', navigations);

                    }else{

                        this.$message({
                            message: 'You cannot reorder navigations while searching',
                            type: 'warning'
                        });

                    }
                }
            }
        }
    };

</script>
