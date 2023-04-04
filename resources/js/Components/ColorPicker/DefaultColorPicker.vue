<template>
    <el-color-picker ref="colorPicker" v-model="localModelValue" @change="updateValue" :show-alpha="false" :predefine="predefineColors"></el-color-picker>
</template>

<script>

    import { useVersionBuilder } from "@stores/VersionBuilder";

    export default {
        props: {
            modelValue: String
        },
        data() {
            return {
                predefineColors: [],
                localModelValue: this.modelValue,
                useVersionBuilder: useVersionBuilder(),
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
        methods: {
            updateValue(value) {
                localModelValue = value;
            }
        },
        created() {
            this.predefineColors = Object.values(this.useVersionBuilder.builder.color_scheme.event_colors);
        }
    }
</script>
