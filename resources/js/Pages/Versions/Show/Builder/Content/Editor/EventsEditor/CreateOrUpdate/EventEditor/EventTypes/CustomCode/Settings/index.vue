<template>

    <div>

        <!-- Explainer -->
        <PrimaryAlert class="mb-6">Write customized code</PrimaryAlert>

        <!-- Code Editor -->
        <CodeEditor v-model="form.event_data.code"></CodeEditor>

    </div>

</template>

<script>

    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import CodeEditor from '@components/CodeEditor/CodeEditor';

    export default {
        props: ['form'],
        components: { PrimaryAlert, CodeEditor },
        data(){
            return {}
        }
    }
</script>
