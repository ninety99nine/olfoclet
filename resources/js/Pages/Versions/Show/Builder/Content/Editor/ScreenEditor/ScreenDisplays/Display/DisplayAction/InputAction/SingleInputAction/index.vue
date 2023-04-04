<template>

    <div>

        <!-- Single Input -->
        <VariableInput v-model="display.content.action.input_value.single_value_input.reference_name" label="Reference Variable" note="User input reference variable" class="mb-6"></VariableInput>

        <!-- Screen / Display Selector -->
        <ScreenOrDisplaySelector v-model="display.content.action.input_value.single_value_input.link"></ScreenOrDisplaySelector>

    </div>

</template>

<script>

    import VariableInput from '@components/Input/VariableInput';
    import ScreenOrDisplaySelector from '@builderComponents/ScreenOrDisplaySelector';

    export default {
        props: ['display'],
        components: { VariableInput, ScreenOrDisplaySelector }
    };

</script>
