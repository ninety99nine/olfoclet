<template>

    <div>

        <!-- Active State -->
        <SelectActiveState v-model="screen.repeat.active" class="mb-6"></SelectActiveState>

        <!-- Repeat Type -->
        <DefaultSelect v-model="screen.repeat.selected_type" :options="repeatTypes" label="Repeat Type" class="mb-6"></DefaultSelect>

        <template v-if="screen.repeat.selected_type == 'repeat_on_items'">

            <!-- Foreach Items Group Reference -->
            <TextOrCodeEditor v-model="screen.repeat[repeatType].group_reference" label="Foreach" placeholder="{{ items }}" note="List of items" :showCode="false" class="mb-6"></TextOrCodeEditor>

            <!-- Single Item Reference Variable -->
            <VariableInput v-model="screen.repeat[repeatType].item_reference_name" label="Reference Item As" placeholder="option" note="Single item reference name" class="mb-6"></VariableInput>

        </template>

        <template v-else>

            <TextOrCodeEditor v-model="screen.repeat[repeatType].value" label="Number" placeholder="3" note="Number of times to repeat" class="mb-6"></TextOrCodeEditor>

        </template>

        <!-- Total Items -->
        <VariableInput v-model="screen.repeat[repeatType].total_loops_reference_name" label="Total Items" class="mb-6"></VariableInput>

        <div class="grid grid-cols-2 gap-8">
            <div class="col-span-1">
                <!-- Item Index -->
                <VariableInput v-model="screen.repeat[repeatType].loop_index_reference_name" label="Item Index" class="mb-6"></VariableInput>
            </div>
            <div class="col-span-1">
                <!-- Item Number -->
                <VariableInput v-model="screen.repeat[repeatType].loop_number_reference_name" label="Item Number" class="mb-6"></VariableInput>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-8">
            <div class="col-span-1">
                <!-- Is First Item -->
                <VariableInput v-model="screen.repeat[repeatType].is_first_loop_reference_name" label="Is First Item" note="True / False" class="mb-6"></VariableInput>
            </div>
            <div class="col-span-1">
                <!-- Is Last Item -->
                <VariableInput v-model="screen.repeat[repeatType].is_last_loop_reference_name" label="Is Last Item" note="True / False" class="mb-6"></VariableInput>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-8 items-end mb-6">
            <div class="col-span-1">
                <!-- No Loops Behaviour -->
                <DefaultSelect v-model="screen.repeat[repeatType].on_no_loop.selected_type" :options="behaviourTypes" label="No Loops Behaviour"></DefaultSelect>
            </div>
            <template v-if="screen.repeat[repeatType].on_no_loop.selected_type === 'link'">
                <div class="col-span-1">
                    <!-- Screen / Display Selector -->
                    <ScreenOrDisplaySelector v-model="screen.repeat[repeatType].on_no_loop.link"></ScreenOrDisplaySelector>
                </div>
            </template>
        </div>

        <div class="grid grid-cols-2 gap-8 items-end mb-6">
            <div class="col-span-1">
                <!-- After Last Loop Behaviour -->
                <DefaultSelect v-model="screen.repeat[repeatType].after_last_loop.selected_type" :options="behaviourTypes" label="After Last Loop Behaviour"></DefaultSelect>
            </div>
            <template v-if="screen.repeat[repeatType].after_last_loop.selected_type === 'link'">
                <div class="col-span-1">
                    <!-- Screen / Display Selector -->
                    <ScreenOrDisplaySelector v-model="screen.repeat[repeatType].after_last_loop.link"></ScreenOrDisplaySelector>
                </div>
            </template>
        </div>

    </div>

</template>

<script>

    import { useVersionBuilder } from '@stores/VersionBuilder';
    import VariableInput from '@components/Input/VariableInput';
    import DefaultSelect from '@components/Select/DefaultSelect';
    import SelectActiveState from "@builderComponents/SelectActiveState";
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';
    import ScreenOrDisplaySelector from '@builderComponents/ScreenOrDisplaySelector';

    export default {
        components: { DefaultSelect, VariableInput, SelectActiveState, TextOrCodeEditor, ScreenOrDisplaySelector },
        data(){
            return {
                useVersionBuilder: useVersionBuilder(),
                repeatTypes: [
                    {
                        label: 'Repeat on number',
                        value: 'repeat_on_number'
                    },
                    {
                        label: 'Repeat on items',
                        value: 'repeat_on_items'
                    }
                ],
                behaviourTypes: [
                    {
                        label: 'Do Nothing',
                        value: 'do_nothing'
                    },
                    {
                        label: 'Link To Screen',
                        value: 'link'
                    }
                ]
            }
        },
        computed: {
            screen() {
                return this.useVersionBuilder.selectedScreen
            },
            repeatType() {
                return this.screen.repeat.selected_type;
            }
        }
    };

</script>
