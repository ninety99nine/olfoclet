<template>

    <Transition name="fade" mode="out-in" appear>
        <p v-if="error" class="text-xs text-red-600 dark:text-red-500" :key="error ?? 1">
            {{ error }}
        </p>
    </Transition>

</template>

<script>
export default {
    props: ['error']
}
</script>

