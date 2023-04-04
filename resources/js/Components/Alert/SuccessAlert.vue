<template>

    <div :class="[{ 'w-full': fullWidth }, 'inline-flex relative rounded-md text-gray-800 text-xs border border-green-100 bg-white']">
        <div v-if="showIcon" class="absolute top-0 bottom-0 left-0 flex items-center px-4 bg-green-100">
            <slot name="icon">
                <div :style="{ width: '16px', height: '16px' }" class="flex-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </slot>
        </div>
        <div :class="['flex-1 py-2 px-4', showIcon ? 'ml-12 bg-green-100/30' : ' bg-green-100']">
            <slot />
        </div>
    </div>

</template>

<script>
export default {
    props: {
        showIcon: {
            type: Boolean,
            default: true
        },
        fullWidth: {
            type: Boolean,
            default: false
        },
    }
}
</script>
