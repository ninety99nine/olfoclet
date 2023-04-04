<template>
    <div class="grid grid-cols-3 gap-4">

        <div :class="isConditional ? 'col-span-2' : 'col-span-3'">
            <DefaultSelect v-model="modelValue.selected_type" :label="label" :info="info" :options="options"></DefaultSelect>
        </div>

        <div v-if="isConditional" class="col-span-1 pt-8">
            <HiddenCode v-model="modelValue.code"></HiddenCode>
        </div>

    </div>
</template>

<script>

import HiddenCode from '@components/CodeEditor/HiddenCode'
import DefaultSelect from '@components/Select/DefaultSelect'

export default {
    props: {
        modelValue: Object,
        label: {
            type: String,
            default: 'Active'
        },
        info: '',
        additionalOptions: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    components: { DefaultSelect, HiddenCode },
    data() {
        return {
            options: ['Yes', 'No', 'Conditional']
        }
    },
    computed: {
        isConditional() {
            return this.modelValue.selected_type == 'conditional';
        }
    },
    created() {

        const options = this.options.concat(this.additionalOptions);

        this.options = options.map((option) => {
            return {
                label: option.label ? option.label : option,
                value: option.value ? option.value : option.toLowerCase()
            };
        });

    }
}
</script>
