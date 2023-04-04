<template>

    <div>

        <!-- If the form property is provided -->
        <template v-if="form">

            <!-- Disclaimer -->
            <WarningAlert v-if="incompleteConfiguration" class="mb-4">
                <span class="text-justify">
                    Please complete the configuration settings to use the <span class="font-semibold text-blue-500">AppWrite</span> service
                </span>
            </WarningAlert>

            <!-- Explainer -->
            <PrimaryAlert v-else class="mb-6">Write customized code to use the <span class="font-semibold text-blue-500">AppWrite</span> service</PrimaryAlert>

            <!-- Code Editor -->
            <CodeEditor v-model="form.event_data.code" class="mb-6"></CodeEditor>

            <!-- Variable Name -->
            <VariableInput v-model="form.event_data.reference_name" label="Variable Name" :error="form.errors.name" @onSetError="form.setError('reference_name', $event)" @onClearError="form.clearErrors('reference_name')" class="mb-6">

                <template #info>
                    <span class="text-xs">
                        Return data on the <span class="font-semibold text-blue-500">AppWrite Code</span> Editor information to be captured on this variable name.
                        <span class="block border-t border-b border-dotted py-2 my-2">In the case that this request fails, the exception error is also captured on this variable name.</span>
                        <span>You can then use methods such as:</span>

                        <span class="block border-t border-b border-dotted py-2 my-2">
                            <span class="font-semibold text-green-500">${{ form.event_data.reference_name }}->getMessage()</span> to capture the exception message
                            e.g <span class="font-semibold">Account already exists</span>
                        </span>

                        <span class="block border-b border-dotted pb-2 mb-2">
                            <span class="font-semibold text-green-500">${{ form.event_data.reference_name }}->getType()</span> to capture the exception type
                            e.g <span class="font-semibold">account_already_exists</span>
                        </span>

                        <span>
                            <span class="font-semibold text-green-500">${{ form.event_data.reference_name }}->getCode()</span> to capture the exception status code
                            e.g <span class="font-semibold">400</span>
                        </span>
                    </span>
                </template>

            </VariableInput>

            <!-- Events Editor -->
            <EventsEditor :events="form.event_data.events.on_request_success" title="On Success Events" info="Run events on a successful request - This will fire events if the request status is a value less than 400 e.g 200, 201 or 204" class="mb-6"></EventsEditor>

            <!-- Events Editor -->
            <EventsEditor :events="form.event_data.events.on_request_fail" title="On Fail Events" info="Run events on a failed request - This will fire events if the request status is a value equal to or greater than 400 e.g 400, 401 or 500"></EventsEditor>

        </template>

        <!-- If the events property is provided (Refer to the EventMenu.vue component) -->
        <template v-else>

            <!-- Events Editor -->
            <EventsEditor :events="event.event_data.events.on_request_success" title="On Success Events" info="Run events on a successful request - This will fire events if the request status is a value less than 400 e.g 200, 201 or 204" class="mb-6"></EventsEditor>

            <!-- Events Editor -->
            <EventsEditor :events="event.event_data.events.on_request_fail" title="On Fail Events" info="Run events on a failed request - This will fire events if the request status is a value equal to or greater than 400 e.g 400, 401 or 500"></EventsEditor>

        </template>
    </div>

</template>

<script>

    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import WarningAlert from '@components/Alert/WarningAlert';
    import CodeEditor from '@components/CodeEditor/CodeEditor';
    import { useVersionBuilder } from "@stores/VersionBuilder";
    import VariableInput from '@components/Input/VariableInput';

    export default {
        props: ['form', 'event'],
        components: { PrimaryAlert, WarningAlert, CodeEditor, VariableInput },
        data(){
            return {
                useVersionBuilder: useVersionBuilder(),
            }
        },
        computed: {
            incompleteConfiguration() {
                return this.useVersionBuilder.builder.appwrite_connection.endpoint.code_editor_mode == false && [].includes(this.useVersionBuilder.builder.appwrite_connection.endpoint.text) ||
                       this.useVersionBuilder.builder.appwrite_connection.project_id.code_editor_mode == false && [null, ''].includes(this.useVersionBuilder.builder.appwrite_connection.project_id.text) ||
                       this.useVersionBuilder.builder.appwrite_connection.api_key.code_editor_mode == false && [null, ''].includes(this.useVersionBuilder.builder.appwrite_connection.api_key.text)
            }
        }
    }
</script>
