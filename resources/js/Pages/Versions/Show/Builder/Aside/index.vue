<template>

    <Transition name="fade" mode="out-in" :duration="250">

        <template v-if="useVersionBuilder.hasDownloadedBuilder && useVersionBuilder.hasSavedBuilder">

            <BuilderEditorAside v-if="showEditor"></BuilderEditorAside>

            <BuilderSimulatorAside v-else></BuilderSimulatorAside>

        </template>

    </Transition>

</template>

<script>

    import BuilderEditorAside from "./Editor";
    import BuilderSimulatorAside from "./Simulator";
    import { useVersionBuilder } from '@stores/VersionBuilder';

    export default {
        props: ['showEditor'],
        components: { BuilderEditorAside, BuilderSimulatorAside },
        data(){
            return {
                useVersionBuilder: useVersionBuilder()
            }
        }
    };

</script>
