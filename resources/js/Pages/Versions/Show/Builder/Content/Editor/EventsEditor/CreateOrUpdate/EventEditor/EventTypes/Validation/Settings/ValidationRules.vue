<template>

    <draggable
        :invertSwap="true"
        handle=".draggble-handle"
        ghost-class="bg-yellow-100"
        item-key="validation-rules"
        v-model="filteredRules">

        <!-- Formatting Rule -->
        <ValidationRule v-for="(element, index) in filteredRules" :key="element.id" :index="index" :rules="modelValue" :rule="element"></ValidationRule>

        <!-- No Formatting Rules Placeholder -->
        <NoValidationRules v-if="filteredRules.length == 0" :form="form"></NoValidationRules>

    </draggable>

</template>

<script>

    import { VueDraggableNext } from 'vue-draggable-next';
    import ValidationRule from "./ValidationRule";
    import NoValidationRules from './NoValidationRules';

    export default {
        props: ['modelValue', 'form', 'searchTerm'],
        components: { draggable: VueDraggableNext, ValidationRule, NoValidationRules },
        computed: {
            filteredRules: {
                get() {

                    return this.modelValue.filter((validationRule) => {

                        const matchesEventName = validationRule.name.toLowerCase().includes(this.searchTerm.toLowerCase());

                        return (this.searchTerm == '' || matchesEventName);

                    })

                },
                set(minifiedEvents) {

                    //  Allow re-ordering when the search term filtering input is empty
                    if( this.searchTerm == '' ) {

                        const rules = minifiedEvents;

                        this.$emit('update:modelValue', rules);

                    }else{

                        this.$message({
                            message: 'You cannot reorder rules while searching',
                            type: 'warning'
                        });

                    }
                }
            }
        }
    };

</script>
