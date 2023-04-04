<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        @open="resetForm()"
        @close="$emit('close')"
        :primaryAction="createDisplay"
        :primaryText="action + ' Display'"
        :defaultAction="cancelCreateDisplay">

        <!-- Modal Title -->
        <template v-slot:title>{{ action + ' Display' }}</template>

        <!-- Modal Content -->
        <template v-slot="{ firePrimaryAction }">
            <p v-if="mode == 'clone'" class="text-sm text-gray-500 mb-5">Cloning <span class="text-blue-500 font-bold">{{ display.name }}</span> display</p>
            <DefaultInput v-model="form.name" label="Name" placeholder="Home" :error="form.errors.name" @keyup.enter="firePrimaryAction" :autofocus="true"></DefaultInput>
        </template>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <svg v-if="mode == 'clone'" name="trigger" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>

            <PrimaryButton v-else name="trigger" class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <slot />
            </PrimaryButton>

        </template>

    </DefaultModal>

</template>

<script>

    import { useForm } from '@inertiajs/vue3'
    import DefaultInput from "@components/Input/DefaultInput";
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import PrimaryButton from "@components/Button/PrimaryButton";

    export default {
        components: { useForm, DefaultInput, DefaultModal, PrimaryButton },
        props: {
            display: {
                type: Object,
                default: null
            },
            mode: {
                type: String,
                default: null,
                validator(value) {
                    return ['create', 'clone'].includes(value)
                }
            },
        },
        data() {
            return {
                form: null,
                useVersionBuilder: useVersionBuilder()
            }
        },
        computed: {
            action() {
                return this.display ? 'Clone' : 'Create'
            }
        },
        methods: {
            resetForm(){

                if( this.mode == 'create') {

                    this.form = useForm(
                        useVersionBuilder().getBlankDisplay()
                    );

                }else if( this.mode == 'clone') {

                    this.form = useForm(
                        useVersionBuilder().getClonedDisplay(this.display)
                    );

                }
            },
            createDisplay(closeModal) {

                this.form.clearErrors();

                //  Check if we have an existing display using the same name
                const totalExactMatches = this.useVersionBuilder.searchScreenDisplays(this.form.name, true).length;

                if( this.form.name.length == 0 ) {

                    this.form.setError('name', 'The display name is required');

                }else if( this.form.name.length < 3 ) {

                    this.form.setError('name', 'The display name is too short');

                }else if( this.form.name.length > 50 ) {

                    this.form.setError('name', 'The display name is too long');

                }else if(totalExactMatches ) {

                    this.form.setError('name', 'This display name is already in use');

                }

                if( this.form.hasErrors === false ) {

                    let display = this.form.data();

                    this.useVersionBuilder.addDisplay(display);
                    this.useVersionBuilder.selectDisplay(display);

                    this.$message({
                        message: 'Display '+(this.display ? 'cloned' : 'created')+' successfully',
                        type: 'success'
                    });

                    closeModal();

                }

            },
            cancelCreateDisplay() {

                //  Clear existing errors
                this.form.clearErrors();

            }
        }
    };

</script>
