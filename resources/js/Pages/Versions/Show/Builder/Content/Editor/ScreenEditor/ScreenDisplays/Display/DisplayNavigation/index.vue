<template>

    <div>

        <!-- Action Explainer -->
        <WarningAlert v-if="screen.repeat.active.selected_type === 'no'" class="mb-6">

            <span>
                Activate <span class="font-semibold text-blue-500">Screen Repeat</span> to utilize the <span class="font-semibold text-blue-500">Navigation</span> functionality.
                This will grant the ability to navigate between different instances of the screen repeat cycle. The user can navigate to the next or previous instance of the repeat cycle.
            </span>

        </WarningAlert>

        <NavigationsEditor v-model="display.content.screen_repeat_navigation.forward_navigation" title="Forward Navigation" note="Proceed to the next repeat loop" class="mb-6"></NavigationsEditor>

        <NavigationsEditor v-model="display.content.screen_repeat_navigation.backward_navigation" title="Backward Navigation" note="Return to the previous repeat loop" class="mb-6"></NavigationsEditor>

    </div>

</template>

<script>

import NavigationsEditor from './NavigationsEditor';
import WarningAlert from '@components/Alert/WarningAlert';
import { useVersionBuilder } from '@stores/VersionBuilder';

export default {
    props: ['display'],
    components: { NavigationsEditor, WarningAlert },
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
}
</script>
