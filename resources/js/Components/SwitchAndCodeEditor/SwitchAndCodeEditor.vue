<template>
    <div>

        <div class="inline-flex items-center mb-2">

            <!-- Toggle Text/Code Editor Switch -->
            <DefaultSwitch v-model="localModelValue.active" :label="label" class="flex"></DefaultSwitch>

            <!-- Hidden Code -->
            <HiddenCode
                v-if="localModelValue.active == true && showCode == false" class="ml-4 cursor-pointer" @click="showCode = true"
                v-model="localModelValue.code" :wrap_code="wrap_code" :read_only="read_only" :show_read_only="show_read_only" :autofocus="autofocus"
                :hide_header="hide_header" :width="width" :height="height" :max_width="max_width" :min_width="min_width"
                :max_height="max_height" :min_height="min_height" :border_radius="border_radius" :language_selector="language_selector"
                :languages="languages" :selector_width="selector_width" :selector_height="selector_height"
                :selector_displayed_by_default="selector_displayed_by_default" :display_language="display_language"
                :copy_code="copy_code" :z_index="z_index" :font_size="font_size" :theme="theme">
            </HiddenCode>

            <!-- Note -->
            <span v-if="note" class="text-xs text-gray-400 ml-2"> &#8212; {{ note }}</span>

            <!-- Info Text -->
            <InfoPopover v-if="info" :info="info" class="ml-2"></InfoPopover>

            <!-- Info Slot -->
            <InfoPopover v-else-if="$slots.info" class="ml-2">
                <slot name="info"></slot>
            </InfoPopover>

        </div>

        <Transition name="fade" mode="out-in" :duration="250">

            <div v-if="localModelValue.active == true && showCode == true">

                <!-- Hide Code -->
                <div class="flex justify-end">
                    <span class="italic px-4 pt-2 rounded-t-md text-xs font-mono shadow-md cursor-pointer -mt-8 mr-8" :style="{ color: '#61aeee', background: '#282c34' }" @click="showCode = false"><slot>Click to hide</slot></span>
                </div>

                <CodeEditor
                    v-model="localModelValue.code" :wrap_code="wrap_code" :read_only="read_only" :show_read_only="show_read_only" :autofocus="autofocus"
                    :hide_header="hide_header" :width="width" :height="height" :max_width="max_width" :min_width="min_width"
                    :max_height="max_height" :min_height="min_height" :border_radius="border_radius" :language_selector="language_selector"
                    :languages="languages" :selector_width="selector_width" :selector_height="selector_height"
                    :selector_displayed_by_default="selector_displayed_by_default" :display_language="display_language"
                    :copy_code="copy_code" :z_index="z_index" :font_size="font_size" :theme="theme">
                </CodeEditor>

            </div>


        </Transition>

        <DefaultError :error="error" class="mt-2"></DefaultError>

    </div>
</template>

<script>

import HiddenCode from '../CodeEditor/HiddenCode';
import DefaultError from './../Error/DefaultError';
import InfoPopover from './../Popover/InfoPopover';
import DefaultSwitch from '../Switch/DefaultSwitch';
import TextEditor from '@components/TextEditor/TextEditor';
import CodeEditor from '@components/CodeEditor/CodeEditor';

export default {
    components: { InfoPopover, DefaultSwitch, TextEditor, CodeEditor, DefaultError, HiddenCode },
    props: {

        //  Below are the text editor and code editor options
        modelValue: Object,
        error: String,
        label: String,
        note: String,
        info: String,
        showCode: {
            type: Boolean,
            default: false
        },

        //  Below are the code editor options
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
            default: "300px",  //   auto
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
        localModelValue: {
            handler: function (newValue, oldValue) {
                if( newValue.code == '<?php\n\n?>' && newValue.active == false ) {
                    newValue.code = null;
                }

                this.$emit('update:modelValue', newValue);
            },
            deep: true
        }
    },
}

</script>
