<template>

    <div>

        <!-- Search Bar -->
        <DefaultSearchBar v-model="searchTerm" placeholder="Search" :totalResults="totalResults" class="mb-4" />

        <!-- Explainer -->
        <PrimaryAlert class="mb-4">
            <span class="text-justify">
                Review variables available to the Code Editor
            </span>
        </PrimaryAlert>

        <div>

            <!-- Variables -->
            <template v-for="(variable, index) in availableVariables" :key="index">
                <div v-if="searchIndexes.includes(index)" @click.stop="copyToClipboard(index)"
                    class="group bg-gray-50 hover:bg-gray-100 hover:shadow-md border border-white hover:border-gray-300 shadow-sm p-4 mb-2 rounded-md cursor-pointer relative">

                    <!-- Copy To Clipboard -->
                    <CopyToClipboard :ref="'clipboard-'+index" :value="variable.code" message="Variable Copied" class="absolute right-2"></CopyToClipboard>

                    <!-- Name -->
                    <div class="inline-flex items-center mb-2">
                        <div class="flex font-bold items-center bg-gray-200 text-gray-900 text-xs rounded-full mr-2 py-1 px-2">{{ index + 1 }}</div>
                        <h1 class="text-sm font-semibold text-gray-800">{{ variable.name }}</h1>
                    </div>

                    <!-- Description -->
                    <p class="text-xs text-gray-500 group-hover:text-gray-600 mb-2">{{ variable.description }}</p>

                    <!-- Code Snippet -->
                    <DefaultCodeSnippet>{{ variable.code }}</DefaultCodeSnippet>

                </div>
            </template>

            <!-- No Variables -->
            <div v-if="hasResults == false" class="flex items-center bg-gray-50 p-8">
                <span class="text-gray-500 text-xs">No Variables</span>
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
                availableVariables: [
                    {
                        type: 'Array',
                        code: '$ussd;',
                        name: 'Ussd information',
                        description: 'Get access to the ussd information such as mobile number, session id, user responses and more'
                    },
                    {
                        type: 'String',
                        code: '$ussd[\'msisdn\'];',
                        name: 'MSISDN',
                        description: 'Get access to the subscriber\'s MSISDN number'
                    },
                    {
                        type: 'String',
                        code: '$ussd[\'mobile_number\'];',
                        name: 'Mobile Number',
                        description: 'Get access to the subscriber\'s mobile number'
                    },
                    {
                        type: 'String',
                        code: '$ussd[\'text\'];',
                        name: 'User Responses (As Text)',
                        description: 'Get access to the user responses in text format'
                    },
                    {
                        type: 'Array',
                        code: '$ussd[\'user_responses\'];',
                        name: 'User Responses (As Array)',
                        description: 'Get access to the ussd user responses'
                    },
                    {
                        type: 'Array',
                        code: '$ussd[\'reply_records\'];',
                        name: 'User Reply Records',
                        description: 'Get access to the ussd reply records'
                    },
                    {
                        type: 'String',
                        code: '$ussd[\'user_response\'];',
                        name: 'User Response',
                        description: 'Get access to the latest user response'
                    },
                    {
                        type: 'String',
                        code: '$ussd[\'session_id\'];',
                        name: 'Session ID',
                        description: 'Get access to the ussd session id'
                    },
                    {
                        type: 'String',
                        code: '$ussd[\'request_type\'];',
                        name: 'Request Type',
                        description: 'Get access to the ussd request type'
                    },
                    {
                        type: 'String',
                        code: '$ussd[\'service_code\'];',
                        name: 'Service Code',
                        description: 'Get access to the ussd service code'
                    },
                    {
                        type: 'Array',
                        code: '$ussd[\'app\'];',
                        name: 'App Details',
                        description: 'Get access to the current app information such as the app name and description'
                    },
                    {
                        type: 'Array',
                        code: '$ussd[\'version\'];',
                        name: 'App Version Details',
                        description: 'Get access to the current app version information such as the version number and description'
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

                this.availableVariables.map((variable, index) => {

                    //  Convert the serach term to lowercase
                    searchTerm = searchTerm.toLowerCase();

                    //  Check if we have the search term
                    const hasSearchTerm = searchTerm !== '';

                    //  Check if the variable name matches the search term
                    const nameMatchesSearchTerm = variable.name.toLowerCase().includes(searchTerm);

                    //  Check if the variable code matches the search term
                    const codeMatchesSearchTerm = variable.code.toLowerCase().includes(searchTerm);

                    //  Check if the variable description matches the search term
                    const descriptionMatchesSearchTerm = variable.description.toLowerCase().includes(searchTerm);

                    //  Determine if we have a match from the possible matches above
                    const matchesSearchTerm = (nameMatchesSearchTerm || codeMatchesSearchTerm || descriptionMatchesSearchTerm);

                    //  If we do not have the search term or the search term has a matching result
                    if( hasSearchTerm == false || (hasSearchTerm == true && matchesSearchTerm == true) ) {

                        //  Indicate that this variable must be shown within the search results
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
