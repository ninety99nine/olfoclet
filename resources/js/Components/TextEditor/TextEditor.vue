<template>

    <div>
        <label v-if="label" :for="uniqueId" :class="'block mb-2 text-'+size+' font-medium text-gray-900'">{{ label }}</label>

        <div v-if="read_only == false" :class="['editable-content-field bg-gray-50 border border-gray-300 rounded-lg relative overflow-hidden', ( disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900')]">
            <textarea v-model="localModelValue" :name="uniqueId" ref="textarea" :disabled="disabled" :placeholder="placeholder" @focus="onFocus" @blur="onBlur" rows="1" :style="{ minHeight: heightSize }"
                     :class="[{ 'opacity-0': isEditting == false, 'cursor-not-allowed': disabled }, 'w-full py-2 px-3 rounded-lg relative z-10 border-0 outline-0 bg-gray-50 focus:ring-0 text-xs -mb-2']">
            </textarea>
            <div class="absolute z-0 top-0 bottom-0 left-0 right-0 py-2 px-3 text-xs">
                <span v-html="showPlaceholder ? placeholder : contentWithHtmlTags" :class="['w-full whitespace-pre-wrap break-words', { 'text-gray-500': showPlaceholder }]"></span>
            </div>
        </div>
        <span v-else v-html="contentWithHtmlTags" class="w-full whitespace-pre-wrap break-words"></span>

        <DefaultError :error="error" class="mt-2"></DefaultError>
    </div>

</template>

<script>

    import { uniqueId } from 'lodash';
    import DefaultError from './../Error/DefaultError';

    export default {
        props: {
            modelValue: String,
            label: String,
            disabled: {
                type: Boolean,
                default: false
            },
            read_only: {
                type: Boolean,
                default: false
            },
            show_read_only: {
                type: Boolean,
                default: true,
            },
            height: {
                type: String,
                default: 'xs'
            },
            placeholder: String,
            error: {
                type: String,
                default: ''
            },
        },
        components: { DefaultError },
        data(){
            return {
                isEditting: false,
                contentWithHtmlTags: null,
                localModelValue: this.modelValue,
                uniqueId: uniqueId('text-editor-')
            }
        },
        watch: {
            modelValue(newValue, oldValue) {
                this.localModelValue = newValue;
                this.setDynamicContent();
            },
            localModelValue(newValue, oldValue) {
                this.$emit('update:modelValue', newValue);
            }
        },
        computed: {
            showPlaceholder() {
                return [null, ''].includes(this.localModelValue);
            },
            heightSize() {
                if( this.height == 'lg' ) {
                    return '12em';
                }else if( this.height == 'md' ) {
                    return '8em';
                }else if( this.height == 'sm' ) {
                    return '4em';
                }else if( this.height == 'xs' ) {
                    return '2.9em';
                }else{
                    return this.height + 'em';
                }
            }
        },
        methods: {
            onFocus(e) {
                this.isEditting = true;
            },
            onBlur() {
                this.isEditting = false;
                this.setDynamicContent();
            },
            setDynamicContent(){

                //  Insert dynamic content inside curly braces within span tags with special styles
                function wrapInHTMLTags(match, offset, string){

                    return '<span class="bg-blue-100 text-blue-900 shadow-sm rounded-md whitespace-nowrap py-1 px-2">' + match + '</span>';

                }

                if( this.localModelValue !== null ){

                    //  This pattern searches for anything using curly braces e.g {{ user }}
                    var pattern = /[{]{2}[\s]*[a-zA-Z_]{1}[a-zA-Z0-9_\.]{0,}[\s]*[}]{2}/g;

                    //  Wrap text with curly braces in HTML tags
                    this.contentWithHtmlTags = this.localModelValue.replace(pattern, wrapInHTMLTags);

                }

            }
        },
        created(){
            this.setDynamicContent();
        }
    }
</script>
