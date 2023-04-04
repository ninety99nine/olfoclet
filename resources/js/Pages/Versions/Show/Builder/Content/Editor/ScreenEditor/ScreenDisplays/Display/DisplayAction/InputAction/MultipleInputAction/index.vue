<template>

    <div>

        <div class="flex justify-between items-end mb-6">

            <DefaultSelect v-model="display.content.action.input_value.multi_value_input.separator" :options="separatorTypes" label="Separator" class="w-1/2"></DefaultSelect>

            <PrimaryButton @click="addMultiInputReference()" class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <span>Add Reference</span>
            </PrimaryButton>

        </div>

        <div class="space-y-4">

            <div v-for="(reference_name, index) in display.content.action.input_value.multi_value_input.reference_names" :key="index" class="flex items-center justify-between">

                <!-- Single Input -->
                <VariableInput v-model="display.content.action.input_value.multi_value_input.reference_names[index]" :label="'Reference Variable #' + (index + 1)" :note="'User input reference variable #' + (index + 1)" class="flex-1"></VariableInput>

                <!-- Delete Icon -->
                <svg @click="removeMultiInputReference(index)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-4 mx-8 hover:text-red-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>

            </div>

        </div>

        <!-- Screen / Display Selector -->
        <ScreenOrDisplaySelector v-model="display.content.action.input_value.multi_value_input.link"></ScreenOrDisplaySelector>

    </div>

</template>

<script>

    import VariableInput from '@components/Input/VariableInput';
    import PrimaryButton from '@components/Button/PrimaryButton';
    import DefaultSelect from '@components/Select/DefaultSelect';
    import ScreenOrDisplaySelector from '@builderComponents/ScreenOrDisplaySelector';

    export default {
        props: ['display'],
        components: { VariableInput, PrimaryButton, DefaultSelect, ScreenOrDisplaySelector },
        data(){
            return {
                separatorTypes: [
                    {
                        label: 'Single spaces ( )',
                        value: 'spaces'
                    },
                    {
                        label: 'Period symbol (.)',
                        value: '.'
                    },
                    {
                        label: 'Comma symbol (,)',
                        value: ','
                    },
                    {
                        label: 'Hyphen symbol (-)',
                        value: '-'
                    },
                    {
                        label: 'Plus symbol (+)',
                        value: '+'
                    },
                    {
                        label: 'Hash symbol (#)',
                        value: ' '
                    },
                    {
                        label: 'Forward slash symbol (/)',
                        value: '/'
                    }
                ]
            }
        },
        methods: {
            addMultiInputReference() {

                //  Build the multi-input reference name template
                var template = '';

                //  Add to existing reference names
                this.display.content.action.input_value.multi_value_input.reference_names.push( template );

            },
            removeMultiInputReference(index) {

                //  If we have 2 or more input values
                if( this.display.content.action.input_value.multi_value_input.reference_names.length >= 2 ) {

                    //  Remove current reference name
                    this.display.content.action.input_value.multi_value_input.reference_names.splice(index, 1);

                    //  Reference name removed success message
                    this.$message({
                        message: 'Input value removed',
                        type: 'success'
                    });

                }else{

                    //  Notify the user on the denied removal of this input value
                    this.$message({
                        message: 'You must have atleast 1 input value',
                        type: 'warning'
                    });

                }

            }

        }
    };

</script>
