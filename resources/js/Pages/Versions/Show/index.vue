<template>

    <div class="pt-8 px-16 mt-4 pb-52">

        <Head :title="appPayload.name + ' - Version ' + versionPayload.number" />

        <!-- Builder Header -->
        <BuilderHeader :showEditor="showEditor" @showEditorState="showEditor = $event"></BuilderHeader>

        <div class="grid grid-cols-12 gap-2">

            <!-- Builder Aside -->
            <div class="col-span-3 py-8 px-4 bg-white rounded-md shadow-md hover:shadow-lg">

                <BuilderAside :showEditor="showEditor"></BuilderAside>

            </div>

            <!-- Builder Content -->
            <div class="col-span-9 bg-white rounded-md shadow-md hover:shadow-lg min-h-screen">

                <BuilderContent :showEditor="showEditor"></BuilderContent>

            </div>

        </div>

    </div>

</template>

<script>

    import BuilderAside from './Builder/Aside';
    import BuilderHeader from './Builder/Header';
    import BuilderContent from './Builder/Content';
    import { Head } from '@inertiajs/vue3';
    import { useVersionBuilder } from '@stores/VersionBuilder';

    export default {
        props: {
            appPayload: Object,
            versionPayload: Object
        },
        components: { Head, BuilderContent, BuilderHeader, BuilderAside },
        data(){
            return {
                showEditor: true,
                useVersionBuilder: useVersionBuilder(),
            }
        },
        beforeUnmount() {
            //  Reset the version builder before unmounting the component
            this.useVersionBuilder.$reset();
        },
    };

</script>
