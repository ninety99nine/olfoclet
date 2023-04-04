<template>

    <div>

        <!-- Automatic Replies -->
        <TextOrCodeEditor v-model="form.event_data.automatic_replies" label="Automatic Replies" placeholder="1*2*3*{{ order.id }}*4" note="User replies" :error="form.errors.automatic_replies"></TextOrCodeEditor>

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
