<template>

    <div>

        <!-- MSISDN -->
        <TextOrCodeEditor v-model="form.event_data.msisdn" label="MSISDN" placeholder="{{ ussd.msisdn }}" note="Mobile number to be charged" :error="form.errors.msisdn" class="mb-6">
            <template #info>
                <span>
                    This is the mobile number to be charged on this transaction e.g 26772123456
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Amount -->
        <TextOrCodeEditor v-model="form.event_data.amount" label="Amount" placeholder="{{ transaction.amount }}" note="Transaction amount to be charged" :error="form.errors.amount" class="mb-6">
            <template #info>
                <span>
                    This is the transaction amount to be charged on this transaction e.g 10.00
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Payment Reference Number -->
        <TextOrCodeEditor v-model="form.event_data.payment_reference" label="Payment Reference" placeholder="{{ transaction.payment_reference }}" note="Transaction payment reference number" :error="form.errors.payment_reference" class="mb-6">
            <template #info>
                <span>
                    This is the identification number to reference this transaction  e.g tr-123456789
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Merchant Code -->
        <TextOrCodeEditor v-model="form.event_data.merchant_code" label="Merchant Code" placeholder="1234" note="Merchant account to receive funds" :error="form.errors.merchant_code" class="mb-6">
            <template #info>
                <span>
                    This is the Orange Money merchant account to receive the funds being charged e.g 1234
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Endpoint url -->
        <TextOrCodeEditor v-model="form.event_data.endpoint" label="Endpoint Url" placeholder="http://www.example.com/api" note="Endpoint to confirm payment success status" :error="form.errors.endpoint">
            <template #info>
                <span>
                    After the processing of this transaction, the endpoint provided
                    will be called to confirm the payment success status. This is
                    to confirm whether or not the transaction succeeded.
                </span>
            </template>
        </TextOrCodeEditor>

    </div>

</template>

<script>

    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['form'],
        components: { TextOrCodeEditor },
        data(){
            return {}
        }
    }
</script>
