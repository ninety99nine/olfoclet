<template>

    <div class="bg-white rounded-sm border border-dashed border-gray-400 p-5">
        <div class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <div>
                <p class="text-gray-800 text-md mb-1">{{ isShowingApps ? 'No Apps': 'No Trashed Apps' }}</p>
                <p class="text-gray-600 text-xs">
                    {{ isShowingApps ? 'Get started by creating your first app': 'You don\'t have any trashed apps' }}
                </p>
            </div>
        </div>
        <div v-if="isShowingApps" class="flex justify-end mt-8">

            <!-- Create App Modal -->
            <CreateOrUpdateAppModal></CreateOrUpdateAppModal>

        </div>
    </div>

</template>

<script>

    import CreateOrUpdateAppModal from './../../Apps/Create/CreateOrUpdateAppModal';

    export default {
        components: { CreateOrUpdateAppModal },
        computed: {
            isShowingApps() {
                return route().current('project.show.with.apps', { project: this.route().params.project });
            },
            isShowingTrashedApps() {
                return route().current('project.show.with.trashed.apps', { project: this.route().params.project });
            }
        },
    };

</script>
