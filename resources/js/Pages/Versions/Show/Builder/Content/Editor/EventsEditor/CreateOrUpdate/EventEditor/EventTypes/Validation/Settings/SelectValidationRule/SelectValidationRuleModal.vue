<template>

    <!-- Modal -->
    <DefaultModal
        width="w-1/2"
        @open="reset()"
        defaultText="Cancel"
        :primaryAction="addSelectedValidationRules"
        :primaryText="'Add '+ totalCheckmarkSelected + (totalCheckmarkSelected == 1 ? ' Rule' : ' Rules')">

        <!-- Modal Title -->
        <template #title>Add Validation Rules</template>

        <!-- Search Bar -->
        <DefaultSearchBar v-model="searchTerm" placeholder="Search" :totalResults="totalResults" class="mb-4" />

        <!-- Explainer -->
        <PrimaryAlert class="mb-4">
            <span class="text-justify">
                Click to select one or many validation rules
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

                            <!-- Error Message -->
                            <td scope="row" class="px-6 py-4 text-xs text-gray-500">
                                <span>{{ rule.error_msg }}</span>
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
                <span v-if="showButtonText" class="ml-2">Create Validation Rule</span>
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
                headers: ['Validation', 'Fail Message'],
                checkedIndexes: [],
                searchIndexes: [],
                availableRules: [
                    {
                        name: 'Only Letters',
                        type: 'only_letters',
                        error_msg: 'Please enter letters only (spaces allowed)',
                        comment: 'Makes sure that the target value only contains letters and nothing else e.g "abc", "ABC" and "A B C". White spaces are also allowed.'
                    },
                    {
                        name: 'Only Numbers',
                        type: 'only_numbers',
                        error_msg: 'Please enter numbers only (spaces allowed)',
                        comment: 'Makes sure that the target value only contains numbers and nothing else e.g "123" and "1 2 3". White spaces are also allowed.'
                    },
                    {
                        name: 'Only Letters And Numbers',
                        type: 'only_letters_and_numbers',
                        error_msg: 'Please enter letters and numbers only (spaces allowed)',
                        comment: 'Makes sure that the target value only contains letters and numbers and nothing else e.g "abc123", "ABC123" and "A B C 1 2 3". White spaces are also allowed.'
                    },
                    {
                        value: '3',
                        name: 'Minimum Character Length',
                        type: 'minimum_characters',
                        error_msg: 'Please enter 3 or more characters',
                        comment: 'Makes sure that the target value contains atleast the specified number of characters e.g "3" means atleast 3 characters must be provided. This means "abc" is valid while "a" and "ab" are not valid. Remember that we also count whitespaces e.g "a b" is also 3 characters.'
                    },
                    {
                        value: '3',
                        name: 'Maximum Character Length',
                        type: 'maximum_characters',
                        error_msg: 'Please enter no more than 3 characters',
                        comment: 'Makes sure that the target value contains no more than the specified number of characters e.g "3" means no more than 3 characters must be provided. This means "a", "ab" and "abc" are valid while "abcd" is not valid. Remember that we also count whitespaces e.g "a b" is also 3 characters.'
                    },
                    {
                        value: '3',
                        name: 'Equal To Character Length',
                        type: 'equal_to_characters',
                        error_msg: 'Please enter exactly 3 characters',
                        comment: 'Makes sure that the target value contains the exact specified number of characters e.g "3" exactly 3 characters must be provided. This means "a", "ab" and "abcd" are valid while "abc" is valid. Remember that we also count whitespaces e.g "a b" is also 3 characters.'
                    },
                    {
                        value: '3',
                        name: 'Equal To (=)',
                        type: 'equal_to',
                        error_msg: 'Please enter the character 3',
                        comment: 'Makes sure that the target value is an exact matching character e.g "3" means that the value provided must be exactly "3".'
                    },
                    {
                        value: '3',
                        name: 'Not Equal To',
                        type: 'not_equal_to',
                        error_msg: 'Please enter any character except 3',
                        comment: 'Makes sure that the target value is not an exact matching character e.g "3" means that the value provided must not be "3".'
                    },
                    {
                        value: '3',
                        name: 'Less Than (<)',
                        type: 'less_than',
                        error_msg: 'Please enter numbers less than 3',
                        comment: 'Makes sure that the target value is less than the given number e.g "3" means that the value provided must be strictly less than "3".'
                    },
                    {
                        value: '3',
                        name: 'Less Than Or Equal (<=)',
                        type: 'less_than_or_equal',
                        error_msg: 'Please enter numbers less than or equal to 3',
                        comment: 'Makes sure that the target value is less than or equal to the given number e.g "3" means that the value provided must be less than or equal to "3".'
                    },
                    {
                        value: '3',
                        name: 'Greater Than (>)',
                        type: 'greater_than',
                        error_msg: 'Please enter numbers greater than 3',
                        comment: 'Makes sure that the target value is greater than the given number e.g "3" means that the value provided must be strictly greater than "3".'
                    },
                    {
                        value: '3',
                        name: 'Greater Than Or Equal (>=)',
                        type: 'greater_than_or_equal',
                        error_msg: 'Please enter numbers greater than or equal to 3',
                        comment: 'Makes sure that the target value is greater than or equal to the given number e.g "3" means that the value provided must be greater than or equal to "3".'
                    },
                    {
                        value: '1',
                        value_2: '10',
                        name: 'In Between (Including Inputs)',
                        type: 'in_between_including',
                        error_msg: 'Please enter numbers between 1 and 10 (including 1 and 10)',
                        comment: 'Makes sure that the target value is a number that is in-between or equal to any of the given minimum and maximum values e.g min="3" and max="5" means that the value provided must "3", "4" or "5" to be valid.'
                    },
                    {
                        value: '1',
                        value_2: '10',
                        name: 'In Between (Excluding Inputs)',
                        type: 'in_between_excluding',
                        error_msg: 'Please enter numbers between 1 and 10 (excluding 1 and 10)',
                        comment: 'Makes sure that the target value is a number that is in-between and not equal to any of the given minimum and maximum values e.g min="3" and max="5" means that the value provided must only be "4" to be valid.'
                    },
                    {
                        name: 'Validate Email',
                        type: 'validate_email',
                        error_msg: 'Please provide a valid email address e.g example@gmail.com',
                        comment: 'Makes sure that the target value contains a valid email address e.g "joe@gmail.com" or "sarah@example.com".'
                    },
                    {
                        name: 'Validate Mobile Number',
                        type: 'validate_mobile_number',
                        error_msg: 'Please provide a valid Botswana phone number e.g "71234567"',
                        comment: 'Makes sure that the target value contains a valid phone number e.g "71234567".'
                    },
                    {
                        name: 'Validate Money',
                        type: 'validate_money',
                        error_msg: 'Please provide a valid money format e.g "35", "35.5" or "35.50"',
                        comment: 'Makes sure that the target value contains a valid money format e.g "35", "35.5" or "35.50" are valid while "P35", "3,500", "35 .5" and "35. 5" are invalid'
                    },
                    {
                        name: 'Validate Date Format (DD/MM/YYYY)',
                        type: 'valiate_date_format',
                        error_msg: 'Please enter a valid date (DD/MM/YYYY) e.g 02/08/2020',
                        comment: 'Makes sure that the target value contains a valid date format (DD/MM/YYYY) e.g e.g 02/08/2020. This also works for other similar date formats e.g 2/8/2020 or 2/08/2020 or 02/8/2020. The date must be correct therefore 02/13/2020 is invalid since there is no 13th month.'
                    },
                    {
                        name: 'Validate Date Format (DD-MM-YYYY)',
                        type: 'valiate_date_using_hyphen_format',
                        error_msg: 'Please enter a valid date (DD-MM-YYYY) e.g 02-08-2020',
                        comment: 'Makes sure that the target value contains a valid date format (DD-MM-YYYY) e.g e.g 02-08-2020. This also works for other similar date formats e.g 2-8-2020 or 2-08-2020 or 02-8-2020. The date must be correct therefore 02-13-2020 is invalid since there is no 13th month.'
                    },
                    {
                        name: 'No Spaces',
                        type: 'no_spaces',
                        error_msg: 'Do not use spaces',
                        comment: 'Makes sure that the target value does not contain any white spaces e.g "abc123" is valid while "abc 123" is not valid since we have white space.'
                    },
                    {
                        rule: {
                            text: '/^[a-zA-Z0-9]+$/',
                            code_editor_text: '',
                            code_editor_mode: false
                        },
                        name: 'Custom Regex',
                        type: 'custom_regex',
                        error_msg: 'Custom regex validation error',
                        comment: 'Makes sure that the target value matches the given Regex Expression e.g if the given pattern is "/[a-zA-Z0-9]+/" then this will only be valid for letters and numbers only.'
                    },
                    {
                        value: '<?php return true; ?>',
                        name: 'Custom Code',
                        type: 'custom_code',
                        error_msg: 'Custom code validation error',
                        comment: 'Validate based on customized code e.g return True if valid and False if invalid.'
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

                    //  Check if the rule error message matches the search term
                    const errorMessageMatchesSearchTerm = rule.error_msg.toLowerCase().includes(searchTerm);

                    //  Determine if we have a match from the possible matches above
                    const matchesSearchTerm = (nameMatchesSearchTerm || errorMessageMatchesSearchTerm);

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
            addSelectedValidationRules(closeModal) {

                const selectedRules = _.cloneDeep(this.availableRules.filter((rule, index) => {

                    return this.checkmarkSelected(rule, index);

                }));

                this.useVersionBuilder.addSelectedValidationRules(this.form.event_data.rules, selectedRules);

                this.$message({
                    message: 'Validation rules added',
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
