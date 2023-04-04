<template>

    <div>

        <!-- Target -->
        <TextOrCodeEditor v-model="form.event_data.target" label="Target" placeholder="{{ first_name }}" note="The variable to format" :error="form.errors.target" class="mb-6"></TextOrCodeEditor>

        <!-- Alternative Reference Name -->
        <VariableInput
            v-model="form.event_data.reference_name" label="Alternative Reference" placeholder="{{ first_name_capitalized }}"
            note="Alternative variable to capture formatted value (Optional)" :error="form.errors.reference_name"
            @onSetError="form.setError('reference_name', $event)"
            @onClearError="form.clearErrors('reference_name')"
            class="mb-6">
            <template #info>
                <span>
                    Provide an alternative variable name to capture the value after formatting.
                    If the alternative name is not provided, the target variable name will be
                    referenced to capture the formatted value.
                </span>
            </template>
        </VariableInput>

        <div class="flex items-center justify-between border-b border-dotted pb-4 mb-4">

            <!-- Title -->
            <h5 class="text-sm font-semibold tracking-tight text-gray-600">Formatting Rules</h5>

            <!-- Search Bar -->
            <DefaultSearchBar v-model="searchTerm" placeholder="Search formatting rules" />

            <!-- Add Formatting Rule Button & Modal -->
            <SelectFormattingRuleModal :form="form"></SelectFormattingRuleModal>

        </div>

        <!-- Formatting Rules -->
        <FormattingRules v-model="form.event_data.rules" :form="form" :searchTerm="searchTerm"></FormattingRules>

    </div>

</template>

<script>
    import FormattingRules from './FormattingRules'
    import VariableInput from "@components/Input/VariableInput";
    import DefaultSearchBar from '@components/SearchBar/DefaultSearchBar';
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';
    import SelectFormattingRuleModal from './SelectFormattingRule/SelectFormattingRuleModal';

    export default {
        props: ['form'],
        components: { FormattingRules, VariableInput, DefaultSearchBar, TextOrCodeEditor, SelectFormattingRuleModal },
        data(){
            return {
                searchTerm: ''
            }
        }
    }
</script>
