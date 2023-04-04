<template>

    <div class="relative min-h-screen">

        <!-- Dashboard Header For Guest User -->
        <DashboardHeader></DashboardHeader>

        <!-- Place the custom content here -->
        <slot />

        <!-- Dashboard Footer For Guest User -->
        <DashboardFooter></DashboardFooter>

    </div>

</template>

<script>

    import DashboardFooter from './Footer/DashboardFooter';
    import DashboardHeader from './Header/DashboardHeader';

    export default {
        components: { DashboardFooter, DashboardHeader }
    };

</script>
