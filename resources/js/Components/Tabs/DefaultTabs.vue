<template>
    <ul class="text-xs font-medium text-center text-gray-500 cursor-pointer rounded-lg divide-x divide-gray-200 shadow sm:flex">
        <li :class="['flex items-center justify-center p-2 w-full', { 'rounded-l-lg':(isFirst(index) && !isLast(index)), 'rounded-r-lg':(!isFirst(index) && isLast(index)) }, (isActive(tab) ? 'text-'+color+'-500 bg-'+color+'-100' : 'text-gray-700 bg-white')]"
            v-for="(tab, index) in tabs" :key="tab.label" @click.stop="onClick(tab, index)">

            <span>{{ tab.label }}</span>

            <!-- Counter -->
            <NumberBadge v-if="tab.count" :count="tab.count" :active="isActive(tab)" :activeStyle="'bg-'+color+'-50 text-'+color+'-500 border border-transparent'" :inActiveStyle="'bg-transparent text-'+color+'-500 border'" class="ml-2"></NumberBadge>

            <!-- Just to load the tailwind css color classes i need here -->
            <span v-if="false" class="bg-green-50"></span>
            <span v-if="false" class="bg-green-100"></span>
        </li>
    </ul>
</template>

<script>

import NumberBadge from '@components/Badges/NumberBadge';

export default {
    components: { NumberBadge },
    props: {
        modelValue: [String, Number],
        color: {
            type: String,
            default: 'blue'
        },
        tabs: {
            type: Array,
            default() {
                return [
                    /*  Example Below
                    {
                        label: 'Example 1',
                        value: 1    //  optional
                    },
                    {
                        label: 'Example 2',
                        value: 2    //  optional
                    }
                    */
                ]
            }
        }
    },
    data() {
        return {

        }
    },
    methods: {
        isFirst(index){
            return index === 0;
        },
        isLast(index){
            return index === (this.tabs.length - 1);
        },
        isActive(tab){
            //  If any of the following conditions pass then this tab is active
            return (tab.value || tab.label) === this.modelValue;
        },
        onClick(tab, index) {
            this.$emit('update:modelValue', (tab.value || tab.label));
        }
    }
}
</script>
