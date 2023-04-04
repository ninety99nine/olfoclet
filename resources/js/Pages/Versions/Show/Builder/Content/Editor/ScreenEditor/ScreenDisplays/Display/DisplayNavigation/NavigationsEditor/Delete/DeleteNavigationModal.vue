<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        @open="$emit('open')"
        @close="$emit('close')"
        dangerText="Delete Navigation"
        :dangerAction="deleteNavigation">

        <!-- Modal Title -->
        <template v-slot:title>Delete Navigation</template>

        <!-- Modal Content -->
        <p class="text-sm text-gray-500 mb-5">Are you sure you want to delete the <span class="text-blue-500 font-bold">{{ navigation.name }}</span> navigation. After this navigation is deleted you cannot recover it again.</p>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <PrimaryButton v-if="showButton" name="trigger" class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
            </PrimaryButton>

            <svg v-else name="trigger" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>

        </template>

    </DefaultModal>

</template>

<script>

    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import PrimaryButton from "@components/Button/PrimaryButton";

    export default {
        components: { DefaultModal, PrimaryButton },
        props: {
            navigations: {
                type: Object,
                default: () => {
                    return [];
                }
            },
            navigation: {
                type: Object,
                default: null
            },
            index: {
                type: Number,
                default: null
            },
            showButton: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                useVersionBuilder: useVersionBuilder()
            }
        },
        methods: {
            deleteNavigation(closeModal) {

                //  Remove the current navigation
                this.useVersionBuilder.removeNavigationByIndex(this.navigations, this.index);

                this.$message({
                    message: 'Navigation deleted successfully',
                    type: 'success'
                });

                closeModal();

            }
        }
    };

</script>
