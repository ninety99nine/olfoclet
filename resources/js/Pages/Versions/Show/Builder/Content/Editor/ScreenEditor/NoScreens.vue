<template>

    <div class="mt-4">

        <div class="flex items-center justify-between bg-white rounded-sm border-x border-t border-dashed border-gray-400 p-5">

            <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <div>
                    <p class="text-gray-800 text-md mb-1">
                        <template v-if="useVersionBuilder.hasDownloadedBuilder == false">Downloading</template>
                        <template v-else-if="useVersionBuilder.hasSavedBuilder == false">Saving</template>
                        <template v-else>No screens</template>
                    </p>
                    <p class="text-gray-600 text-xs">
                        <template v-if="useVersionBuilder.hasDownloadedBuilder == false">The application builder is still downloading</template>
                        <template v-else-if="useVersionBuilder.hasSavedBuilder == false">The application builder is still saving</template>
                        <template v-else>Go ahead and create your first screen</template>
                    </p>
                </div>
            </div>

            <div class="flex items-center justify-end">

                <!-- Create Screen Modal -->
                <CreateScreenModal v-if="useVersionBuilder.hasDownloadedBuilder && useVersionBuilder.hasSavedBuilder">
                    <span class="ml-2">Create Screen</span>
                </CreateScreenModal>

                <!-- Loader -->
                <Loader v-else />

            </div>

        </div>

        <div class="border border-dashed border-gray-400 p-5 rounded-b-md">

            <svg v-if="useVersionBuilder.hasDownloadedBuilder && useVersionBuilder.hasSavedBuilder" xmlns="http://www.w3.org/2000/svg" class="h-80 w-80 text-blue-100 m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>

            <CubeLoader v-else class="py-40"></CubeLoader>

        </div>

    </div>

</template>

<script>

    import Loader from "@components/Loader/Loader";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import CubeLoader from "@components/Loader/Unique/CubeLoader";
    import CreateScreenModal from './CreateScreen/CreateScreenModal';

    export default {
        props: ['screens'],
        components: { Loader, CubeLoader, CreateScreenModal },
        data(){
            return {
                useVersionBuilder: useVersionBuilder()
            }
        }
    };

</script>
