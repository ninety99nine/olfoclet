<template>

    <div class="p-4 rounded-lg bg-gray-50 shadow-md border">

        <div class="flex items-center justify-between border-b border-dotted pb-4 mb-4">

            <!-- Static Option Search Bar -->
            <DefaultSearchBar v-model="searchTerm" placeholder="Search static options" />

            <!-- Add Static Option Button & Modal -->
            <CreateOrUpdateStaticOptionModal :staticOptions="staticOptions" mode="create"></CreateOrUpdateStaticOptionModal>

        </div>

        <!-- Static Options -->
        <StaticOptions v-model="staticOptions" :searchTerm="searchTerm" class="mb-6"></StaticOptions>

        <!-- Reference Variable -->
        <VariableInput v-model="display.content.action.select_option.static_options.reference_name" label="Reference Variable" note="Selected option reference variable" class="mb-6"></VariableInput>

        <!-- No Options Message -->
        <TextOrCodeEditor v-model="display.content.action.select_option.static_options.no_results_message" label="No Options Message" placeholder="No options found" :showCode="false" class="mb-6"></TextOrCodeEditor>

        <!-- Incorrect Option Message -->
        <TextOrCodeEditor v-model="display.content.action.select_option.static_options.incorrect_option_selected_message" label="Incorrect Option Message" placeholder="Incorrect option selected" :showCode="false"></TextOrCodeEditor>

    </div>

</template>

<script>

import StaticOptions from "./StaticOptions";
import VariableInput from '@components/Input/VariableInput';
import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";
import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';
import CreateOrUpdateStaticOptionModal from './CreateOrUpdate/CreateOrUpdateStaticOptionModal';

export default {
    props: ['display'],
    components: { StaticOptions, VariableInput, DefaultSearchBar, TextOrCodeEditor, CreateOrUpdateStaticOptionModal },
    data() {
        return {
            searchTerm: ''
        }
    },
    computed: {
        staticOptions: {
            get() {
                return this.display.content.action.select_option.static_options.options;
            },
            set(staticOptions) {
                return this.display.content.action.select_option.static_options.options = staticOptions;
            }
        }
    }
}
</script>
