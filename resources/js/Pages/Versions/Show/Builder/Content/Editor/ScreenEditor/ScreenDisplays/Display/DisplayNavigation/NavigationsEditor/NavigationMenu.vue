<template>

    <div :class="['rounded-md border', (active ? 'shadow-sm border-2 my-4' : 'mb-2')]" :style="{ borderLeftColor: navigation.hexColor, borderLeftWidth: '4px' }">

        <div @click="toggleSelection()" :class="['grid grid-cols-12 group-repeat-navigation-menu text-xs text-gray-700 py-2 px-4 cursor-pointer', active ? 'border-b border-dashed bg-blue-50 rounded-tr-md' : 'bg-gray-50 rounded-r-md']" :style="{ backgroundColor: navigation.hexColor+'05',  }">

            <div class="col-span-6 flex items-center">
                <div v-if="navigation.name && totalExactMatches == 1" :class="{ 'text-blue-500 font-semibold': active }">{{ navigation.name }}</div>
                <div v-else-if="navigation.name && totalExactMatches > 1" :class="['text-red-500', { 'font-semibold italic' : active }]">Duplicate name</div>
                <div v-else :class="['text-red-500', { 'font-semibold italic' : active }]">No name</div>
            </div>

            <div class="col-span-6 flex justify-end items-center relative">

                <div class="flex items-center text-gray-400 text-xs transition-all duration-300 opacity-100 group-repeat-navigation-menu-hover:opacity-0">

                    <SuccessBadge v-if="navigation.active.selected_type == 'yes'">Active</SuccessBadge>
                    <WarningBadge v-else-if="navigation.active.selected_type == 'no'">Inactive</WarningBadge>
                    <PrimaryBadge v-else-if="navigation.active.selected_type == 'conditional'">Conditional</PrimaryBadge>

                </div>

                <div class="absolute right-8 flex items-center justify-end transition-all duration-300 opacity-0 group-repeat-navigation-menu-hover:opacity-100">

                    <!-- Copy To Clipboard -->
                    <CopyToClipboard v-for="(clipboard, index) in clipboards" :value="clipboard.value" :message="clipboard.message" :key="index" class="whitespace-nowrap mr-2">
                        <PrimaryBadge :clickable="true">{{ clipboard.label }}</PrimaryBadge>
                    </CopyToClipboard>

                    <!-- Copy Badge -->
                    <PrimaryBadge @click.stop="copyNavigation()" :clickable="true" class="whitespace-nowrap mr-4">Copy Navigation</PrimaryBadge>

                    <!-- Edit Icon -->
                    <CreateOrUpdateNavigationModal :navigations="navigations" :navigation="navigation" :index="index" mode="update"></CreateOrUpdateNavigationModal>

                    <!-- Delete Icon -->
                    <DeleteNavigationModal :navigations="navigations" :navigation="navigation" :index="index"></DeleteNavigationModal>

                    <!-- Clone Icon -->
                    <CreateOrUpdateNavigationModal :navigations="navigations" :navigation="navigation" mode="clone"></CreateOrUpdateNavigationModal>

                    <!-- Move Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-grab hover:text-blue-500 active:cursor-grabbing draggble-handle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>

                </div>

                <!-- Info Popover -->
                <div class="ml-4 mr-1">
                    <InfoPopover :title="navigation.type">

                        <div class="border-t border-dashed pt-4 mt-4">
                            <p class="text-xs text-gray-600 break-normal">Navigation details ...</p>
                        </div>

                    </InfoPopover>
                </div>

            </div>

        </div>

        <SlideUpDown v-model="active" :duration="300">
            <div class="flex justify-between p-4">

                <!-- Comment -->
                <span class="text-xs mr-4">{{ navigation.comment ? navigation.comment : 'No comments' }}</span>

                <!-- Color Picker -->
                <DefaultColorPicker v-model="navigation.hexColor"></DefaultColorPicker>

            </div>
        </SlideUpDown>

    </div>

</template>

<script>
    import SlideUpDown from 'vue3-slide-up-down';
    import CopyToClipboard from '@components/CopyToClipboard';
    import InfoPopover from '@components/Popover/InfoPopover';
    import SuccessBadge from '@components/Badges/SuccessBadge';
    import PrimaryBadge from '@components/Badges/PrimaryBadge';
    import WarningBadge from '@components/Badges/WarningBadge';
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DeleteNavigationModal from './Delete/DeleteNavigationModal';
    import DefaultColorPicker from '@components/ColorPicker/DefaultColorPicker';
    import CreateOrUpdateNavigationModal from './CreateOrUpdate/CreateOrUpdateNavigationModal';

    export default {
        props: ['navigations', 'navigation', 'index'],
        components: { SlideUpDown, CopyToClipboard, InfoPopover, SuccessBadge, PrimaryBadge, WarningBadge, DeleteNavigationModal, DefaultColorPicker, CreateOrUpdateNavigationModal },
        data(){
            return {
                active: false,
                clipboards: [
                    {
                        label: 'Copy Name',
                        value: this.navigation.name,
                        message: 'Copied the Navigation Name'
                    }
                ],
                useVersionBuilder: useVersionBuilder()
            }
        },
        computed: {
            totalExactMatches() {
                return this.useVersionBuilder.searchNavigations(this.navigations, this.navigation.name, true).length;
            }
        },
        methods: {
            toggleSelection(){
                this.active = !this.active;
            },
            copyNavigation(){

                //  Store to local storage
                window.localStorage.setItem('navigation',  JSON.stringify(this.navigation));

                this.$message({
                    message: 'Navigation Copied',
                    type: 'success'
                });

            }
        }
    };

</script>
