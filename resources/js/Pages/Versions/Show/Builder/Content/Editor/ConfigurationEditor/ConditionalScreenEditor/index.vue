<template>

    <!-- Switch -->
    <DefaultSwitch v-model="useVersionBuilder.builder.conditional_screens.active" :note="( useVersionBuilder.builder.conditional_screens.active ? 'Disable ' : 'Enable') + ' conditional screen selection'" class="mb-6"></DefaultSwitch>

    <!-- Code Editor -->
    <Transition name="fade">
        <CodeEditor v-if="useVersionBuilder.builder.conditional_screens.active" v-model="useVersionBuilder.builder.conditional_screens.code" height="700px"></CodeEditor>
    </Transition>

</template>

<script>

    import { useVersionBuilder } from '@stores/VersionBuilder';
    import CodeEditor from '@components/CodeEditor/CodeEditor';
    import DefaultSwitch from '@components/Switch/DefaultSwitch';

    export default {
        components: { CodeEditor, DefaultSwitch },
        data(){
            return {
                useVersionBuilder: useVersionBuilder()
            }
        }
    };

</script>
