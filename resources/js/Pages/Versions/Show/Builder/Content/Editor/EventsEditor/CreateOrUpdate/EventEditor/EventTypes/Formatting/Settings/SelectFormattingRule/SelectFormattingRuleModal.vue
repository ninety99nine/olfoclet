<template>

    <!-- Modal -->
    <DefaultModal
        width="w-1/2"
        @open="reset()"
        defaultText="Cancel"
        :primaryAction="addSelectedFormattingRules"
        :primaryText="'Add '+ totalCheckmarkSelected + (totalCheckmarkSelected == 1 ? ' Rule' : ' Rules')">

        <!-- Modal Title -->
        <template #title>Add Formatting Rules</template>

        <!-- Search Bar -->
        <DefaultSearchBar v-model="searchTerm" placeholder="Search" :totalResults="totalResults" class="mb-4" />

        <!-- Explainer -->
        <PrimaryAlert class="mb-4">
            <span class="text-justify">
                Click to select one or many formatting rules
            </span>
        </PrimaryAlert>

        <!-- Table -->
        <div class="shadow-md">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <!-- Table Header Columns Names -->
                        <th v-for="(header, index) in headers" :key="index" scope="col" class="px-6 py-3">
                            <span>{{ header }}</span>
                        </th>

                        <!-- Table Header Action -->
                        <th scope="col" class="px-6 py-3">
                            <span class="sr-only">Action</span>
                        </th>
                    </tr>
                </thead>

                <!-- Table Body -->
                <tbody>
                    <template v-for="(rule, index) in availableRules" :key="index">

                        <!-- Table Rows -->
                        <tr v-if="searchIndexes.includes(index)" class="'group border-b cursor-pointer hover:bg-gray-50" @click="toggleSingleCheckmark(index)">

                            <!-- Name -->
                            <td scope="row" class="px-6 py-4 text-xs font-medium text-gray-900">
                                <span>{{ rule.name }}</span>
                            </td>

                            <!-- Comment -->
                            <td scope="row" class="px-6 py-4 text-xs text-gray-500">
                                <span>{{ rule.comment }}</span>
                            </td>

                            <!-- Selected Indicator -->
                            <td class="p-4">
                                <div class="flex items-center justify-center">

                                    <svg v-if="checkmarkSelected(rule, index)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>

                                </div>
                            </td>

                        </tr>

                    </template>
                </tbody>
            </table>

            <div v-if="hasResults == false" class="flex items-center bg-gray-50 p-8">
                <span class="text-gray-500 text-xs">No Results</span>
            </div>

        </div>

        <!-- Modal Trigger -->
        <template #trigger>

            <PrimaryButton class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <span v-if="showButtonText" class="ml-2">Create Formatting Rule</span>
            </PrimaryButton>

        </template>

    </DefaultModal>

</template>

<script>

    import _, { cloneDeep } from 'lodash';
    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import PrimaryButton from "@components/Button/PrimaryButton";
    import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";

    export default {
        props: {
            form: Object,
            showButtonText: {
                type: Boolean,
                default: false
            }
        },
        components: { PrimaryAlert, DefaultModal, PrimaryButton, DefaultSearchBar },
        data(){
            return {
                useVersionBuilder: useVersionBuilder(),
                headers: ['Rule', 'Description'],
                checkedIndexes: [],
                searchIndexes: [],
                availableRules: [
                    {
                        name: 'Capitalize',
                        type: 'capitalize',
                        comment: 'Capitalize the first letter of each word'
                    },
                    {
                        name: 'Uppercase',
                        type: 'uppercase',
                        comment: 'Set every character to uppercase'
                    },
                    {
                        name: 'Lowercase',
                        type: 'lowercase',
                        comment: 'Set every character to lowercase'
                    },
                    {
                        name: 'Trim',
                        type: 'trim',
                        comment: 'Remove whitespace at the start and end of the target value'
                    },
                    {
                        name: 'Trim (Left)',
                        type: 'trim_left',
                        comment: 'Remove whitespace at the start of the target value'
                    },
                    {
                        name: 'Trim (Right)',
                        type: 'trim_right',
                        comment: 'Remove whitespace at the end of the target value'
                    },
                    {
                        value: 'P',
                        name: 'Convert To Money',
                        type: 'convert_to_money',
                        comment: 'Convert a given number to represent money format e.g "25" into "P25.00"'
                    },
                    {
                        value: '10',
                        value_2: '...',
                        name: 'Limit',
                        type: 'limit',
                        comment: 'Limit the number of characters of the target value'
                    },
                    {
                        value: '5',
                        value_2: '10',
                        name: 'Substr',
                        type: 'substr',
                        comment: 'Returns the portion of the target value specified by the start and length parameters'
                    },
                    {
                        name: 'Remove Letters',
                        type: 'remove_letters',
                        comment: 'Remove numbers from the target value e.g "abc123def" into "123"'
                    },
                    {
                        name: 'Remove Numbers',
                        type: 'remove_numbers',
                        comment: 'Remove letters from the target value e.g "abc123def" into "abcdef"'
                    },
                    {
                        name: 'Remove Symbols',
                        type: 'remove_symbols',
                        comment: 'Remove symbols from the target value. It will remove everything except letters, numbers and spaces e.g "+26771234567" into "26771234567"'
                    },
                    {
                        name: 'Remove Spaces',
                        type: 'remove_spaces',
                        comment: 'Remove white spaces from the target value e.g "Remove spaces here" into "Removespaceshere"'
                    },
                    {
                        value: 'That',
                        value_2: 'This',
                        name: 'Replace With',
                        type: 'replace_with',
                        comment: 'Replace every occurence of a value with another value within the target value e.g replace "that" with "this" in the sentence "We love to play with that"'
                    },
                    {
                        value: 'That',
                        value_2: 'This',
                        name: 'Replace First With',
                        type: 'replace_first_with',
                        comment: 'Replace the first occurence of a value with another value within the target value e.g replace "that" with "this" in the sentence "We love to play with that"'
                    },
                    {
                        value: 'That',
                        value_2: 'This',
                        name: 'Replace Last With',
                        type: 'replace_last_with',
                        comment: 'Replace the last occurence of a value with another value within the target value e.g replace "that" with "this" in the sentence "We love to play with that"'
                    },
                    {
                        value: 'child',
                        name: 'Plural Or Singular',
                        type: 'plural_or_singular',
                        comment: 'Convert a string to its plural or singular form based on the target value e.g return "child" if the target value is "1" and "children" if the target value is greater than "1"'
                    },
                    {
                        value: '40',
                        name: 'Random String',
                        type: 'random_string',
                        comment: 'Generate a random string of the specified length e.g "40" will return a random 40 character string'
                    },
                    {
                        name: 'Set To Null',
                        type: 'set_to_null',
                        comment: 'Set the target value equal to Null'
                    },
                    {
                        name: 'Set To True',
                        type: 'set_to_true',
                        comment: 'Set the target value equal to True'
                    },
                    {
                        name: 'Set To False',
                        type: 'set_to_false',
                        comment: 'Set the target value equal to False'
                    },
                    {
                        name: 'Set To Empty String',
                        type: 'set_to_empty_string',
                        comment: 'Set the target value equal to Empty String'
                    },
                    {
                        name: 'Set To Empty Array',
                        type: 'set_to_empty_array',
                        comment: 'Set the target value equal to Empty Array'
                    },
                    {
                        value: '',
                        name: 'Custom Code',
                        type: 'custom_code',
                        comment: 'Formats the target value using customized code for increased flexibility'
                    }
                ],
                hasResults: true,
                totalResults: 0,
                searchTerm: ''
            }
        },
        watch: {
            searchTerm(newSearchTerm, oldSearchTerm) {

                //  Start a search using the given search term
                this.startSearch(newSearchTerm);

            },
        },
        computed: {
            totalCheckmarkSelected() {

                return this.availableRules.filter((rule, index) => {

                    return this.checkmarkSelected(rule, index);

                }).length;
            }
        },
        methods: {
            startSearch(searchTerm) {

                //  Reset the search indexes
                this.searchIndexes = [];

                this.availableRules.map((rule, index) => {

                    //  Convert the serach term to lowercase
                    searchTerm = searchTerm.toLowerCase();

                    //  Check if we have the search term
                    const hasSearchTerm = searchTerm !== '';

                    //  Check if the rule name matches the search term
                    const nameMatchesSearchTerm = rule.name.toLowerCase().includes(searchTerm);

                    //  Check if the rule comment matches the search term
                    const commentMatchesSearchTerm = rule.comment.toLowerCase().includes(searchTerm);

                    //  Determine if we have a match from the possible matches above
                    const matchesSearchTerm = (nameMatchesSearchTerm || commentMatchesSearchTerm);

                    //  If we do not have the search term or the search term has a matching result
                    if( hasSearchTerm == false || (hasSearchTerm == true && matchesSearchTerm == true) ) {

                        //  Indicate that this rule must be shown within the search results
                        this.searchIndexes.push(index);

                    }else{

                    }

                });

                this.totalResults = this.searchIndexes.length;
                this.hasResults = this.totalResults > 0;
            },
            toggleSingleCheckmark(index) {

                const removeAt = this.checkedIndexes.indexOf(index);

                //  If this index already exists
                if(removeAt >= 0 ) {

                    //  Remove the index (This will uncheck the checkbox)
                    this.checkedIndexes.splice(removeAt, 1).sort();

                }else{

                    //  Add the index (This will check the checkbox)
                    this.checkedIndexes.push(index)
                    this.checkedIndexes.sort();

                }
            },
            checkmarkSelected(rule, index) {
                return this.checkedIndexes.includes(index) || this.form.event_data.rules.map((rule) => rule.type).includes(rule.type);
            },
            addSelectedFormattingRules(closeModal) {

                const selectedRules = _.cloneDeep(this.availableRules.filter((rule, index) => {

                    return this.checkmarkSelected(rule, index);

                }));

                this.useVersionBuilder.addSelectedFormattingRules(this.form.event_data.rules, selectedRules);

                this.$message({
                    message: 'Formatting rules added',
                    type: 'success'
                });

                closeModal();

            },
            reset() {
                this.searchTerm = '';
                this.checkedIndexes = [];
                this.startSearch(this.searchTerm);
            }
        }
    };

</script>
