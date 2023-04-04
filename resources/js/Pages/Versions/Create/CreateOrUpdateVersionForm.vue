<template>

    <!-- Delete / Restore -->
    <template v-if="mode == 'Delete' || mode == 'Restore'">

        <!-- Soft Delete -->
        <p v-if="mode == 'Delete' && !form.deleted_at" class="text-sm text-gray-500 mb-5">This version will be trashed for 30 days before it's permanently deleted. Please be certain. Enter the confirmation code <span class="text-gray-800 font-bold">{{ version.confirmation_code }}</span> to confirm this action.</p>

        <!-- Force Delete -->
        <p v-if="mode == 'Delete' && form.deleted_at" class="text-sm text-gray-500 mb-5">Once you delete this version, there is no going back. Please be certain. Enter the confirmation code <span class="text-gray-800 font-bold">{{ version.confirmation_code }}</span> to confirm this action.</p>

        <!-- Restore -->
        <p v-if="mode == 'Restore'" class="text-sm text-gray-500 mb-5">Enter the confirmation code <span class="text-gray-800 font-bold">{{ version.confirmation_code }}</span> to confirm this action.</p>

        <DefaultInput v-model="form.confirmation_code" label="Confirmation code" placeholder="Enter the confirmation code" :disabled="form.processing || form.processing" :error="form.errors.confirmation_code" class="mb-6"></DefaultInput>

    </template>

    <template v-else>
        <DefaultInput v-model="form.number" label="Number" placeholder="1.00" :disabled="form.processing" :error="form.errors.number" class="mb-6"></DefaultInput>
        <DefaultTextArea v-model="form.description" label="Description" placeholder="This is the first version" :disabled="form.processing" :error="form.errors.description" class="mb-6"></DefaultTextArea>
    </template>

    <template v-if="version && mode == 'Update'">
        <DefaultSwitch v-model="form.reset_builder" label="Reset" :disabled="form.processing" :error="form.errors.reset_builder" class="mb-6">
            <span v-if="form.reset_builder" class="text-xs text-gray-400 ml-2"> &#8212; This version will be reset</span>
        </DefaultSwitch>
        <p v-if="form.reset_builder" class="text-sm text-gray-500 border-b pb-5 mb-5">Resetting this version will destroy the version screens, displays, events and settings. Once you reset a version, there is no going back. Enter the reset code <span class="text-gray-800 font-bold">{{ version.confirmation_code }}</span> to confirm this action.</p>
        <DefaultInput v-if="form.reset_builder" v-model="form.confirmation_code" label="Reset code" placeholder="Enter the reset code" :disabled="form.processing || form.processing" :error="form.errors.confirmation_code" class="mb-6"></DefaultInput>
    </template>

    <template v-if="mode == 'Create' || mode == 'Update'">

        <div>

            <div class="flex items-center justify-between mb-4">

                <span class="text-sm font-medium text-gray-900">Features</span>

                <DefaultButton @click="addFeature()" class="px-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    <span>Add Feature</span>
                </DefaultButton>

            </div>

            <draggable
                group="features"
                :invertSwap="true"
                item-key="features"
                v-model="form.features"
                handle=".draggble-handle"
                ghost-class="bg-yellow-100">

                <div v-for="(element, index) in form.features" :key="element.id" class="flex items-center justify-between py-1 px-2 rounded-md -ml-2">

                    <!-- Single Input -->
                    <DefaultInput v-model="form.features[index]" :placeholder="'Feature #' + (index + 1)" :error="form.errors['features.'+index]" :disabled="form.processing || form.processing" class="flex-1"></DefaultInput>

                    <!-- Delete Icon -->
                    <svg @click="removeFeature(index)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-3 ml-8 hover:text-red-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>

                    <!-- Move Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-3 ml-4 hover:text-blue-500 cursor-grab active:cursor-grabbing draggble-handle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>

                </div>

            </draggable>

            <!-- Explainer -->
            <PrimaryAlert v-if="form.features.length == 0">No features mentioned</PrimaryAlert>

        </div>

    </template>

    <!-- Update -->
    <template v-if="mode == 'Create'">

        <DefaultSelect v-model="form.clone_version_id" :options="versionOptions" label="Clone version" placeholder="Select a version to clone" :disabled="form.processing" :error="form.errors.clone_version_id" class="mt-6"></DefaultSelect>

    </template>

</template>

<script>

    import { VueDraggableNext } from 'vue-draggable-next';
    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import DefaultInput from "@components/Input/DefaultInput";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import DefaultButton from '@components/Button/DefaultButton';
    import DefaultSwitch from "@components/Switch/DefaultSwitch";
    import DefaultTextArea from "@components/TextArea/DefaultTextArea.vue";

    export default {
        components: { draggable: VueDraggableNext, PrimaryAlert, DefaultInput, DefaultSelect, DefaultButton, DefaultSwitch, DefaultTextArea },
        props: {
            form: Object,
            mode: String,
            version: {
                type: Object,
                default: null
            },
        },
        methods: {
            addFeature() {

                //  Add to existing features
                this.form.features.push('');

            },
            removeFeature(index) {

                //  Remove feature
                this.form.features.splice(index, 1);

                //  Feature removed success message
                this.$message({
                    message: 'Feature removed',
                    type: 'success'
                });

            }
        },
        computed: {
            versionOptions() {
                let options = this.$page.props.versionsPayload;

                if( options.length ) {

                    options = options.map((option) => {
                        return {
                            label: option.number,
                            value: option.id
                        }
                    });

                }

                options.unshift({
                    label: 'None',
                    value: 'none'
                });

                return options;
            }
        }
    }
</script>

<style>

</style>>
