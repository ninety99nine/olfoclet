<template>

    <div>

        <div class="grid grid-cols-3 gap-4 items-end mb-6">

            <div class="col-span-1">

                <!-- Action -->
                <DefaultSelect v-model="form.event_data.action" :options="selectOptions" label="Action" placeholder="Select action" :error="form.errors.action"></DefaultSelect>

            </div>

            <div class="col-span-2">

                <!-- Explainer -->
                <PrimaryAlert :showIcon="false">
                    <span>

                        <template v-if="form.event_data.action == 'read'">
                            Find an existing database property called <span class="font-semibold text-green-500">{{ form.event_data.reference_name }}</span>
                        </template>

                        <template v-else-if="form.event_data.action == 'create'">
                            Create a new database property called <span class="font-semibold text-green-500">{{ form.event_data.reference_name }}</span>
                        </template>

                        <template v-else-if="form.event_data.action == 'update'">
                            Update an existing database property called <span class="font-semibold text-green-500">{{ form.event_data.reference_name }}</span>
                        </template>

                        <template v-else-if="form.event_data.action == 'delete'">
                            <span class="font-semibold text-red-500">Delete</span> an existing database property called <span class="font-semibold text-green-500">{{ form.event_data.reference_name }}</span>
                        </template>

                        <template v-else-if="form.event_data.action == 'read_or_create'">
                            Find or create a new database property called <span class="font-semibold text-green-500">{{ form.event_data.reference_name }}</span>
                        </template>

                        <template v-else-if="form.event_data.action == 'create_or_update'">
                            Create or update an existing database property called <span class="font-semibold text-green-500">{{ form.event_data.reference_name }}</span>
                        </template>

                    </span>
                </PrimaryAlert>

            </div>

        </div>

        <!-- Reference Name -->
        <VariableInput v-model="form.event_data.reference_name" label="Name" placeholder="profile" :error="form.errors.reference_name" :allowGlobalVariables="false" @onSetError="form.setError('reference_name', $event)" @onClearError="form.clearErrors('reference_name')" class="mb-6">
            <template #info>
                <span>
                    This is the reference name to query the
                    <template v-if="form.event_data.reference_name">
                        <span class="font-semibold text-green-500">{{ form.event_data.reference_name }}</span>
                        information in the database
                    </template>
                    <template v-else>
                        information in the database
                    </template>
                </span>
            </template>
        </VariableInput>

        <!-- Existence Reference Name -->
        <VariableInput v-model="form.event_data.existence_reference_name" label="Existence Name" note="Optional" placeholder="profile_exists" :error="form.errors.existence_reference_name" @onSetError="form.setError('existence_reference_name', $event)" @onClearError="form.clearErrors('existence_reference_name')" class="mb-6">
            <template #info>
                <span>
                    This is the reference name to query the existence of the
                    <template v-if="form.event_data.reference_name">
                        <span class="font-semibold text-green-500">{{ form.event_data.reference_name }}</span>
                        information in the database
                    </template>
                    <template v-else>
                        information in the database
                    </template>
                    regardless of the action being performed. The result is a True or False bolean indicating the existence of the <span class="font-semibold text-green-500">{{ form.event_data.reference_name }} </span> information.
                </span>
            </template>
        </VariableInput>

        <template v-if="['create', 'update', 'read_or_create', 'create_or_update'].includes(form.event_data.action)">

            <!-- Variables Editor -->
            <VariablesEditor :form="form" class="mb-6"></VariablesEditor>

            <div v-if="['update', 'create_or_update'].includes(form.event_data.action)" class="grid grid-cols-3 gap-4 items-end mb-6">

                <div class="col-span-1">

                    <!-- Action -->
                    <DefaultSelect v-model="form.event_data.update_approach" :options="selectUpdateApproachOptions" label="Update Approach" placeholder="Select storage approach" :error="form.errors.update_approach"></DefaultSelect>

                </div>

                <div class="col-span-2">

                    <!-- Explainer -->
                    <PrimaryAlert :showIcon="false">
                        <span>

                            <template v-if="form.event_data.update_approach == 'merge'">
                                Merge with existing variables (<span class="font-semibold text-green-500">Preserve</span> variables stored in the database that do not appear on this list of variables)
                            </template>

                            <template v-else-if="form.event_data.update_approach == 'replace'">
                                Replace existing variables completely (<span class="font-semibold text-red-500">Delete</span> variables previously stored in the database that do not appear on this list of variables)
                            </template>

                        </span>
                    </PrimaryAlert>

                </div>

            </div>

        </template>

        <span class="text-xs tracking-tight">

            This information can be referenced as <span class="font-semibold text-green-500"><span v-pre>{{ </span>{{ form.event_data.reference_name }}<span v-pre> }}</span></span> after this event has completed.
            <template v-if="form.event_data.existence_reference_name">
                The existence of the information can be referenced as <span class="font-semibold text-green-500"><span v-pre>{{ </span>{{ form.event_data.existence_reference_name }}<span v-pre> }}</span></span> which is a True or False bolean value indicating the existence of the information regardless of the action being performed.
            </template>

        </span>

    </div>

</template>

<script>

    import VariablesEditor from './VariablesEditor';
    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import VariableInput from "@components/Input/VariableInput";
    import DefaultSwitch from "@components/Switch/DefaultSwitch";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['form'],
        components: { VariablesEditor, PrimaryAlert, VariableInput, DefaultSwitch, DefaultSelect, TextOrCodeEditor },
        data(){
            return {
                selectOptions: [
                    {
                        label: 'Read',
                        value: 'read'
                    },
                    {
                        label: 'Create',
                        value: 'create'
                    },
                    {
                        label: 'Update',
                        value: 'update'
                    },
                    {
                        label: 'Delete',
                        value: 'delete'
                    },
                    {
                        label: 'Read Or Create',
                        value: 'read_or_create'
                    },
                    {
                        label: 'Create Or Update',
                        value: 'create_or_update'
                    },
                ],
                selectUpdateApproachOptions: [
                    {
                        label: 'Merge',
                        value: 'merge'
                    },
                    {
                        label: 'Replace',
                        value: 'replace'
                    },
                ],
            }
        }
    }
</script>
