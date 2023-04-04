<template>

    <div :class="{ 'p-4 rounded-lg bg-gray-50 shadow-md border': highlight }">

        <div class="flex items-center justify-between border-b border-dotted pb-4 mb-4">

            <div v-if="title || note" class="flex items-center">

                <!-- Navigation Title -->
                <h5 v-if="title" class="text-sm font-semibold tracking-tight text-gray-600">{{ title }}</h5>

                <!-- Note -->
                <span v-if="note" class="text-xs text-gray-400 ml-2"> &#8212; {{ note }}</span>

            </div>

            <Transition name="fade">

                <!-- Navigation Search Bar -->
                <DefaultSearchBar v-if="isShowingNavigations" v-model="searchTerm" placeholder="Search navigations" />

            </Transition>

            <div class="flex items-center">

                <Transition name="fade">

                    <div v-if="isShowingNavigations" class="flex items-center">

                        <!-- Paste Navigation -->
                        <Transition name="fade">
                            <SuccessBadge v-if="hasNavigationToPaste" @click.stop="pasteNavigation()" :clickable="true" class="mr-4">Paste</SuccessBadge>
                        </Transition>

                        <!-- Add Navigation Button & Modal -->
                        <CreateOrUpdateNavigationModal v-if="localModelValue.length" :navigations="localModelValue" mode="create" class="mr-4"></CreateOrUpdateNavigationModal>
                    </div>

                </Transition>

                <!-- Collapse Arrows -->
                <div v-if="collapsable" @click.stop="isShowingNavigations = !isShowingNavigations" class="text-gray-400">
                    <Transition name="fade" mode="out-in">
                        <svg v-if="isShowingNavigations" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                        </svg>
                    </Transition>
                </div>

            </div>

        </div>

        <SlideUpDown v-model="isShowingNavigations" :duration="300">

            <!-- Navigation Menus -->
            <NavigationMenus v-model="localModelValue" :searchTerm="searchTerm" :class="['transition-all duration-1000', isShowingNavigations ? 'mb-0': 'mb-8']"></NavigationMenus>

        </SlideUpDown>

        <Transition name="fade">
            <div v-if="canShowNavigationsSummary == true && isShowingNavigations == false">
                <span class="mr-2">📌</span>
                <span v-if="localModelValue.length == 0" class="text-blue-500 font-bold text-xs">No Navigations</span>
                <span v-else class="text-blue-500 font-bold text-xs">Found {{ localModelValue.length }} {{ localModelValue.length == 1 ? ' Navigation' : ' Navigations' }}</span>
            </div>
        </Transition>

    </div>

</template>

<script>

import SlideUpDown from "vue3-slide-up-down";
import NavigationMenus from "./NavigationMenus";
import { useVersionBuilder } from "@stores/VersionBuilder";
import SuccessBadge from "@components/Badges/SuccessBadge";
import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";
import CreateOrUpdateNavigationModal from './CreateOrUpdate/CreateOrUpdateNavigationModal';

export default {
    props: {
        modelValue: Array,
        title: String,
        note: String,
        highlight: {
            type: Boolean,
            default: true
        },
        collapsable: {
            type: Boolean,
            default: true
        },
    },
    components: { NavigationMenus, SlideUpDown, SuccessBadge, DefaultSearchBar, CreateOrUpdateNavigationModal },
    data() {
        return {
            searchTerm: '',
            setInterval: null,
            hasNavigationToPaste: false,
            isShowingNavigations: false,
            canShowNavigationsSummary: false,
            localModelValue: this.modelValue,
            useVersionBuilder: useVersionBuilder(),
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
        screen() {
            return this.useVersionBuilder.selectedScreen
        }
    },
    methods: {
        pasteNavigation() {

            var navigation = window.localStorage.getItem('navigation');

            if( navigation !== null ) {

                //  Convert to JSON object
                navigation = JSON.parse(navigation);

                //  Clone to change the navigation id
                navigation = this.useVersionBuilder.getClonedNavigation(navigation);

                //  Add navigation
                this.localModelValue.push(navigation);

                window.localStorage.removeItem('navigation');

                this.hasNavigationToPaste = false;

                this.$message({
                    message: 'Navigation Pasted',
                    type: 'success'
                });

            }

        },
        checkPastableNavigation() {

            const navigation = window.localStorage.getItem('navigation');

            this.hasNavigationToPaste = (navigation !== null);

        }
    },
    created() {

        setTimeout(() => {
            this.isShowingNavigations = true;
            this.canShowNavigationsSummary = true;
        }, 100);

        //  Run every 1 second
        this.setInterval = setInterval(() => {

            this.checkPastableNavigation();

        }, 1000);

    },
    beforeUnmount() {
        clearInterval(this.setInterval);
    }
}
</script>
