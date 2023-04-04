<template>

    <div>

        <!-- Target -->
        <TextOrCodeEditor v-model="form.event_data.target" label="Target" placeholder="{{ quantity }}" note="The variable to validate" :error="form.errors.target" class="mb-6"></TextOrCodeEditor>

        <div class="flex items-center justify-between border-b border-dotted pb-4 mb-4">

            <!-- Title -->
            <h5 class="text-sm font-semibold tracking-tight text-gray-600">Validation Rules</h5>

            <!-- Search Bar -->
            <DefaultSearchBar v-model="searchTerm" placeholder="Search validation rules" />

            <!-- Add Validation Rule Button & Modal -->
            <SelectValidationRuleModal :form="form"></SelectValidationRuleModal>

        </div>

        <!-- Validation Rules -->
        <ValidationRules v-model="form.event_data.rules" :form="form" :searchTerm="searchTerm"></ValidationRules>

    </div>

</template>

<script>
    import ValidationRules from './ValidationRules'
    import DefaultSearchBar from '@components/SearchBar/DefaultSearchBar';
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';
    import SelectValidationRuleModal from './SelectValidationRule/SelectValidationRuleModal';

    export default {
        props: ['form'],
        components: { ValidationRules, DefaultSearchBar, TextOrCodeEditor, SelectValidationRuleModal },
        data(){
            return {
                searchTerm: ''
            }
        }
    }
</script>
