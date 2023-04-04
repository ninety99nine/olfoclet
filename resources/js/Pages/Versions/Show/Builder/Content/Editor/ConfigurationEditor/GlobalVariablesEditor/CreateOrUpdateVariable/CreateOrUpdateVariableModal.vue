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

        <!-- Variable Name -->
        <VariableInput v-model="form.name" label="Name" :error="form.errors.name" @onSetError="form.setError('name', $event)" @onClearError="form.clearErrors('name')" class="mb-6"></VariableInput>

        <!-- Variable Type -->
        <DefaultSelect v-model="form.type" :options="typeOptions" label="Select Type" placeholder="Select the variable type" class="mb-6"></DefaultSelect>

        <!-- Variable Value -->
        <DefaultInput v-if="form.type === 'string'" v-model="form.value.string" label="String" :error="form.errors.value" class="mb-6"></DefaultInput>
        <DefaultInput v-else-if="form.type === 'integer'" type="number" v-model="form.value.integer" label="Integer" :error="form.errors.value" class="mb-6"></DefaultInput>
        <DefaultSelect v-else-if="form.type === 'boolean'" v-model="form.value.boolean" :options="booleanOptions" label="Select Boolean" :error="form.errors.value" placeholder="Select boolean value" class="mb-6"></DefaultSelect>
        <CodeEditor v-else-if="form.type === 'code'" v-model="form.value.code" :error="form.errors.value" height="300px" class="mb-6"></CodeEditor>

        <!-- Make Constant -->
        <DefaultSwitch v-model="form.is_constant" label="Make Constant" info="Once the value is evaluated and set, it cannot be modified or overridden during application runtime. This value can only be modified here as a global variable" class="mb-6"></DefaultSwitch>

        <!-- Save for next session -->
        <DefaultSwitch v-model="form.is_global" label="Save for next session" info="Once the value is evaluated and set, it will be preserved for the next session" class="mb-6"></DefaultSwitch>

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
    import DefaultInput from "@components/Input/DefaultInput";
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import CodeEditor from "@components/CodeEditor/CodeEditor";
    import VariableInput from "@components/Input/VariableInput";
    import DefaultSwitch from "@components/Switch/DefaultSwitch";
    import DefaultSelect from '@components/Select/DefaultSelect';
    import PrimaryButton from "@components/Button/PrimaryButton";

    export default {
        components: { useForm, DefaultInput, DefaultModal, CodeEditor, DefaultSwitch, DefaultSelect, PrimaryButton, VariableInput },
        props: {
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
                        useVersionBuilder().getBlankGlobalVariable(),
                    );

                }else if( this.mode == 'clone') {

                    this.form = useForm(
                         useVersionBuilder().getClonedGlobalVariable(this.variable)
                    );

                }else if( this.mode == 'update') {

                    this.form = useForm({
                        ...useVersionBuilder().getBlankGlobalVariable(),
                        ..._.cloneDeep(this.variable)
                    });

                }
            },
            createVariable(closeModal) {

                //  Check if we have an existing variable using the same name
                const totalExactMatches = this.useVersionBuilder.searchGlobalVariables(this.form.name, true).length;

                if( this.form.name.length == 0 ) {

                    this.form.setError('name', 'The variable name is required');

                }else if( this.form.name.length < 3 ) {

                    this.form.setError('name', 'The variable name is too short');

                }else if( this.form.name.length > 50 ) {

                    this.form.setError('name', 'The variable name is too long');

                }else if( ['create', 'clone'].includes(this.mode) && totalExactMatches ) {

                    this.form.setError('name', 'This variable name is already in use');

                }else if( this.mode == 'update' && totalExactMatches && this.variable.name !== this.form.name ) {

                    this.form.setError('name', 'This variable name is already in use');

                }

                if( this.form.type === 'boolean' && (this.form.value.boolean == null) ) {

                    this.form.setError('value', 'The variable boolean is required');

                }else if( this.form.type === 'integer' && (this.form.value.integer == null) ) {

                    this.form.setError('value', 'The variable integer is required');

                }else if( this.form.type === 'code' && (this.form.value.code == null) ) {

                    this.form.setError('value', 'The variable code is required');

                }

                if( this.form.hasErrors === false ) {

                    let variable = this.form.data();

                    if( this.mode == 'update' ) {

                        this.useVersionBuilder.updateGlobalVariable(variable, this.index);

                    }else{

                        this.useVersionBuilder.addGlobalVariable(variable);

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
