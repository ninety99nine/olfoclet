<template>

    <div>

        <TextOrCodeEditor v-model="form.event_data.response.general.default_success_message" label="Success Message" note="Default success message" :error="form.errors.default_success_message" class="mb-6"></TextOrCodeEditor>

        <TextOrCodeEditor v-model="form.event_data.response.general.default_error_message" label="Error Message" note="Default error message" :error="form.errors.default_error_message" class="mb-6"></TextOrCodeEditor>

        <DefaultSelect v-model="form.event_data.response.selected_type" label="Response" :options="apiResponseOptions" class="mb-6"></DefaultSelect>

        <!-- Manual response -->
        <template v-if="form.event_data.response.selected_type == 'manual'">

            <!-- Explainer -->
            <PrimaryAlert class="mb-6">
                <span class="text-justify">
                    Add one or more <span class="font-semibold text-green-500">status codes</span> to take advantage of handling specific responses.
                    Each status code represents an opportunity to handle the request in a specific manner e.g
                    <span class="font-semibold text-green-500">capturing data</span> or
                    <span class="font-semibold text-red-500">reporting errors</span>
                </span>
            </PrimaryAlert>

            <!-- Create Status Code Modal Button -->
            <CreateOrUpdateStatusCodeModal :statusCodes="form.event_data.response.manual.response_status_handles" mode="create" class="flex justify-end"></CreateOrUpdateStatusCodeModal>

            <!-- Status Code Tabs -->
            <el-tabs v-model="activeTab" type="card" :closable="false">
                <el-tab-pane v-for="(statusHandle, index) in form.event_data.response.manual.response_status_handles" :key="index" :name="index"
                    @tab-remove="removeTab(index)">

                    <template v-slot:label>
                        <span :class="[activeTab == index ? (statusHandle.status < 400 ? 'text-green-500 font-bold' : 'text-red-500 font-bold') : 'text-gray-800']">{{ statusHandle.status }}</span>
                    </template>

                    <!-- Status Code Tab Content -->
                    <div class="bg-gray-50 border rounded-md p-4">

                        <div class="flex justify-between items-center mb-6">

                            <!-- Response Reference Name -->
                            <VariableInput v-model="statusHandle.reference_name" label="Response Name" :error="form.errors.response_reference_name" @onSetError="form.setError('response_reference_name', $event)" @onClearError="form.clearErrors('response_reference_name')"></VariableInput>

                            <!-- Delete Status Code -->
                            <DeleteStatusCodeModal
                                :index="index"
                                @deleted="onDeleted"
                                :statusCode="statusHandle"
                                :statusCodes="form.event_data.response.manual.response_status_handles"
                                v-if="form.event_data.response.manual.response_status_handles.length >= 2">
                            </DeleteStatusCodeModal>

                        </div>

                        <!-- Attribute Name & Value Editor -->
                        <ResponseStatusAttributes :form="form" :statusHandle="statusHandle" class="mb-6"></ResponseStatusAttributes>

                        <!-- Select After Response Action -->
                        <DefaultSelect v-model="statusHandle.on_handle.selected_type" label="After Response" :options="manualOptions" class="mb-6"></DefaultSelect>

                        <!-- Display Custom Message -->
                        <template v-if="statusHandle.on_handle.selected_type == 'use_custom_msg'">

                            <!-- Custom Message Explainer -->
                            <PrimaryAlert class="mb-6">
                                <span>
                                    Compose a message to inform the subscriber on whether the API call passed or failed
                                </span>
                            </PrimaryAlert>

                            <!-- Custom Message -->
                            <TextOrCodeEditor v-model="statusHandle.on_handle.use_custom_msg" label="Message" note="Sweet and short" class="mb-6"></TextOrCodeEditor>

                        </template>

                    </div>

                </el-tab-pane>
            </el-tabs>

        </template>

        <!-- Automatic response -->
        <template v-else>

            <!-- Explainer -->
            <PrimaryAlert class="mb-6">
                <span>
                    The application will automatically decide whether to use the <span class="font-semibold text-green-500">default success</span> message or
                    <span class="font-semibold text-red-500">default error</span> message depending on whether or not the API call is successful.
                </span>
            </PrimaryAlert>

            <div class="grid grid-cols-2 gap-8">

                <!-- On Success Handle -->
                <div class="col-span-1">

                    <DefaultSelect v-model="form.event_data.response.automatic.on_handle_success" label="On Success" :options="automaticSuccessOptions"></DefaultSelect>

                </div>

                <!-- On Fail Handle -->
                <div class="col-span-1">

                    <DefaultSelect v-model="form.event_data.response.automatic.on_handle_error" label="On Error" :options="automaticErrorOptions"></DefaultSelect>

                </div>

            </div>

        </template>


    </div>

</template>

<script>

    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import VariableInput from "@components/Input/VariableInput";
    import DefaultSelect from '@components/Select/DefaultSelect';
    import ResponseStatusAttributes from './ResponseStatusAttributes'
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';
    import DeleteStatusCodeModal from './DeleteStatusCode/DeleteStatusCodeModal';
    import CreateOrUpdateStatusCodeModal from './CreateOrUpdateStatusCode/CreateOrUpdateStatusCodeModal'

    export default {
        props: ['form'],
        components: { PrimaryAlert, VariableInput, DefaultSelect, ResponseStatusAttributes, TextOrCodeEditor, DeleteStatusCodeModal, CreateOrUpdateStatusCodeModal },
        data(){
            return {
                activeTab: 0,
                apiResponseOptions: [
                    {
                        label: 'Automatic Responses',
                        value: 'automatic'
                    },
                    {
                        label: 'Manual Responses',
                        value: 'manual'
                    }
                ],
                automaticSuccessOptions: [
                    {
                        label: 'Display Default Success Message',
                        value: 'use_default_success_msg'
                    },
                    {
                        label: 'Do Nothing',
                        value: 'do_nothing'
                    }
                ],
                automaticErrorOptions: [
                    {
                        label: 'Display Default Error Message',
                        value: 'use_default_error_msg'
                    },
                    {
                        label: 'Do Nothing',
                        value: 'do_nothing'
                    }
                ],
                manualOptions: [
                    {
                        label: 'Display Message',
                        value: 'use_custom_msg'
                    },
                    {
                        label: 'Do Nothing',
                        value: 'do_nothing'
                    }
                ],
            }
        },
        methods: {
            removeTab(index) {
                this.form.event_data.response.manual.response_status_handles.splice(index, 1);
            },
            onDeleted() {
                this.activeTab = 0;
            }
        }
    }
</script>
