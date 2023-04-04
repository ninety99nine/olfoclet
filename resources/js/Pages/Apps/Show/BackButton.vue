<template>

    <div>
        <DefaultButton class="mb-4" @click="showApps()" :disabled="disabled">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <slot>Back</slot>
        </DefaultButton>
    </div>

</template>

<script>

    import DefaultButton from "@components/Button/DefaultButton";

    export default {
        props: ['disabled'],
        components: { DefaultButton },
        methods: {
            showApps() {
                this.$inertia.get(route('project.show.with.apps', { project: this.route().params.project }));
            }
        }
    };

</script>
