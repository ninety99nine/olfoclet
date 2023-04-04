<template>

    <div>
        <DefaultInput
            v-model="localModelValue"
            :appendClasses="[(allowGlobalVariables && hintGlobalVariables && isGlobal) ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500']"
            :label="label" :type="type" :note="note" :info="info" :size="size" :disabled="disabled" :placeholder="placeholder" :error="localError">

            <template #append>
                <Transition name="slide-up" mode="out-in" appear>
                    <span v-if="allowGlobalVariables && hintGlobalVariables && isGlobal">
                        <span class="whitespace-nowrap">@ Global</span>
                    </span>
                    <span v-else>@</span>
                </Transition>
            </template>

            <template v-if="$slots.info" #info>
                <slot name="info"></slot>
            </template>

        </DefaultInput>

        <Transition name="fade" mode="out-in" appear>
            <div v-if="matchingGlobalVariableNames.length && isGlobal == false && allowGlobalVariables && hintGlobalVariables" class="space-x-2 mt-2 overflow-hidden">
                <OrangeBadge v-for="(name, index) in matchingGlobalVariableNames" :key="index" class="cursor-pointer hover:animate-pulse" @click="localModelValue = name">{{ name }}</OrangeBadge>
            </div>
        </Transition>

    </div>

</template>

<script>

    import DefaultInput from './DefaultInput';
    import OrangeBadge from '../Badges/OrangeBadge.vue';
    import { useVersionBuilder } from '@stores/VersionBuilder';

    export default {
        components: { DefaultInput, OrangeBadge },
        props: {
            modelValue: String,
            label: String,
            info: String,
            note: String,
            type: {
                type: String,
                default: 'text'
            },
            size: {
                type: String,
                default: 'xs'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            placeholder: String,
            error: {
                type: String,
                default: ''
            },
            hintGlobalVariables: {
                type: Boolean,
                default: true
            },
            allowGlobalVariables: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                localError: this.error,
                localModelValue: this.modelValue,
                useVersionBuilder: useVersionBuilder()
            }
        },
        watch: {
            error(newValue, oldValue) {
                this.localError = newValue;
            },
            modelValue(newValue, oldValue) {

                this.localModelValue = newValue;

                const rejectGlobalVariables = this.allowGlobalVariables == false && this.isGlobal == true;

                if( rejectGlobalVariables === true ) {

                    this.localError = 'Avoid referencing global variables';
                    this.$emit('onSetError', this.localError);

                }else {

                    this.localError = this.checkIfValidVariableSyntax(newValue);

                    if( this.localError ) {

                        this.$emit('onSetError', this.localError);

                    }else{

                        this.$emit('onClearError');

                    }

                }
            },
            localModelValue(newValue, oldValue) {
                this.$emit('update:modelValue', newValue);
            }
        },
        computed: {
            matchingGlobalVariableNames() {
                if( this.localModelValue ) return this.useVersionBuilder.searchGlobalVariables(this.localModelValue, false).map((globalVariable) => globalVariable.name);
                return [];
            },
            isGlobal() {
                if( this.localModelValue ) return this.useVersionBuilder.searchGlobalVariables(this.localModelValue, true).length ? true : false
                return false
            }
        },
        methods: {
            checkIfValidVariableSyntax(value) {

                //  This pattern will detect white spaces
                var has_white_spaces = /\s/;

                //  This pattern will detect if the value starts with a character that is not a letter or underscore
                var valid_first_character = /^[^a-zA-Z_]/;

                /** This pattern matches any non-word character. Same as [^a-zA-Z_0-9].
                 *  Note that a word is definned as a to z, A to Z, 0 to 9, and the
                 *  underscore "_"
                 */
                var valid_remaining_characters = /\W/g;

                //  Check for unauthourized spaces
                if ( has_white_spaces.test(value) == true ) {

                    return 'This value must not have spaces. Use underscores "_" instead e.g "first_name", "_username", "age_less_than_30"';

                //  Check if first character is invalid
                }else if ( valid_first_character.test(value) == true ) {

                    return 'This value must start with a letter or underscore "_" e.g "first_name", "_username", "age_less_than_30"';

                    //  Check if remaining characters are invalid
                }else if ( valid_remaining_characters.test(value) == true ) {

                    return 'This value must only contain letters, numbers and underscores "_" e.g "first_name", "_username", "age_less_than_30"';

                }else{

                    return null;

                }

            }
        },
    }
</script>
