<template>

    <div>

        <!-- Sender Name -->
        <TextOrCodeEditor v-model="form.event_data.sender_name" label="Sender Name" placeholder="Company XYZ" :error="form.errors.sender_name" class="mb-6">
            <template #info>
                <span>
                    This is the name of the sender of this email e.g Company XYZ
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Sender Email -->
        <TextOrCodeEditor v-model="form.event_data.sender_email" label="Sender Email" placeholder="sender@gmail.com" :error="form.errors.sender_email" class="mb-6">
            <template #info>
                <span>
                    This is the email of the sender e.g sender@gmail.com
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Recipient Email -->
        <TextOrCodeEditor v-model="form.event_data.recipient_email" label="Recipient Email" placeholder="recipient@gmail.com" :error="form.errors.recipient_email" class="mb-6">
            <template #info>
                <span>
                    This is the email of the recipient e.g recipient@gmail.com
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
