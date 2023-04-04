<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        :primaryAction="exportFile"
        :primaryText="form.processing ? '': 'Export File'">

        <!-- Modal Title -->
        <template v-slot:title>Export Version</template>

        <!-- Explainer -->
        <PrimaryAlert>

            <span class="block text-justify">
                Exporting your <span class="font-semibold text-blue-500">Project File</span> will download a JSON File that can be imported into a different project
            </span>

        </PrimaryAlert>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <!-- Import Button -->
            <DefaultButton class="rounded-l-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                Export
            </DefaultButton>

        </template>

    </DefaultModal>

</template>

<script>

    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultButton from '@components/Button/DefaultButton';

    export default {
        props: ['form'],
        components: { PrimaryAlert, DefaultModal, DefaultButton },
        data() {
            return {
                useVersionBuilder: useVersionBuilder(),
                project: this.$page.props.projectPayload,
                version: this.$page.props.versionPayload,
                app: this.$page.props.appPayload,
            }
        },
        methods: {
            exportFile (closeModal) {

                /** Download builder automatically
                 *
                 *  This approach has the following advantages over other proposed ones:
                 *  - No HTML element needs to be clicked
                 *  - Result will be named as you want it
                 *  - No jQuery needed
                 *
                 *  Reference: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
                 */
                var name = this.app.name +' - version '+ this.version.number;
                var json = this.useVersionBuilder.builder;

                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
                var downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href",     dataStr);
                downloadAnchorNode.setAttribute("download", name + ".json");
                document.body.appendChild(downloadAnchorNode);  // required for firefox
                downloadAnchorNode.click();
                downloadAnchorNode.remove();

                this.$message({
                    message: 'Exporting your project file',
                    type: 'success'
                });

                closeModal();

            },
        }
    };

</script>
