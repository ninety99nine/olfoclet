<template>

    <div>

        <!-- Explainer -->
        <PrimaryAlert class="mb-6">
            <span class="text-justify">
                Redirect to another service code e.g *123#
            </span>
        </PrimaryAlert>

        <!-- Trigger Type -->
        <DefaultSelect v-model="form.event_data.general.trigger.selected_type" :options="selectOptions" label="Trigger Type" placeholder="Select trigger type" :error="form.errors.selected_type" class="mb-6"></DefaultSelect>

        <!-- Manual Trigger Input -->
        <template v-if="form.event_data.general.trigger.selected_type == 'manual'">

            <TextOrCodeEditor v-model="form.event_data.general.trigger.manual.input" label="Trigger Input" note="User response to trigger redirect" placeholder="1" :error="form.errors.input" class="mb-6">
                <template #info>
                    This is the user response value to trigger redirect to a given service code
                </template>
            </TextOrCodeEditor>

        </template>

        <!-- Service Code -->
        <TextOrCodeEditor v-model="form.event_data.service_code" label="Service Code" placeholder="*123#" :error="form.errors.service_code"></TextOrCodeEditor>

    </div>

</template>

<script>

    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['form'],
        components: { PrimaryAlert, DefaultSelect, TextOrCodeEditor },
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
