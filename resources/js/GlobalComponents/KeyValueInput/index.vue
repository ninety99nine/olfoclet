<template>

    <div :class="{ 'overflow-auto p-5' : (level == 0) }" :style="{ maxHeight: '600px' }">

        <div :class="[(level == 0) ? 'border-l border-dashed pl-8' : 'ml-8']">

            <div v-for="(value, label, index) in modelValue" :key="index" :class="['relative', { 'mb-4' : !isLastItem(index) }]">

                <div v-if="typeof value === 'object' && value !== null" :class="['div-wrapper', { 'div-border-hider' : isLastItem(index) }]">

                    <span v-if="Array.isArray(value) && value.length === 0" class="flex items-center">
                        <span class="block text-xs font-medium text-gray-900">{{ label }}</span>
                        <span class="text-xs text-gray-400 mx-2">—</span>
                        <PrimaryBadge>Empty Array</PrimaryBadge>
                    </span>

                    <CollapsableObject
                        v-else v-model="modelValue[label]" :label="getLabel(label)" :level="level + 1"
                        :isFirst="isFirstItem(index)"
                        :isLast="isLastItem(index)">
                    </CollapsableObject>

                </div>

                <div v-else :class="{ 'border-hider' : isLastItem(index) }">

                    <template v-if="typeof value === 'string' || value === null">

                        <DefaultInput v-if="(value || '').length < 25 || value === null" v-model="modelValue[label]" :label="getLabel(label)" :note="value === null ? 'NULL' : ''" class="w-60"></DefaultInput>

                        <DefaultTextArea v-else v-model="modelValue[label]" :label="getLabel(label)" class="w-60"></DefaultTextArea>

                    </template>

                    <DefaultInput v-else-if="typeof value === 'number'" type="number" v-model="modelValue[label]" :label="getLabel(label)" class="w-60"></DefaultInput>

                    <DefaultSelect v-else-if="typeof value === 'boolean'" v-model="modelValue[label]" :options="booleanOptions" :label="getLabel(label)" class="w-60"></DefaultSelect>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import CollapsableObject from './CollapsableObject';
    import DefaultInput from '@components/Input/DefaultInput';
    import PrimaryBadge from '@components/Badges/PrimaryBadge';
    import DefaultSelect from '@components/Select/DefaultSelect';
    import DefaultTextArea from '@components/TextArea/DefaultTextArea';

    export default {
        props: {
            modelValue: null,
            label: String,
            level: {
                type: Number,
                default: 0
            }
        },
        components: { CollapsableObject, DefaultInput, PrimaryBadge, DefaultSelect, DefaultTextArea },
        data(){
            return {
                booleanOptions: [
                    {
                        label: 'True',
                        value: true
                    },
                    {
                        label: 'False',
                        value: false
                    }
                ]
            }
        },
        methods: {
            getLabel(label) {

                //  If isNaN() returns false, the label is a number, therefore return null instead
                return isNaN(label) ? label : null;

            },
            isFirstItem(index) {
                return index === 0;
            },
            isLastItem(index) {
                return index === (Object.keys(this.modelValue).length - 1);
            },
            updateValue(event) {
                this.$emit('update:modelValue', event.target.value);
            }
        }
    }
</script>

<style scoped>
    .div-wrapper,
    .input-wrapper,
    .select-wrapper,
    .textarea-wrapper {
        position: relative;
    }

    .div-wrapper::before,
    .input-wrapper::before,
    .select-wrapper::before,
    .textarea-wrapper::before {
        top: 0;
        bottom: 0;
        content: "";
        width: 30px;
        height: 1px;
        left: -30px;
        position: absolute;
        border-bottom:1px dashed#E5E7EB;
        /* background: red; */
    }

    .div-wrapper::before {
        margin-top: 10px;
    }

    .input-wrapper::before,
    .select-wrapper::before,
    .textarea-wrapper::before {
        /**
         *  Vertically center the dotted lines of the input, textarea and select fields
         */
        margin-top: auto;
        margin-bottom: auto;
    }

    .div-wrapper.div-border-hider::before {
        margin-top: 6px;
        margin-bottom: 0;
    }

    .border-hider,
    .div-border-hider {
        position: relative;
    }

    .border-hider::after,
    .div-border-hider::after {
        top: 0;
        bottom: 0;
        content: "";
        width: 1px;
        left: -33px;
        height: auto;
        position: absolute;
        background: white;
        /* background: blue; */
    }

    .border-hider::after {
        top: 42px;
    }

    .div-border-hider::after {
        top: 7px;
    }

</style>
