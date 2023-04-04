<template>

     <div :class="['rounded-md border', (active ? 'shadow-sm border-2 my-4' : 'mb-2')]" :style="{ borderLeftColor: rule.hexColor, borderLeftWidth: '4px' }">

        <div @click="toggleSelection()" :class="['grid grid-cols-12 group text-xs text-gray-700 py-2 px-4 cursor-pointer', active ? 'border-b border-dashed bg-blue-50 rounded-t-md' : 'bg-gray-50 rounded-md']">

            <div class="col-span-6 flex items-center">
                <div v-if="rule.name" :class="{ 'text-blue-500 font-semibold': active }">{{ rule.name }}</div>
                <div v-else :class="['text-red-500', { 'font-semibold italic' : active }]">No name</div>
            </div>

            <div class="col-span-6 flex justify-end items-center relative">

                <div class="flex items-center text-gray-400 text-xs transition-all duration-300 opacity-100 group-hover:opacity-0">

                    <span class="mr-4">{{ ruleType }}</span>

                    <div class="mr-2">
                        <SuccessBadge v-if="rule.active.selected_type == 'yes'">Active</SuccessBadge>
                        <WarningBadge v-else-if="rule.active.selected_type == 'no'">Inactive</WarningBadge>
                        <PrimaryBadge v-else-if="rule.active.selected_type == 'conditional'">Conditional</PrimaryBadge>
                    </div>

                    <!-- Info Icon -->
                    <InfoPopover size="5"></InfoPopover>
                </div>

                <div class="absolute right-0 flex items-center justify-end opacity-0 group-hover:opacity-100">

                    <!-- Edit Icon -->
                    <CloneOrUpdateValidationRuleModal :rules="rules" :rule="rule" :index="index" mode="update"></CloneOrUpdateValidationRuleModal>

                    <!-- Delete Icon -->
                    <DeleteValidationRuleModal :rules="rules" :rule="rule" :index="index"></DeleteValidationRuleModal>

                    <!-- Clone Icon -->
                    <CloneOrUpdateValidationRuleModal :rules="rules" :rule="rule" mode="clone"></CloneOrUpdateValidationRuleModal>

                    <!-- Move Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-grab hover:text-blue-500 active:cursor-grabbing draggble-handle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>

                    <!-- Info Icon -->
                    <div class="ml-4 mr-1">
                        <InfoPopover :title="rule.type">

                            <div class="border-t border-dashed pt-4 mt-4">
                                <p class="text-xs text-gray-600 break-normal">Validation rule details ...</p>
                            </div>

                        </InfoPopover>
                    </div>

                </div>

            </div>

        </div>

        <SlideUpDown v-model="active" :duration="300">
            <div class="flex justify-between p-4">

                <!-- Comments -->
                <span class="flex-1 text-xs mr-4">{{ rule.comment ? rule.comment : 'No comments' }}</span>

                <!-- Color Picker -->
                <DefaultColorPicker v-model="rule.hexColor"></DefaultColorPicker>

            </div>
        </SlideUpDown>

    </div>

</template>

<script>

    import SlideUpDown from 'vue3-slide-up-down';
    import InfoPopover from '@components/Popover/InfoPopover';
    import SuccessBadge from '@components/Badges/SuccessBadge';
    import PrimaryBadge from '@components/Badges/PrimaryBadge';
    import WarningBadge from '@components/Badges/WarningBadge';
    import DefaultColorPicker from '@components/ColorPicker/DefaultColorPicker';
    import DeleteValidationRuleModal from './DeleteValidationRule/DeleteValidationRuleModal';
    import CloneOrUpdateValidationRuleModal from './CloneOrUpdateValidationRule/CloneOrUpdateValidationRuleModal';

    export default {
        props: ['rules', 'rule', 'index'],
        components: { SlideUpDown, InfoPopover, SuccessBadge, PrimaryBadge, WarningBadge, DefaultColorPicker, DeleteValidationRuleModal, CloneOrUpdateValidationRuleModal },
        data(){
            return {
                active: false
            }
        },
        computed: {
            ruleType() {
                return this.rule.type.split('_').join(' ').toLowerCase();
            }
        },
        methods: {
            toggleSelection(){
                this.active = !this.active;
            }
        }
    };

</script>
