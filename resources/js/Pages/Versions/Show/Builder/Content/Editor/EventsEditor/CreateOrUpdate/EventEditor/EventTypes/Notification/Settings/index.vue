<template>

    <div>

        <!-- MSISDN -->
        <TextOrCodeEditor v-model="form.event_data.msisdn" label="MSISDN" placeholder="{{ ussd.msisdn }}" note="Mobile number" :error="form.errors.msisdn" class="mb-6">
            <template #info>
                <span>
                    This is the mobile number to receive the notification e.g 26772123456
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Message -->
        <TextOrCodeEditor v-model="form.event_data.message" label="Message" placeholder="Hi {{ first_name }}, your account was created!" :error="form.errors.message" te_height="lg" class="mb-6">
            <template #info>
                <span>
                    This is the notification message
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Continue Text -->
        <TextOrCodeEditor v-model="form.event_data.continue_text" label="Continue Text" placeholder="1. Continue" :error="form.errors.continue_text">
            <template #info>
                <span>
                    This is the continue text to close the notification
                </span>
            </template>
        </TextOrCodeEditor>

    </div>

</template>

<script>

    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['form'],
        components: { TextOrCodeEditor },
        data(){
            return {}
        }
    }
</script>
