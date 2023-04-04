<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        @open="resetForm()"
        @close="$emit('close')"
        :primaryAction="createStaticOption"
        :primaryText="modeInCaps + ' Option'"
        :defaultAction="cancelCreateStaticOption">

        <!-- Modal Title -->
        <template v-slot:title>{{ modeInCaps + ' Option' }}</template>

        <!-- Modal Content -->
        <p v-if="mode == 'clone'" class="text-sm text-gray-500 mb-5">Cloning option</p>

        <!-- Tabs -->
        <DefaultTabs v-model="selectedTab" :tabs="tabs" class="mb-8" color="blue"></DefaultTabs>

        <Transition name="fade" mode="out-in" appear>

            <div v-if="selectedTab == 1">

                <!-- Active State -->
                <SelectActiveState v-model="form.active" class="mb-4"></SelectActiveState>

                <!-- Static Option Name -->
                <TextOrCodeEditor v-model="form.name" label="Name" :error="form.errors.name" class="mb-4"></TextOrCodeEditor>

                <!-- Static Option Value -->
                <TextOrCodeEditor v-model="form.value" label="Value" :error="form.errors.value" class="mb-4"></TextOrCodeEditor>

                <!-- Static Option Input -->
                <TextOrCodeEditor v-model="form.input" label="Input" :error="form.errors.input" class="mb-4"></TextOrCodeEditor>

                <!-- Screen / Display Selector -->
                <ScreenOrDisplaySelector v-model="form.link"></ScreenOrDisplaySelector>

            </div>

            <div v-else>

                <!-- Static Option Top Separator -->
                <TextOrCodeEditor v-model="form.separator.top" label="Top Separator" placeholder="" :error="form.errors.separator_top" class="mb-4"></TextOrCodeEditor>

                <!-- Static Option Bottom Separator -->
                <TextOrCodeEditor v-model="form.separator.bottom" label="Bottom Separator" placeholder="" :error="form.errors.separator_bottom" class="mb-4"></TextOrCodeEditor>

                <div class="flex items-end justify-between">

                    <!-- Comment -->
                    <DefaultTextArea v-model="form.comment" label="Comment" class="flex-1 mr-4"></DefaultTextArea>

                    <!-- Color Picker -->
                    <DefaultColorPicker v-model="form.hexColor"></DefaultColorPicker>

                </div>

            </div>

        </Transition>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <PrimaryButton v-if="mode == 'create'" name="trigger" class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <span>Create Option</span>
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
    import DefaultTabs from '@components/Tabs/DefaultTabs';
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import PrimaryButton from "@components/Button/PrimaryButton";
    import DefaultTextArea from "@components/TextArea/DefaultTextArea";
    import SelectActiveState from "@builderComponents/SelectActiveState";
    import DefaultColorPicker from '@components/ColorPicker/DefaultColorPicker';
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';
    import ScreenOrDisplaySelector from '@builderComponents/ScreenOrDisplaySelector';

    export default {
        components: { useForm, DefaultTabs, DefaultModal, PrimaryButton, DefaultColorPicker, DefaultTextArea, SelectActiveState, TextOrCodeEditor, ScreenOrDisplaySelector },
        props: {
            staticOptions: {
                type: Array
            },
            staticOption: {
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
                tabs: [
                    {
                        label: 'General',
                        value: 1
                    },
                    {
                        label: 'Optional',
                        value: 2
                    }
                ],
                selectedTab: 1,
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
                        useVersionBuilder().getBlankStaticOption(this.staticOptions),
                    );

                }else if( this.mode == 'clone') {

                    this.form = useForm(
                         useVersionBuilder().getClonedStaticOption(this.staticOption)
                    );

                }else if( this.mode == 'update') {

                    this.form = useForm({
                        ...useVersionBuilder().getBlankStaticOption(),
                        ..._.cloneDeep(this.staticOption)
                    });

                }
            },
            createStaticOption(closeModal) {

                //  Clear existing errors
                this.form.clearErrors();

                //  Check if we have an existing static option using the same name
                const totalExactMatchesByName = this.useVersionBuilder.searchStaticOptionsByName(this.staticOptions, this.form.name, true).length;
                const totalExactMatchesByInput = this.useVersionBuilder.searchStaticOptionsByInput(this.staticOptions, this.form.input, true).length;

                if( this.form.name.code_editor_mode == false && (this.form.name.text == '' || this.form.name.text == null) ) {

                    this.form.setError('name', 'The option name is required');

                }else if( this.form.name.code_editor_mode == true && (this.form.name.code_editor_text == '' || this.form.name.code_editor_text == null) ) {

                    this.form.setError('name', 'The option name is required');

                }else if( ['create', 'clone'].includes(this.mode) && totalExactMatchesByName ) {

                    this.form.setError('name', 'This option name is already in use');

                }

                if( this.form.input.code_editor_mode == false && (this.form.input.text == '' || this.form.input.text == null) ) {

                    this.form.setError('input', 'The option input is required');

                }else if( this.form.input.code_editor_mode == true && (this.form.input.code_editor_text == '' || this.form.input.code_editor_text == null) ) {

                    this.form.setError('input', 'The option input is required');

                }else if( ['create', 'clone'].includes(this.mode) && totalExactMatchesByInput ) {

                    this.form.setError('input', 'This option input is already in use');

                }else if( this.mode == 'update' && totalExactMatchesByInput &&
                    (
                        (this.staticOption.input.code_editor_mode == false && (this.staticOption.input.text !== this.form.input.text)) ||
                        (this.staticOption.input.code_editor_mode == true && (this.staticOption.input.code_editor_text !== this.form.input.code_editor_text))
                    )
                ) {

                    this.form.setError('input', 'This option input is already in use');

                }

                if( this.form.hasErrors === false ) {

                    let staticOption = this.form.data();

                    if( this.mode == 'update' ) {

                        this.useVersionBuilder.updateStaticOption(this.staticOptions, staticOption, this.index);

                    }else{

                        this.useVersionBuilder.addStaticOption(this.staticOptions, staticOption);

                    }

                    //  Determine the action name e.g created, cloned or updated
                    const actionName = (this.mode + 'd');

                    this.$message({
                        message: 'Option '+actionName+' successfully',
                        type: 'success'
                    });

                    closeModal();

                }

            },
            cancelCreateStaticOption() {

                //  Clear existing errors
                this.form.clearErrors();

            }
        }
    };

</script>
