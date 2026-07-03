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
            //  File 02 — the colour scheme now lives in settings.appearance; fall back
            //  to a legacy builder.color_scheme, then to an empty palette (converted
            //  builders no longer carry color_scheme).
            const scheme = (((this.useVersionBuilder.settings || {}).appearance || {}).color_scheme)
                || this.useVersionBuilder.builder.color_scheme
                || { event_colors: {} };
            this.predefineColors = Object.values(scheme.event_colors || {});
        }
    }
</script>
