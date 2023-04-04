<template>

    <!-- Create App Modal -->
    <DefaultModal defaultText="Cancel"
        @open="isOpen = true; $emit('open')"
        @close="isOpen = false; $emit('close')"
        :defaultAction="cancelCreateApp" :isLoading="form.processing"
        :dangerText="['Delete'].includes(this.mode) ? mode + ' App' : ''" :dangerAction="handleAction"
        :primaryText="['Create', 'Update', 'Restore'].includes(mode) ? (['Create', 'Restore'].includes(this.mode) ? mode + ' App' : 'Save Changes') : ''" :primaryAction="handleAction">

        <!-- Create App Title (Modal Title) -->
        <template v-slot:title>{{ mode }} App</template>

        <!-- Create App Content (Modal Content) -->
        <CreateOrUpdateAppForm :form="form" :app="app" :mode="mode" />

        <!-- Create App Button (Modal Trigger) -->
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
                    {{ app.deleted_at ? mode : 'Trash' }}
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
                    {{ mode }} App
                </PrimaryButton>
            </template>

        </template>

    </DefaultModal>

</template>

<script>

    import { useForm } from '@inertiajs/vue3'
    import CreateOrUpdateAppForm from './CreateOrUpdateAppForm';
    import DefaultModal from "@components/Modal/DefaultModal";
    import DangerButton from "@components/Button/DangerButton.vue";
    import PrimaryButton from "@components/Button/PrimaryButton.vue";

    export default {
        components: { useForm, CreateOrUpdateAppForm, DefaultModal, DangerButton, PrimaryButton },
        props: {
            app: {
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
            }
        },
        data() {
            return {
                form: this.getForm(),
                isOpen: false
            }
        },
        watch: {
            app(newValue, oldValue) {
                if( this.isOpen == false ) {
                    this.form = this.getForm();
                }
            }
        },
        methods: {
            getForm() {

                //  If we are updating
                if(this.app && this.mode == 'Update') {

                    return useForm({
                        name: this.app.name,
                        online: this.app.online,
                        description: this.app.description,
                        offline_message: this.app.offline_message,
                        active_version_id: this.app.active_version_id,

                        //  Indicate the shared shortcode
                        shared_code: this.app.short_code.shared_code,

                        //  Indicate the dedicated shortcode
                        overide_dedicated_code: false,
                        dedicated_code: this.app.short_code.dedicated_code,

                        shared_short_code_id: this.app.short_code.shared_short_code_id,

                        //  Indicate that we should return to the project view
                        destination: route().current()
                    });

                //  If we are deleting
                }else if(this.app && ['Delete', 'Restore'].includes(this.mode)) {

                    return useForm({
                        confirmation_code: '',
                        deleted_at: this.app.deleted_at
                    });

                //  If we are creating
                }else if(this.mode == 'Create') {

                    return useForm({
                        name: '',
                        online: true,
                        description: '',
                        offline_message: 'This service is currently not available',
                        shared_short_code_id: this.$page.props.sharedShortCodesPayload[0].id
                    });

                }else{

                    return useForm({});

                }
            },
            handleAction(closeModal) {

                //  If we are updating
                if(this.app && this.mode == 'Update') {

                    this.updateApp(closeModal);

                //  If we are deleting
                }else if(this.app && this.mode == 'Delete') {

                    this.deleteApp(closeModal);

                //  If we are restoring
                }else if(this.app && this.mode == 'Restore') {

                    this.restoreApp(closeModal);

                //  If we are creating
                }else if(this.mode == 'Create') {

                    this.createApp(closeModal);

                }

            },
            createApp(closeModal) {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to create app
                this.form.post(route('apps.create', { project: this.route().params.project }), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'App created successfully',
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
            updateApp(closeModal) {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to update app
                this.form.put(route('app.update', { project: this.route().params.project, app: this.app.id }), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'App updated successfully',
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
            restoreApp(closeModal) {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to restore app
                this.form.post(route('app.restore', { project: this.route().params.project, app: this.app.id }), {
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'App restored successfully',
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
            deleteApp(closeModal) {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to create app
                this.form.delete(route('app.delete', { project: this.route().params.project, app: this.app.id }), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'App deleted successfully',
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
            cancelCreateApp() {

                //  Clear existing errors
                this.form.clearErrors();

                //  Reset the form
                this.form.reset();

            }
        }
    };

</script>

