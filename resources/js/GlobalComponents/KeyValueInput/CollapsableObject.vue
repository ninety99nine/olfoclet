<template>

    <div :class="['border-l border-dashed']">

        <div class="flex items-center pl-1 -ml-1 cursor-pointer bg-white" @click="toggle()">

            <span class="block text-xs font-medium text-gray-900 bg-white mr-2">{{ label }}</span>

            <svg v-if="active" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <span v-if="!active" class="text-blue-300 text-xs ml-2"> x {{ Object.keys(localModelValue).length }}</span>

        </div>

        <SlideUpDown v-model="active" :duration="duration">

            <KeyValueInput v-model="localModelValue" :label="label" :level="level" class="mt-4" />

        </SlideUpDown>

    </div>

</template>

<script>

    import SlideUpDown from 'vue3-slide-up-down';

    export default {
        props: {
            modelValue: null,
            isFirst: Boolean,
            isLast: Boolean,
            label: String,
            level: Number
        },
        components: { SlideUpDown },
        data(){
            return {
                active: false,
                localModelValue: this.modelValue,
                duration: this.level == 1 ? 300 : 0
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
            toggle() {
                this.duration = 300;
                this.active = !this.active;
            }
        },
        created() {

            /**
             *  For the top-most dropdown, slide the drawer open after 500ms,
             *  however for the nested dropdowns, slide immediately.
             */
            if( this.level == 1) {

                setTimeout(() => {
                    this.active = true;
                }, 500);

            }else{

                this.active = true;

            }

        }
    }
</script>

