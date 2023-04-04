<template>

    <TextOrCodeEditor v-model="useVersionBuilder.builder.airtime_billing_connection.client_id" label="Client ID" placeholder="Enter client id" :showCode="true" class="mb-6"></TextOrCodeEditor>
    <TextOrCodeEditor v-model="useVersionBuilder.builder.airtime_billing_connection.client_secret" label="Client Secret" placeholder="Enter client secret" :showCode="true"></TextOrCodeEditor>

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
