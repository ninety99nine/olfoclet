<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        @open="resetForm()"
        @close="$emit('close')"
        :primaryAction="createAttribute"
        :primaryText="modeInCaps + ' Attribute'"
        :defaultAction="cancelCreateAttribute">

        <!-- Modal Title -->
        <template v-slot:title>{{ modeInCaps + ' Attribute' }}</template>

        <!-- Modal Content -->
        <p v-if="mode == 'clone'" class="text-sm text-gray-500 mb-5">Cloning <span class="text-blue-500 font-bold">{{ attribute.name }}</span> attribute</p>

        <!-- Attribute Name -->
        <VariableInput v-model="form.name" label="Response Name" :error="form.errors.name" @onSetError="form.setError('name', $event)" @onClearError="form.clearErrors('name')" class="mb-6"></VariableInput>

        <!-- Attribute Value -->
        <TextOrCodeEditor v-model="form.value" label="Value" :error="form.errors.value" class="mb-4"></TextOrCodeEditor>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <PrimaryButton v-if="mode == 'create'" name="trigger" class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <span>Create Attribute</span>
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
    import VariableInput from "@components/Input/VariableInput";
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import PrimaryButton from "@components/Button/PrimaryButton";
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        components: { useForm, VariableInput, DefaultModal, PrimaryButton, TextOrCodeEditor },
        props: {
            attributes: {
                type: Array
            },
            attribute: {
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
                        useVersionBuilder().getBlankStatusCodeAttribute(),
                    );

                }else if( this.mode == 'clone') {

                    this.form = useForm(
                         useVersionBuilder().getClonedStatusCodeAttribute(this.attribute)
                    );

                }else if( this.mode == 'update') {

                    this.form = useForm({
                        ...useVersionBuilder().getBlankStatusCodeAttribute(),
                        ..._.cloneDeep(this.attribute)

                    });

                }
            },
            createAttribute(closeModal) {

                //  Clear existing errors
                this.form.clearErrors();

                //  Check if we have an existing attribute using the same name
                const totalExactMatches = this.useVersionBuilder.searchStatusCodeAttributes(this.attributes, this.form.name, true).length;

                if( this.form.name.length == 0 ) {

                    this.form.setError('name', 'The attribute name is required');

                }else if( this.form.value.code_editor_mode == false && (this.form.value.text == '' || this.form.value.text == null) ) {

                    this.form.setError('value', 'The value is required');

                }else if( this.form.value.code_editor_mode == true && (this.form.value.code_editor_text == '' || this.form.value.code_editor_text == null) ) {

                    this.form.setError('value', 'The value is required');

                }else if( ['create', 'clone'].includes(this.mode) && totalExactMatches ) {

                    this.form.setError('name', 'This attribute name is already in use');

                }else if( this.mode == 'update' && totalExactMatches && this.attribute.name !== this.form.name ) {

                    this.form.setError('name', 'This attribute name is already in use');

                }

                if( this.form.hasErrors === false ) {

                    let attribute = this.form.data();

                    if( this.mode == 'update' ) {

                        this.useVersionBuilder.updateStatusCodeAttribute(this.attributes, attribute, this.index);

                    }else{

                        this.useVersionBuilder.addStatusCodeAttribute(this.attributes, attribute);

                    }

                    //  Determine the action name e.g created, cloned or updated
                    const actionName = (this.mode + 'd');

                    this.$message({
                        message: 'Attribute '+actionName+' successfully',
                        type: 'success'
                    });

                    closeModal();

                }

            },
            cancelCreateAttribute() {

                //  Clear existing errors
                this.form.clearErrors();

            }
        }
    };

</script>
