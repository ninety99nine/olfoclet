<template>

<div :class="['w-fit bg-red-50 text-red-500 border border-red-500 text-xs px-2.5 py-0.5 rounded', { 'cursor-pointer hover:bg-red-100 active:bg-red-200' : clickable }]">
    <slot></slot>
</div>

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
