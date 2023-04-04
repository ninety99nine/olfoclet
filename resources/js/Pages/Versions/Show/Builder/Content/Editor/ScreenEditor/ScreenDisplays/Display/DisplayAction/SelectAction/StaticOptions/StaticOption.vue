<template>

    <div :class="['rounded-md border', (active ? 'shadow-sm border-2 my-4' : 'mb-2')]" :style="{ borderLeftColor: staticOption.hexColor, borderLeftWidth: '4px' }">

        <div @click="toggleSelection()" :class="['grid grid-cols-12 group text-xs text-gray-700 py-2 px-4 cursor-pointer', active ? 'border-b border-dashed bg-blue-50 rounded-t-md' : 'bg-gray-50 rounded-md']" :style="{ backgroundColor: staticOption.hexColor+'05',  }">

            <div class="col-span-6 flex items-center">
                <TextEditor v-if="staticOption.name.code_editor_mode == false" v-model="staticOption.name.text" :read_only="true"></TextEditor>
                <HiddenCode v-else v-model="staticOption.name.code_editor_text" :read_only="true"></HiddenCode>
            </div>

            <div class="col-span-6 flex justify-end items-center relative">

                <div class="flex items-center text-gray-400 text-xs transition-all duration-300 opacity-100 group-hover:opacity-0">
                    <SuccessBadge v-if="staticOption.active.selected_type == 'yes'">Active</SuccessBadge>
                    <WarningBadge v-else-if="staticOption.active.selected_type == 'no'">Inactive</WarningBadge>
                    <PrimaryBadge v-else-if="staticOption.active.selected_type == 'conditional'">Conditional</PrimaryBadge>
                </div>

                <div class="absolute right-8 flex items-center justify-end transition-all duration-300 opacity-0 group-hover:opacity-100">

                    <!-- Edit Icon -->
                    <CreateOrUpdateStaticOptionModal :staticOptions="staticOptions" :staticOption="staticOption" :index="index" mode="update"></CreateOrUpdateStaticOptionModal>

                    <!-- Delete Icon -->
                    <DeleteStaticOptionModal :staticOptions="staticOptions" :staticOption="staticOption" :index="index"></DeleteStaticOptionModal>

                    <!-- Clone Icon -->
                    <CreateOrUpdateStaticOptionModal :staticOptions="staticOptions" :staticOption="staticOption" mode="clone"></CreateOrUpdateStaticOptionModal>

                    <!-- Move Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-grab hover:text-blue-500 active:cursor-grabbing draggble-handle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>

                </div>

                <!-- Info Icon -->
                <div class="ml-4 mr-1">
                    <InfoPopover title="Details">

                        <div class="border-t border-dashed pt-4 mt-4">
                            <p class="text-xs text-gray-600 break-normal">Static Option details ...</p>
                        </div>

                    </InfoPopover>
                </div>

            </div>

        </div>

        <SlideUpDown v-model="active" :duration="300">
            <div class="flex justify-between p-4">

                 <!-- Comment -->
                <span class="text-xs mr-4">{{ staticOption.comment ? staticOption.comment : 'No comments' }}</span>

                <!-- Color Picker -->
                <DefaultColorPicker v-model="staticOption.hexColor"></DefaultColorPicker>

            </div>
        </SlideUpDown>

    </div>

</template>

<script>
    import SlideUpDown from 'vue3-slide-up-down';
    import TextEditor from "@components/TextEditor/TextEditor";
    import HiddenCode from "@components/CodeEditor/HiddenCode";
    import SuccessBadge from '@components/Badges/SuccessBadge';
    import PrimaryBadge from '@components/Badges/PrimaryBadge';
    import WarningBadge from '@components/Badges/WarningBadge';
    import InfoPopover from '@components/Popover/InfoPopover';
    import DeleteStaticOptionModal from './Delete/DeleteStaticOptionModal';
    import DefaultColorPicker from '@components/ColorPicker/DefaultColorPicker';
    import CreateOrUpdateStaticOptionModal from './CreateOrUpdate/CreateOrUpdateStaticOptionModal';

    export default {
        props: ['staticOptions', 'staticOption', 'index'],
        components: { TextEditor, HiddenCode, SuccessBadge, PrimaryBadge, WarningBadge, DeleteStaticOptionModal, DefaultColorPicker, CreateOrUpdateStaticOptionModal, InfoPopover, SlideUpDown },
        data(){
            return {
                active: false
            }
        },
        methods: {
            toggleSelection(){
                this.active = !this.active;
            }
        }
    };

</script>
