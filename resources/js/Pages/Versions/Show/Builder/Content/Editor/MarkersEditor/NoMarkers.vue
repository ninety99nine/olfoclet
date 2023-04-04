<template>

    <div class="flex items-center justify-between bg-white rounded-sm border border-dashed border-gray-400 p-5">
        <div class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <div>
                <p class="text-gray-800 text-md mb-1">No markers</p>
                <p class="text-gray-600 text-xs">Go ahead and create your first marker</p>
            </div>
        </div>
        <div class="flex justify-end">

            <!-- Create Marker Modal -->
            <CreateOrUpdateMarkerModal :markers="markers" mode="create">
                <span class="ml-2">Create Marker</span>
            </CreateOrUpdateMarkerModal>

        </div>
    </div>

</template>

<script>

    import CreateOrUpdateMarkerModal from './CreateOrUpdate/CreateOrUpdateMarkerModal';

    export default {
        props: ['markers'],
        components: { CreateOrUpdateMarkerModal },
    };

</script>
