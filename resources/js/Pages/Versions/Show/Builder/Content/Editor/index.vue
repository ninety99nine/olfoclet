<template>

    <div class="p-8 relative h-full">

        <Transition :duration="300" name="fade" mode="out-in" appear>

            <div v-if="useVersionBuilder.selectedConfigMenu" :key="useVersionBuilder.selectedConfigMenu">
                 <!--
                    The component key added above activates transition via selected config menu name changes.

                    This comment is added here since we cannot add comments within the
                    transition component alongside its nested children
                 -->
                <ConfigurationEditorHeader></ConfigurationEditorHeader>
                <ConfigurationEditor></ConfigurationEditor>

            </div>

            <ScreenEditor v-else-if="screen" :key="screen.id">
                 <!--
                    The component key added above activates transition via screen id changes.

                    This comment is added here since we cannot add comments within the
                    transition component alongside its nested children
                 -->
            </ScreenEditor>

            <NoScreens v-else></NoScreens>

        </Transition>

    </div>

</template>

<script>

    import ScreenEditor from "./ScreenEditor";
    import NoScreens from './ScreenEditor/NoScreens';
    import ConfigurationEditor from "./ConfigurationEditor";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import ConfigurationEditorHeader from "./ConfigurationEditor/Header";

    export default {
        components: { ScreenEditor, NoScreens, ConfigurationEditor, ConfigurationEditorHeader },
        data(){
            return {
                useVersionBuilder: useVersionBuilder()
            }
        },
        computed: {
            screen() {
                return this.useVersionBuilder.selectedScreen
            }
        }
    };

</script>
