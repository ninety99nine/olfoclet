<template>

    <!-- Create Version Modal -->
    <DefaultModal defaultText="Cancel"
        @open="isOpen = true; $emit('open')"
        @close="isOpen = false; $emit('close')"
        :defaultAction="cancelCreateVersion" :isLoading="form.processing"
        :dangerText="['Delete'].includes(this.mode) ? mode + ' Version' : ''" :dangerAction="handleAction"
        :primaryText="['Create', 'Update', 'Restore'].includes(mode) ? (['Create', 'Restore'].includes(this.mode) ? mode + ' Version' : 'Save Changes') : ''" :primaryAction="handleAction">

        <!-- Create Version Title (Modal Title) -->
        <template v-slot:title>{{ mode }} Version</template>

        <!-- Create Version Content (Modal Content) -->
        <CreateOrUpdateVersionForm :form="form" :version="version" :mode="mode" />

        <!-- Create Version Button (Modal Trigger) -->
        <template v-slot:trigger>

            <!-- Update -->
            <template v-if="mode == 'Update'">

                <PrimaryButton v-if="showButton" :disabled="form.processing" name="trigger">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                </PrimaryButton>

                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-pointer hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>

            </template>

            <!-- Delete -->
            <template v-else-if="mode == 'Delete'">

                <DangerButton v-if="showButton" :disabled="form.processing" name="trigger">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {{ version.deleted_at ? mode : 'Trash' }}
                </DangerButton>

                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-pointer hover:text-red-500 active:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>

            </template>

            <!-- Restore -->
            <template v-else-if="mode == 'Restore'">

                <PrimaryButton v-if="showButton" :disabled="form.processing" name="trigger">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restore
                </PrimaryButton>

                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-pointer hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>

            </template>

            <!-- Create -->
            <template v-else>
                <PrimaryButton :disabled="form.processing" name="trigger">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    {{ mode }} Version
                </PrimaryButton>
            </template>

        </template>

    </DefaultModal>

</template>

<script>

    import { useForm } from '@inertiajs/vue3'
    import CreateOrUpdateVersionForm from './CreateOrUpdateVersionForm';
    import DefaultModal from "@components/Modal/DefaultModal";
    import DangerButton from "@components/Button/DangerButton.vue";
    import PrimaryButton from "@components/Button/PrimaryButton.vue";

    export default {
        components: { useForm, CreateOrUpdateVersionForm, DefaultModal, DangerButton, PrimaryButton },
        props: {
            version: {
                type: Object,
                default: null
            },
            mode: {
                type: String,
                default: 'Create'
            },
            showButton: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                form: this.getForm()
            }
        },
        methods: {
            getForm() {

                //  If we are updating
                if(this.version && this.mode == 'Update') {

                    return useForm({
                        description: this.version.description,
                        features: this.version.features ?? [],
                        number: this.version.number,
                        reset_builder: false,
                        confirmation_code: '',

                        //  Indicate that we should return to the app view
                        destination: route().current()
                    });

                //  If we are deleting
                }else if(this.version && ['Delete', 'Restore'].includes(this.mode)) {

                    return useForm({
                        confirmation_code: '',
                        deleted_at: this.version.deleted_at
                    });

                //  If we are creating
                }else if(this.mode == 'Create') {

                    return useForm({
                        clone_version_id: this.$page.props.versionsPayload.length ? this.$page.props.versionsPayload[0].id : null,
                        description: '',
                        features: [],
                        number: ''
                    });

                }else{

                    return useForm({});

                }
            },
            handleAction(closeModal) {

                //  If we are updating
                if(this.version && this.mode == 'Update') {

                    this.updateVersion(closeModal);

                //  If we are deleting
                }else if(this.version && this.mode == 'Delete') {

                    this.deleteVersion(closeModal);

                //  If we are restoring
                }else if(this.version && this.mode == 'Restore') {

                    this.restoreVersion(closeModal);

                //  If we are creating
                }else if(this.mode == 'Create') {

                    this.createVersion(closeModal);

                }

            },
            createVersion(closeModal) {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to create version
                this.form.post(route('versions.create', { project: this.route().params.project, app: this.route().params.app,  }), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'Version created successfully',
                            type: 'success'
                        });
                        self.form.reset();
                        closeModal();
                    },
                    onError: (errors) => {
                        self.$message({
                            message: 'Sorry, we found some mistakes',
                            type: 'error'
                        });
                    },
                });

            },
            updateVersion(closeModal) {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to create version
                this.form.put(route('version.update', { project: this.route().params.project, app: this.route().params.app, version: this.version.id }), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'Version updated successfully',
                            type: 'success'
                        });
                        self.form.reset();
                        closeModal();
                    },
                    onError: (errors) => {
                        self.$message({
                            message: 'Sorry, we found some mistakes',
                            type: 'error'
                        });
                    },
                });

            },
            restoreVersion(closeModal) {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to restore version
                this.form.post(route('version.restore', { project: this.route().params.project, app: this.route().params.app, version: this.version.id }), {
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'Version restored successfully',
                            type: 'success'
                        });
                        self.form.reset();
                        closeModal();
                    },
                    onError: (errors) => {
                        self.$message({
                            message: 'Sorry, we found some mistakes',
                            type: 'error'
                        });
                    },
                });

            },
            deleteVersion(closeModal) {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to create version
                this.form.delete(route('version.delete', { project: this.route().params.project, app: this.route().params.app, version: this.version.id }), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'Version deleted successfully',
                            type: 'success'
                        });
                        self.form.reset();
                        closeModal();
                    },
                    onError: (errors) => {
                        self.$message({
                            message: 'Sorry, we found some mistakes',
                            type: 'error'
                        });
                    },
                });

            },
            cancelCreateVersion() {

                //  Clear existing errors
                this.form.clearErrors();

                //  Reset the form
                this.form.reset();

            }
        }
    };

</script>
