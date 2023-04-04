<template>

    <div :class="['group-event-menu rounded-md border', (active ? 'shadow-sm border-2 my-4' : 'mb-2')]" :style="{ borderLeftColor: event.hexColor, borderLeftWidth: '4px' }">

        <div @click="toggleSelection()" :class="['grid grid-cols-12 text-xs text-gray-700 py-2 px-4 cursor-pointer', active ? 'border-b border-dashed bg-blue-50 rounded-tr-md' : 'bg-gray-50 rounded-r-md']" :style="{ backgroundColor: event.hexColor+'05',  }">

            <div class="col-span-6 flex items-center">
                <div v-if="event.name && totalExactMatches == 1" :class="{ 'text-blue-500 font-semibold': active }">{{ event.name }}</div>
                <div v-else-if="event.name && totalExactMatches > 1" :class="['text-red-500', { 'font-semibold italic' : active }]">Duplicate name</div>
                <div v-else :class="['text-red-500', { 'font-semibold italic' : active }]">No name</div>
            </div>

            <div class="col-span-6 flex justify-end items-center relative">

                <div class="flex items-center text-gray-400 text-xs transition-all duration-300 opacity-100 group-event-menu-hover:opacity-0">

                    <EventIcon :event="event.type" class="mr-2"></EventIcon>

                    <span class="mr-4">{{ event.type }}</span>

                    <SuccessBadge v-if="event.active.selected_type == 'yes'">Active</SuccessBadge>
                    <WarningBadge v-else-if="event.active.selected_type == 'no'">Inactive</WarningBadge>
                    <PrimaryBadge v-else-if="event.active.selected_type == 'conditional'">Conditional</PrimaryBadge>

                </div>

                <div class="absolute right-8 flex items-center justify-end transition-all duration-300 opacity-0 group-event-menu-hover:opacity-100">

                    <!-- Copy To Clipboard -->
                    <CopyToClipboard v-for="(clipboard, index) in clipboards" :value="clipboard.value" :message="clipboard.message" :key="index" class="whitespace-nowrap mr-2">
                        <PrimaryBadge :clickable="true">{{ clipboard.label }}</PrimaryBadge>
                    </CopyToClipboard>

                    <!-- Copy Badge -->
                    <PrimaryBadge @click.stop="copyEvent()" :clickable="true" class="whitespace-nowrap mr-4">Copy Event</PrimaryBadge>

                    <!-- Edit Icon -->
                    <CreateOrUpdateEventModal :events="events" :event="event" :index="index" mode="update"></CreateOrUpdateEventModal>

                    <!-- Delete Icon -->
                    <DeleteEventModal :events="events" :event="event" :index="index"></DeleteEventModal>

                    <!-- Clone Icon -->
                    <CreateOrUpdateEventModal :events="events" :event="event" mode="clone"></CreateOrUpdateEventModal>

                    <!-- Move Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-grab hover:text-blue-500 active:cursor-grabbing draggble-handle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>

                </div>

                <!-- Info Popover -->
                <div class="ml-4 mr-1">
                    <InfoPopover :title="event.type">

                        <div class="border-t border-dashed pt-4 mt-4">
                            <p class="text-xs text-gray-600 break-normal">Event details ...</p>
                        </div>

                    </InfoPopover>
                </div>

            </div>

        </div>

        <SlideUpDown v-model="active" :duration="300">

            <div class="flex justify-between p-4">

                <!-- Comments -->
                <span class="flex-1 text-xs mr-4">{{ event.comment ? event.comment : 'No comments' }}</span>

                <!-- Color Picker -->
                <DefaultColorPicker v-model="event.hexColor"></DefaultColorPicker>

            </div>

            <!-- Event Collection (List events) -->
            <template v-if="event.type == 'Event Collection'">

                <CollectionSettings :event="event" class="mx-4 mb-4"></CollectionSettings>

            </template>

            <!-- AppWrite Connection (List events) -->
            <template v-if="event.type == 'AppWrite Connection'">

                <AppWriteSettings :event="event" class="mx-4 mb-4"></AppWriteSettings>

            </template>

        </SlideUpDown>

    </div>

</template>

<script>
    import EventIcon from './EventIcon';
    import SlideUpDown from 'vue3-slide-up-down';
    import DeleteEventModal from './Delete/DeleteEventModal';
    import CopyToClipboard from '@components/CopyToClipboard';
    import SuccessBadge from '@components/Badges/SuccessBadge';
    import WarningBadge from '@components/Badges/WarningBadge';
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import PrimaryBadge from '@components/Badges/PrimaryBadge';
    import InfoPopover from '@components/Popover/InfoPopover';
    import DefaultColorPicker from '@components/ColorPicker/DefaultColorPicker';
    import CreateOrUpdateEventModal from './CreateOrUpdate/CreateOrUpdateEventModal';
    import CollectionSettings from './CreateOrUpdate/EventEditor/EventTypes/Collection/Settings';
    import AppWriteSettings from './CreateOrUpdate/EventEditor/EventTypes/ThirdPartyIntegration/AppWrite/Settings';

    export default {
        props: ['events', 'event', 'index'],
        components: { SuccessBadge, PrimaryBadge, WarningBadge, DeleteEventModal, CopyToClipboard, CreateOrUpdateEventModal, InfoPopover, SlideUpDown, EventIcon, DefaultColorPicker, CollectionSettings, AppWriteSettings },
        data(){
            return {
                active: false,
                clipboards: [
                    {
                        label: 'Copy ID',
                        value: this.event.id,
                        message: 'Copied the Event ID'
                    },
                    {
                        label: 'Copy Name',
                        value: this.event.name,
                        message: 'Copied the Event Name'
                    }
                ],
                useVersionBuilder: useVersionBuilder()
            }
        },
        computed: {
            totalExactMatches() {
                return this.useVersionBuilder.searchEvents(this.events, this.event.name, true).length;
            }
        },
        methods: {
            toggleSelection(){
                this.active = !this.active;
            },
            copyEvent(){

                //  Store to local storage
                window.localStorage.setItem('event',  JSON.stringify(this.event));

                this.$message({
                    message: 'Event Copied',
                    type: 'success'
                });

            }
        }
    };

</script>
