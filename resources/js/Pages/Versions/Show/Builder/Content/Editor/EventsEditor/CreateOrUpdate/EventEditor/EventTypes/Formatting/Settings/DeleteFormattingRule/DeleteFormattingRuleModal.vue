<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        @open="$emit('open')"
        @close="$emit('close')"
        dangerText="Delete Formatting Rule"
        :dangerAction="deleteFormattingRule">

        <!-- Modal Title -->
        <template v-slot:title>Delete Formatting Rule</template>

        <!-- Modal Content (If we are deleting single rule) -->
        <p v-if="mode == 'single' && rule" class="text-sm text-gray-500 mb-5">Are you sure you want to delete the <span class="text-blue-500 font-bold">{{ rule.name }}</span> formatting rule. After this formatting rule is deleted you cannot recover it again.</p>

        <!-- Modal Content (If we are deleting multiple rule) -->
        <p v-else-if="mode == 'multiple'" class="text-sm text-gray-500 mb-5">Are you sure you want to delete <span class="text-blue-500 font-bold">{{ indexes.length }}</span> {{ indexes.length == 1 ? 'formatting rule' : 'formatting rules' }}. After {{ indexes.length == 1 ? 'this formatting rule is deleted you cannot recover it again' : 'these formatting rules are deleted you cannot recover them again' }}.</p>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <svg v-if="mode == 'single'" name="trigger" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 hover:text-red-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>

            <Transition name="fade">

                <div v-if="mode == 'multiple' && indexes.length" class="flex items-center justify-end">

                    <span class="text-gray-500 text-xs mr-4">{{ indexes.length + (indexes.length == 1 ? ' rule' : ' rules') }} selected</span>

                    <DangerButton class="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                    </DangerButton>

                </div>

            </Transition>

        </template>

    </DefaultModal>

</template>

<script>

    import DangerButton from "@components/Button/DangerButton";
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';

    export default {
        components: { DangerButton, DefaultModal },
        props: {
            rule: Object,
            index: Number,
            indexes: Array,
            rules: Array,
            mode: {
                type: String,
                default: 'single',
                validator(value) {
                    return ['single', 'multiple'].includes(value)
                }
            },
        },
        data() {
            return {
                useVersionBuilder: useVersionBuilder()
            }
        },
        methods: {
            deleteFormattingRule(closeModal) {

                if( this.mode == 'single' ) {

                    this.useVersionBuilder.removeFormattingRuleByIndex(this.rules, this.index);

                    this.$message({
                        message: 'Formatting rule deleted successfully',
                        type: 'success'
                    });

                    this.$emit('deleted');

                }else if( this.mode == 'multiple' && this.indexes.length ){

                    this.useVersionBuilder.removeFormattingRulesByIndexes(this.rules, this.indexes);

                    this.$message({
                        message: ( this.indexes == 1 ? 'Formatting rule' : 'Formatting rules' ) + ' deleted successfully',
                        type: 'success'
                    });

                    this.$emit('deleted');

                }

                closeModal();

            }
        }
    };

</script>
