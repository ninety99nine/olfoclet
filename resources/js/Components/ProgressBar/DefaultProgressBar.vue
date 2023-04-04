<template>

    <div class="w-full bg-gray-200 rounded-full">
        <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" :style="{ width: width + '%' }"> {{ width }}%</div>
    </div>

</template>

<script>
export default {
    props: {
        width: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style>

</style>>
