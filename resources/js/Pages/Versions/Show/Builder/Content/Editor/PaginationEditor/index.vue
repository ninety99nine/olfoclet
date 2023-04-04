<template>

    <div>

        <!-- Switch -->
        <template v-if="global == false">

            <DefaultSwitch v-model="pagination.use_global_pagination" label="Global Pagination" :note="( pagination.use_global_pagination ? 'Disable ' : 'Enable') + ' the use of global pagination'" class="mb-6"></DefaultSwitch>

        </template>

        <template v-if="global == true || (global == false && pagination.use_global_pagination == false)">

            <!-- Active State -->
            <SelectActiveState v-model="pagination.active" class="mb-6"></SelectActiveState>

            <div class="grid grid-cols-2 gap-8 mb-6">

                <div class="col-span-1">

                    <!-- Target -->
                    <DefaultSelect v-model="pagination.content_target.selected_type" :options="targetOptions" label="Target" note="📃 Content to paginate"></DefaultSelect>

                </div>

                <div class="col-span-1">

                    <!-- Separation -->
                    <DefaultSelect v-model="pagination.slice.separation_type" :options="separationOptions" label="Separation" note="✂️ Content separation technique"></DefaultSelect>

                </div>

            </div>

            <!-- Enable / Disable Pagination By Line Breaks -->
            <DefaultSwitch v-model="pagination.paginate_by_line_breaks" :note="( pagination.paginate_by_line_breaks ? 'Disable' : 'Enable') + ' separation by line breaks before pagination'" class="mb-6">

                <template #info>
                    <span>
                        If enabled, this feature separates the content by its line breaks before limiting the content.
                        This is useful if the display consists of menus that must not be cut off, especially menus
                        consisting of multiple words. This means each menu will not be split into separate
                        portions and placed in separate pagination groups.
                    </span>
                </template>

            </DefaultSwitch>

            <div class="grid grid-cols-2 gap-8 mb-6">

                <div class="col-span-1">

                    <TextOrCodeEditor v-model="pagination.scroll_down.name" label="Scroll ⬇️ Name" placeholder="99. Next" note="Proceed forward name"></TextOrCodeEditor>

                </div>

                <div class="col-span-1">

                    <TextOrCodeEditor v-model="pagination.scroll_down.input" label="Scroll ⬇️ Input" placeholder="99" note="Proceed forward input"></TextOrCodeEditor>

                </div>

            </div>

            <div class="grid grid-cols-2 gap-8 mb-6">

                <div class="col-span-1">

                    <TextOrCodeEditor v-model="pagination.scroll_up.name" label="Scroll ⬆️ Name" placeholder="0. Back" note="Proceed backward name"></TextOrCodeEditor>

                </div>

                <div class="col-span-1">

                    <TextOrCodeEditor v-model="pagination.scroll_up.input" label="Scroll ⬆️ Input" placeholder="0" note="Proceed backward input"></TextOrCodeEditor>

                </div>

            </div>

            <div class="grid grid-cols-2 gap-8 mb-6">

                <div class="col-span-1">

                    <TextOrCodeEditor v-model="pagination.slice.start" label="Start Slice Position" placeholder="0" note="📍 Start pagination offset"></TextOrCodeEditor>

                </div>

                <div class="col-span-1">

                    <TextOrCodeEditor v-model="pagination.slice.end" label="End Slice Position" placeholder="0" note="📍 End pagination offset"></TextOrCodeEditor>

                </div>

            </div>

            <TextOrCodeEditor v-model="pagination.trailing_end" label="Trailing Characters" placeholder="..." note="Content continuation hint" class="w-1/2 mb-6"></TextOrCodeEditor>

            <DefaultSwitch v-model="pagination.break_line_before_trail" :note="( pagination.break_line_before_trail ? 'Disable ' : 'Enable') + ' line break before trailing characters'" class="mb-4"></DefaultSwitch>
            <DefaultSwitch v-model="pagination.break_line_after_trail" :note="( pagination.break_line_after_trail ? 'Disable ' : 'Enable') + ' line break after trailing characters'"></DefaultSwitch>

        </template>

    </div>

</template>

<script>

    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultSwitch from '@components/Switch/DefaultSwitch';
    import DefaultSelect from '@components/Select/DefaultSelect';
    import SelectActiveState from "@builderComponents/SelectActiveState";
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['global', 'pagination'],
        components: { DefaultSwitch, DefaultSelect, SelectActiveState, TextOrCodeEditor },
        data(){
            return {
                useVersionBuilder: useVersionBuilder(),
                targetOptions: [
                    {
                        label: 'Instruction Content',
                        value: 'instruction'
                    },
                    {
                        label: 'Action Content',
                        value: 'action'
                    },
                    {
                        label: 'Both',
                        value: 'both'
                    }
                ],
                separationOptions: [
                    {
                        label: 'Words',
                        value: 'words'
                    },
                    {
                        label: 'Characters',
                        value: 'characters'
                    }
                ]
            }
        }
    };

</script>
