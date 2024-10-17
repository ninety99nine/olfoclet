<template>

<div :class="['bg-orange-50 text-orange-500 border border-orange-500 text-xs px-2.5 py-0.5 rounded', { 'cursor-pointer hover:bg-orange-100 active:bg-orange-200' : clickable }]">
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
