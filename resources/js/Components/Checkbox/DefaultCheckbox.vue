<template>
    <div>
        <div class="flex items-center">
            <input :id="uniqueId" type="checkbox" v-model="localModelValue" :disabled="disabled" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
            <label v-if="label" :for="uniqueId" :class="'text-'+size+' font-medium text-gray-900 ml-2'">{{ label }}</label>

            <!-- Note -->
            <span v-if="note" class="text-xs text-gray-400 ml-2"> &#8212; {{ note }}</span>

            <!-- Info Text -->
            <InfoPopover v-if="info" :info="info" class="ml-2"></InfoPopover>

            <!-- Info Slot -->
            <InfoPopover v-else-if="$slots.info" class="ml-2">
                <slot name="info"></slot>
            </InfoPopover>

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
            modelValue: Boolean,
            label: String,
            info: String,
            note: String,
            size: {
                type: String,
                default: 'xs'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            error: {
                type: String,
                default: ''
            }
        },
        data(){
            return {
                uniqueId: uniqueId('input-'),
                localModelValue: this.modelValue
            }
        },
        watch: {
            modelValue(newValue, oldValue) {
                this.localModelValue = newValue;
            },
            localModelValue(newValue, oldValue) {
                this.$emit('update:modelValue', newValue);
                this.$emit('onChange', newValue);
            }
        }
    }
</script>
