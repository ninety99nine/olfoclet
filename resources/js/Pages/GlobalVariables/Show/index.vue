<template>

    <div class="pt-8 px-16 mt-4 pb-52">

        <Head :title="appPayload.name + ' - Version ' + versionPayload.number" />

        <div class="grid grid-cols-12 gap-8">

            <div class="col-span-3">

                <!-- Back Button -->
                <BackButton></BackButton>

                <!-- Account Details -->
                <GlobalVariableDetails />

            </div>

            <div class="col-span-9">

                <UpdateGlobalVariable />

            </div>

        </div>

    </div>

</template>

<script>

    import BackButton from "./BackButton";
    import GlobalVariableDetails from "./Details";
    import { Head } from '@inertiajs/vue3';
    import UpdateGlobalVariable from './UpdateGlobalVariable';

    export default {
        props: {
            appPayload: Object,
            versionPayload: Object,
            globalVariablePayload: Object,
        },
        components: { Head, BackButton, GlobalVariableDetails, UpdateGlobalVariable },
        data() {
            return {

            }
        }
    };

</script>
