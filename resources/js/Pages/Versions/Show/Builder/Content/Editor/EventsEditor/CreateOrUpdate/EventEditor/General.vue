<template>

    <div>

        <!-- Cloning Indication -->
        <p v-if="mode == 'clone'" class="text-sm text-gray-500 mb-5">Cloning <span class="text-blue-500 font-bold">{{ event.name }}</span> event</p>

        <!-- Global Switch-->
        <DefaultSwitch v-model="form.global" :note="form.global ? 'Disable global presence' : 'Enable global presence'" class="mb-6"></DefaultSwitch>

        <!-- Event Name -->
        <DefaultInput v-if="['clone', 'update'].includes(mode)" v-model="form.name" label="Name" :error="form.errors.name" :autofocus="true" class="mb-6"></DefaultInput>

        <!-- Event Active State -->
        <SelectActiveState v-model="form.active" class="mb-6"></SelectActiveState>

        <!-- Run Active State -->
        <template v-if="form.active.selected_type !== 'no'">
            <SelectActiveState v-model="form.run_next_events" :additionalOptions="runNextEventsOptions" label="Run next events" info="Determine whether to run events after this event" class="mb-6"></SelectActiveState>
        </template>

        <div class="flex items-end justify-between">

            <!-- Comment -->
            <DefaultTextArea v-model="form.comment" label="Comment" class="flex-1 mr-4"></DefaultTextArea>

            <!-- Color Picker -->
            <DefaultColorPicker v-model="form.hexColor"></DefaultColorPicker>

        </div>

    </div>

</template>

<script>

    import DefaultInput from "@components/Input/DefaultInput";
    import DefaultSwitch from "@components/Switch/DefaultSwitch";
    import DefaultTextArea from "@components/TextArea/DefaultTextArea";
    import SelectActiveState from "@builderComponents/SelectActiveState";
    import DefaultColorPicker from '@components/ColorPicker/DefaultColorPicker';

    export default {
        props: ['form', 'event', 'mode'],
        components: { DefaultInput, DefaultSwitch, DefaultTextArea, SelectActiveState, DefaultColorPicker},
        data() {
            return {
                runNextEventsOptions: [
                    {
                        label: 'If Active',
                        value: 'if_active',
                    },
                    {
                        label: 'If Inactive',
                        value: 'if_inactive',
                    }
                ]
            }
        }
    };

</script>
