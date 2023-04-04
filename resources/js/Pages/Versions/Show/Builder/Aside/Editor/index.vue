<template>

    <div>

        <div class="flex items-center justify-between border-b border-dotted pb-2 mb-2">

            <div class="flex items-center">

                <h5 class="text-sm font-semibold tracking-tight text-gray-600">Screens</h5>

                <!-- Counter -->
                <NumberBadge v-if="useVersionBuilder.totalScreens" :count="useVersionBuilder.totalScreens" :active="false" class="ml-2"></NumberBadge>

            </div>

            <div>

                <!-- Create Screen Modal Button -->
                <CreateScreenModal></CreateScreenModal>

            </div>

        </div>

        <div class="mb-2">

            <!-- Screen Search Bar -->
            <DefaultSearchBar v-model="useVersionBuilder.filterScreenSearch" placeholder="Search screens" />

        </div>

        <!-- Screen Navigation Menus -->
        <ScreenMenus></ScreenMenus>

        <!-- Configuration Menus -->
        <ConfigMenus></ConfigMenus>

    </div>

</template>

<script>

    import NumberBadge from '@components/Badges/NumberBadge';
    import ScreenMenus from "./ScreenNavigation/ScreenMenus";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import ConfigMenus from "./ConfigurationNavigation/ConfigMenus";
    import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";
    import CreateScreenModal from "@screenEditor/CreateScreen/CreateScreenModal";

    export default {
        components: { NumberBadge, ScreenMenus, ConfigMenus, CreateScreenModal, DefaultSearchBar },
        data(){
            return {
                useVersionBuilder: useVersionBuilder()
            }
        }
    };

</script>
