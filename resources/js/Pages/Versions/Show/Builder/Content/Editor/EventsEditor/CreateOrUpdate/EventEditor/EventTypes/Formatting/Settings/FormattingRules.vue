<template>

    <draggable
        :invertSwap="true"
        handle=".draggble-handle"
        ghost-class="bg-yellow-100"
        item-key="formatting-rules"
        v-model="filteredRules">

        <!-- Formatting Rule -->
        <FormattingRule v-for="(element, index) in filteredRules" :key="element.id" :index="index" :rules="modelValue" :rule="element"></FormattingRule>

        <!-- No Formatting Rules Placeholder -->
        <NoFormattingRules v-if="filteredRules.length == 0" :form="form"></NoFormattingRules>

    </draggable>

</template>

<script>

    import { VueDraggableNext } from 'vue-draggable-next';
    import FormattingRule from "./FormattingRule";
    import NoFormattingRules from './NoFormattingRules';

    export default {
        props: ['modelValue', 'form', 'searchTerm'],
        components: { draggable: VueDraggableNext, FormattingRule, NoFormattingRules },
        computed: {
            filteredRules: {
                get() {

                    return this.modelValue.filter((formattingRule) => {

                        const matchesEventName = formattingRule.name.toLowerCase().includes(this.searchTerm.toLowerCase());

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
