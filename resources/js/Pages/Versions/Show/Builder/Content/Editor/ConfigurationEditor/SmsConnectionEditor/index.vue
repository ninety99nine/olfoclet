<template>

    <TextOrCodeEditor v-model="useVersionBuilder.builder.sms_connection.username" label="Username" placeholder="Enter account username" :showCode="true" class="mb-6"></TextOrCodeEditor>
    <TextOrCodeEditor v-model="useVersionBuilder.builder.sms_connection.password" label="Password" placeholder="Enter account password" :showCode="true"></TextOrCodeEditor>

</template>

<script>

    import { useVersionBuilder } from '@stores/VersionBuilder';
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        components: { TextOrCodeEditor },
        data(){
            return {
                useVersionBuilder: useVersionBuilder()
            }
        }
    };

</script>
