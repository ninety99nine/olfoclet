<template>

    <div>

        <!-- Heading -->
        <div class="flex items-center justify-between border-b border-dotted pb-2 mb-8">
            <h5 class="text-sm font-semibold tracking-tight text-gray-600">Simulator Settings</h5>
        </div>

        <!-- Mobile Number -->
        <DefaultInput v-model="useVersionBuilder.builder.simulator.subscriber.phone_number" label="Mobile number" placeholder="26772001234" class="mb-6"></DefaultInput>

        <!-- Allow Timeout -->
        <DefaultSwitch v-model="useVersionBuilder.builder.simulator.settings.allow_timeouts" label="Allow Timeouts" class="mb-6">
            <span class="text-xs text-gray-400 ml-2">
                &#8212; {{ useVersionBuilder.builder.simulator.settings.allow_timeouts ? 'Timeout enabled' : 'Timeout disabled' }}
            </span>
        </DefaultSwitch>

        <!-- Timeout In Seconds -->
        <DefaultInput v-model="useVersionBuilder.builder.simulator.settings.timeout_limit_in_seconds" type="number" label="Timeout In Seconds" placeholder="120" :disabled="useVersionBuilder.builder.simulator.settings.allow_timeouts == false" class="mb-6"></DefaultInput>

        <!-- Timeout Message -->
        <DefaultTextArea v-model="useVersionBuilder.builder.simulator.settings.timeout_message" label="Timeout Message" :disabled="useVersionBuilder.builder.simulator.settings.allow_timeouts == false"></DefaultTextArea>

        <!-- Heading -->
        <div class="border-b border-dotted pb-4 my-8">
            <h5 class="text-sm font-semibold tracking-tight text-gray-600">Log Settings</h5>
            <h5 class="text-xs tracking-tight text-gray-400 mt-4 italic text-justify">Showing the debugging logs may slow down the performance of the simulator. Turn off the logs for better performance</h5>
        </div>

        <!-- Show Debugging Logs -->
        <DefaultSwitch v-model="useVersionBuilder.builder.simulator.debugger.return_logs" label="Show Debugging Logs" class="mb-6"></DefaultSwitch>

        <!-- Summarize Debugging Logs -->
        <template v-if="useVersionBuilder.builder.simulator.debugger.return_logs">
            <DefaultSwitch v-model="useVersionBuilder.builder.simulator.debugger.return_summarized_logs" label="Summarize Debugging Logs" class="mb-6"></DefaultSwitch>
        </template>

    </div>

</template>

<script>

    import DefaultInput from "@components/Input/DefaultInput";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultSwitch from "@components/Switch/DefaultSwitch";
    import DefaultTextArea from "@components/TextArea/DefaultTextArea";

    export default {
        components: { DefaultInput, DefaultSwitch, DefaultTextArea },
        data(){
            return {
                useVersionBuilder: useVersionBuilder()
            }
        }
    };

</script>
