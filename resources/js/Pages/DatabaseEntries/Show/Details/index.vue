<template>

    <div class="p-5 bg-white rounded-md shadow-md hover:shadow-lg">

        <ul class="space-y-4 text-xs text-gray-500">
            <li class="flex justify-between">
                <span>Mobile Number</span>
                <span>{{ databaseEntry.account.mobile_number }}</span>
            </li>
            <li class="flex justify-between border-t mt-4 pt-4">
                <span>Created</span>
                <span>{{ moment(databaseEntry.created_at).fromNow() }}</span>
            </li>
            <li class="flex justify-between mt-4">
                <span>Last updated</span>
                <span>{{ moment(databaseEntry.updated_at).fromNow() }}</span>
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
                databaseEntry: this.$page.props.databaseEntryPayload
            }
        },
        watch: {
            /**
             *  Watch for changes on the page props
             */
            '$page.props': function (newUrl, oldUrl) {
                this.databaseEntry = this.$page.props.databaseEntryPayload;
            }
        },
    };

</script>
