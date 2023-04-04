<template>

    <div>

        <PrimaryAlert class="mb-6">
            <span>Download log files for debugging</span>
        </PrimaryAlert>

        <div class="space-y-4">

            <div v-for="(fileNames, groupName, index) in fileNameClusters" :key="index">

                <!-- Show If Files Exist -->
                <template v-if="fileNames.length">

                    <!-- File Group Name -->
                    <h2 class="text-sm font-semibold text-blue-500 mb-2">{{ groupName }}</h2>

                    <div class="flex flex-wrap gap-4">

                        <template v-for="(fileName, index2) in fileNames" :key="index2">

                            <!-- File Name -->
                            <a  class="text-xs text-gray-400 hover:text-blue-500 active:text-blue-600 hover:underline"
                                :href="route('settings.server.logs.download', { file_name: fileName })" target="_blank">
                                {{ fileName }}
                            </a>

                        </template>

                    </div>

                </template>

            </div>

        </div>

        <DefaultError v-if="fileError" :error="fileError" class="mt-4"></DefaultError>

    </div>

</template>

<script>

    import DefaultError from '@components/Error/DefaultError';
    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import PrimaryButton from "@components/Button/PrimaryButton";

    export default {
        components: { DefaultError, PrimaryAlert, PrimaryButton },
        data() {
            return {
                fileNameClusters: this.$page.props.fileNames,
                fileError: (this.$page.props.errors || {}).file
            }
        }
    };

</script>
