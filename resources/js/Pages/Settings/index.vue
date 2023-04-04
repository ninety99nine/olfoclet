<template>

    <div class="pt-8 px-16 mt-4 pb-52">

        <Head title="Settings" />

        <div class="grid grid-cols-12">

            <div class="col-span-2">

                <!-- Menu -->
                <SettingsMenu />

            </div>

            <div class="col-span-8 col-start-4">

                <!-- Content -->
                <SettingsContent />

            </div>

        </div>

    </div>

</template>

<script>

    import SettingsMenu from "./SettingsMenu";
    import { Head } from '@inertiajs/vue3';
    import SettingsContent from "./SettingsContent";

    export default {
        components: { Head, SettingsMenu, SettingsContent },
        data() {
            return {

            }
        }
    };

</script>
