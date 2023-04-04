<template>

    <div>


        <div class="grid grid-cols-2 gap-8 mb-6">

            <div class="col-span-1">

                <DefaultSelect v-model="display.content.action.selected_type" :options="actionOptions" label="Action"></DefaultSelect>

            </div>

            <div class="col-span-1">

                <template v-if="display.content.action.selected_type == 'input_value'">
                    <DefaultSelect v-model="display.content.action.input_value.selected_type" :options="inputActionOptions" label="Type"></DefaultSelect>
                </template>

                <template v-if="display.content.action.selected_type == 'select_option'">
                    <DefaultSelect v-model="display.content.action.select_option.selected_type" :options="selectActionOptions" label="Type"></DefaultSelect>
                </template>

            </div>

        </div>


        <div v-if="display.content.action.selected_type == 'input_value'" class="border-t border-dashed pt-4 mt-4 mb-4">

            <template v-if="display.content.action.input_value.selected_type == 'single_value_input'">

                <SingleInputAction :display="display"></SingleInputAction>

            </template>

            <template v-else-if="display.content.action.input_value.selected_type == 'multi_value_input'">

                <MultipleInputAction :display="display"></MultipleInputAction>

            </template>

        </div>

        <div v-else-if="display.content.action.selected_type == 'select_option'" class="border-t border-dashed pt-4 mt-4 mb-4">

            <template v-if="display.content.action.select_option.selected_type == 'static_options'">

                <StaticOptions :display="display"></StaticOptions>

            </template>

            <template v-else-if="display.content.action.select_option.selected_type == 'dynamic_options'">

                <DynamicOptions :display="display"></DynamicOptions>

            </template>

            <template v-else-if="display.content.action.select_option.selected_type == 'code_editor_options'">

                <CodeOptions :display="display"></CodeOptions>

            </template>

        </div>

    </div>

</template>

<script>

    import CodeOptions from './SelectAction/CodeOptions';
    import StaticOptions from './SelectAction/StaticOptions';
    import DynamicOptions from './SelectAction/DynamicOptions';
    import DefaultSelect from '@components/Select/DefaultSelect';
    import SingleInputAction from './InputAction/SingleInputAction';
    import MultipleInputAction from './InputAction/MultipleInputAction';
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['display'],
        components: { CodeOptions, StaticOptions, DynamicOptions, DefaultSelect, SingleInputAction, MultipleInputAction, TextOrCodeEditor },
        data(){
            return {
                actionOptions: [
                    {
                        label: 'No Action',
                        value: 'no_action'
                    },
                    {
                        label: 'Input Value',
                        value: 'input_value'
                    },
                    {
                        label: 'Select Option',
                        value: 'select_option'
                    }
                ],
                inputActionOptions: [
                    {
                        label: 'Single Input',
                        value: 'single_value_input'
                    },
                    {
                        label: 'Multiple Inputs',
                        value: 'multi_value_input'
                    }
                ],
                selectActionOptions: [
                    {
                        label: 'Static Options',
                        value: 'static_options'
                    },
                    {
                        label: 'Dynamic Options',
                        value: 'dynamic_options'
                    },
                    {
                        label: 'Code Editor Options',
                        value: 'code_editor_options'
                    }
                ],
            }
        }
    };

</script>
