<template>

    <div class="absolute bottom-0 left-0 right-0">

        <div class="flex justify-center -mb-8">

            <WindTurbineLoader class="scale-150"></WindTurbineLoader>

        </div>

        <div class="flex items-center justify-center py-4 pt-12 bg-white shadow-md">

            <Logo width="w-16" class="mr-2" />

            <span class="text-sm text-gray-500">© 2018 - {{ currentYear }} Optimum Quality. All Rights Reserved</span>

        </div>

    </div>

</template>

<script>

    import WindTurbineLoader from "@components/Loader/Unique/WindTurbineLoader";
    import Logo from "@components/Logo/Logo";

    export default {
        components: { Logo, WindTurbineLoader },
        props: {
            showWindTurbine: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                currentYear: new Date().getFullYear()   // 2022
            };
        }
    };

</script>
