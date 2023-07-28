<template>

    <div>

        <!-- MSISDN -->
        <TextOrCodeEditor v-model="form.event_data.msisdn" label="MSISDN" placeholder="{{ ussd.msisdn }}" note="Mobile number" :error="form.errors.msisdn" class="mb-6">
            <template #info>
                <span>
                    This is the mobile number to receive the notification e.g 26772123456
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Message -->
        <TextOrCodeEditor v-model="form.event_data.message" label="Message" placeholder="Hi {{ first_name }}, your account was created!" :error="form.errors.message" te_height="md" class="mb-6">
            <template #info>
                <span>
                    This is the notification message
                </span>
            </template>
        </TextOrCodeEditor>

        <!-- Expiry Switch -->
        <DefaultSwitch v-model="form.event_data.can_expire" note="Determine whether this notification can expire or not" class="mb-6"></DefaultSwitch>

        <!-- Expiry Settings -->
        <div v-if="form.event_data.can_expire" class="grid grid-cols-12 gap-8 mb-6 items-end">

            <div class="col-span-9">

                <!-- Expiry Duration Number -->
                <TextOrCodeEditor v-model="form.event_data.expiry_duration_number" label="Expiry Number" placeholder="30" :error="form.errors.expiry_duration_number">
                    <template #info>
                        <span>
                            This is the number until expiry e.g 1, 2, 3, e.t.c
                        </span>
                    </template>
                </TextOrCodeEditor>

            </div>

            <div class="col-span-3">

                <!-- Expiry Duration Type -->
                <DefaultSelect v-model="form.event_data.expiry_duration_type" :options="expiryDurationTypeOptions" label="Expiry Type" placeholder="Seconds"></DefaultSelect>

            </div>

        </div>

        <!-- Display Session Type -->
        <DefaultSelect v-model="form.event_data.display_session_type" :options="displaySessionTypeOptions" label="Display Session Type" placeholder="Any Session" class="mb-6"></DefaultSelect>

        <!-- Continue Text -->
        <TextOrCodeEditor v-model="form.event_data.continue_text" label="Continue Text" placeholder="1. Continue" :error="form.errors.continue_text">
            <template #info>
                <span>
                    This is the type until expiry e.g seconds, minutes, hours, e.t.c
                </span>
            </template>
        </TextOrCodeEditor>

    </div>

</template>

<script>

    import DefaultSwitch from "@components/Switch/DefaultSwitch";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['form'],
        components: { DefaultSwitch, DefaultSelect, TextOrCodeEditor },
        data(){
            return {
                expiryDurationTypeOptions: [
                    {
                        label: 'None',
                        value: '',
                    },
                    {
                        label: 'Seconds',
                        value: 'Seconds',
                    },
                    {
                        label: 'Minutes',
                        value: 'Minutes',
                    },
                    {
                        label: 'Days',
                        value: 'Days',
                    },
                    {
                        label: 'Months',
                        value: 'Months',
                    },
                ],
                displaySessionTypeOptions: [
                    {
                        label: 'Any Session',
                        value: 'Any Session',
                    },
                    {
                        label: 'Same Session',
                        value: 'Same Session',
                    },
                    {
                        label: 'Next Session',
                        value: 'Next Session',
                    },
                ]
            }
        }
    }
</script>
