<template>

    <TextOrCodeEditor v-model="useVersionBuilder.builder.firebase_connection.json" label="Firebase JSON Configuration" te_height="lg" placeholder="{ Json ... }" :showCode="true"></TextOrCodeEditor>

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
