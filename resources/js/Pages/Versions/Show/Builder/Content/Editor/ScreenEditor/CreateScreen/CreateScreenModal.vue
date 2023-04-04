<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        @open="resetForm()"
        @close="$emit('close')"
        :primaryAction="createScreen"
        :primaryText="action + ' Screen'"
        :defaultAction="cancelCreateScreen">

        <!-- Modal Title -->
        <template v-slot:title>{{ action + ' Screen' }}</template>

        <!-- Modal Content -->
        <template v-slot="{ firePrimaryAction }">
            <p v-if="screen" class="text-sm text-gray-500 mb-5">Cloning <span class="text-blue-500 font-bold">{{ screen.name }}</span> screen</p>
            <DefaultInput v-model="form.name" label="Name" placeholder="Home" :error="form.errors.name" @keyup.enter="firePrimaryAction" :autofocus="true"></DefaultInput>
        </template>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <svg v-if="screen" name="trigger" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>

            <PrimaryButton v-else name="trigger" class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <slot></slot>
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
            screen: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                form: null,
                useVersionBuilder: useVersionBuilder()
            }
        },
        computed: {
            action() {
                return this.screen ? 'Clone' : 'Create'
            }
        },
        methods: {
            resetForm(){
                this.form = useForm(
                    this.screen ? useVersionBuilder().getClonedScreen(this.screen)
                                : useVersionBuilder().getBlankScreen()
                );
            },
            createScreen(closeModal) {

                this.form.clearErrors();

                //  Check if we have an existing screen using the same name
                const totalExactMatches = this.useVersionBuilder.searchScreens(this.form.name, true).length;

                if( this.form.name.length == 0 ) {

                    this.form.setError('name', 'The screen name is required');

                }else if( this.form.name.length < 3 ) {

                    this.form.setError('name', 'The screen name is too short');

                }else if( this.form.name.length > 50 ) {

                    this.form.setError('name', 'The screen name is too long');

                }else if( totalExactMatches > 0) {

                    this.form.setError('name', 'This screen name is already in use');

                }else{

                    let screen = this.form.data();

                    this.useVersionBuilder.addScreen(screen);
                    this.useVersionBuilder.selectScreen(screen);

                    this.$message({
                        message: 'Screen '+(this.screen ? 'cloned' : 'created')+' successfully',
                        type: 'success'
                    });

                    closeModal();

                }

            },
            cancelCreateScreen() {

                //  Clear existing errors
                this.form.clearErrors();

            }
        }
    };

</script>
