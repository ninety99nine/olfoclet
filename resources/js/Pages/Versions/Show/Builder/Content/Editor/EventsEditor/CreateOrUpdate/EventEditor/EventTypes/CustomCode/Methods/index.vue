<template>

    <div>

        <!-- Search Bar -->
        <DefaultSearchBar v-model="searchTerm" placeholder="Search" :totalResults="totalResults" class="mb-4" />

        <!-- Explainer -->
        <PrimaryAlert class="mb-4">
            <span class="text-justify">
                Review methods available to the Code Editor
            </span>
        </PrimaryAlert>

        <div>

            <!-- Methods -->
            <template v-for="(method, index) in availableMethods" :key="index">
                <div v-if="searchIndexes.includes(index)" @click.stop="copyToClipboard(index)"
                    class="group bg-gray-50 hover:bg-gray-100 hover:shadow-md border border-white hover:border-gray-300 shadow-sm p-4 mb-2 rounded-md cursor-pointer relative">

                    <!-- Copy To Clipboard -->
                    <CopyToClipboard :ref="'clipboard-'+index" :value="method.code" message="Method Copied" class="absolute right-2"></CopyToClipboard>

                    <!-- Name -->
                    <div class="inline-flex items-center mb-2">
                        <div class="flex font-bold items-center bg-gray-200 text-gray-900 text-xs rounded-full mr-2 py-1 px-2">{{ index + 1 }}</div>
                        <h1 class="text-sm font-semibold text-gray-800">{{ method.name }}</h1>
                    </div>

                    <!-- Description -->
                    <p class="text-xs text-gray-500 group-hover:text-gray-600 mb-2">{{ method.description }}</p>

                    <!-- Code Snippet -->
                    <DefaultCodeSnippet>{{ method.code }}</DefaultCodeSnippet>

                </div>
            </template>

            <!-- No Methods -->
            <div v-if="hasResults == false" class="flex items-center bg-gray-50 p-8">
                <span class="text-gray-500 text-xs">No Methods</span>
            </div>

        </div>


    </div>

</template>

<script>

    import CopyToClipboard from '@components/CopyToClipboard';
    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";
    import DefaultCodeSnippet from "@components/CodeSnippet/DefaultCodeSnippet";

    export default {
        props: ['form'],
        components: { CopyToClipboard, PrimaryAlert, DefaultSearchBar, DefaultCodeSnippet },
        data(){
            return {
                availableMethods: [
                    {
                        type: 'String',
                        name: 'Log Information',
                        code: '$this->logInfo(\'My message\');',
                        description: 'Log general messages on the Simulator debugger.'
                    },
                    {
                        type: 'String',
                        name: 'Log Warning Information',
                        code: '$this->logWarning(\'My warning\');',
                        description: 'Log warning messages on the Simulator debugger. This could be used to report run-time warnings of the application'
                    },
                    {
                        type: 'String',
                        name: 'Log Error Information',
                        code: '$this->logError(\'My error\');',
                        description: 'Log error messages on the Simulator debugger. This could be used to report run-time errors of the application'
                    },
                    {
                        type: 'String',
                        name: 'Get Total Screen Responses',
                        code: '$this->getTotalScreenResponses(\'screen_1603621400274\');',
                        description: 'Get the total number of user responses recorded for a given screen. This could be used to determine if the user has responded to a given screen. This method requires that you provide the screen id to be checked.'
                    },
                    {
                        type: 'String',
                        name: 'Get Total Display Responses',
                        code: '$this->getTotalDisplayResponses(\'display_1603621400274\');',
                        description: 'Get the total number of user responses recorded for a given display. This could be used to determine if the user has responded to a given display. This method requires that you provide the display id to be checked.'
                    },
                    {
                        type: 'String',
                        name: 'Check If Responded',
                        code: '$this->hasResponded();',
                        description: 'Check if the user has responded to the current level (screen or display)'
                    },
                    {
                        type: 'String',
                        name: 'Check Screen Existence By Marker',
                        code: '$this->hasScreenByMarker(\'Main Menu\');',
                        description: 'Check if the screen with the given marker name exists'
                    },
                    {
                        type: 'String',
                        name: 'Check Display Existence By Marker',
                        code: '$this->hasDisplayByMarker(\'Main Menu\');',
                        description: 'Check if the display with the given marker name exists'
                    },
                    {
                        type: 'String',
                        name: 'Check Chained Screen Existence By Id',
                        code: '$this->hasScreenByMarker(\'screen_1603621400274\');',
                        description: 'Check if the screen with the given id exists on the chained screens'
                    },
                    {
                        type: 'String',
                        name: 'Get Chained Screen By Id',
                        code: '$this->getChainedScreenById(\'screen_1603621400274\');',
                        description: 'Get the screen with the given id on the chained screens'
                    },
                    {
                        type: 'String',
                        name: 'Check Chained Display Existence By Id',
                        code: '$this->hasDisplayByMarker(\'display_1603621400274\');',
                        description: 'Check if the display with the given id exists on the chained displays'
                    },
                    {
                        type: 'String',
                        name: 'Get Chained Display By Id',
                        code: '$this->getChainedDisplayById(\'display_1603621400274\');',
                        description: 'Get the display with the given id on the chained displays'
                    }
                ],
                searchIndexes: [],
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
        methods: {
            startSearch(searchTerm) {

                //  Reset the search indexes
                this.searchIndexes = [];

                this.availableMethods.map((method, index) => {

                    //  Convert the serach term to lowercase
                    searchTerm = searchTerm.toLowerCase();

                    //  Check if we have the search term
                    const hasSearchTerm = searchTerm !== '';

                    //  Check if the method name matches the search term
                    const nameMatchesSearchTerm = method.name.toLowerCase().includes(searchTerm);

                    //  Check if the method code matches the search term
                    const codeMatchesSearchTerm = method.code.toLowerCase().includes(searchTerm);

                    //  Check if the method description matches the search term
                    const descriptionMatchesSearchTerm = method.description.toLowerCase().includes(searchTerm);

                    //  Determine if we have a match from the possible matches above
                    const matchesSearchTerm = (nameMatchesSearchTerm || codeMatchesSearchTerm || descriptionMatchesSearchTerm);

                    //  If we do not have the search term or the search term has a matching result
                    if( hasSearchTerm == false || (hasSearchTerm == true && matchesSearchTerm == true) ) {

                        //  Indicate that this method must be shown within the search results
                        this.searchIndexes.push(index);

                    }else{

                    }

                });

                this.totalResults = this.searchIndexes.length;
                this.hasResults = this.totalResults > 0;

                this.$emit('updateCount', this.totalResults);
            },
            copyToClipboard(index) {
                this.$refs['clipboard-'+index][0].copyToClipboard();
            }
        },
        created() {
            this.startSearch(this.searchTerm);
        }
    }
</script>
