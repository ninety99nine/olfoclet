<template>

    <div>

        <!-- If the form property is provided -->
        <template v-if="form">

            <!-- Explainer -->
            <PrimaryAlert class="mb-6">Manage a collection of related events</PrimaryAlert>

            <!-- Events Editor -->
            <EventsEditor :events="form.event_data.events"></EventsEditor>

            <!-- Error -->
            <DefaultError :error="form.errors.events" class="mt-2"></DefaultError>

        </template>

        <!-- If the events property is provided (Refer to the EventMenu.vue component) -->
        <template v-else>

            <!-- Events Editor -->
            <EventsEditor :events="event.event_data.events"></EventsEditor>

        </template>

    </div>

</template>

<script>

    import DefaultError from '@components/Error/DefaultError';
    import PrimaryAlert from "@components/Alert/PrimaryAlert";

    export default {
        props: ['form', 'event'],
        components: { DefaultError, PrimaryAlert },
        data(){
            return {}
        }
    }
</script>
