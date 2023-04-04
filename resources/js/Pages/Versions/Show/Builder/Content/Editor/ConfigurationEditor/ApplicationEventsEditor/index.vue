<template>

    <div>

        <EventsEditor :events="useVersionBuilder.builder.application_events.on_start" title="On Start Events" note="Run events on application start" class="mb-6"></EventsEditor>

        <EventsEditor :events="useVersionBuilder.builder.application_events.on_close" title="On Close Events" note="Run events on application close"></EventsEditor>

    </div>

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
