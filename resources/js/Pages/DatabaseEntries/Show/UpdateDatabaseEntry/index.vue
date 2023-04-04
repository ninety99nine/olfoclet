<template>

    <div class="bg-white rounded-md shadow-md hover:shadow-lg">

        <KeyValueInput v-model="form.metadata"></KeyValueInput>

        <div class="flex justify-end border-t p-4">

            <JsonEditorModal v-model="form.metadata" class="mr-4"></JsonEditorModal>

            <PrimaryButton @click="saveChanges()" :disabled="form.processing">Save Changes</PrimaryButton>

        </div>

    </div>

</template>

<script>

    import moment from 'moment';
    import { useForm } from '@inertiajs/vue3';
    import PrimaryButton from '@components/Button/PrimaryButton';
    import JsonEditorModal from '@components/JsonEditor/JsonEditorModal';

    export default {
        components: { PrimaryButton, JsonEditorModal },
        data() {
            return {
                moment: moment,
                form: this.getForm()
            }
        },
        methods: {
            getForm() {
                return useForm({
                    metadata: this.$page.props.databaseEntryPayload.metadata
                });
            },
            saveChanges() {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to update project
                this.form.put(route('database.entry.update', { project: this.route().params.project, app: this.route().params.app, version: this.route().params.version, database_entry: this.route().params.database_entry }), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'Database entry updated successfully',
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
