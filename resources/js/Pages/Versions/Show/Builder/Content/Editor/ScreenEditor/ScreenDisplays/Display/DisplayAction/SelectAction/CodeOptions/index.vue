<template>

    <div>

        <!-- Code Editor -->
        <Transition name="fade">

            <CodeEditor v-model="display.content.action.select_option.code_editor_options.code_editor_text" class="mb-6"></CodeEditor>

        </Transition>

        <!-- Reference Variable -->
        <VariableInput v-model="display.content.action.select_option.code_editor_options.reference_name" label="Reference Variable" note="Selected option reference variable" class="mb-6"></VariableInput>

        <!-- No Options Message -->
        <TextOrCodeEditor v-model="display.content.action.select_option.code_editor_options.no_results_message" label="No Options Message" placeholder="No options found" :showCode="false" class="mb-6"></TextOrCodeEditor>

        <!-- Incorrect Option Message -->
        <TextOrCodeEditor v-model="display.content.action.select_option.code_editor_options.incorrect_option_selected_message" label="Incorrect Option Message" placeholder="Incorrect option selected" :showCode="false" class="mb-6"></TextOrCodeEditor>

    </div>

</template>

<script>

    import CodeEditor from '@components/CodeEditor/CodeEditor';
    import VariableInput from '@components/Input/VariableInput';
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['display'],
        components: { CodeEditor, VariableInput, TextOrCodeEditor }
    };

</script>
