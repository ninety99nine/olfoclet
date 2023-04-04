<template>

    <!-- Modal -->
    <DefaultModal
        width="w-2/3"
        defaultText="Done"
        @open="$emit('open')"
        @close="$emit('close')">

        <!-- Modal Title -->
        <template v-slot:title>Code Editor</template>

        <!-- Modal Content -->
        <CodeEditor
            v-model="localModelValue" :error="error" :wrap_code="wrap_code" :read_only="read_only" :autofocus="autofocus"
            :hide_header="hide_header" :width="width" :height="height" :max_width="max_width" :min_width="min_width"
            :max_height="max_height" :min_height="min_height" :border_radius="border_radius" :language_selector="language_selector"
            :languages="languages" :selector_width="selector_width" :selector_height="selector_height"
            :selector_displayed_by_default="selector_displayed_by_default" :display_language="display_language"
            :copy_code="copy_code" :z_index="z_index" :font_size="font_size" :theme="theme">
        </CodeEditor>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <svg name="trigger" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 cursor-pointer hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>

        </template>

    </DefaultModal>

</template>

<script>

    import CodeEditor from "./../CodeEditor";
    import DefaultModal from "@components/Modal/DefaultModal";

    export default {
        props: [
            'modelValue', 'expandable', 'error',

            //  Below are the code editor options
            'wrap_code', 'read_only', 'autofocus', 'hide_header', 'width', 'height', 'max_width', 'min_width',
            'max_height', 'min_height', 'border_radius', 'language_selector', 'languages', 'selector_width',
            'selector_height', 'selector_displayed_by_default', 'display_language', 'copy_code',
            'z_index', 'font_size', 'theme'
        ],
        components: { CodeEditor, DefaultModal },
        data(){
            return {
                localModelValue: this.modelValue
            }
        },
        watch: {
            modelValue(newValue, oldValue) {
                this.localModelValue = newValue;
            },
            localModelValue(newValue, oldValue) {
                this.$emit('update:modelValue', newValue);
            }
        },
    };

</script>
