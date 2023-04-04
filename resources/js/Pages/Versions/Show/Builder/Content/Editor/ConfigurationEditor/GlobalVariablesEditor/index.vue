<template>

    <div>

        <!-- Search Bar -->
        <div class="grid grid-cols-12 mb-4 items-center">

            <div class="col-span-6">

                <DefaultSearchBar v-model="searchTerm" placeholder="Search" :totalResults="totalResults" />

            </div>

            <div class="col-span-6">

                <div class="flex items-center justify-end">

                    <!-- Delete Modal Button -->
                    <DeleteVariableModal :indexes="checkedIndexes" mode="multiple" @deleted="resetCheckboxes()"></DeleteVariableModal>

                    <!-- Create Modal Button -->
                    <CreateOrUpdateVariableModal mode="create"></CreateOrUpdateVariableModal>

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

                            <span class="flex items-center">

                                <!-- Header Name -->
                                <span>{{ header.name ? header.name : header }}</span>

                                <!-- Header Info -->
                                <InfoPopover v-if="header.info" :info="header.info" class="ml-2"></InfoPopover>

                            </span>

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
                    item-key="global-variables"
                    ghost-class="bg-yellow-100"
                    v-model="useVersionBuilder.builder.global_variables">

                    <template v-for="(element, index) in useVersionBuilder.builder.global_variables">
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

                            <!-- Type -->
                            <td scope="row" class="px-6 py-4 text-xs whitespace-nowrap font-normal text-gray-500">
                                <span>{{ element.type }}</span>
                            </td>

                            <!-- Value -->
                            <td scope="row" class="px-6 py-4 text-xs whitespace-nowrap font-normal text-gray-500">
                                <span v-if="element.type == 'null'">Null</span>
                                <span v-else-if="element.type == 'empty array'">[]</span>
                                <span v-else-if="element.type == 'integer'">{{ element.value.integer }}</span>
                                <span v-else-if="element.type == 'boolean'" class="capitalize">{{ element.value.boolean }}</span>
                                <TextEditor v-else-if="element.type == 'string'" v-model="element.value.string" :read_only="true"></TextEditor>
                                <HiddenCode v-else-if="element.type == 'code'" v-model="useVersionBuilder.builder.global_variables[index].value.code"></HiddenCode>
                            </td>

                            <!-- Is Global -->
                            <td scope="row" class="px-6 py-4 text-xs whitespace-nowrap font-normal text-gray-500">
                                <svg v-if="element.is_global" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </td>

                            <!-- Is Contant -->
                            <td scope="row" class="px-6 py-4 text-xs whitespace-nowrap font-normal text-gray-500">
                                <svg v-if="element.is_constant" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </td>

                            <td scope="row">
                                <div class="flex justify-end">
                                    <div class="w-24 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-end mr-4">

                                        <!-- Update Modal Button -->
                                        <CreateOrUpdateVariableModal :variable="element" :index="index" mode="update"></CreateOrUpdateVariableModal>

                                        <!-- Clone Modal Button -->
                                        <CreateOrUpdateVariableModal :variable="element" mode="clone"></CreateOrUpdateVariableModal>

                                        <!-- Delete Modal Button -->
                                        <DeleteVariableModal :variable="element" :index="index" mode="single"></DeleteVariableModal>

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
            <div v-if="hasResults == false" class="flex items-center justify-center bg-gray-50 p-8">
                <span class="text-gray-500 text-xs">No Results</span>
            </div>
        </div>

    </div>

</template>

<script>

    import { VueDraggableNext } from 'vue-draggable-next';
    import InfoPopover from '@components/Popover/InfoPopover';
    import TextEditor from "@components/TextEditor/TextEditor";
    import HiddenCode from "@components/CodeEditor/HiddenCode";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DangerButton from "@components/Button/DangerButton.vue";
    import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";
    import DeleteVariableModal from "./DeleteVariable/DeleteVariableModal";
    import CreateOrUpdateVariableModal from './CreateOrUpdateVariable/CreateOrUpdateVariableModal';

    export default {
        components: { draggable: VueDraggableNext, InfoPopover, TextEditor, HiddenCode, DefaultSearchBar, CreateOrUpdateVariableModal, DangerButton, DeleteVariableModal },
        data(){
            return {
                headers: [
                    'Name',
                    'Type',
                    'Value',
                    {
                        name: 'Global',
                        info: 'Once the value is evaluated and set, it will be preserved for the next session'
                    },
                    {
                        name: 'Constant',
                        info: 'Once the value is evaluated and set, it cannot be modified or overridden during application runtime. This value can only be modified here as a global variable'
                    }
                ],
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
            'useVersionBuilder.builder.global_variables': {
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

                this.useVersionBuilder.builder.global_variables.map((global_variable, index) => {

                    //  Convert the serach term to lowercase
                    searchTerm = searchTerm.toLowerCase();

                    //  Check if we have the search term
                    const hasSearchTerm = searchTerm !== '';

                    //  Check if the global variable name matches the search term
                    const nameMatchesSearchTerm = global_variable.name.toLowerCase().includes(searchTerm);

                    //  Check if the global variable type matches the search term
                    const typeMatchesSearchTerm = global_variable.type.toLowerCase().includes(searchTerm);

                    //  Check if the global variable string matches the search term
                    const stringMatchesSearchTerm = global_variable.type == 'string' && (global_variable.value.string || '').toString().toLowerCase().includes(searchTerm);

                    //  Check if the global variable integer matches the search term
                    const integerMatchesSearchTerm = global_variable.type == 'integer' && (global_variable.value.integer || '').toString().toLowerCase().includes(searchTerm);

                    //  Check if the global variable boolean matches the search term
                    const booleanMatchesSearchTerm = global_variable.type == 'boolean' && global_variable.value.boolean.toString().toLowerCase().includes(searchTerm);

                    //  Check if the global variable code matches the search term
                    const codeMatchesSearchTerm = global_variable.type == 'code' && global_variable.value.code.toString().toLowerCase().includes(searchTerm);

                    //  Determine if we have a match from the possible matches above
                    const matchesSearchTerm = (nameMatchesSearchTerm || typeMatchesSearchTerm || stringMatchesSearchTerm || integerMatchesSearchTerm || booleanMatchesSearchTerm || codeMatchesSearchTerm);

                    //  If we do not have the search term or the search term has a matching result
                    if( hasSearchTerm == false || (hasSearchTerm == true && matchesSearchTerm == true) ) {

                        //  Indicate that this global variable must be shown within the search results
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
                    this.useVersionBuilder.builder.global_variables.forEach((global_variable, index) => this.checkedIndexes.push(index));

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
