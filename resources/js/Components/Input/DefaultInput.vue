<template>
    <div>

        <div v-if="label || note || $slots.info" class="flex mb-2">

            <!-- Label -->
            <label v-if="label" :for="uniqueId" :class="'text-'+size+' font-medium text-gray-900'">{{ label }}</label>

            <!-- Note -->
            <span v-if="note" class="text-xs text-gray-400 ml-2"> &#8212; {{ note }}</span>

            <!-- Info Text -->
            <InfoPopover v-if="info" :info="info" class="ml-2"></InfoPopover>

            <!-- Info Slot -->
            <InfoPopover v-else-if="$slots.info" class="ml-2">
                <slot name="info"></slot>
            </InfoPopover>

        </div>

        <div class="flex input-wrapper">

            <!-- Append Content -->
            <span v-if="$slots.append" :class="['inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md', ...appendClasses]">
                <slot name="append"></slot>
            </span>

            <input ref="input" :id="uniqueId" :value="modelValue" @input="updateValue" :name="label" :type="type" :placeholder="placeholder" :disabled="disabled" :autofocus="autofocus" :class="['bg-gray-50 border border-gray-300 placeholder:text-gray-400/80', ( disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900') ,'text-'+size+' focus:ring-blue-500 focus:border-blue-400 block w-full', $slots.append ? '' : 'rounded-l-lg', $slots.prepend ? '' : 'rounded-r-lg']">

            <!-- Prepend Content -->
            <span v-if="$slots.prepend" :class="['inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md', ...prependClasses]">
                <slot name="prepend"></slot>
            </span>

        </div>

        <DefaultError :error="error" class="mt-2"></DefaultError>
    </div>
</template>

<script>

    import { uniqueId } from 'lodash';
    import InfoPopover from './../Popover/InfoPopover';
    import DefaultError from './../Error/DefaultError';

    export default {
        components: { InfoPopover, DefaultError },
        props: {
            modelValue: [String, Number],
            label: String,
            info: String,
            note: String,
            type: {
                type: String,
                default: 'text'
            },
            size: {
                type: String,
                default: 'xs'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            autofocus: {
                type: Boolean,
                default: false
            },
            placeholder: String,
            error: {
                type: String,
                default: ''
            },
            appendClasses: {
                type: Array,
                default: () => {
                    return []
                }
            },
            prependClasses: {
                type: Array,
                default: () => {
                    return []
                }
            },
        },
        data(){
            return {
                uniqueId: uniqueId('input-'),
                initialValue: this.modelValue,
                initialType: typeof this.modelValue
            }
        },
        methods: {
            updateValue(event) {

                var value = event.target.value;

                //  If isNaN() returns false, the value is a number
                if( this.initialType === 'number' && isNaN(value) == false ) {

                    value = parseInt(value);

                }else if( this.initialValue === null && value === '' ) {

                    value = null;

                }

                this.$emit('update:modelValue', value);
            }
        },
        mounted() {
            if( this.autofocus ) {
                this.$refs.input.focus();
            }
        }
    }
</script>
