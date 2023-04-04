<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        @open="resetForm()"
        @close="$emit('close')"
        :primaryAction="createVariable"
        :primaryText="modeInCaps + ' Variable'"
        :defaultAction="cancelCreateVariable">

        <!-- Modal Title -->
        <template v-slot:title>{{ modeInCaps + ' Variable' }}</template>

        <!-- Modal Content -->
        <p v-if="mode == 'clone'" class="text-sm text-gray-500 mb-5">Cloning <span class="text-blue-500 font-bold">{{ variable.name }}</span> variable</p>

        <!-- Name -->
        <VariableInput v-model="form.name" label="Name" placeholder="language" :error="form.errors.name" :hintGlobalVariables="false" @onSetError="form.setError('name', $event)" @onClearError="form.clearErrors('name')" class="mb-6"></VariableInput>

        <!-- Original Value -->
        <TextOrCodeEditor v-model="form.value" label="Value" placeholder="{{ language }}" note="Original value" :error="form.errors.value" class="mb-6"></TextOrCodeEditor>

        <!-- Enable Default Value -->
        <DefaultSwitch v-model="form.on_empty.active" label="Fallback">
            <span class="text-xs text-gray-400 ml-2">
                &#8212; {{ form.on_empty.active ? 'Disable default value' : 'Enable default value' }}
            </span>
        </DefaultSwitch>

        <template v-if="form.on_empty.active">

            <!-- Default Value -->
            <TextOrCodeEditor v-model="form.on_empty.value" label="Fallback Value" placeholder="English" :error="form.errors.on_empty_value" class="mt-6">
                <template #info>
                    <span>
                        This is the default value incase the original value is not provided. This replacement
                        occurs if the original value is Null, False, Empty String, Empty Array or equal to
                        Zero (0) as string or integer. The check if performed using the PHP empty() method.
                    </span>
                </template>
            </TextOrCodeEditor>

        </template>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <PrimaryButton v-if="mode == 'create'" name="trigger" class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <span>Create Variable</span>
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
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultSwitch from "@components/Switch/DefaultSwitch";
    import VariableInput from "@components/Input/VariableInput";
    import PrimaryButton from "@components/Button/PrimaryButton";
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        components: { useForm, DefaultModal, DefaultSwitch, PrimaryButton, VariableInput, TextOrCodeEditor },
        props: {
            variables: Array,
            variable: {
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
                typeOptions: [
                    {
                        label: 'String',
                        value: 'string',
                    },
                    {
                        label: 'Integer',
                        value: 'integer',
                    },
                    {
                        label: 'Boolean',
                        value: 'boolean',
                    },
                    {
                        label: 'Code',
                        value: 'code',
                    },
                    {
                        label: 'Null',
                        value: 'null',
                    },
                    {
                        label: 'Empty Array',
                        value: 'empty array',
                    }
                ],
                booleanOptions: [
                    {
                        label: 'True',
                        value: 'true',
                    },
                    {
                        label: 'False',
                        value: 'false',
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
                        useVersionBuilder().getBlankDatabaseVariable(),
                    );

                }else if( this.mode == 'clone') {

                    this.form = useForm(
                         useVersionBuilder().getClonedDatabaseVariable(this.variable)
                    );

                }else if( this.mode == 'update') {

                    this.form = useForm({
                        ...useVersionBuilder().getBlankDatabaseVariable(),
                        ..._.cloneDeep(this.variable)
                    });

                }
            },
            createVariable(closeModal) {

                //  Check if we have an existing variable using the same name
                const totalExactMatches = this.useVersionBuilder.searchDatabaseVariables(this.variables, this.form.name, true).length;

                if( this.form.name.length == 0 ) {

                    this.form.setError('name', 'The variable name is required');

                }else if( this.form.name.length < 3 ) {

                    this.form.setError('name', 'The variable name is too short');

                }else if( this.form.name.length > 50 ) {

                    this.form.setError('name', 'The variable name is too long');

                }else if( totalExactMatches && this.mode !== 'update' ) {

                    this.form.setError('name', 'This variable name is already in use');

                }

                if( this.form.value.code_editor_mode == false && ['', null].includes( this.form.value.text) ) {

                    this.form.setError('value', 'The value is required');

                }else if(  this.form.value.code_editor_mode == true && ['', null].includes( this.form.value.code_editor_text) ) {

                    this.form.setError('value', 'The value is required');

                }

                if( this.form.on_empty.active ) {

                    if(  this.form.on_empty.value.code_editor_mode == false && ['', null].includes( this.form.on_empty.value.text) ) {

                        form.setError('on_empty_value', 'The default value is required');

                    }else if(  this.form.on_empty.value.code_editor_mode == true && ['', null].includes( this.form.on_empty.value.code_editor_text) ) {

                        form.setError('on_empty_value', 'The default value is required');

                    }

                }

                if( this.form.hasErrors === false ) {

                    let variable = this.form.data();

                    if( this.mode == 'update' ) {

                        this.useVersionBuilder.updateDatabaseVariable(this.variables, variable, this.index);

                    }else{

                        this.useVersionBuilder.addDatabaseVariable(this.variables, variable);

                    }

                    //  Determine the action name e.g created, cloned or updated
                    const actionName = (this.mode + 'd');

                    this.$message({
                        message: 'Variable '+actionName+' successfully',
                        type: 'success'
                    });

                    closeModal();

                }

            },
            cancelCreateVariable() {

                //  Clear existing errors
                this.form.clearErrors();

            }
        }
    };

</script>
