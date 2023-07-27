<template>

    <TextOrCodeEditor v-model="useVersionBuilder.builder.sms_connection.client_credentials" label="Client Credentials" placeholder="Enter client credentials" :showCode="true" class="mb-6"></TextOrCodeEditor>

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
