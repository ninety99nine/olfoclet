<template>

    <div>

        <!-- Explainer -->
        <PrimaryAlert class="mb-6">Select conditions to enable saving session logs</PrimaryAlert>

        <table class="w-full text-sm text-left text-gray-500">

            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <!-- Table Header Columns Names -->
                    <th v-for="(header, index) in headers" :key="index" scope="col" class="px-6 py-3">
                        <span>{{ header }}</span>
                    </th>
                </tr>
            </thead>

            <!-- Table Body -->
            <tbody>

                <tr class="border-b hover:bg-gray-50">

                    <td v-for="(saveLogType, index) in saveLogTypes" :key="index" scope="row" class="px-6 py-3">

                        <!-- Select Save Approach -->
                        <DefaultSelect v-model="useVersionBuilder.builder.log_settings[saveLogType].save_logs" :options="saveLogOptions" class="w-40"></DefaultSelect>

                        <!-- Description -->
                        <div class="flex text-xs text-gray-500 mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                {{ saveLogOptions.find((option) => option.value == useVersionBuilder.builder.log_settings[saveLogType].save_logs).description }}
                            </span>
                        </div>

                    </td>

                </tr>

            </tbody>

        </table>

        <div v-if="useVersionBuilder.builder.log_settings.simulator.save_logs != 'never' || useVersionBuilder.builder.log_settings.mobile.save_logs != 'never'" class="flex items-center space-x-4 mt-6">

            <span class="text-xs font-medium text-gray-900">Save logs for</span>

            <DefaultInput v-model="useVersionBuilder.builder.log_settings.duration.number" type="number"></DefaultInput>

            <DefaultSelect v-model="useVersionBuilder.builder.log_settings.duration.type" :options="durationOptions" class="w-40"></DefaultSelect>

            <InfoPopover info="The time to wait until the logs are deleted"></InfoPopover>

        </div>


    </div>

</template>

<script>

    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import DefaultInput from '@components/Input/DefaultInput';
    import InfoPopover from '@components/Popover/InfoPopover';
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultSelect from '@components/Select/DefaultSelect';

    export default {
        components: { PrimaryAlert, DefaultInput, InfoPopover, DefaultSelect },
        data(){
            return {
                useVersionBuilder: useVersionBuilder(),
                headers: ['Simulator Logs', 'Mobile Logs'],
                saveLogTypes: ['simulator', 'mobile'],
                saveLogOptions: [
                    {
                        label: 'Never',
                        value: 'never',
                        description: 'Never save logs of any session'
                    },
                    {
                        label: 'Always',
                        value: 'always',
                        description: 'Always save logs of every session'
                    },
                    {
                        label: 'On Fail',
                        value: 'on_fail',
                        description: 'Only save logs of failed sessions'
                    },
                    {
                        label: 'On Success',
                        value: 'on_success',
                        description: 'Only save logs of sucessful sessions'
                    }
                ]
            }
        },
        computed: {
            durationOptions() {
                return [
                    {
                        label: this.useVersionBuilder.builder.log_settings.duration.number == 1 ? 'Minute' : 'Minutes',
                        value: 'minutes',
                    },
                    {
                        label: this.useVersionBuilder.builder.log_settings.duration.number == 1 ? 'Hour' : 'Hours',
                        value: 'hours',
                    },
                    {
                        label: this.useVersionBuilder.builder.log_settings.duration.number == 1 ? 'Day' : 'Days',
                        value: 'days',
                    },
                    {
                        label: this.useVersionBuilder.builder.log_settings.duration.number == 1 ? 'Week' : 'Weeks',
                        value: 'weeks',
                    },
                    {
                        label: this.useVersionBuilder.builder.log_settings.duration.number == 1 ? 'Month' : 'Months',
                        value: 'months',
                    },
                    {
                        label: this.useVersionBuilder.builder.log_settings.duration.number == 1 ? 'Year' : 'Years',
                        value: 'years',
                    }
                ];
            }
        }
    };

</script>
