<template>

    <div class="p-5 bg-white rounded-md shadow-md hover:shadow-lg">

        <ul class="space-y-4 text-xs text-gray-500">
            <li class="flex justify-between">
                <span>Mobile Number</span>
                <span>{{ account.mobile_number }}</span>
            </li>
            <li class="flex justify-between">
                <span>Origin</span>
                <span>{{ account.origin }}</span>
            </li>
            <li class="flex justify-between border-t mt-4 pt-4">
                <span>Sessions</span>
                <span>{{ account.sessions_count }}</span>
            </li>
            <li class="flex justify-between">
                <span>Notifications</span>
                <span>{{ account.session_notifications_count }}</span>
            </li>
            <li class="flex justify-between">
                <span>Database Entries</span>
                <span>{{ account.database_entries_count }}</span>
            </li>
            <li class="flex justify-between">
                <span>Global Variables</span>
                <span>{{ account.global_variables_count }}</span>
            </li>
            <li class="flex justify-between border-t mt-4 pt-4">
                <span>Created</span>
                <span>{{ moment(account.created_at).fromNow() }}</span>
            </li>
        </ul>

    </div>

</template>

<script>

    import moment from 'moment'

    export default {
        data() {
            return {
                moment: moment,
                account: this.$page.props.accountPayload
            }
        },
        watch: {
            /**
             *  Watch for changes on the page props
             */
            '$page.props': function (newUrl, oldUrl) {
                this.account = this.$page.props.accountPayload;
            }
        },
    };

</script>
