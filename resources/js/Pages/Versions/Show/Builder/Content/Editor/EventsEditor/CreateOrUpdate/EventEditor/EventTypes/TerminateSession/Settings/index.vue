<template>

    <div>

        <!-- Message -->
        <TextOrCodeEditor v-model="form.event_data.message" label="Message" placeholder="Hi {{ first_name }}, your account was created!" :error="form.errors.message" te_height="md" class="mb-6">
            <template #info>
                <span>
                    This is the termination message (Optional)
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
            return {

            }
        }
    }
</script>
