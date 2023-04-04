<template>

    <div class="p-5 bg-white rounded-md shadow-md hover:shadow-lg">

        <ul class="space-y-4 text-xs text-gray-500">
            <li class="flex justify-between">
                <span>Mobile Number</span>
                <span>{{ session.mobile_number }}</span>
            </li>
            <li class="flex justify-between">
                <span>Created</span>
                <span>{{ moment(session.created_at).fromNow() }}</span>
            </li>
            <li class="flex justify-between">
                <span>Duration</span>
                <span>{{ session.total_duration }}</span>
            </li>
            <li class="flex justify-between">
                <span>Origin</span>
                <span>{{ session.origin }}</span>
            </li>
            <li class="flex justify-between">
                <span>Status</span>
                <span v-if="session.fatal_error" class="font-semibold text-red-500">{{ session.success_status.name }}</span>
                <span v-else class="text-green-500">{{ session.success_status.name }}</span>
            </li>
            <li v-if="session.fatal_error" class="border-t mt-4 pt-4">
                <span class="text-red-500">{{ session.fatal_error_msg }}</span>
            </li>
            <li class="border-t border-b my-4 py-4">
                <div class="flex items-center justify-between mb-2">
                    <span>Request</span>
                    <SuccessBadge v-if="session.request_type_status.name === 'Started'">{{ session.request_type_status.name }}</SuccessBadge>
                    <PrimaryBadge v-if="session.request_type_status.name === 'Running'">{{ session.request_type_status.name }}</PrimaryBadge>
                    <WarningBadge v-if="session.request_type_status.name === 'Timeout'">{{ session.request_type_status.name }}</WarningBadge>
                    <DefaultBadge v-if="session.request_type_status.name === 'Ended'">{{ session.request_type_status.name }}</DefaultBadge>
                </div>
                <span class="flex items-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ session.request_type_status.description }}</span>
                </span>
            </li>
            <li>
                <span class="block mb-2">Session ID</span>
                <span class="font-semibold text-blue-500">{{ session.session_id }}</span>
            </li>
        </ul>

    </div>

</template>

<script>

    import PrimaryBadge from '@components/Badges/PrimaryBadge';
    import DefaultBadge from '@components/Badges/DefaultBadge';
    import WarningBadge from '@components/Badges/WarningBadge';
    import SuccessBadge from '@components/Badges/SuccessBadge';
    import moment from 'moment'

    export default {
        components: { PrimaryBadge, DefaultBadge, WarningBadge, SuccessBadge },
        data() {
            return {
                moment: moment,
                session: this.$page.props.sessionPayload
            }
        },
        watch: {
            /**
             *  Watch for changes on the page props
             */
            '$page.props': function (newUrl, oldUrl) {
                this.session = this.$page.props.sessionPayload;
            }
        },
    };

</script>
