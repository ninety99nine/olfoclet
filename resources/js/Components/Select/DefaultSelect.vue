<template>
    <div>

        <div v-if="label || note || $slots.info" class="flex items-center mb-2">

            <!-- Label -->
            <label v-if="label" :for="label" :class="['block text-'+size+' font-medium text-gray-900', { 'mr-2' : info }]">{{ label }}</label>

            <!-- Note -->
            <span v-if="note" class="text-xs text-gray-400 ml-2"> &#8212; {{ note }}</span>

            <!-- Info Text -->
            <InfoPopover v-if="info" :info="info" class="ml-2"></InfoPopover>

            <!-- Info Slot -->
            <InfoPopover v-else-if="$slots.info" class="ml-2">
                <slot name="info"></slot>
            </InfoPopover>

        </div>

        <div class="flex select-wrapper">

            <!-- Append Content -->
            <span v-if="$slots.append" :class="['inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md', ...appendClasses]">
                <slot name="append"></slot>
            </span>

            <select :value="modelValue" @input="updateValue" :name="label" :placeholder="placeholder" :disabled="disabled" :class="['bg-gray-50 border border-gray-300 text-gray-900 text-'+size+' focus:ring-transparent focus:border-blue-400 block w-full p-2.5', $slots.append ? '' : 'rounded-l-lg', $slots.prepend ? '' : 'rounded-r-lg']">
                <option v-for="option in options" :key="option" :value="option.hasOwnProperty('value') ? option.value : option.label">{{ option.label }}</option>
            </select>

            <!-- Prepend Content -->
            <span v-if="$slots.prepend" :class="['inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md', ...prependClasses]">
                <slot name="prepend"></slot>
            </span>

        </div>

        <DefaultError :error="error" class="mt-2"></DefaultError>

    </div>
</template>

<script>
    import InfoPopover from './../Popover/InfoPopover';
    import DefaultError from './../Error/DefaultError';

    export default {
        components: { InfoPopover, DefaultError },
        props: {
            modelValue: [String, Number, Boolean],
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
            placeholder: String,
            error: {
                type: String,
                default: ''
            },
            options: {
                type: Array,
                default: () => {
                    return [];
                }
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
        methods: {
            updateValue(event) {

                var value = event.target.value;

                if( value === 'true' ) {

                    value = true;

                }else if( value === 'false' ) {

                    value = false;

                }

                this.$emit('update:modelValue', value);
            }
        }
    }
</script>
