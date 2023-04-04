<template>

    <div>

        <!-- Explainer -->
        <PrimaryAlert class="mb-6">
            <span class="text-justify">
                Automatically or manually trigger linking to a specific screen or display
            </span>
        </PrimaryAlert>

        <!-- Trigger Type -->
        <DefaultSelect v-model="form.event_data.trigger.selected_type" :options="selectOptions" label="Trigger Type" placeholder="Select trigger type" :error="form.errors.selected_type" class="mb-6"></DefaultSelect>

        <!-- Manual Trigger Input -->
        <template v-if="form.event_data.trigger.selected_type == 'manual'">

            <TextOrCodeEditor v-model="form.event_data.trigger.manual.input" label="Trigger Input" note="User response to trigger linking" placeholder="1" :error="form.errors.input" class="mb-6">
                <template #info>
                    This is the user response value to trigger linking to the given screen or display
                </template>
            </TextOrCodeEditor>

        </template>

        <!-- Screen / Display Selector -->
        <ScreenOrDisplaySelector v-model="form.event_data.link" :error="form.errors.link"></ScreenOrDisplaySelector>

    </div>

</template>

<script>

    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';
    import ScreenOrDisplaySelector from '@builderComponents/ScreenOrDisplaySelector';

    export default {
        props: ['form'],
        components: { PrimaryAlert, DefaultSelect, TextOrCodeEditor, ScreenOrDisplaySelector },
        data(){
            return {
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
