<template>

    <!-- Delete / Restore -->
    <template v-if="mode == 'Delete' || mode == 'Restore'">

        <!-- Soft Delete -->
        <p v-if="mode == 'Delete' && !form.deleted_at" class="text-sm text-gray-500 mb-5">This project will be trashed for 30 days before it's permanently deleted. Please be certain. Enter the confirmation code <span class="text-gray-800 font-bold">{{ project.confirmation_code }}</span> to confirm this action.</p>

        <!-- Force Delete -->
        <p v-if="mode == 'Delete' && form.deleted_at" class="text-sm text-gray-500 mb-5">Once you delete this project, there is no going back. Please be certain. Enter the confirmation code <span class="text-gray-800 font-bold">{{ project.confirmation_code }}</span> to confirm this action.</p>

        <!-- Restore -->
        <p v-if="mode == 'Restore'" class="text-sm text-gray-500 mb-5">Enter the confirmation code <span class="text-gray-800 font-bold">{{ project.confirmation_code }}</span> to confirm this action.</p>

        <DefaultInput v-model="form.confirmation_code" label="Confirmation code" placeholder="Enter the confirmation code" :disabled="form.processing || form.processing" :error="form.errors.confirmation_code" class="mb-6"></DefaultInput>

    </template>

    <!-- Create / Update -->
    <template v-else>
        <DefaultInput v-model="form.name" label="Name" placeholder="My Project" :disabled="form.processing" :error="form.errors.name" class="mb-6"></DefaultInput>
    </template>

</template>

<script>
    import DefaultInput from "@components/Input/DefaultInput";

    export default {
        components: { DefaultInput },
        props: {
            form: Object,
            mode: String,
            project: Object
        }
    }
</script>

