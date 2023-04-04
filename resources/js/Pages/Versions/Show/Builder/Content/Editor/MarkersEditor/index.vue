<template>

    <div class="p-4 rounded-lg bg-gray-50 shadow-md border">

        <div class="flex items-center justify-between border-b border-dotted pb-4 mb-4">

            <!-- Marker Search Bar -->
            <DefaultSearchBar v-model="searchTerm" placeholder="Search markers" />

            <!-- Add Marker Button & Modal -->
            <CreateOrUpdateMarkerModal v-if="localModelValue.length" :markers="localModelValue" mode="create"></CreateOrUpdateMarkerModal>

        </div>

        <!-- Markers -->
        <Markers v-model="localModelValue" :searchTerm="searchTerm" class="mb-6"></Markers>

    </div>

</template>

<script>

import Markers from "./Markers";
import { useVersionBuilder } from "@stores/VersionBuilder";
import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";
import CreateOrUpdateMarkerModal from './CreateOrUpdate/CreateOrUpdateMarkerModal';

export default {
    props: {
        modelValue: {
            type: Array,
        },
        something: {
            type: String
        }
    },
    components: { Markers, DefaultSearchBar, CreateOrUpdateMarkerModal },
    data() {
        return {
            searchTerm: '',
            localModelValue: this.modelValue,
            useVersionBuilder: useVersionBuilder()
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
}
</script>
