<template>

    <div>

        <!-- Action -->
        <DefaultSelect v-model="form.event_data.airtime_billing_action" label="After Response" :options="airtimeBillingActions" class="mb-6"></DefaultSelect>

        <!-- MSISDN -->
        <TextOrCodeEditor v-model="form.event_data.msisdn" label="MSISDN" note="Mobile number" :error="form.errors.msisdn" class="mb-6"></TextOrCodeEditor>

        <!-- Response Reference Name -->
        <VariableInput v-model="form.event_data.response_reference_name" label="Response Name" :error="form.errors.response_reference_name" placeholder="airtime_billing_response" @onSetError="form.setError('response_reference_name', $event)" @onClearError="form.clearErrors('response_reference_name')" class="mb-6"></VariableInput>

            <!-- Action Explainer -->
        <PrimaryAlert class="items-center mb-6">

            <!-- Deduct Fee Explainer -->
            <span v-if="form.event_data.airtime_billing_action == 'deduct_fee'" class="text-justify">
                You are charging the subscriber on their airtime balance. Provide additional information below
            </span>

            <!-- Usage Consumption Data Explainer -->
            <span v-else-if="form.event_data.airtime_billing_action == 'get_usage_consumption_data'" class="text-justify">
                You are querying the subscriber's <span class="font-semibold text-blue-500">usage consumption data</span>.
                This query provides information on the mobile number <span class="font-semibold text-green-500">airtime balance</span>,
                <span class="font-semibold text-green-500">data balance</span> and
                <span class="font-semibold text-green-500">sms quantities remaining</span>
            </span>

            <!-- Product Inventory Data Explainer -->
            <span v-else-if="form.event_data.airtime_billing_action == 'get_product_inventory_data'" class="text-justify">
                You are querying the subscriber's <span class="font-semibold text-blue-500">product inventory data</span>.
                This query provides information on the mobile number status such as <span class="font-semibold text-green-500">active</span>
                / <span class="font-semibold text-red-500">inactive</span> or mobile number rating type such as
                <span class="font-semibold text-green-500">prepaid</span>
                / <span class="font-semibold text-green-500">postpaid</span>
            </span>

        </PrimaryAlert>

        <!-- If deducting fees -->
        <template v-if="form.event_data.airtime_billing_action == 'deduct_fee'">

            <!-- Amount -->
            <TextOrCodeEditor v-model="form.event_data.amount" label="Amount" placeholder="10.00" :error="form.errors.amount" class="mb-6">
                <template #info>
                    <span>Provide a single amount e.g "0.50", or separate multiple amounts with the "|" symbol e.g "0.30|0.20|0.10". We will attempt to bill from the first to the last amount provided. The first amount that qualifies will be used to bill the subscriber.</span>
                </template>
            </TextOrCodeEditor>

            <!-- Currency -->
            <TextOrCodeEditor v-model="form.event_data.currency" label="Currency" placeholder="BWP" :error="form.errors.currency" class="mb-6">
                <template #info>
                    <span>Provide a single currency to bill the subscriber e.g BWP</span>
                </template>
            </TextOrCodeEditor>

            <!-- Description -->
            <TextOrCodeEditor v-model="form.event_data.description" label="Description" placeholder="Subscription payment for football results" :error="form.errors.description" class="mb-6">
                <template #info>
                    <span>Provide a description for this payment</span>
                </template>
            </TextOrCodeEditor>

        </template>

    </div>

</template>

<script>

    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import VariableInput from "@components/Input/VariableInput";
    import DefaultSelect from '@components/Select/DefaultSelect';
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['form'],
        components: { PrimaryAlert, VariableInput, DefaultSelect, TextOrCodeEditor },
        data(){
            return {
                airtimeBillingActions: [
                    {
                        label: 'Deduct Fee',
                        value: 'deduct_fee'
                    },
                    {
                        label: 'Get Product Inventory Data',
                        value: 'get_product_inventory_data'
                    },
                    {
                        label: 'Get Usage Consumption Data',
                        value: 'get_usage_consumption_data'
                    }
                ],
            }
        }
    }
</script>
