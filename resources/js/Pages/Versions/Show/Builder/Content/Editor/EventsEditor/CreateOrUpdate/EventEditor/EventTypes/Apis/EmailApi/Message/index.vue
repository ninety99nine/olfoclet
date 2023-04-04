<template>

    <div>

        <!-- Subject -->
        <TextOrCodeEditor v-model="form.event_data.subject" label="Subject" placeholder="My subject" :error="form.errors.subject" class="mb-6">
            <template #info>
                <span>
                    This is the email subject e.g Welcome
                </span>
            </template>
        </TextOrCodeEditor>

        <template v-if="!form.event_data.message.code_editor_mode">

            <!-- Toggle Message Preview -->
            <div class="flex justify-end mb-4">
                <PrimaryButton @click="togglePreviewMessage()">

                    <!-- Closed Eye Icon -->
                    <svg v-if="previewMessage" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>

                    <!-- Open Eye Icon -->
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>

                    <span>{{ previewMessage ? 'Stop preview' : 'Preview Message' }}</span>

                </PrimaryButton>
            </div>

            <!-- Message Preview -->
            <div v-if="previewMessage" v-html="form.event_data.message.text" contenteditable="true" @blur="onBlur"></div>

        </template>

        <!-- Message -->
        <TextOrCodeEditor v-if="!previewMessage" v-model="form.event_data.message" :languages="[['HTML', 'Html']]" label="Message" placeholder="My message" :error="form.errors.message">
            <template #info>
                <span>
                    This is the email message e.g Thank you for joining Company XYZ
                </span>
            </template>
        </TextOrCodeEditor>

    </div>

</template>

<script>

    import PrimaryButton from '@components/Button/PrimaryButton';
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['form'],
        components: { PrimaryButton, TextOrCodeEditor },
        data(){
            return {
                previewMessage: false
            }
        },
        methods: {
            togglePreviewMessage() {
                this.previewMessage = !this.previewMessage;
            },
            onBlur(val) {
                let html = val.target.innerHTML;
                this.form.event_data.message.text = html;
            }
        },
        created() {
            const messageTextIsNotEmpty = ['', null].includes(this.form.event_data.message.text) == false;
            this.previewMessage = messageTextIsNotEmpty;
        }
    }
</script>
