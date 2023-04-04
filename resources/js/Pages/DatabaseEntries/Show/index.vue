<template>

    <div class="pt-8 px-16 mt-4 pb-52">

        <Head :title="appPayload.name + ' - Version ' + versionPayload.number" />

        <div class="grid grid-cols-12 gap-8">

            <div class="col-span-3">

                <!-- Back Button -->
                <BackButton></BackButton>

                <!-- Account Details -->
                <DatabaseEntryDetails />

            </div>

            <div class="col-span-9">

                <UpdateDatabaseEntry />

            </div>

        </div>

    </div>

</template>

<script>

    import BackButton from "./BackButton";
    import DatabaseEntryDetails from "./Details";
    import { Head } from '@inertiajs/vue3';
    import UpdateDatabaseEntry from './UpdateDatabaseEntry';

    export default {
        props: {
            appPayload: Object,
            versionPayload: Object,
            databaseEntryPayload: Object,
        },
        components: { Head, BackButton, DatabaseEntryDetails, UpdateDatabaseEntry },
        data() {
            return {

            }
        }
    };

</script>
