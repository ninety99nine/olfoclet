<template>

    <tr @click="showDatabaseEntry" class="group border-b cursor-pointer hover:bg-gray-50">

        <!-- Mobile Number -->
        <td v-if="headers.includes('Number')" scope="row" class="px-6 py-4 text-xs">
            <span>{{ databaseEntry.account.mobile_number }}</span>
        </td>

        <!-- Name -->
        <td v-if="headers.includes('Name')" scope="row" class="px-6 py-4 text-xs">
            <span>{{ databaseEntry.name }}</span>
        </td>

        <!-- Metadata -->
        <td v-if="headers.includes('Metadata')" scope="row" :class="['px-6 py-4 text-xs', { 'whitespace-pre-wrap' : prettifyJson }]">
            <span>{{ databaseEntry.metadata }}</span>
        </td>

        <!-- Created Date -->
        <td v-if="headers.includes('Created Date')" scope="row" class="px-6 py-4 text-xs text-gray-500 text-right">
            <span>{{ moment(databaseEntry.created_at).fromNow() }}</span>
        </td>

    </tr>

</template>

<script>

    import moment from 'moment'

    export default {
        props: {
            headers: Array,
            prettifyJson: Boolean,
            databaseEntry: Object,
        },
        data() {
            return {
                moment: moment,
            }
        },
        methods: {
            showDatabaseEntry() {
                this.$inertia.get(route('database.entry.show', { project: this.route().params.project, app: this.route().params.app, version: this.databaseEntry.version_id, database_entry: this.databaseEntry.id }));
            }
        }
    };

</script>
