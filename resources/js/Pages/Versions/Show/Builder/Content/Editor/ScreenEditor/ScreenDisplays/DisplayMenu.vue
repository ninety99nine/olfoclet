<template>

    <div :class="['group rounded-md border transition-all duration-300', active ? 'my-4' : 'mb-2']" :style="{ borderLeftColor: display.hexColor, borderLeftWidth: '4px' }">

        <div @click="toggleSelection()" :class="['flex justify-between text-xs text-gray-700 py-2 px-4 cursor-pointer', active ? 'border-b border-dashed bg-blue-100 rounded-t-md' : 'rounded-md']">

            <div v-if="display.name && totalExactMatches == 1" :class="{ 'text-blue-500 font-semibold': active }">{{ display.name }}</div>
            <div v-else-if="display.name && totalExactMatches > 1" :class="['text-red-500', { 'font-semibold italic' : active }]">Duplicate name</div>
            <div v-else :class="['text-red-500', { 'font-semibold italic' : active }]">No name</div>

            <div class="flex items-center justify-end relative">

                <div class="absolute right-0 flex items-center justify-end opacity-0 group-hover:opacity-100">

                    <!-- Copy To Clipboard -->
                    <CopyToClipboard v-for="(clipboard, index) in clipboards" :value="clipboard.value" :message="clipboard.message" :key="index" class="whitespace-nowrap mr-2">
                        <PrimaryBadge :clickable="true">{{ clipboard.label }}</PrimaryBadge>
                    </CopyToClipboard>

                    <PrimaryBadge @click.stop="copyDisplay()" :clickable="true" class="whitespace-nowrap mr-4">Copy Display</PrimaryBadge>

                    <!-- Edit Icon -->
                    <svg @click.stop="toggleSelection()" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-pointer hover:text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>

                    <!-- Delete Icon -->
                    <DeleteDisplayModal :display="display"></DeleteDisplayModal>

                    <!-- Clone Icon -->
                    <CreateDisplayModal :display="display" mode="clone"></CreateDisplayModal>

                    <!-- Move Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-grab hover:text-blue-500 active:cursor-grabbing draggble-handle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>

                </div>

                <div v-show="firstDisplay && !usingConditionalDisplays" class="absolute right-0 w-16 flex justify-end group-hover:hidden">

                    <!-- Pin Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>

                </div>

            </div>

        </div>

        <SlideUpDown v-model="active" :duration="300">
            <Display :display="display" class="py-4 px-4 bg-blue-50/50"></Display>
        </SlideUpDown>

    </div>

</template>

<script>
    import Display from './Display/Display';
    import SlideUpDown from 'vue3-slide-up-down'
    import CopyToClipboard from '@components/CopyToClipboard';
    import PrimaryBadge from '@components/Badges/PrimaryBadge';
    import DefaultBadge from '@components/Badges/DefaultBadge';
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import CreateDisplayModal from './Create/CreateDisplayModal';
    import DeleteDisplayModal from './Delete/DeleteDisplayModal';

    export default {
        props: ['display', 'index'],
        components: { PrimaryBadge, CopyToClipboard, DefaultBadge, DeleteDisplayModal, CreateDisplayModal, SlideUpDown, Display },
        data(){
            return {
                active: false,
                useVersionBuilder: useVersionBuilder(),
                clipboards: [
                    {
                        label: 'Copy ID',
                        value: this.display.id,
                        message: 'Copied the Display ID'
                    },
                    {
                        label: 'Copy Name',
                        value: this.display.name,
                        message: 'Copied the Display Name'
                    }
                ],
            }
        },
        computed: {
            firstDisplay() {
                return this.display['first_display'];
            },
            usingConditionalDisplays() {
                return this.useVersionBuilder.selectedScreen.conditional_displays.active;
            },
            totalExactMatches() {
                return this.useVersionBuilder.searchScreenDisplays(this.display.name, true).length;
            }
        },
        methods: {
            toggleSelection(){
                if( this.active == true ){
                    this.unselectDisplay();
                }else{
                    this.selectDisplay();
                }
            },
            selectDisplay() {
                this.active = true;
            },
            unselectDisplay() {
                this.active = false;
            },
            copyDisplay(){

                //  Store to local storage
                window.localStorage.setItem('display',  JSON.stringify(this.display));

                this.$message({
                    message: 'Display Copied',
                    type: 'success'
                });

            }
        },
        mounted() {
            setTimeout(() => {
                this.active = this.useVersionBuilder.totalScreenDisplays === 1;  //  Automatically open on one display
            }, 100);
        }
    };

</script>
