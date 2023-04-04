<template>

    <div class="p-5 mt-4 bg-white rounded-b-md shadow-md hover:shadow-lg">

        <!-- App name -->
        <h5 class="text-xl font-medium text-gray-900 border-b pb-5 mb-5">Delete App</h5>

        <p class="text-sm text-gray-500 border-b pb-5 mb-5">Once you delete a app, there is no going back. Please be certain. Enter the confirmation code <span class="text-gray-800 font-bold">{{ appPayload.confirmation_code }}</span> to confirm this action.</p>

        <DefaultInput v-model="form.confirmation_code" label="Delete code" placeholder="Enter the confirmation code" :disabled="form.processing" :error="form.errors.confirmation_code" class="mb-6"></DefaultInput>

        <div class="flex justify-end">
            <DangerButton :disabled="form.processing" @click="deleteApp()">
                Delete App
            </DangerButton>
        </div>

    </div>

</template>

<script>

    import { useForm } from '@inertiajs/vue3';
    import DefaultInput from "@components/Input/DefaultInput";
    import DangerButton from "@components/Button/DangerButton";

    export default {
        props: {
            appPayload: Object
        },
        components: { DefaultInput, DangerButton },
        data() {
            return {
                form: useForm({
                    confirmation_code: ''
                }),
                search: this.route().params.search
            }
        },
        methods: {
            deleteApp() {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to update app
                this.form.delete(route('app.delete', { project: this.route().params.project, app: this.route().params.app }), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'App deleted successfully',
                            type: 'success'
                        });
                    },
                    onError: (errors) => {
                        self.$message({
                            message: 'Sorry, we found some mistakes',
                            type: 'error'
                        });
                    },
                });

            }
        }
    };

</script>
