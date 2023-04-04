<template>

    <!-- Screen / Display Marker Selector -->
    <DefaultSelect
        v-model="localModelValue"
        :options="markerOptions" :error="error"
        :appendClasses="['bg-blue-50', 'text-blue-500']"
        label="Marker" placeholder="Select marker to target screen or display">
        <template #append>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </template>
    </DefaultSelect>

</template>

<script>

    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultSelect from "@components/Select/DefaultSelect";

    export default {
        props: ['modelValue', 'error'],
        components: { DefaultSelect },
        data(){
            return {
                localModelValue: this.modelValue,
                useVersionBuilder: useVersionBuilder()
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
        computed: {
            markerOptions() {
                return this.useVersionBuilder.screenAndDisplayMarkers.map((marker) => {
                    return {
                        label: marker,
                        value: marker
                    }
                });
            }
        }
    }
</script>
