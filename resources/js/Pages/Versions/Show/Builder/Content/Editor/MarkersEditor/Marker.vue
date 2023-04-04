<template>

    <div class="rounded-md border mb-2" :style="{ borderLeftColor: hexColor, borderLeftWidth: '4px' }">

        <div class="grid grid-cols-12 group text-xs text-gray-700 py-2 px-4 cursor-pointer bg-gray-50 rounded-md" :style="{ backgroundColor: hexColor+'05',  }">

            <div class="col-span-6 flex items-center">
                <span>{{ marker }}</span>
            </div>

            <div class="col-span-6 relative">

                <div class="absolute right-0 flex justify-end transition-all duration-300 opacity-0 group-hover:opacity-100">

                    <!-- Edit Icon -->
                    <CreateOrUpdateMarkerModal :markers="markers" :marker="marker" :index="index" mode="update"></CreateOrUpdateMarkerModal>

                    <!-- Delete Icon -->
                    <DeleteMarkerModal :markers="markers" :marker="marker" :index="index"></DeleteMarkerModal>

                    <!-- Clone Icon -->
                    <CreateOrUpdateMarkerModal :markers="markers" :marker="marker" mode="clone"></CreateOrUpdateMarkerModal>

                    <!-- Move Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-grab hover:text-blue-500 active:cursor-grabbing draggble-handle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>

                </div>

            </div>

        </div>

    </div>

</template>

<script>
    import DeleteMarkerModal from './Delete/DeleteMarkerModal';
    import CreateOrUpdateMarkerModal from './CreateOrUpdate/CreateOrUpdateMarkerModal';

    export default {
        props: ['markers', 'marker', 'index'],
        components: { DeleteMarkerModal, CreateOrUpdateMarkerModal },
        data(){
            return {
                hexColor: '#00c2b1'
            }
        }
    };

</script>
