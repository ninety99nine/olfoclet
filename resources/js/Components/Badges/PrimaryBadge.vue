<template>

<span :class="['bg-blue-50 text-blue-500 border border-blue-500 text-xs px-2.5 py-0.5 rounded', { 'cursor-pointer hover:bg-blue-100 active:bg-blue-200' : clickable }]">
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
