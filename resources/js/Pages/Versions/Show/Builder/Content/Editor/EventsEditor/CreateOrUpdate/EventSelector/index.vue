<template>

    <Transition name="fade" mode="out-in" appear>

        <div :key="renderKey">

            <!-- Back Button -->
            <BackButton v-if="showBackButton" @click="setAvailableEvents(availableEvents)"></BackButton>

            <!-- Available Events -->
            <availableEventCards :form="form" :availableEvents="selectedAvailableEvents" :setAvailableEvents="setAvailableEvents" :createEvent="firePrimaryAction"></availableEventCards>

        </div>

    </Transition>

</template>

<script>

    import BackButton from "./BackButton";
    import availableEventCards from './availableEventCards';

    export default {
        props: ['form', 'firePrimaryAction'],
        components: { BackButton, availableEventCards },
        data() {
            return {
                renderKey: 1,
                availableEvents: [
                    {
                        type: "API's",
                        children: [
                            {
                                type: "REST API"
                            },
                            {
                                type: "SMS API"
                            },
                            {
                                type: "Airtime Billing API"
                            },
                            {
                                type: "Orange Money API"
                            },
                            {
                                type: "Email API"
                            },
                        ]
                    },
                    {
                        type: "Third-Party Integration",
                        children: [
                            {
                                type: "Firebase Connection"
                            },
                            {
                                type: "AppWrite Connection"
                            }
                        ]
                    },
                    {
                        type: "Validation"
                    },
                    {
                        type: "Formatting"
                    },
                    {
                        type: 'Set Property',
                    },
                    {
                        type: "Custom Code"
                    },
                    {
                        type: "Auto Link"
                    },
                    {
                        type: "Auto Reply"
                    },
                    {
                        type: "Revisit"
                    },
                    {
                        type: "Redirect"
                    },
                    {
                        type: "Notification"
                    },
                    {
                        type: "Event Collection"
                    },
                    {
                        type: "Terminate Session"
                    },
                    {
                        type: "Database"
                    }
                ],
                showBackButton: false,
                selectedAvailableEvents: [],
            }
        },
        methods: {
            setAvailableEvents(availableEvents, showBackButton = false){
                this.selectedAvailableEvents = availableEvents;
                this.showBackButton = showBackButton;
                ++this.renderKey;
            }
        },
        created() {
            this.setAvailableEvents(this.availableEvents);
        }
    };

</script>
