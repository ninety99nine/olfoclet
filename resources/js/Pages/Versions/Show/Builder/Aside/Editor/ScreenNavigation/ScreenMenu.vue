<template>

    <li @click="selectScreen" :class="['group overflow-hidden text-xs text-gray-700 flex justify-between border rounded-md cursor-pointer p-2 mb-1 hover:bg-blue-50 hover:border-blue-300 hover:shadow', active ? 'border-blue-300 bg-blue-100 shadow' : 'border-transparent' ]">

        <span v-if="screen.name" :class="{ 'text-blue-500': active }">{{ screen.name }}</span>
        <span v-else :class="['text-red-500', {'italic': active }]">No name</span>

        <div class="flex justify-end relative">

            <div :class="['absolute right-0 w-24 hidden group-hover:flex justify-end', { 'bg-blue-50': active }]">

                <!-- Delete Icon -->
                <DeleteScreenModal :screen="screen"></DeleteScreenModal>

                <!-- Clone Icon -->
                <CreateScreenModal :screen="screen"></CreateScreenModal>

                <!-- Move Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 hover:text-blue-500 cursor-grab active:cursor-grabbing draggble-handle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>

            </div>

            <div class="absolute right-0 w-24 flex group-hover:hidden justify-end">

                <!-- Repeat Icon -->
                <svg v-if="usingRepeatingScreen" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>

                <!-- Pin Icon -->
                <svg v-if="firstDisplayScreen && !usingConditionalScreens" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

            </div>

        </div>

    </li>

</template>

<script>
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DeleteScreenModal from '@screenEditor/DeleteScreen/DeleteScreenModal';
    import CreateScreenModal from '@screenEditor/CreateScreen/CreateScreenModal';

    export default {
        props: ['screen', 'index'],
        components: { DeleteScreenModal, CreateScreenModal },
        data(){
            return {
                useVersionBuilder: useVersionBuilder()
            }
        },
        computed: {
            active() {
                return this.screen.id === (this.useVersionBuilder.selectedScreen || {}).id
            },
            firstDisplayScreen() {
                return this.screen['first_display_screen'];
            },
            usingConditionalScreens() {
                return this.useVersionBuilder.builder.conditional_screens.active;
            },
            usingRepeatingScreen() {
                return ['yes', 'conditional'].includes(this.screen.repeat.active.selected_type);
            }
        },
        methods: {
            selectScreen() {
                this.useVersionBuilder.selectScreen(this.screen.id);
            },
            duplicateScreen() {

            }
        }
    };

</script>
