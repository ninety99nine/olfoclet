<template>

    <div class="mt-8">

        <SessionLogs :logs="(session.logs || [])"></SessionLogs>

    </div>

</template>

<script>

    import SessionLogs from "@versionBuilder/Content/Simulator/Logs";

    export default {
        components: { SessionLogs },
        data() {
            return {
                session: this.$page.props.sessionPayload,
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
