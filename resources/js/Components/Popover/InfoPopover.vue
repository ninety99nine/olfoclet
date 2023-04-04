<template>
    <span>
        <el-popover placement="top" :title="title" :width="350" trigger="hover">

            <!-- Info Text -->
            <p v-if="info" class="text-xs text-gray-600 break-normal">{{ info }}</p>

            <!-- Info Slot -->
            <slot />

            <template v-slot:reference>
                <svg xmlns="http://www.w3.org/2000/svg" :class="['h-'+size, 'w-'+size, 'text-green-500 hover:text-green-600 cursor-pointer']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </template>

        </el-popover>
    </span>
</template>

<script>
    export default {
        props: {
            'info': String,
            'title': String,
            'size': {
                type: String,
                default: '4'
            }
        }
    }
</script>
