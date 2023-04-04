<template>

    <div :class="{ 'p-4 rounded-lg bg-gray-50 shadow-md border': highlight }">

        <div class="flex items-center justify-between border-b border-dotted pb-4 mb-4">

            <div v-if="title || note" class="flex items-center">

                <!-- Event Title -->
                <h5 v-if="title" class="text-sm font-semibold tracking-tight text-gray-600">{{ title }}</h5>

                <!-- Note -->
                <span v-if="note" class="text-xs text-gray-400 ml-2"> &#8212; {{ note }}</span>

                <!-- Info Text -->
                <InfoPopover v-if="info" :info="info" class="ml-2"></InfoPopover>

                <!-- Info Slot -->
                <InfoPopover v-else-if="$slots.info" class="ml-2">
                    <slot name="info"></slot>
                </InfoPopover>

            </div>

            <Transition name="fade">

                <!-- Event Search Bar -->
                <DefaultSearchBar v-if="isShowingEvents" v-model="searchTerm" placeholder="Search events" />

            </Transition>

            <div class="flex items-center">

                <Transition name="fade">

                    <div v-if="isShowingEvents" class="flex items-center">

                        <!-- Paste Event -->
                        <Transition name="fade">
                            <SuccessBadge v-if="hasEventToPaste" @click.stop="pasteEvent()" :clickable="true" class="mr-4">Paste Event</SuccessBadge>
                        </Transition>

                        <!--
                            Add Event Button & Modal

                            Most "Events" consist of a "collection" key which holds the nested events.
                            However the "Global Events" do not have this "collection" key. Therefore
                            we must conditionally check for either case to access the nested events.
                        -->
                        <template v-if="totalEvents">
                            <CreateOrUpdateEventModal v-if="localEvents.hasOwnProperty('collection')" :events="localEvents.collection" mode="create" class="mr-4"></CreateOrUpdateEventModal>
                            <CreateOrUpdateEventModal v-else :events="localEvents" mode="create" class="mr-4"></CreateOrUpdateEventModal>
                        </template>
                    </div>

                </Transition>

                <!-- Collapse Arrows -->
                <div v-if="collapsable" @click.stop="isShowingEvents = !isShowingEvents" class="text-gray-400">
                    <Transition name="fade" mode="out-in">
                        <svg v-if="isShowingEvents" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                        </svg>
                    </Transition>
                </div>

            </div>

        </div>

        <SlideUpDown v-model="isShowingEvents" :duration="300">

            <!-- If this supports conditional events -->
            <template v-if="localEvents.hasOwnProperty('conditional')">

                <!-- Conditional Events Code Editor -->
                <SwitchAndCodeEditor
                    v-model="localEvents.conditional" max_height="200px" class="mb-4"
                    info="Write code to conditionally select events to run as well as their order of execution"
                    note="Select events conditionally">
                </SwitchAndCodeEditor>

            </template>

            <!--
                Event Menus

                Most "Events" consist of a "collection" key which holds the nested events.
                The Screen ("on enter", "on response" and "on leave") events as well as
                the display ("on enter", "on response" and "on leave") or the event
                called "Event Collection" are good examples. However the
                "Global Events" do not have this "collection" key,
                therefore we must conditionally check for either
                case to access the nested events.
            -->
            <EventMenus v-if="localEvents.hasOwnProperty('collection')" v-model="localEvents.collection" :searchTerm="searchTerm" :class="['transition-all duration-1000', isShowingEvents ? 'mb-0': 'mb-8']"></EventMenus>
            <EventMenus v-else v-model="localEvents" :searchTerm="searchTerm" :class="['transition-all duration-1000', isShowingEvents ? 'mb-0': 'mb-8']"></EventMenus>

        </SlideUpDown>

        <Transition name="fade">
            <div v-if="canShowEventsSummary == true && isShowingEvents == false">
                <span class="mr-2">📌</span>
                <span v-if="totalEvents == 0" class="text-blue-500 font-bold text-xs">No Events</span>
                <span v-else class="text-blue-500 font-bold text-xs">Found {{ totalEvents.length }} {{ totalEvents.length == 1 ? ' Event' : ' Events' }}</span>
            </div>
        </Transition>

    </div>

</template>

<script>

import EventMenus from "./EventMenus.vue";
import SlideUpDown from "vue3-slide-up-down";
import InfoPopover from '@components/Popover/InfoPopover';
import { useVersionBuilder } from "@stores/VersionBuilder";
import SuccessBadge from "@components/Badges/SuccessBadge";
import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";
import CreateOrUpdateEventModal from './CreateOrUpdate/CreateOrUpdateEventModal';
import SwitchAndCodeEditor from "@components/SwitchAndCodeEditor/SwitchAndCodeEditor";

export default {
    props: {
        events: Object,
        title: String,
        note: String,
        info: String,
        highlight: {
            type: Boolean,
            default: true
        },
        collapsable: {
            type: Boolean,
            default: true
        },
    },
    components: { EventMenus, SlideUpDown, InfoPopover, SuccessBadge, DefaultSearchBar, CreateOrUpdateEventModal, SwitchAndCodeEditor },
    data() {
        return {
            searchTerm: '',
            isShowingEvents: false,
            hasEventToPaste: false,
            localEvents: this.events,
            canShowEventsSummary: false,
            useVersionBuilder: useVersionBuilder(),

            setInterval: null
        }
    },
    watch: {
        events(newValue, oldValue) {
            this.localEvents = newValue;
        },
        localEvents(newValue, oldValue) {
            this.$emit('update:events', newValue);
        }
    },
    computed: {
        screen() {
            return this.useVersionBuilder.selectedScreen
        },
        totalEvents() {
            return (this.localEvents.hasOwnProperty('collection') ? this.localEvents.collection : this.localEvents).length
        }
    },
    methods: {
        pasteEvent() {

            var event = window.localStorage.getItem('event');

            if( event !== null ) {

                //  Convert to JSON object
                event = JSON.parse(event);

                //  Clone to change the event id
                event = this.useVersionBuilder.getClonedEvent(event);

                if( this.localEvents.hasOwnProperty('collection') ) {

                    this.localEvents.collection.push(event);

                }else{

                    this.localEvents.push(event);

                }

                window.localStorage.removeItem('event');

                this.hasEventToPaste = false;

                this.$message({
                    message: 'Event Pasted',
                    type: 'success'
                });

            }

        },
        checkPastableEvent() {

            const event = window.localStorage.getItem('event');

            this.hasEventToPaste = (event !== null);

        }
    },
    created() {

        setTimeout(() => {
            this.isShowingEvents = true;
            this.canShowEventsSummary = true;
        }, 100);

        //  Run every 1 second
        this.setInterval = setInterval(() => {

            this.checkPastableEvent();

        }, 1000);
    },
    beforeUnmount() {
        clearInterval(this.setInterval);
    }
}
</script>
