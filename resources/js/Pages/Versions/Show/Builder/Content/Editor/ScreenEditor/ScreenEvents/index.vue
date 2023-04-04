<template>

    <div>

        <EventsEditor :events="screen.events.on_enter" title="On Enter" note="Run events on screen enter" class="mb-6"></EventsEditor>

        <EventsEditor :events="screen.events.on_response" title="On Response" note="Run events on reply" class="mb-6"></EventsEditor>

        <EventsEditor :events="screen.events.on_leave" title="On Leave" note="Run events on screen leave" class="mb-6"></EventsEditor>

    </div>

</template>

<script>

import { useVersionBuilder } from '@stores/VersionBuilder';

export default {
    data(){
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
