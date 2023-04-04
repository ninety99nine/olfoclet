<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        @open="resetForm()"
        @close="$emit('close')"
        :primaryAction="createNavigation"
        :primaryText="modeInCaps + ' Navigation'"
        :defaultAction="cancelCreateNavigation">

        <!-- Modal Title -->
        <template v-slot:title>{{ modeInCaps + ' Navigation' }}</template>

        <!-- Modal Content -->
        <p v-if="mode == 'clone'" class="text-sm text-gray-500 mb-5">Cloning <span class="text-blue-500 font-bold">{{ navigation.name }}</span> navigation</p>

        <!-- Active State -->
        <SelectActiveState v-model="form.active" class="mb-6"></SelectActiveState>

        <!-- Name -->
        <DefaultInput v-model="form.name" label="Name" :error="form.errors.name" class="mb-6"></DefaultInput>

        <!-- Type -->
        <DefaultSelect v-model="form.selected_type" :options="navigationTypes" label="Navigation Trigger" :error="form.errors.selected_type" class="mb-6"></DefaultSelect>

        <template v-if="form.selected_type == 'custom'">

            <!-- Input(s) -->
            <TextOrCodeEditor v-model="form[this.form.selected_type].inputs" label="Input(s)" placeholder="1, 2, 3" :error="form.errors.inputs" class="mb-6"></TextOrCodeEditor>

        </template>

        <template v-else-if="form.selected_type == 'regex'">

            <!-- Regex Pattern -->
            <TextOrCodeEditor v-model="form[this.form.selected_type].rule" label="Regex Rule" placeholder="/[a-zA-Z]+/" :error="form.errors.rule" class="mb-6"></TextOrCodeEditor>

        </template>

        <!-- Step -->
        <TextOrCodeEditor v-model="form[this.form.selected_type].step" label="Step" placeholder="1" note="Loops to navigate" :error="form.errors.step" class="mb-6"></TextOrCodeEditor>

        <!-- Screen Selector -->
        <ScreenOrDisplaySelector v-model="form[this.form.selected_type].link" label="Navigation Target" info="Screen to trigger navigation" :showDisplays="false" :error="form.errors.link" class="mb-6"></ScreenOrDisplaySelector>

        <div class="flex items-end justify-between">

            <!-- Comment -->
            <DefaultTextArea v-model="form.comment" label="Comment" class="flex-1 mr-4"></DefaultTextArea>

            <!-- Color Picker -->
            <DefaultColorPicker v-model="form.hexColor"></DefaultColorPicker>

        </div>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <PrimaryButton v-if="mode == 'create'" name="trigger" class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <span v-if="$slots.default" class="ml-2">
                    <slot></slot>
                </span>
            </PrimaryButton>

            <svg v-else-if="mode == 'clone'" name="trigger" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 cursor-pointer hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>

            <svg v-else-if="mode == 'update'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 cursor-pointer hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>

        </template>

    </DefaultModal>

</template>

<script>

    import _, { cloneDeep } from 'lodash';
    import { useForm } from '@inertiajs/vue3'
    import DefaultInput from "@components/Input/DefaultInput";
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultSelect from '@components/Select/DefaultSelect';
    import PrimaryButton from "@components/Button/PrimaryButton";
    import DefaultTextArea from "@components/TextArea/DefaultTextArea";
    import SelectActiveState from "@builderComponents/SelectActiveState";
    import DefaultColorPicker from '@components/ColorPicker/DefaultColorPicker';
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';
    import ScreenOrDisplaySelector from '@builderComponents/ScreenOrDisplaySelector';

    export default {
        components: { useForm, DefaultInput, DefaultModal, DefaultSelect, PrimaryButton, DefaultColorPicker, DefaultTextArea, SelectActiveState, TextOrCodeEditor, ScreenOrDisplaySelector },
        props: {
            navigations: {
                type: Array
            },
            navigation: {
                type: Object,
                default: null
            },
            index: {
                type: Number,
                default: null
            },
            mode: {
                type: String,
                default: null,
                validator(value) {
                    return ['create', 'clone', 'update'].includes(value)
                }
            },
        },
        data() {
            return {
                form: null,
                navigationTypes: [
                    {
                        label: 'Custom Inputs',
                        value: 'custom'
                    },
                    {
                        label: 'Regex Match',
                        value: 'regex'
                    }
                ],
                useVersionBuilder: useVersionBuilder()
            }
        },
        computed: {
            modeInCaps() {

                return this.mode.charAt(0).toUpperCase() + this.mode.slice(1);

            }
        },
        methods: {
            resetForm(){

                if( this.mode == 'create') {

                    this.form = useForm(
                        useVersionBuilder().getBlankNavigation(),
                    );

                }else if( this.mode == 'clone') {

                    this.form = useForm(
                         useVersionBuilder().getClonedNavigation(this.navigation)
                    );

                }else if( this.mode == 'update') {

                    this.form = useForm({
                        ...useVersionBuilder().getBlankNavigation(),
                        ..._.cloneDeep(this.navigation)
                    });

                }
            },
            createNavigation(closeModal) {

                //  Clear existing errors
                this.form.clearErrors();

                //  Check if we have an existing navigation using the same name
                const totalExactMatches = this.useVersionBuilder.searchNavigations(this.navigations, this.form.name, true).length;

                if( this.form.name.length == 0 ) {

                    this.form.setError('name', 'The navigation name is required');

                }else if( this.form.name.length < 3 ) {

                    this.form.setError('name', 'The navigation name is too short');

                }else if( this.form.name.length > 50 ) {

                    this.form.setError('name', 'The navigation name is too long');

                }else if( ['create', 'clone'].includes(this.mode) && totalExactMatches ) {

                    this.form.setError('name', 'This navigation name is already in use');

                }else if( this.mode == 'update' && totalExactMatches && this.navigation.name !== this.form.name ) {

                    this.form.setError('name', 'This navigation name is already in use');

                }

                if( this.form.selected_type == 'custom' ) {

                    if( this.form[this.form.selected_type].inputs.code_editor_mode == false && ['', null].includes(this.form[this.form.selected_type].inputs.text) ) {

                        this.form.setError('inputs', 'The navigation input is required');

                    }else if( this.form[this.form.selected_type].inputs.code_editor_mode == true && ['', null].includes(this.form[this.form.selected_type].inputs.code_editor_text) ) {

                        this.form.setError('inputs', 'The navigation input is required');

                    }

                }else if( this.form.selected_type == 'regex' ) {

                    if( this.form[this.form.selected_type].rule.code_editor_mode == false && ['', null].includes(this.form[this.form.selected_type].rule.text) ) {

                        this.form.setError('rule', 'The navigation regex rule is required');

                    }else if( this.form[this.form.selected_type].rule.code_editor_mode == true && ['', null].includes(this.form[this.form.selected_type].rule.code_editor_text) ) {

                        this.form.setError('rule', 'The navigation regex rule is required');

                    }

                }

                if( this.form[this.form.selected_type].step.code_editor_mode == false && ['', null].includes(this.form[this.form.selected_type].step.text) ) {

                    this.form.setError('step', 'The navigation step is required');

                }else if( this.form[this.form.selected_type].step.code_editor_mode == true && ['', null].includes(this.form[this.form.selected_type].step.code_editor_text) ) {

                    this.form.setError('step', 'The navigation step is required');

                }


                if( this.form[this.form.selected_type].link.code_editor_mode == false && ['', null].includes(this.form[this.form.selected_type].link.text) ) {

                    this.form.setError('link', 'The navigation link is required');

                }else if( this.form[this.form.selected_type].link.code_editor_mode == true && ['', null].includes(this.form[this.form.selected_type].link.code_editor_text) ) {

                    this.form.setError('link', 'The navigation link is required');

                }

                if( this.form.hasErrors === false ) {

                    let navigation = this.form.data();

                    if( this.mode == 'update' ) {

                        this.useVersionBuilder.updateNavigation(this.navigations, navigation, this.index);

                    }else{

                        this.useVersionBuilder.addNavigation(this.navigations, navigation);

                    }

                    //  Determine the action name e.g created, cloned or updated
                    const actionName = (this.mode + 'd');

                    this.$message({
                        message: 'Navigation '+actionName+' successfully',
                        type: 'success'
                    });

                    closeModal();

                }

            },
            cancelCreateNavigation() {

                //  Clear existing errors
                this.form.clearErrors();

            }
        }
    };

</script>
