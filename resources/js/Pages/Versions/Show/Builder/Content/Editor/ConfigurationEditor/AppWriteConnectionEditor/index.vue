<template>

    <TextOrCodeEditor v-model="useVersionBuilder.builder.appwrite_connection.endpoint" label="Endpoint" placeholder="https://api.example.com/v1" :showCode="true" class="mb-6"></TextOrCodeEditor>
    <TextOrCodeEditor v-model="useVersionBuilder.builder.appwrite_connection.project_id" label="Project ID" placeholder="5df5acd0d48c2..." :showCode="true" class="mb-6"></TextOrCodeEditor>
    <TextOrCodeEditor v-model="useVersionBuilder.builder.appwrite_connection.api_key" label="Secret API key" placeholder="919c2d18fb5d4..." :showCode="true"></TextOrCodeEditor>

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
