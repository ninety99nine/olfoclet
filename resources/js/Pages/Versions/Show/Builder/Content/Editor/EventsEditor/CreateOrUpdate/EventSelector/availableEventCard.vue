<template>
    <div class="col-span-1 relative flex items-center justify-center bg-gray-50 border hover:bg-blue-50 hover:border-blue-200 active:bg-blue-100 active:border-blue-400 hover:shadow-md rounded-md py-5 text-xs text-gray-800 cursor-pointer">
        <span v-if="availableEvent.hasOwnProperty('children')" class="absolute top-0 right-0 bg-blue-300 font-semibold mr-2 mt-2 px-2 py-1 rounded-full text-gray-800 text-xs">
            {{ availableEvent.children.length }}
        </span>
        <div>
            <EventIcon class="mx-auto mb-4"></EventIcon>
            <p>{{ availableEvent.type }}</p>
        </div>
    </div>
</template>

<script>
import EventIcon from "@eventsEditor/EventIcon"

export default {
    props: ['availableEvent'],
    components: { EventIcon }
}
</script>
