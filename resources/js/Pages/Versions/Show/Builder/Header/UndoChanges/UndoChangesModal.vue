<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        :warningAction="undoChanges"
        :warningText="form.processing ? '': 'Undo Changes'">

        <!-- Modal Title -->
        <template v-slot:title>Undo Changes</template>

        <!-- Explainer -->
        <PrimaryAlert>

            <span class="block text-justify">
                We have detected some changes that have not yet been saved for <span class="font-semibold text-blue-500">{{ name }}</span>.
                If you would like to revert back to the previous state, then you may undo these unsaved changes. Please note that this
                action cannot be undone and all unsaved changes will be lost once completed.
            </span>

        </PrimaryAlert>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <!-- Undo Changes Button -->
            <WarningButton>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m15 15-6 6m0 0-6-6m6 6V9a6 6 0 0 1 12 0v3" />
                </svg>
                Undo Changes
            </WarningButton>

        </template>

    </DefaultModal>

</template>

<script>

    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import WarningButton from '@components/Button/WarningButton';

    export default {
        props: ['form'],
        components: { PrimaryAlert, DefaultModal, WarningButton },
        data() {
            return {
                useVersionBuilder: useVersionBuilder(),
                project: this.$page.props.projectPayload,
                version: this.$page.props.versionPayload,
                app: this.$page.props.appPayload,
            }
        },
        computed: {
            name() {
                return this.app.name +' - version '+ this.version.number;
            }
        },
        methods: {
            undoChanges (closeModal) {

                this.useVersionBuilder.setOriginalBuilder();

                this.$message({
                    message: 'Changes reversed',
                    type: 'success'
                });

                closeModal();

            },
        }
    };

</script>
