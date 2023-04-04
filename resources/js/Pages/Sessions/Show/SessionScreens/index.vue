<template>

    <div>

        <div class="flex justify-between">

            <span class="block text-sm font-semibold text-gray-700 my-8">
                {{ session.total_inputs_and_outputs }} {{ session.total_inputs_and_outputs == 1 ? 'Interaction' : 'Interactions' }}
            </span>

            <DefaultSearchBar v-model="search" placeholder="Search content"/>

        </div>

        <div class="relative">

            <div class="flex items-start space-x-4 overflow-y-auto bg-gray-100 rounded-t-md border py-4 px-10">

                <div v-if="filteredInputsAndOutputs.length" class="absolute top-2 bottom-4 left-0 w-12 bg-gradient-to-r from-gray-100 rounded-l-md border-l border-transparent"></div>
                <div v-if="filteredInputsAndOutputs.length" class="absolute top-2 bottom-4 right-0 w-12 bg-gradient-to-l from-gray-100 rounded-r-md border-r border-transparent"></div>

                <div v-for="(record, index) in filteredInputsAndOutputs" :key="index" class="flex items-center space-x-4">

                    <div v-if="index == 0 && [null, ''].includes(search)" class="flex items-center">

                        <span class="bg-white border-2 p-8 rounded-full text-center">
                            <span class="block text-gray-400 text-xs italic">Dial</span>
                            <span class="font-bold">{{ record.input }}</span>
                        </span>

                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 ml-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>

                    </div>

                    <div>
                        <div class="flex-none bg-white border rounded-lg shadow-md p-4 w-60 mb-2">
                            <p class="text-gray-600 text-xs whitespace-pre-wrap">
                                {{ record.output }}
                            </p>
                        </div>
                        <p v-if="index != (session.inputs_and_outputs.length - 1)" class="text-gray-600 text-sm whitespace-pre-wrap my-4 text-center">
                            <span>
                                <span class="text-gray-400 text-xs italic mr-2">Reply:</span>
                                <span class="font-bold">{{ session.inputs_and_outputs[index + 1].input }}</span>
                            </span>
                        </p>
                    </div>
                </div>

                <div v-if="filteredInputsAndOutputs.length == 0">
                    <span class="text-xs">No search results</span>
                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";

    export default {
        props: ['view'],
        components: { DefaultSearchBar },
        data() {
            return {
                search: null,
                session: this.$page.props.sessionPayload,
                screens: [
                    {
                        input: '*250#',
                        output: 'Screen 1'
                    },
                    {
                        input: '1',
                        output: 'Screen 2'
                    },
                    {
                        input: '2',
                        output: 'Screen 3'
                    },
                    {
                        input: '3',
                        output: 'Screen 4'
                    },
                    {
                        input: '4',
                        output: 'Screen 5'
                    },
                    {
                        input: '5',
                        output: 'Screen 6'
                    },
                    {
                        input: '6',
                        output: 'Screen 7'
                    }
                ]
            }
        },
        watch: {
            /**
             *  Watch for changes on the page props
             */
            '$page.props': function (newUrl, oldUrl) {
                this.session = this.$page.props.sessionPayload;
            }
        },
        computed: {
            filteredInputsAndOutputs() {
                if( [null, ''].includes(this.search) == false ) {
                    return this.session.inputs_and_outputs.filter((record) => record.output.toLowerCase().includes(this.search.toLowerCase()));
                }
                return this.session.inputs_and_outputs;
            }
        }
    };

</script>
