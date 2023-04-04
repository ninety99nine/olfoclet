<template>

<span :class="['bg-gray-100 text-gray-600 border border-gray-400 text-xs px-2.5 py-0.5 rounded', { 'cursor-pointer hover:bg-blue-200 active:bg-blue-300' : clickable }]">
    <slot></slot>
</span>

</template>

<script>
export default {
    props: {
        clickable: {
            type: Boolean,
            default: false
        }
    }
}
</script>
