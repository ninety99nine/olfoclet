<template>

    <tr @click="showVersion" class="group border-b cursor-pointer hover:bg-gray-50">

        <!-- Version -->
        <td scope="row" class="px-6 py-4 text-xs font-medium text-gray-900">
            <span>{{ version.number }}</span>
        </td>

        <!-- Last Update -->
        <td scope="row" class="px-6 py-4 text-xs text-gray-500">
            <span>{{ moment(version.updated_at).fromNow() }}</span>
        </td>

        <!-- Description -->
        <td scope="row" class="px-6 py-4 text-xs text-gray-500">

            <template v-if="version.description || version.features.length">

                <div class="text-justify space-y-4">

                    <template v-if="version.description">

                        <span class="text-xs text-gray-500 break-normal">{{ version.description }}</span>

                    </template>

                    <template v-if="version.features.length">

                        <div class="space-y-2">
                            <div v-for="(feature, index) in version.features" :key="index" class="flex items-center">

                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                                <span class="text-xs text-gray-500">{{ feature }}</span>

                            </div>
                        </div>

                    </template>

                </div>

            </template>

        </td>

        <!-- Action -->
        <td scope="row" class="p-4">

            <div class="flex justify-end opacity-0 group-hover:opacity-100">

                <template v-if="isShowingVersions" class="flex justify-end">

                    <!-- Delete App Modal -->
                    <CreateOrUpdateVersionModal :version="version" :showButton="false" mode="Delete" class="mr-2"></CreateOrUpdateVersionModal>

                    <!-- Update App Modal -->
                    <CreateOrUpdateVersionModal :version="version" :showButton="false" mode="Update"></CreateOrUpdateVersionModal>

                </template>

                <template v-else>

                    <!-- Delete App Modal -->
                    <CreateOrUpdateVersionModal :version="version" :showButton="false" mode="Delete" class="mr-2"></CreateOrUpdateVersionModal>

                    <!-- Restore App Modal -->
                    <CreateOrUpdateVersionModal :version="version" :showButton="false" mode="Restore"></CreateOrUpdateVersionModal>

                </template>

            </div>

        </td>

    </tr>

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
