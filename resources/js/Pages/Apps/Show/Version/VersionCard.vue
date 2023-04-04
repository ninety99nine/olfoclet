<template>

    <div :class="[showingOptions ? 'h-44' : 'h-32 delay-200']" class="bg-white p-6 border rounded-md cursor-pointer shadow-sm hover:shadow-lg hover:bg-blue-50 active:shadow-xl active:bg-white transition-height duration-250 ease-in-out"
        @mouseenter="showOptions" @mouseleave="hideOptions" @click="showVersion">

        <div class="flex justify-between border-b border-dotted pb-4 mb-4">

            <h5 class="text-sm tracking-tight">
                <span class="text-gray-500 mr-2">version</span>
                <span class="text-gray-900 font-semibold text-xl">{{ version.number }}</span>
            </h5>

            <div class="flex ml-4">

                <!-- Total Features -->
                <span v-if="version.features.length" class="text-xs text-gray-400 mr-4">{{ version.features.length }} {{ version.features.length == 1 ? 'Feature' : 'Features' }}</span>

                <!-- Feature Info Icon -->
                <FeaturePopover :version="version"></FeaturePopover>

            </div>

        </div>

        <div class="flex justify-between mb-4">
            <div v-if="version.deleted_at" class="flex items-center">
                <span class="text-gray-600 text-xs">{{ moment(version.deleted_at).fromNow() }}</span>
                <span class="text-gray-500 text-xs ml-1 italic"> &#8212; Trashed</span>
            </div>
            <div v-else-if="version.updated_at" class="flex items-center">
                <span class="text-gray-600 text-xs">{{ moment(version.updated_at).fromNow() }}</span>
                <span class="text-gray-500 text-xs ml-1 italic"> &#8212; Last updated</span>
            </div>
            <el-tag v-if="appPayload.active_version_id === version.id" size="small" type="success">
                <div class="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Active Version</span>
                </div>
            </el-tag>
        </div>

        <Transition name="slide-fade">

            <div v-show="showingOptions" class="flex justify-end">

                <template v-if="isShowingVersions" class="flex justify-end">

                    <!-- Delete App Modal -->
                    <CreateOrUpdateVersionModal :version="version" @close="modalClosed" @open="modalOpened" mode="Delete" class="mr-2"></CreateOrUpdateVersionModal>

                    <!-- Update App Modal -->
                    <CreateOrUpdateVersionModal :version="version" @close="modalClosed" @open="modalOpened" mode="Update"></CreateOrUpdateVersionModal>

                </template>

                <template v-else>

                    <!-- Delete App Modal -->
                    <CreateOrUpdateVersionModal :version="version" @close="modalClosed" @open="modalOpened" mode="Delete" class="mr-2"></CreateOrUpdateVersionModal>

                    <!-- Restore App Modal -->
                    <CreateOrUpdateVersionModal :version="version" @close="modalClosed" @open="modalOpened" mode="Restore"></CreateOrUpdateVersionModal>

                </template>

            </div>

        </Transition>

    </div>

</template>

<script>

    import mixin from './mixin.vue';

    /**
     *  Everything is contained within the mixin file
     */
    export default {
        mixins: [ mixin ],
    };

</script>
