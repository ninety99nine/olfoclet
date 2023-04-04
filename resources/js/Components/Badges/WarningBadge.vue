<template>

<span :class="['bg-yellow-50 text-yellow-500 border border-yellow-500 text-xs px-2.5 py-0.5 rounded', { 'cursor-pointer hover:bg-yellow-100 active:bg-yellow-200' : clickable }]">
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
