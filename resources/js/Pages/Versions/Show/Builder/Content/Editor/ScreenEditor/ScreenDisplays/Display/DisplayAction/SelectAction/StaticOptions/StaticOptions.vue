<template>

    <draggable
        :invertSwap="true"
        item-key="static-options"
        handle=".draggble-handle"
        ghost-class="bg-yellow-100"
        v-model="filteredStaticOptions">

        <!-- Static Option -->
        <StaticOption v-for="(element, index) in filteredStaticOptions" :index="index" :key="element.id" :staticOptions="modelValue" :staticOption="element"></StaticOption>

        <!-- No Static Options Placeholder -->
        <NoStaticOptions v-if="filteredStaticOptions.length == 0" :staticOptions="modelValue"></NoStaticOptions>

    </draggable>

</template>

<script>
    import { VueDraggableNext } from 'vue-draggable-next';
    import StaticOption from "./StaticOption";
    import NoStaticOptions from './NoStaticOptions';

    export default {
        props: ['modelValue', 'searchTerm'],
        components: { draggable: VueDraggableNext, NoStaticOptions, StaticOption },
        data() {
            return {}
        },
        computed: {
            filteredStaticOptions: {
                get() {

                    return this.modelValue.filter((staticOption) => {

                        //  Check if the static option name text value matches the search term
                        const nameTextValueMatchesSearchTerm = (staticOption.name.code_editor_mode == false) && (staticOption.name.text || '').toString().toLowerCase().includes(this.searchTerm);

                        //  Check if the static option name code value matches the search term
                        const nameCodeValueMatchesSearchTerm = (staticOption.name.code_editor_mode == true) && (staticOption.name.code_editor_text || '').toString().toLowerCase().includes(this.searchTerm);

                        //  Check if the static option value text value matches the search term
                        const valueTextValueMatchesSearchTerm = (staticOption.value.code_editor_mode == false) && (staticOption.value.text || '').toString().toLowerCase().includes(this.searchTerm);

                        //  Check if the static option value code value matches the search term
                        const valueCodeValueMatchesSearchTerm = (staticOption.value.code_editor_mode == true) && (staticOption.value.code_editor_text || '').toString().toLowerCase().includes(this.searchTerm);

                        return (this.searchTerm == '' || nameTextValueMatchesSearchTerm || nameCodeValueMatchesSearchTerm || valueTextValueMatchesSearchTerm || valueCodeValueMatchesSearchTerm);

                    })

                },
                set(staticOptions) {

                    //  Allow re-ordering when the options filtering input is empty
                    if( this.searchTerm == '' ) {

                        this.$emit('update:modelValue', staticOptions);

                    }else{

                        this.$message({
                            message: 'You cannot reorder options while searching',
                            type: 'warning'
                        });

                    }
                }
            }
        }
    };

</script>
