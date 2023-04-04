<template>

    <tr @click="showNotification" class="group border-b cursor-pointer hover:bg-gray-50">

        <!-- Mobile Number -->
        <td v-if="headers.includes('Number')" scope="row" class="px-6 py-4 text-xs">
            <span>{{ notification.account.mobile_number }}</span>
        </td>

        <!-- Message -->
        <td v-if="headers.includes('Message')" scope="row" class="px-6 py-4 text-xs">
            <div class="flex">
                <span class="whitespace-pre-wrap block bg-blue-50 py-2 px-4 rounded-lg">{{ notification.message }}</span>
            </div>
        </td>

        <!-- Created Date -->
        <td v-if="headers.includes('Created Date')" scope="row" class="px-6 py-4 text-xs text-gray-500 text-right">
            <span>{{ moment(notification.created_at).fromNow() }}</span>
        </td>

    </tr>

</template>

<script>

    import moment from 'moment'

    export default {
        props: {
            headers: Array,
            notification: Object,
        },
        data() {
            return {
                moment: moment,
            }
        },
        methods: {
            showNotification() {
                this.$inertia.get(route('notification.show', { project: this.route().params.project, app: this.route().params.app, version: this.notification.version_id, notification: this.notification.id }));
            }
        }
    };

</script>
