<template>

    <div>

        <!-- Product ID -->
        <TextOrCodeEditor v-model="form.event_data.product_id" label="Product ID" placeholder="daily_subscription" note="Payment product identifier" class="mb-6">
            <template #info>
                <span>Provide the product id to identify this payment product category e.g daily_subscription</span>
            </template>
        </TextOrCodeEditor>

        <!-- Service ID -->
        <TextOrCodeEditor v-model="form.event_data.service_id" label="Service ID" placeholder="football_results" note="Payment service identifier" class="mb-6">
            <template #info>
                <span>Provide the service id to identify this payment service category e.g football_results</span>
            </template>
        </TextOrCodeEditor>

        <!-- On Behalf Of -->
        <TextOrCodeEditor v-model="form.event_data.on_behalf_of" label="On Behalf Of" placeholder="{{ ussd.msisdn }}" note="Mobile number" class="mb-6">
            <template #info>
                <span>Provide the mobile number that this payment is being processed for</span>
            </template>
        </TextOrCodeEditor>

        <!-- Purchase Category Code -->
        <TextOrCodeEditor v-model="form.event_data.purchase_category_code" label="Purchase Category Code" placeholder="daily_autorenew_pack" class="mb-6">
            <template #info>
                <span>The purchase category code e.g daily_autorenew_pack</span>
            </template>
        </TextOrCodeEditor>

        <!-- Successful Payment Message -->
        <TextOrCodeEditor v-model="form.event_data.successful_payment_message" label="Successful Payment Message" placeholder="Payment successful" class="mb-6">
            <template #info>
                <span>The message to show when the subscriber transaction is processed successfully</span>
            </template>
        </TextOrCodeEditor>

        <!-- Insufficient Funds Message -->
        <TextOrCodeEditor v-model="form.event_data.insufficient_funds_message" label="Insufficient Funds Message" placeholder="You do not have enough funds to complete this payment">
            <template #info>
                <span>The message to show when the subscriber does not have enough funds to complete the transaction</span>
            </template>
        </TextOrCodeEditor>

    </div>

</template>

<script>

    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['form'],
        components: { TextOrCodeEditor }
    }
</script>
