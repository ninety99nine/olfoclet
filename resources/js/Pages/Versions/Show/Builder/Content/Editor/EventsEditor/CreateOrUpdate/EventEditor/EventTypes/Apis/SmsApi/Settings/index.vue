<template>

    <div>

        <!-- Sender Name -->
        <TextOrCodeEditor v-model="form.event_data.sender_name" label="Sender Name" placeholder="Company XYZ" note="Must be 20 or less characters" :error="form.errors.sender_name" class="mb-6">
            <template #info>
                <span>
                    This is the name of the sender of this SMS e.g Company XYZ. The sender name must not exceed 20 characters
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Sender Mobile Number -->
        <TextOrCodeEditor v-model="form.event_data.sender_number" label="Sender Mobile" placeholder="{{ ussd.msisdn }}" note="From" :error="form.errors.sender_number" class="mb-6">
            <template #info>
                <span>
                    This is the mobile number of the sender this SMS e.g 26772123456
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Recipient Mobile Number -->
        <TextOrCodeEditor v-model="form.event_data.recipient_number" label="Recipient Mobile" placeholder="{{ ussd.msisdn }}" note="To" :error="form.errors.recipient_number" class="mb-6">
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
