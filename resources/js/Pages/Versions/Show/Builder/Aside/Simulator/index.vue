<template>

    <div>

        <!-- Heading -->
        <div class="flex items-center justify-between border-b border-dotted pb-2 mb-8">
            <h5 class="text-sm font-semibold tracking-tight text-gray-600">Simulator Settings</h5>
        </div>

        <!-- Mobile Number -->
        <DefaultInput v-model="useVersionBuilder.settings.simulator.subscriber.phone_number" label="Mobile number" placeholder="26772001234" class="mb-6"></DefaultInput>

        <!-- Allow Timeout -->
        <DefaultSwitch v-model="useVersionBuilder.settings.session.allow_timeouts" label="Allow Timeouts" class="mb-6">
            <span class="text-xs text-gray-400 ml-2">
                &#8212; {{ useVersionBuilder.settings.session.allow_timeouts ? 'Timeout enabled' : 'Timeout disabled' }}
            </span>
        </DefaultSwitch>

        <!-- Timeout In Seconds -->
        <DefaultInput v-model="useVersionBuilder.settings.session.timeout_limit_in_seconds" type="number" label="Timeout In Seconds" placeholder="120" :disabled="useVersionBuilder.settings.session.allow_timeouts == false" class="mb-6"></DefaultInput>

        <!-- Timeout Message -->
        <DefaultTextArea v-model="useVersionBuilder.settings.session.timeout_message" label="Timeout Message" :disabled="useVersionBuilder.settings.session.allow_timeouts == false"></DefaultTextArea>

        <!-- Heading -->
        <div class="border-b border-dotted pb-4 my-8">
            <h5 class="text-sm font-semibold tracking-tight text-gray-600">Log Settings</h5>
            <h5 class="text-xs tracking-tight text-gray-400 mt-4 italic text-justify">Showing the debugging logs may slow down the performance of the simulator. Turn off the logs for better performance</h5>
        </div>

        <!-- Show Debugging Logs -->
        <DefaultSwitch v-model="useVersionBuilder.settings.simulator.debugger.return_logs" label="Show Debugging Logs" class="mb-6"></DefaultSwitch>

        <!-- Summarize Debugging Logs -->
        <template v-if="useVersionBuilder.settings.simulator.debugger.return_logs">
            <DefaultSwitch v-model="useVersionBuilder.settings.simulator.debugger.return_summarized_logs" label="Summarize Debugging Logs" class="mb-6"></DefaultSwitch>
        </template>

        <!--
            File 02 — settings save independently of the builder. Changing a test
            number / timeout / debugger flag hits the lightweight
            PUT version.settings.update endpoint and never re-saves or repairs
            the large builder JSON.
        -->
        <div class="border-t border-dotted pt-6 mt-8">
            <DefaultButton
                :loading="isSaving"
                :disabled="isSaving"
                @click="saveSettings()"
                class="w-full">
                Save Settings
            </DefaultButton>
        </div>

    </div>

</template>

<script>

    import DefaultInput from "@components/Input/DefaultInput";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultButton from "@components/Button/DefaultButton";
    import DefaultSwitch from "@components/Switch/DefaultSwitch";
    import DefaultTextArea from "@components/TextArea/DefaultTextArea";

    export default {
        components: { DefaultInput, DefaultButton, DefaultSwitch, DefaultTextArea },
        data(){
            return {
                isSaving: false,
                useVersionBuilder: useVersionBuilder()
            }
        },
        methods: {
            saveSettings(){

                this.isSaving = true;

                const self = this;

                this.useVersionBuilder.saveSettings()
                    .then(() => {
                        self.$message({ message: 'Settings saved successfully', type: 'success' });
                    })
                    .catch((error) => {
                        var message = (error || {}).message ?? 'Sorry, something went wrong';
                        if( ((error || {}).response || {}).status === 419 ) {
                            message = 'Please login';
                            self.$inertia.get(route('login.show'));
                        }
                        self.$message({ message: message, type: 'warning' });
                    })
                    .finally(() => {
                        self.isSaving = false;
                    });
            }
        }
    };

</script>
