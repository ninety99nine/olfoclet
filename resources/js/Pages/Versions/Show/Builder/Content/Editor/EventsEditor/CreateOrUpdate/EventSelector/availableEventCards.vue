<template>
    <div class="grid grid-cols-3 gap-2">
        <availableEventCard v-for="(availableEvent, index) in availableEvents" :key="index" :availableEvent="availableEvent" @click="onclick(availableEvent)"></availableEventCard>
    </div>
</template>

<script>

import availableEventCard from "./availableEventCard"

export default {
    props: ['form', 'availableEvents', 'setAvailableEvents', 'createEvent'],
    components: { availableEventCard },
    methods: {
        onclick(availableEvent) {
            if(availableEvent.hasOwnProperty('children')) {
                this.setAvailableEvents(availableEvent.children, true);
            }else{
                this.form.name = availableEvent.type;
                this.createEvent();
            }
        }
    }
}
</script>
