<template>

    <div>

        <div class="flex justify-between mb-6">

            <PrimaryAlert>
                <span>Modify the enviroment file</span>
            </PrimaryAlert>

            <!-- Save Enviroment Button -->
            <PrimaryButton @click.stop="saveEnviroment()" :disabled="form.processing">Save Enviroment</PrimaryButton>

        </div>

        <div class="relative">

            <!-- Loading overlay -->
            <LoaderOverlay :show="form.processing" />

            <CodeEditor v-model="form.enviromentFile" :display_language="false" :error="form.errors.enviromentFile"></CodeEditor>

        </div>

    </div>

</template>

<script>

    import { useForm } from '@inertiajs/vue3';
    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import CodeEditor from "@components/CodeEditor/CodeEditor";
    import PrimaryButton from "@components/Button/PrimaryButton";
    import LoaderOverlay from '@components/Loader/LoaderOverlay';

    export default {
        components: { useForm, PrimaryAlert, CodeEditor, PrimaryButton, LoaderOverlay },
        data() {
            return {
                form: useForm({
                    enviromentFile: this.$page.props.enviromentFile
                })
            }
        },
        methods: {
            saveEnviroment() {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to save
                this.form.post(route('settings.enviroment.configurations.update'), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'Updated successfully',
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
