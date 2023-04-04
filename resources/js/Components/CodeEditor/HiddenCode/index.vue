<template>

    <div class="flex items-center">

        <el-popover placement="top" :width="800" trigger="hover">

            <!-- Read Only Code Editor -->
            <CodeEditor
                v-model="localModelValue" :error="error" :wrap_code="wrap_code" :read_only="read_only" :autofocus="autofocus"
                :hide_header="hide_header" :width="width" :height="height" :max_width="max_width" :min_width="min_width"
                :max_height="max_height" :min_height="min_height" :border_radius="border_radius" :language_selector="language_selector"
                :languages="languages" :selector_width="selector_width" :selector_height="selector_height"
                :selector_displayed_by_default="selector_displayed_by_default" :display_language="display_language"
                :copy_code="copy_code" :z_index="z_index" :font_size="font_size" :theme="theme">
            </CodeEditor>

            <!-- Hidden Code Badge -->
            <template v-slot:reference>

                <!-- Code Snippet -->
                <DefaultCodeSnippet @click="this.$emit('click')" @mouseenter="hintExpandable(2)" @mouseleave="onMouseLeave()">

                    <Transition name="slide-up" mode="out-in" appear>
                        <p v-if="showTrailingDots">...</p>
                        <p v-else>
                            <span class="mt-1 block animate-bounce">Click here</span>
                        </p>
                    </Transition>

                </DefaultCodeSnippet>

            </template>

        </el-popover>

        <!-- Maximize Icon -->
        <CodeEditorModal
            v-model="localModelValue" :error="error" :wrap_code="wrap_code" :read_only="read_only" :autofocus="autofocus"
            :hide_header="hide_header" :width="width" :height="height" :max_width="max_width" :min_width="min_width"
            :max_height="max_height" :min_height="min_height" :border_radius="border_radius" :language_selector="language_selector"
            :languages="languages" :selector_width="selector_width" :selector_height="selector_height"
            :selector_displayed_by_default="selector_displayed_by_default" :display_language="display_language"
            :copy_code="copy_code" :z_index="z_index" :font_size="font_size" :theme="theme">
        </CodeEditorModal>

    </div>

</template>

<script>

import CodeEditor from "./../CodeEditor.vue";
import CodeEditorModal from "./CodeEditorModal";
import DefaultCodeSnippet from "@components/CodeSnippet/DefaultCodeSnippet";

export default {
    props: [
        'modelValue', 'expandable', 'error',

        //  Below are the code editor options
        'wrap_code', 'read_only', 'autofocus', 'hide_header', 'width', 'height', 'max_width', 'min_width',
        'max_height', 'min_height', 'border_radius', 'language_selector', 'languages', 'selector_width',
        'selector_height', 'selector_displayed_by_default', 'display_language', 'copy_code',
        'z_index', 'font_size', 'theme'
    ],
    components: { CodeEditor, CodeEditorModal, DefaultCodeSnippet },
    data(){
        return {
            localModelValue: this.modelValue,
            showTrailingDots: true,
            setInterval: null,
            changes: 0,
            hints: 0
        }
    },
    watch: {
        modelValue(newValue, oldValue) {
            this.localModelValue = newValue;

            //  Increment the number of changes
            ++this.changes;

            //  If we have more than 10 changes to the modelValue
            if(this.changes > 10) {

                //  Hint to expand the code editor
                this.hintExpandable(2);

            }
        },
        localModelValue(newValue, oldValue) {
            this.$emit('update:modelValue', newValue);
        }
    },
    methods: {
        /**
         *  The expandable property is used by the TextOrCodeEditor component
         *  to support minimizing and maximizing the Code Editor component.
         *
         *  We want to indicate to the user that this feature is available
         *  by using the hintExpandable() and onMouseLeave() events of the
         *  Hidden Code Badge.
         */
        hintExpandable(hints) {
            if( this.expandable ) {
                if( this.setInterval == null ) {

                    this.hints = hints;

                    this.setInterval = setInterval(() => {

                        if( this.hints <= 0 ) {
                            this.resetInterval();
                        }else{

                            this.showTrailingDots = !this.showTrailingDots;

                            if( this.showTrailingDots == false ) {
                                --this.hints;
                            }

                        }

                    }, 5000);
                }
            }
        },
        resetInterval() {
            clearInterval(this.setInterval);
            this.showTrailingDots = true;
            this.setInterval = null;
        },
        onMouseLeave() {
            this.resetInterval();
        }
    },
    unmounted() {
        this.resetInterval();
    }
}

</script>
