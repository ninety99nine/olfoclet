<template>

    <div>
        <TextOrCodeEditor v-model="display.content.instruction" label="Instruction" placeholder="Welcome to {{ company }}, how may we help you today?" te_height="lg" :showCode="false"></TextOrCodeEditor>
        <el-checkbox v-model="display.content.enable_instruction_emoji" label="Allow Emojis 🙂" />
    </div>

</template>

<script>

    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['display'],
        components: { TextOrCodeEditor }
    };

</script>
