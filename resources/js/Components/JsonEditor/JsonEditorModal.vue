<template>

    <!-- Modal -->
    <DefaultModal
        @open="resetForm()"
        defaultText="Cancel"
        @close="$emit('close')"
        primaryText="Update JSON"
        :primaryAction="updateJson"
        :defaultAction="cancelUpdateJson">

        <!-- Modal Title -->
        <template v-slot:title>Update JSON</template>

        <!-- Modal Content -->
        <CodeEditor v-model="form.json" :error="form.errors.json" :languages="[['JSON', 'json']]" height="300px"></CodeEditor>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <DefaultButton name="trigger" class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>Edit JSON</span>
            </DefaultButton>

        </template>

    </DefaultModal>

</template>

<script>

    import { useForm } from '@inertiajs/vue3'
    import DefaultModal from "@components/Modal/DefaultModal";
    import CodeEditor from "@components/CodeEditor/CodeEditor";
    import DefaultButton from "@components/Button/DefaultButton";

    export default {
        components: { useForm, DefaultModal, CodeEditor, DefaultButton },
        props: ['modelValue'],
        data() {
            return {
                form: null
            }
        },
        methods: {
            resetForm(){
                this.form = useForm({
                    json: JSON.stringify((this.modelValue ?? {}), null, 2)
                });
            },
            updateJson(closeModal) {

                console.log();

                this.form.clearErrors();

                try {

                    //  Get the JSON data
                    const validJson = JSON.parse(this.form.json);

                    if( validJson ) {

                        this.$emit('update:modelValue', validJson);

                        this.$message({
                            message: 'JSON updated successfully',
                            type: 'success'
                        });

                        closeModal();

                    }

                } catch (e) {

                    this.form.setError('json', 'The JSON syntax provided is not valid');

                }

            },
            cancelUpdateJson() {

                //  Clear existing errors
                this.form.clearErrors();

            }
        }
    };

</script>
