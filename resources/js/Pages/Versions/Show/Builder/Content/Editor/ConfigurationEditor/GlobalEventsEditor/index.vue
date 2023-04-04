<template>

    <EventsEditor :events="useVersionBuilder.globalEvents"></EventsEditor>

</template>

<script>

import { useVersionBuilder } from "@stores/VersionBuilder";

export default {
    data() {
        return {
            useVersionBuilder: useVersionBuilder()
        }
    },
    computed: {
        screen() {
            return this.useVersionBuilder.selectedScreen
        }
    }
}
</script>
