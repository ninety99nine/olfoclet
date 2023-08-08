<template>

    <div>

        <!-- Foreach Items Group Reference -->
        <TextOrCodeEditor v-model="display.content.action.select_option.dynamic_options.group_reference" label="Foreach" placeholder="{{ options }}" note="List of options" :showCode="false" class="mb-6"></TextOrCodeEditor>

        <!-- Single Item Reference Variable -->
        <VariableInput v-model="display.content.action.select_option.dynamic_options.template_reference_name" label="Reference Option As" placeholder="option" note="Single option reference name" class="mb-6"></VariableInput>

        <!-- Explainer -->
        <PrimaryAlert class="mb-6">

            <span>
                Each option can be referenced as
                <span class="font-semibold text-green-500">
                    <span v-pre>{{ </span>
                        {{ display.content.action.select_option.dynamic_options.template_reference_name }}
                    <span v-pre> }}</span>
                </span>
                to access the option properties. The option properties can be used to generate the option name which is displayed to the subscriber e.g
                <span class="font-semibold text-green-500">
                    <span v-pre>{{ </span>
                        {{ display.content.action.select_option.dynamic_options.template_reference_name }}.name
                    <span v-pre> }}</span>
                </span>
                might generate various option names such as
                <span class="font-semibold text-green-500">Home</span>,
                <span class="font-semibold text-green-500">About Us</span>,
                <span class="font-semibold text-green-500">Services</span> and so on. The option value
                is passed on as a value of the
                <span class="font-semibold text-green-500">
                    <span v-pre>{{ </span>
                        {{ display.content.action.select_option.dynamic_options.reference_name }}
                    <span v-pre> }}</span>
                </span>
                reference variable after the option is selected. The link is the <span class="font-semibold text-green-500">screen</span> or <span class="font-semibold text-green-500">display</span> that we must link to after the user has selected an option.
            </span>

        </PrimaryAlert>

        <!-- Option Name -->
        <TextOrCodeEditor v-model="display.content.action.select_option.dynamic_options.template_display_name" label="Option Name" placeholder="{{ option.name }} - {{ option.price }}" :showCode="false" class="mb-6"></TextOrCodeEditor>

        <!-- Option Value -->
        <TextOrCodeEditor v-model="display.content.action.select_option.dynamic_options.template_value" label="Option Value" placeholder="{{ option }}" :showCode="false" class="mb-6"></TextOrCodeEditor>

        <!-- Reference Variable -->
        <VariableInput v-model="display.content.action.select_option.dynamic_options.reference_name" label="Reference Variable" note="Selected option reference variable" class="mb-6"></VariableInput>

        <!-- Screen / Display Selector -->
        <ScreenOrDisplaySelector v-model="display.content.action.select_option.dynamic_options.link" class="mb-6"></ScreenOrDisplaySelector>

        <!-- No Options Message -->
        <TextOrCodeEditor v-model="display.content.action.select_option.dynamic_options.no_results_message" label="No Options Message" placeholder="No options found" :showCode="false" class="mb-6"></TextOrCodeEditor>

        <!-- Incorrect Option Message -->
        <TextOrCodeEditor v-model="display.content.action.select_option.dynamic_options.incorrect_option_selected_message" label="Incorrect Option Message" placeholder="Incorrect option selected" :showCode="false"></TextOrCodeEditor>

    </div>

</template>

<script>

    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import VariableInput from '@components/Input/VariableInput';
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';
    import ScreenOrDisplaySelector from '@builderComponents/ScreenOrDisplaySelector';

    export default {
        props: ['display'],
        components: { PrimaryAlert, VariableInput, TextOrCodeEditor, ScreenOrDisplaySelector }
    };

</script>
