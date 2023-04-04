<template>

    <div :class="[showingOptions ? 'h-52' : 'h-44 delay-300']" class="bg-white p-6 border rounded-md cursor-pointer shadow-sm hover:shadow-lg hover:bg-blue-50 active:shadow-xl active:bg-white transition-height duration-250 ease-in-out"
        @mouseenter="showOptions" @mouseleave="hideOptions" @click="showApp">

        <div class="border-b border-dotted pb-4 mb-4">

            <div class="flex justify-between">

                <h5 class="text-sm font-semibold tracking-tight text-gray-600">{{ app.name }}</h5>

                <!-- Info Icon -->
                <InfoPopover v-if="app.description" :title="app.name">

                    <div class="border-t border-dashed pt-4 mt-4 mb-4">

                        <span class="text-xs text-gray-500 break-normal">{{ app.description }}</span>

                    </div>

                </InfoPopover>

            </div>
        </div>

        <div class="flex justify-between">
            <div class="flex items-center">
                <span class="animate-pulse h-2 w-2 rounded-full mr-1" :class="{ 'bg-green-500': app.online, 'bg-red-500': !app.online }"></span>
                <span class="text-gray-500 text-xs">Online</span>
            </div>
            <div v-if="app.active_version" class="flex items-center">
                <span class="text-gray-500 text-xs mr-1">Version</span>
                <span class="text-gray-500 text-xs font-bold">{{ app.active_version.number }}</span>
                <!-- Feature Info Icon -->
                <FeaturePopover :version="app.active_version" class="ml-2"></FeaturePopover>
            </div>
            <div class="flex items-center">
                <span class="text-gray-500 text-xs mr-1">Dial</span>
                <span class="text-gray-500 text-xs font-bold">{{ (app.short_code || {}).primary_code }}</span>
            </div>
        </div>


        <div class="flex justify-between border-t border-dotted pt-4 mt-4 mb-4">
            <div class="flex items-center">
                <el-tag v-if="app.versions_count == 0" type="warning" size="small">No versions</el-tag>
                <el-tag v-else size="small">{{ app.versions_count + (app.versions_count == 1 ? ' Version' : ' Versions') }}</el-tag>
            </div>

            <div v-if="app.deleted_at" class="flex justify-between">
                <div class="flex items-center">
                    <span class="text-gray-400 text-xs mr-1 italic">Trashed &#8212; </span>
                    <span class="text-gray-500 text-xs">{{ moment(app.deleted_at).fromNow() }}</span>
                </div>
            </div>

            <div v-else-if="app.created_at" class="flex justify-between">
                <div class="flex items-center">
                    <span class="text-gray-400 text-xs mr-1 italic">Created &#8212; </span>
                    <span class="text-gray-500 text-xs">{{ moment(app.created_at).fromNow() }}</span>
                </div>
            </div>
        </div>

        <Transition name="slide-fade">

            <div v-show="showingOptions" class="flex justify-end">

                <template v-if="isShowingApps">

                    <!-- Delete App Modal -->
                    <CreateOrUpdateAppModal :app="app" @close="modalClosed" @open="modalOpened" mode="Delete" class="mr-2"></CreateOrUpdateAppModal>

                    <!-- Update App Modal -->
                    <CreateOrUpdateAppModal :app="app" @close="modalClosed" @open="modalOpened" mode="Update"></CreateOrUpdateAppModal>

                </template>

                <template v-else>

                    <!-- Delete App Modal -->
                    <CreateOrUpdateAppModal :app="app" @close="modalClosed" @open="modalOpened" mode="Delete" class="mr-2"></CreateOrUpdateAppModal>

                    <!-- Restore App Modal -->
                    <CreateOrUpdateAppModal :app="app" @close="modalClosed" @open="modalOpened" mode="Restore"></CreateOrUpdateAppModal>

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
