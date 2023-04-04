<template>

    <img src="/images/logo-bold.png" alt="Logo" :class="[width]">

</template>

<script>

    export default {
        props: {
            width: {
                type: String,
                default: 'w-24'
            }
        }
    };

</script>
