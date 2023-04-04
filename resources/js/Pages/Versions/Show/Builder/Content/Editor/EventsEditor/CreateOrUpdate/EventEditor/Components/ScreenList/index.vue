<template>

    <div>

        <!-- Search Bar -->
        <DefaultSearchBar v-model="searchTerm" placeholder="Search" :totalResults="totalResults" class="mb-4" />

        <!-- Explainer -->
        <PrimaryAlert class="mb-4">
            <span class="text-justify">
                Review screens available for linking
            </span>
        </PrimaryAlert>

        <div>

            <!-- Screens -->
            <template v-for="(minifiedScreen, index) in minifiedScreens" :key="index">
                <div v-if="searchIndexes.includes(index)" @click.stop="copyToClipboard(index)"
                    class="group bg-gray-50 hover:bg-gray-100 hover:shadow-md border border-white hover:border-gray-300 shadow-sm p-4 mb-2 rounded-md cursor-pointer relative">

                    <!-- Copy To Clipboard -->
                    <CopyToClipboard :ref="'clipboard-'+index" :value="minifiedScreen.id" message="Screen ID Copied" class="absolute right-2"></CopyToClipboard>

                    <div class="grid grid-cols-2">

                        <!-- Name -->
                        <div class="col-span-1 inline-flex items-center">
                            <div class="flex font-bold items-center bg-gray-200 text-gray-900 text-xs rounded-full mr-2 py-1 px-2">{{ index + 1 }}</div>
                            <h1 class="text-xs font-semibold text-gray-800">{{ minifiedScreen.name }}</h1>
                        </div>

                        <!-- ID Code Snippet -->
                        <div class="col-span-1 flex items-center justify-end">
                            <span class="text-xs text-gray-300 mr-2">ID:</span>
                            <DefaultCodeSnippet>{{ minifiedScreen.id }}</DefaultCodeSnippet>
                        </div>

                    </div>

                </div>
            </template>

            <!-- No Screens -->
            <div v-if="hasResults == false" class="flex items-center bg-gray-50 p-8">
                <span class="text-gray-500 text-xs">No Screens</span>
            </div>

        </div>


    </div>

</template>

<script>

    import CopyToClipboard from '@components/CopyToClipboard';
    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";
    import DefaultCodeSnippet from "@components/CodeSnippet/DefaultCodeSnippet";

    export default {
        props: ['form'],
        components: { CopyToClipboard, PrimaryAlert, DefaultSearchBar, DefaultCodeSnippet },
        data(){
            return {
                useVersionBuilder: useVersionBuilder(),
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
        computed: {
            minifiedScreens() {
                return this.useVersionBuilder.screens.map((screen) => {
                    return {
                        id: screen.id,
                        name: screen.name
                    }
                });
            }
        },
        methods: {
            startSearch(searchTerm) {

                //  Reset the search indexes
                this.searchIndexes = [];

                this.minifiedScreens.map((minifiedScreen, index) => {

                    //  Convert the serach term to lowercase
                    searchTerm = searchTerm.toLowerCase();

                    //  Check if we have the search term
                    const hasSearchTerm = searchTerm !== '';

                    //  Check if the name matches the search term
                    const nameMatchesSearchTerm = minifiedScreen.name.toLowerCase().includes(searchTerm);

                    //  Check if the id matches the search term
                    const idMatchesSearchTerm = minifiedScreen.id.toLowerCase().includes(searchTerm);

                    //  Determine if we have a match from the possible matches above
                    const matchesSearchTerm = (nameMatchesSearchTerm || idMatchesSearchTerm);

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
