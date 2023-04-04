<template>

    <div>

        <!-- Explainer -->
        <PrimaryAlert class="mb-6">
            <span class="text-justify">
                Automatically or manually trigger revisit to a specific screen or display
            </span>
        </PrimaryAlert>

        <!-- Trigger Type -->
        <DefaultSelect v-model="form.event_data.general.trigger.selected_type" :options="selectOptions" label="Trigger Type" placeholder="Select trigger type" :error="form.errors.trigger_selected_type" class="mb-6"></DefaultSelect>

        <!-- Manual Trigger Input -->
        <template v-if="form.event_data.general.trigger.selected_type == 'manual'">

            <TextOrCodeEditor v-model="form.event_data.general.trigger.manual.input" label="Trigger Input" note="User response to trigger revisit" placeholder="1" :error="form.errors.input" class="mb-6">
                <template #info>
                    This is the user response value to trigger revisit to a given screen or display
                </template>
            </TextOrCodeEditor>

        </template>

        <!-- Revisit Type -->
        <DefaultSelect v-model="form.event_data.revisit_type.selected_type" :options="revisitOptions" label="Revisit Type" placeholder="Select revisit type" :error="form.errors.revisit_selected_type" class="mb-6"></DefaultSelect>

        <!-- Revisit Screen / Display -->
        <template v-if="form.event_data.revisit_type.selected_type == 'screen_revisit'">

            <!-- Screen / Display Selector -->
            <ScreenOrDisplaySelector v-model="form.event_data.revisit_type.screen_revisit.link" :error="form.errors.link" class="mb-6"></ScreenOrDisplaySelector>

        </template>

        <!-- Revisit Marker -->
        <template v-if="form.event_data.revisit_type.selected_type == 'marked_revisit'">

            <!-- Screen / Display Marker Selector -->
            <ScreenOrDisplayMarkerSelector v-model="form.event_data.revisit_type.marked_revisit.selected_marker" :error="form.errors.selected_marker" class="mb-6"></ScreenOrDisplayMarkerSelector>

        </template>

        <!-- Automatic Replies -->
        <TextOrCodeEditor v-model="form.event_data.general.automatic_replies" label="Automatic Replies" placeholder="1*2*3*{{ order.id }}*4" note="User replies" :error="form.errors.automatic_replies"></TextOrCodeEditor>

    </div>

</template>

<script>

    import { useVersionBuilder } from '@stores/VersionBuilder';
    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';
    import ScreenOrDisplaySelector from '@builderComponents/ScreenOrDisplaySelector';
    import ScreenOrDisplayMarkerSelector from '@builderComponents/ScreenOrDisplayMarkerSelector';

    export default {
        props: ['form'],
        components: { PrimaryAlert, DefaultSelect, TextOrCodeEditor, ScreenOrDisplaySelector, ScreenOrDisplayMarkerSelector },
        data(){
            return {
                useVersionBuilder: useVersionBuilder(),
                revisitOptions: [
                    {
                        label: 'Home Revisit',
                        value: 'home_revisit'
                    },
                    {
                        label: 'Screen Revisit',
                        value: 'screen_revisit'
                    },
                    {
                        label: 'Marked Revisit',
                        value: 'marked_revisit'
                    }
                ],
                selectOptions: [
                    {
                        label: 'Automatic',
                        value: 'automatic'
                    },
                    {
                        label: 'Manual',
                        value: 'manual'
                    }
                ]
            }
        }
    }
</script>
