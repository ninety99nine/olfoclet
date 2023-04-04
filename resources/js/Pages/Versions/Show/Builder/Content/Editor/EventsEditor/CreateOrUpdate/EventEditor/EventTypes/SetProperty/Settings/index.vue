<template>

    <div>

        <!-- Response Reference Name -->
        <VariableInput v-model="form.event_data.reference_name" label="Name" :error="form.errors.reference_name" placeholder="quantity" @onSetError="form.setError('reference_name', $event)" @onClearError="form.clearErrors('reference_name')" class="mb-6"></VariableInput>

        <!-- Recipient -->
        <TextOrCodeEditor v-model="form.event_data.property" label="Value" placeholder="1" note="Value to be saved" :error="form.errors.property">
            <template #info>
                <span>
                    This is the property value to be saved
                </span>
            </template>
        </TextOrCodeEditor>

    </div>

</template>

<script>

    import VariableInput from "@components/Input/VariableInput";
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['form'],
        components: { VariableInput, TextOrCodeEditor },
        data(){
            return {}
        }
    }
</script>
