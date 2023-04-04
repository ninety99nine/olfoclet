<template>

    <TextOrCodeEditor v-model="display.content.instruction" label="Instruction" placeholder="Welcome to {{ company }}, how may we help you today?" te_height="lg" :showCode="false"></TextOrCodeEditor>

</template>

<script>

    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['display'],
        components: { TextOrCodeEditor }
    };

</script>
