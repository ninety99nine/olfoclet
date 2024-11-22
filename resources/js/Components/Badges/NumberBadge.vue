<template>

    <div :key="active" :class="['w-fit transition-all duration-500 inline-flex items-center py-1 px-2.5 ml-2 text-xs rounded-full font-semibold', active ? activeStyle : inActiveStyle]">
        <span class="text-xs">{{ count }}</span>
    </div>

</template>

<script>
export default {
    props: {
        count: {
            type: [String, Number],
            default: 0
        },
        active: {
            type: Boolean,
            default: false
        },
        activeStyle: {
            type: String,
            default: 'bg-white text-blue-500'
        },
        inActiveStyle: {
            type: String,
            default: 'bg-blue-50 text-blue-500'
        }
    }
}
</script>
