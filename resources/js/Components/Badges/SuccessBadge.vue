<template>

<div :class="['w-fit bg-green-50 text-green-500 border border-green-500 text-xs px-2.5 py-0.5 rounded', { 'cursor-pointer hover:bg-green-100 active:bg-green-200' : clickable }]">
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
