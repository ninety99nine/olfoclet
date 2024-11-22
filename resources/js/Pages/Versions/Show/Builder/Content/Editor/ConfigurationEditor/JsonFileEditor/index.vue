<template>
    <!-- Code Editor -->
    <Transition name="fade">
        <div>
            <div :class="['flex items-end mb-4', isLoading || errorMessage || mustSaveChanges ? 'justify-between' : 'justify-end' ]">

                <!-- Loader -->
                <div v-if="isLoading" class="flex justify-start items-center">
                    <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8H4z"></path>
                    </svg>
                    <span class="ml-2 text-sm">Loading...</span>
                </div>

                <!-- Error Message -->
                <span v-else-if="errorMessage" class="flex text-red-500 text-xs">
                    <svg class="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span>{{ errorMessage }}</span>
                </span>

                <!-- Must Save Changes -->
                <span v-else-if="mustSaveChanges" class="text-green-500 text-xs">
                    <span>Save your changes</span>
                </span>

                <div class="flex space-x-4">

                    <!-- Reset -->
                    <DefaultButton v-if="!isLoading && (errorMessage || mustSaveChanges)" @click="resetBuilder" paddingClasses="px-2.5 py-0.5">
                        <svg class="w-4 h-4 text-gray-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                        <span>Reset</span>
                    </DefaultButton>

                    <!-- Copy Original To Clipboard -->
                    <CopyToClipboard :value="originalBuilderAsJsonString" message="Copied Original Json File" class="whitespace-nowrap">
                        <DefaultBadge :clickable="true">Copy (Original) Json File</DefaultBadge>
                    </CopyToClipboard>

                    <!-- Copy To Clipboard -->
                    <CopyToClipboard v-if="mustSaveChanges" :value="builderAsJsonString" message="Copied Json File" class="whitespace-nowrap">
                        <PrimaryBadge :clickable="true">Copy (Unsaved) Json File</PrimaryBadge>
                    </CopyToClipboard>

                </div>

            </div>

            <!-- Editable JSON File -->
            <textarea
                v-model="builderAsJsonString"
                class="w-full h-96 p-4 text-xs font-mono bg-gray-50 border border-gray-300 rounded-md overflow-y-auto resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="debouncedUpdateBuilder"
            ></textarea>
        </div>
    </Transition>
</template>

<script>
import { debounce } from "lodash";
import CopyToClipboard from '@components/CopyToClipboard';
import DefaultBadge from '@components/Badges/DefaultBadge';
import PrimaryBadge from '@components/Badges/PrimaryBadge';
import { useVersionBuilder } from '@stores/VersionBuilder';
import DefaultButton from "@components/Button/DefaultButton";

export default {
    components: { CopyToClipboard, DefaultBadge, PrimaryBadge, DefaultButton },
    data() {
        return {
            useVersionBuilder: useVersionBuilder(),
            originalBuilderAsJsonString: '',
            builderAsJsonString: '',
            errorMessage: null,
            hasChanges: false,  // New property to track changes
            isLoading: false,    // New property for loader state
        };
    },
    computed: {
        // Compute if changes have been made
        mustSaveChanges() {
            return this.hasChanges && !this.errorMessage; // Check against hasChanges
        }
    },
    methods: {
        updateBuilder() {
            this.isLoading = false;
            try {
                console.log('updateBuilder');
                const parsedJson = JSON.parse(this.builderAsJsonString);
                this.useVersionBuilder.builder = parsedJson;
                this.errorMessage = null;
                this.hasChanges = true; // Mark as having changes
            } catch (error) {
                this.errorMessage = "Invalid JSON format";
                this.hasChanges = false; // Reset if there's an error
            }
        },
        debouncedUpdateBuilder() {
            this.isLoading = true; // Start loading before debounce
            this.debouncedUpdateBuilderInternal();
        },
        debouncedUpdateBuilderInternal: debounce(function () {
            this.updateBuilder();
            this.isLoading = false;
        }, 1000),
        resetBuilder() {
            this.builderAsJsonString = this.originalBuilderAsJsonString;
            this.errorMessage = null;
            this.hasChanges = false;
        },
    },
    created() {
        this.builderAsJsonString = JSON.stringify(this.useVersionBuilder.builder, null, 2);
        this.originalBuilderAsJsonString = _.cloneDeep(this.builderAsJsonString);
    }
};
</script>
