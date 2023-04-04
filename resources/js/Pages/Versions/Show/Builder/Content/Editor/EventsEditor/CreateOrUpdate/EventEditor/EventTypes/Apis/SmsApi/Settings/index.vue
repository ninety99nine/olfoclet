<template>

    <div>

        <!-- Sender -->
        <TextOrCodeEditor v-model="form.event_data.sender" label="Sender" placeholder="Company XYZ" note="Must be less than 11 characters" :error="form.errors.sender" class="mb-6">
            <template #info>
                <span>
                    This is the name of the sender of this SMS e.g Company XYZ. The sender name must not exceed 11 characters
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Recipient -->
        <TextOrCodeEditor v-model="form.event_data.recipient" label="Recipient" placeholder="{{ ussd.msisdn }}" note="Mobile number" :error="form.errors.recipient" class="mb-6">
            <template #info>
                <span>
                    This is the mobile number to send this SMS e.g 26772123456
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Message -->
        <TextOrCodeEditor v-model="form.event_data.message" label="Message" placeholder="Hi, this is a simple message" :error="form.errors.message">
            <template #info>
                <span>
                    This is the SMS message to send e.g Thank you for joining Company XYZ
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
