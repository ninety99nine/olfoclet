<template>

    <!-- Delete / Restore -->
    <template v-if="mode == 'Delete' || mode == 'Restore'">

        <!-- Soft Delete -->
        <p v-if="mode == 'Delete' && !form.deleted_at" class="text-sm text-gray-500 mb-5">This app will be trashed for 30 days before it's permanently deleted. Please be certain. Enter the confirmation code <span class="text-gray-800 font-bold">{{ app.confirmation_code }}</span> to confirm this action.</p>

        <!-- Force Delete -->
        <p v-if="mode == 'Delete' && form.deleted_at" class="text-sm text-gray-500 mb-5">Once you delete this app, there is no going back. Please be certain. Enter the confirmation code <span class="text-gray-800 font-bold">{{ app.confirmation_code }}</span> to confirm this action.</p>

        <!-- Restore -->
        <p v-if="mode == 'Restore'" class="text-sm text-gray-500 mb-5">Enter the confirmation code <span class="text-gray-800 font-bold">{{ app.confirmation_code }}</span> to confirm this action.</p>

        <DefaultInput v-model="form.confirmation_code" label="Confirmation code" placeholder="Enter the confirmation code" :disabled="form.processing || form.processing" :error="form.errors.confirmation_code" class="mb-6"></DefaultInput>

    </template>

    <!-- Create / Update -->
    <template v-else>
        <DefaultInput v-model="form.name" label="Name" placeholder="My App" :disabled="form.processing" :error="form.errors.name" class="mb-6"></DefaultInput>
        <DefaultTextArea v-model="form.description" label="Description" placeholder="This is a budget app" :disabled="form.processing" :error="form.errors.description" class="mb-6"></DefaultTextArea>
        <DefaultSwitch v-model="form.online" label="Online" :disabled="form.processing" :error="form.errors.online" class="mb-6">
            <span class="text-xs text-gray-400 ml-2"> &#8212; Your app is {{ form.online ? 'online' : 'offline' }}</span>
        </DefaultSwitch>
        <DefaultTextArea v-if="!form.online" v-model="form.offline_message" label="Offline Message" placeholder="This service is currently not available" :disabled="form.processing" :error="form.errors.offline_message" class="mb-4"></DefaultTextArea>

        <div class="flex items-center justify-between mb-6">
            <DefaultSelect v-model="form.shared_short_code_id" :options="sharedShortCodeOptions" label="Shared Short Code" placeholder="Select a shared shortcode" :disabled="form.processing" :error="form.errors.shared_short_code_id" class="w-60"></DefaultSelect>
            <PrimaryBadge v-if="form.shared_code" class="mt-4">{{ form.shared_code }}</PrimaryBadge>
        </div>
    </template>

    <!-- Update -->
    <template v-if="mode == 'Update'">

        <DefaultSelect v-model="form.active_version_id" :options="versionOptions" label="Active version" placeholder="Select a version" :disabled="form.processing" :error="form.errors.active_version_id" class="mb-6"></DefaultSelect>

        <DefaultInput v-model="form.dedicated_code" label="Dedicated Code" placeholder="*123#" :disabled="form.processing" :error="form.errors.dedicated_code" class="mb-6"></DefaultInput>

        <DefaultCheckbox v-if="form.errors.dedicated_code == 'The dedicated code is already used by another app. Do you want to reassign the shortcode?'" v-model="form.overide_dedicated_code" label="Reassign dedicated code to this app" :disabled="form.processing" :error="form.errors.overide_dedicated_code" class="mb-6"></DefaultCheckbox>

    </template>

</template>

<script>
    import DefaultInput from "@components/Input/DefaultInput";
    import PrimaryBadge from "@components/Badges/PrimaryBadge";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import DefaultSwitch from "@components/Switch/DefaultSwitch";
    import DefaultCheckbox from "@components/Checkbox/DefaultCheckbox";
    import DefaultTextArea from "@components/TextArea/DefaultTextArea";

    export default {
        components: { DefaultInput, PrimaryBadge, DefaultSelect, DefaultSwitch, DefaultCheckbox, DefaultTextArea, PrimaryBadge },
        props: {
            form: Object,
            mode: String,
            app: {
                type: Object,
                default: null
            }
        },
        computed: {
            sharedShortCodeOptions() {
                return this.$page.props.sharedShortCodesPayload.map((option) => {
                    return {
                        label: option.code,
                        value: option.id
                    }
                });
            },
            versionOptions() {
                let options = (this.app || {}).versions ? this.app.versions : this.$page.props.versionsPayload;

                return options.map((option) => {
                    return {
                        label: option.number,
                        value: option.id
                    }
                });
            }
        }
    }
</script>

