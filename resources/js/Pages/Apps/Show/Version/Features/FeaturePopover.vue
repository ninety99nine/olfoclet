<template>

    <InfoPopover v-if="version.description || version.features.length" :title="'Version ' + version.number">

        <div class="space-y-4 border-t border-dashed pt-4 mt-4">

            <template v-if="version.description">

                <span class="text-xs text-gray-500 break-normal">{{ version.description }}</span>

            </template>

            <template v-if="version.features.length">

                <p class="text-xs text-gray-700 font-semibold mb-2">Features</p>

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

    </InfoPopover>

</template>

<script>
    import InfoPopover from '@components/Popover/InfoPopover';
    export default {
        props: ['version'],
        components: { InfoPopover }
    };
</script>
