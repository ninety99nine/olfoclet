<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        @open="resetForm()"
        @close="$emit('close')"
        :primaryAction="submitFormattingRule"
        :defaultAction="cancelCreateFormattingRule"
        :primaryText="modeInCaps + ' Formatting Rule'">

        <!-- Modal Title -->
        <template v-slot:title>{{ modeInCaps + ' Formatting Rule' }}</template>

        <!-- Modal Content -->
        <p v-if="mode == 'clone'" class="text-sm text-gray-500 mb-5">Cloning <span class="text-blue-500 font-bold">{{ rule.name }}</span> rule</p>

        <!-- Active State -->
        <SelectActiveState v-model="form.active" class="mb-6"></SelectActiveState>

        <!-- Name -->
        <DefaultInput v-model="form.name" label="Name" :error="form.errors.name" class="mb-6"></DefaultInput>

        <!-- Explainer -->
        <PrimaryAlert v-if="form.type == 'custom_code'" class="mb-6">
            <span class="text-justify">
                Write code to munipulate the target value. Make sure to return the final result.
            </span>
        </PrimaryAlert>

        <!-- Code Editor -->
        <CodeEditor v-if="form.type == 'custom_code'" v-model="form.value" class="mb-6" height="300px"></CodeEditor>

        <template v-else>

            <!-- Value -->
            <TextOrCodeEditor v-if="form.hasOwnProperty('value')" v-model="form.value" :label="valueLabel" :error="form.errors.value" class="mb-6"></TextOrCodeEditor>

            <!-- Value 2 -->
            <TextOrCodeEditor v-if="form.hasOwnProperty('value_2')" v-model="form.value_2" :label="value2Label" :error="form.errors.value_2" class="mb-6"></TextOrCodeEditor>

        </template>

        <div class="flex items-end justify-between">

            <!-- Comment -->
            <DefaultTextArea v-model="form.comment" label="Comment" class="flex-1 mr-4"></DefaultTextArea>

            <!-- Color Picker -->
            <DefaultColorPicker v-model="form.hexColor"></DefaultColorPicker>

        </div>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <svg v-if="mode == 'clone'" name="trigger" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 cursor-pointer hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import DefaultInput from "@components/Input/DefaultInput";
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import CodeEditor from '@components/CodeEditor/CodeEditor';
    import DefaultTextArea from "@components/TextArea/DefaultTextArea";
    import SelectActiveState from "@builderComponents/SelectActiveState";
    import DefaultColorPicker from '@components/ColorPicker/DefaultColorPicker';
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        components: { useForm, PrimaryAlert, DefaultInput, DefaultModal, CodeEditor, DefaultColorPicker, DefaultTextArea, SelectActiveState, TextOrCodeEditor },
        props: {
            rules: {
                type: Array
            },
            rule: {
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
                    return ['clone', 'update'].includes(value)
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
            modeInCaps() {
                return this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
            },
            valueLabel() {
                if( this.form.type == 'convert_to_money' ) {
                    return 'Currency Symbol';
                }else if( this.form.type == 'substr' ) {
                    return 'Start Index';
                }else if( ['replace_with', 'replace_first_with', 'replace_last_with'].includes(this.form.type) ) {
                    return 'Search';
                }else if( this.form.type == 'plural_or_singular' ) {
                    return 'Word';
                }else if( this.form.type == 'random_string' ) {
                    return 'Number of random characters';
                }else{
                    return this.form.type.split('_').map((word) => {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                    }).join(' ');
                }
            },
            value2Label() {
                if( this.form.type == 'limit' ) {
                    return 'Trailing characters';
                }else if( this.form.type == 'substr' ) {
                    return 'Length';
                }else if( ['replace_with', 'replace_first_with', 'replace_last_with'].includes(this.form.type) ) {
                    return 'Replace';
                }
            },
        },
        methods: {
            resetForm(){
                this.form = useForm(_.cloneDeep(this.rule));
            },
            submitFormattingRule(closeModal) {

                //  Clear existing errors
                this.form.clearErrors();

                //  Check if we have an existing rule using the same name
                const totalExactMatches = this.useVersionBuilder.searchFormattingRules(this.rules, this.form.name, true).length;

                if( this.form.name.length == 0 ) {

                    this.form.setError('name', 'The rule name is required');

                }

                if( this.mode == 'clone' && totalExactMatches ) {

                    this.form.setError('name', 'This name is already in use');

                }else if( this.mode == 'update' && totalExactMatches && this.form.name !== this.form.name ) {

                    this.form.setError('name', 'This name is already in use');

                }

                if( this.form.hasOwnProperty('value') ){

                    if( this.form.value.code_editor_mode == false && (this.form.value.text == '' || this.form.value.text == null) ) {

                        this.form.setError('value', 'The value is required');

                    }else if( this.form.value.code_editor_mode == true && (this.form.value.code_editor_text == '' || this.form.value.code_editor_text == null) ) {

                        this.form.setError('value', 'The value is required');

                    }

                }

                if( this.form.hasOwnProperty('value_2') ){

                    if( this.form.value_2.code_editor_mode == false && (this.form.value_2.text == '' || this.form.value_2.text == null) ) {

                        this.form.setError('value_2', 'The value is required');

                    }else if( this.form.value_2.code_editor_mode == true && (this.form.value_2.code_editor_text == '' || this.form.value_2.code_editor_text == null) ) {

                        this.form.setError('value_2', 'The value is required');

                    }

                }

                if( this.form.hasErrors === false ) {

                    let rule = this.form.data();

                    if( this.mode == 'update' ) {

                        this.useVersionBuilder.updateFormattingRule(this.rules, rule, this.index);

                    }else{

                        this.useVersionBuilder.addFormattingRule(this.rules, rule);

                    }

                    //  Determine the action name e.g cloned or updated
                    const actionName = (this.mode + 'd');

                    this.$message({
                        message: 'Formatting rule '+actionName+' successfully',
                        type: 'success'
                    });

                    closeModal();

                }

            },
            cancelCreateFormattingRule() {

                //  Clear existing errors
                this.form.clearErrors();

            }
        }
    };

</script>
