<template>

    <div>

        <EventsEditor :events="display.content.events.on_enter" title="On Enter" note="Run events on display enter" class="mb-6"></EventsEditor>

        <EventsEditor :events="display.content.events.on_response" title="On Response" note="Run events on reply" class="mb-6"></EventsEditor>

        <EventsEditor :events="display.content.events.on_leave" title="On Leave" note="Run events on display leave" class="mb-6"></EventsEditor>

    </div>

</template>

<script>

export default {
    props: ['display']
}
</script>
