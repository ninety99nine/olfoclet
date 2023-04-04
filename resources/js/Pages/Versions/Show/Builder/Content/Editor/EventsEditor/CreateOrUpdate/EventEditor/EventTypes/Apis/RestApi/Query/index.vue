<template>

    <div>

        <!-- Search Bar -->
        <div class="grid grid-cols-12 mb-4 items-center">

            <div class="col-span-6">

                <DefaultSearchBar v-model="searchTerm" placeholder="Search" :totalResults="totalResults" />

            </div>

            <div class="col-span-6">

                <div class="flex items-center justify-end">

                    <Transition name="fade" mode="out-in">

                        <div :key="checkedIndexes.length">

                            <DeleteQueryModal v-if="checkedIndexes.length > 0" :queries="form.event_data.query_params" :indexes="checkedIndexes" mode="multiple" @deleted="resetCheckboxes()"></DeleteQueryModal>

                            <CreateOrUpdateQueryModal v-else :queries="form.event_data.query_params" mode="create"></CreateOrUpdateQueryModal>

                        </div>

                    </Transition>

                </div>

            </div>

        </div>

        <!-- Table -->
        <div class="relative overflow-x-auto shadow-md">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <!-- Table Header Checkbox -->
                        <th v-if="hasResults" scope="col" class="p-4">
                            <div class="flex items-center">
                                <input id="checkbox-all" type="checkbox" v-model="globalCheckboxChecked" @change="toggleMultipleCheckmarks($event)" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
                                <label for="checkbox-all" class="sr-only">checkbox</label>
                            </div>
                        </th>

                        <!-- Table Header Columns Names -->
                        <th v-for="(header, index) in headers" :key="index" scope="col" class="px-6 py-3">
                            <span>{{ header }}</span>
                        </th>

                        <!-- Table Header Edit Action -->
                        <th scope="col" class="px-6 py-3">
                            <span class="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>

                <!-- Table Draggable Rows -->
                <draggable
                    tag="tbody"
                    :invertSwap="true"
                    handle=".draggble-handle"
                    item-key="rest-api-queries"
                    ghost-class="bg-yellow-100"
                    v-model="form.event_data.query_params">
                    <template v-for="(element, index) in form.event_data.query_params">
                        <tr v-if="searchIndexes.includes(index)" :key="index" class="group border-b hover:bg-gray-50">

                            <!-- Table Body Checkbox -->
                            <td v-if="hasResults" class="w-4 p-4">
                                <div class="flex items-center">
                                    <input id="checkbox-table-1" type="checkbox" :checked="checkedIndexes.includes(index)" @change="toggleSingleCheckmark(index)" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
                                    <label for="checkbox-table-1" class="sr-only">checkbox</label>
                                </div>
                            </td>

                            <!-- Name -->
                            <td scope="row" class="px-6 py-4 text-xs whitespace-nowrap font-medium text-gray-900">
                                <span>{{ element.name }}</span>
                            </td>

                            <!-- Value -->
                            <td scope="row" class="px-6 py-4 text-xs whitespace-nowrap font-normal text-gray-500">

                                <!-- Code Editor Value -->
                                <HiddenCode v-if="element.value.code_editor_mode" v-model="element.value.code_editor_text"></HiddenCode>

                                <!-- String Value -->
                                <TextEditor v-else v-model="element.value.text" :read_only="true"></TextEditor>

                            </td>

                            <td scope="row">
                                <div class="flex justify-end">
                                    <div class="opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-end mr-4">

                                        <!-- Update Modal Button -->
                                        <CreateOrUpdateQueryModal :queries="form.event_data.query_params" :query="element" :index="index" mode="update"></CreateOrUpdateQueryModal>

                                        <!-- Clone Modal Button -->
                                        <CreateOrUpdateQueryModal :queries="form.event_data.query_params" :query="element" mode="clone"></CreateOrUpdateQueryModal>

                                        <!-- Delete Modal Button -->
                                        <DeleteQueryModal :queries="form.event_data.query_params" :query="element" :index="index" mode="single"></DeleteQueryModal>

                                        <!-- Move Icon -->
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 hover:text-blue-500 cursor-grab active:cursor-grabbing draggble-handle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>

                                    </div>
                                </div>
                            </td>

                        </tr>
                    </template>
                </draggable>
            </table>

            <div v-if="hasResults == false" class="flex items-center bg-gray-50 p-8">
                <span class="text-gray-500 text-xs">No Results</span>
            </div>

            <DefaultError :error="form.errors.query_params" class="p-2"></DefaultError>

        </div>

    </div>

</template>

<script>

    import { VueDraggableNext } from 'vue-draggable-next';
    import DefaultError from '@components/Error/DefaultError';
    import TextEditor from "@components/TextEditor/TextEditor";
    import HiddenCode from "@components/CodeEditor/HiddenCode";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DangerButton from "@components/Button/DangerButton.vue";
    import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";
    import DeleteQueryModal from "./DeleteQuery/DeleteQueryModal";
    import CreateOrUpdateQueryModal from './CreateOrUpdateQuery/CreateOrUpdateQueryModal';

    export default {
        props: ['form'],
        components: { draggable: VueDraggableNext, DefaultError, TextEditor, HiddenCode, DefaultSearchBar, CreateOrUpdateQueryModal, DangerButton, DeleteQueryModal },
        data(){
            return {
                headers: ['Name', 'Value'],
                useVersionBuilder: useVersionBuilder(),
                globalCheckboxChecked: false,
                checkedIndexes: [],
                searchIndexes: [],
                hasResults: true,
                totalResults: 0,
                searchTerm: ''
            }
        },
        watch: {
            'form.event_data.query_params': {
                handler: function (after, before) {

                    //  Start a search using the given search term
                    this.startSearch(this.searchTerm);

                },
                deep: true
            },
            searchTerm(newSearchTerm, oldSearchTerm) {

                //  Start a search using the given search term
                this.startSearch(newSearchTerm);
            },
        },
        methods: {
            startSearch(searchTerm) {

                //  Reset the search indexes
                this.searchIndexes = [];

                this.form.event_data.query_params.map((query, index) => {

                    //  Convert the serach term to lowercase
                    searchTerm = searchTerm.toLowerCase();

                    //  Check if we have the search term
                    const hasSearchTerm = searchTerm !== '';

                    //  Check if the query name matches the search term
                    const nameMatchesSearchTerm = query.name.toLowerCase().includes(searchTerm);

                    //  Check if the query text value matches the search term
                    const textValueMatchesSearchTerm = (query.value.code_editor_mode == false) && (query.value.text || '').toString().toLowerCase().includes(searchTerm);

                    //  Check if the query code value matches the search term
                    const codeValueMatchesSearchTerm = (query.value.code_editor_mode == true) && (query.value.code_editor_text || '').toString().toLowerCase().includes(searchTerm);

                    //  Determine if we have a match from the possible matches above
                    const matchesSearchTerm = (nameMatchesSearchTerm || textValueMatchesSearchTerm || codeValueMatchesSearchTerm);

                    //  If we do not have the search term or the search term has a matching result
                    if( hasSearchTerm == false || (hasSearchTerm == true && matchesSearchTerm == true) ) {

                        //  Indicate that this query must be shown within the search results
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
            toggleMultipleCheckmarks(event){

                //  Uncheck the checked checkboxes
                this.checkedIndexes = [];

                if( event.target.checked ) {

                    //  Check all the checkboxes
                    this.form.event_data.query_params.forEach((query, index) => this.checkedIndexes.push(index));

                }
            },
            resetCheckboxes() {
                this.checkedIndexes = [];
                this.globalCheckboxChecked = false;
            }
        },
        created() {

            //  Start a search using the given search term (which is an empty search term)
            this.startSearch(this.searchTerm);

        }
    };

</script>
