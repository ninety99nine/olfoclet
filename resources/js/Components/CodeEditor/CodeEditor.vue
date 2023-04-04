<template>
    <div>
        <WarningAlert v-if="read_only && show_read_only" class="mt-2 mb-2 pb-2 border-b border-dotted">
            <div class="flex items-center">
                <span class="text-gray-800 font-bold text-xs">Read Only</span>
                <span class="text-gray-600 text-xs ml-1 italic"> &#8212; You cannot edit this code</span>
            </div>
        </WarningAlert>
        <CodeEditor
            v-model="localModelValue" :value="localModelValue" :wrap_code="wrap_code" :read_only="read_only" :show_read_only="show_read_only" :autofocus="autofocus"
            :hide_header="hide_header" :width="width" :height="height" :max_width="max_width" :min_width="min_width"
            :max_height="max_height" :min_height="min_height" :border_radius="border_radius" :language_selector="language_selector"
            :languages="languages" :selector_width="selector_width" :selector_height="selector_height"
            :selector_displayed_by_default="selector_displayed_by_default" :display_language="display_language"
            :copy_code="copy_code" :z_index="z_index" :font_size="font_size" :theme="theme">
        </CodeEditor>
        <DefaultError :error="error" class="mt-2"></DefaultError>
    </div>
</template>

<script>

/**
 *  Package Reference: https://github.com/justcaliturner/simple-code-editor
 */
import DefaultError from '../Error/DefaultError';
import WarningAlert from '../Alert/WarningAlert';
import CodeEditor from 'simple-code-editor';

export default {
    components: { DefaultError, WarningAlert, CodeEditor },
    props: {
        modelValue: {
            type: String,
        },
        error: {
            type: String,
            default: ''
        },
        wrap_code: {
            type: Boolean,
            default: false,
        },
        read_only: {
            type: Boolean,
            default: false,
        },
        show_read_only: {
            type: Boolean,
            default: true,
        },
        autofocus: {
            type: Boolean,
            default: false,
        },
        hide_header: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: "100%",   //  540px
        },
        height: {
            type: String,
            default: "400px",  //  auto
        },
        max_width: {
            type: String,
        },
        min_width: {
            type: String,
        },
        max_height: {
            type: String,
        },
        min_height: {
            type: String,
        },
        border_radius: {
            type: String,
            default: "12px",
        },
        language_selector: {
            type: Boolean,
            default: false,
        },
        languages: {
            type: Array,
            default: function () {
                return [
                    ["PHP", "php"],
                    //  ["cpp", "C++"],
                    //  ["python", "Python"],
                ];
            },
        },
        selector_width: {
            type: String,
            default: "110px",
        },
        selector_height: {
            type: String,
            default: "auto",
        },
        selector_displayed_by_default: {
            type: Boolean,
            default: false,
        },
        display_language: {
            type: Boolean,
            default: true,
        },
        copy_code: {
            type: Boolean,
            default: true,
        },
        z_index: {
            type: String,
        },
        font_size: {
            type: String,
            default: "12px",
        },
        theme: {
            type: String,
            default: "dark",
        },
    },
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
    created(){

        //  If the code does not exist
        if( this.localModelValue === null || this.localModelValue === '' ) {

            //  Set the php tags
            this.localModelValue = '<?php\n\n?>';

        }
    }
}
</script>
