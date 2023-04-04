<template>

    <div class="flex items-center justify-between bg-white rounded-sm border border-dashed border-gray-400 p-5">
        <div class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <div>
                <p class="text-gray-800 text-md mb-1">No formatting rules</p>
                <p class="text-gray-600 text-xs">Go ahead and create your first formatting rule</p>
            </div>
        </div>
        <div class="flex justify-end">

            <!-- Add Formatting Rule Button & Modal -->
            <SelectFormattingRuleModal :form="form" :showButtonText="true"></SelectFormattingRuleModal>

        </div>
    </div>

</template>

<script>

    import SelectFormattingRuleModal from './SelectFormattingRule/SelectFormattingRuleModal';

    export default {
        props: ['form'],
        components: { SelectFormattingRuleModal },
    };

</script>
