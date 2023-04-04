<template>
    <div class="textarea-wrapper">

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

        <textarea :id="uniqueId" :value="modelValue" @input="updateValue" :name="label" :rows="rows" :placeholder="placeholder" :disabled="disabled" :class="['bg-gray-50 border border-gray-300', ( disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900') ,'text-'+size+' rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5']"></textarea>

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
            modelValue: String,
            label: String,
            info: String,
            note: String,
            rows: {
                type: Number,
                default: 2
            },
            size: {
                type: String,
                default: 'xs'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            placeholder: String,
            error: {
                type: String,
                default: ''
            },
        },
        data(){
            return {
                uniqueId: uniqueId('textarea-')
            }
        },
        methods: {
            updateValue(event) {
                this.$emit('update:modelValue', event.target.value);
            }
        }
    }
</script>
