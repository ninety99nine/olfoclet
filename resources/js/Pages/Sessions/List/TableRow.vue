<template>

    <tr @click="showSession" class="group border-b cursor-pointer hover:bg-gray-50">

        <!-- Project -->
        <td v-if="headers.includes('Project')" scope="row" class="px-6 py-4 text-xs whitespace-nowrap">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && (isTheFirstIteration() || notTheSameAsThePreviousProjectName()))">
                {{ getProjectName(session) }}
            </span>
        </td>

        <!-- App -->
        <td  v-if="headers.includes('App')" scope="row" class="px-6 py-4 text-xs whitespace-nowrap">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && (isTheFirstIteration() || notTheSameAsThePreviousAppName()))">
                {{ getAppName(session) }}
            </span>
        </td>

        <!-- Version -->
        <td  v-if="headers.includes('Version')" scope="row" class="px-6 py-4 text-xs whitespace-nowrap">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && (isTheFirstIteration() || notTheSameAsThePreviousVersionNumber()))">
                {{ getVersionNumber(session) }}
            </span>
        </td>

        <!-- Mobile Number -->
        <td v-if="headers.includes('Number')" scope="row" class="px-6 py-4 text-xs">
            <span>{{ session.mobile_number }}</span>
        </td>

        <!-- Origin -->
        <td v-if="headers.includes('Origin')" scope="row" class="px-6 py-4 text-xs">
            <span :class="{ 'text-blue-500' : !session.account.test }">{{ session.origin }}</span>
        </td>

        <!-- Request Type Status -->
        <td v-if="headers.includes('Request')" scope="row" class="px-6 py-4 text-xs">
            <SuccessBadge v-if="session.request_type_status.name === 'Started'">{{ session.request_type_status.name }}</SuccessBadge>
            <PrimaryBadge v-if="session.request_type_status.name === 'Running'">{{ session.request_type_status.name }}</PrimaryBadge>
            <WarningBadge v-if="session.request_type_status.name === 'Timeout'">{{ session.request_type_status.name }}</WarningBadge>
            <DefaultBadge v-if="session.request_type_status.name === 'Ended'">{{ session.request_type_status.name }}</DefaultBadge>
        </td>

        <!-- Success Status -->
        <td v-if="headers.includes('Status')" scope="row" class=" px-6 py-4 text-xs">
            <div :class="['flex', (session.fatal_error ? 'text-red-500' : 'text-green-500')]">

                <!-- Error Status -->
                <el-popover v-if="session.fatal_error" placement="top" :width="300" trigger="hover">
                    <span class="text-xs text-red-500">{{ session.fatal_error_msg }}</span>

                    <template v-slot:reference>
                        <div class="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{{ session.success_status.name }}</span>
                        </div>
                    </template>
                </el-popover>

                <!-- Success Status -->
                <template v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ session.success_status.name }}</span>
                </template>

            </div>
        </td>

        <!-- Interactions -->
        <td v-if="headers.includes('Interactions')" scope="row" class="text-center px-6 py-4 text-xs">
            <span>{{ session.total_inputs_and_outputs }}</span>
        </td>

        <!-- Duration -->
        <td v-if="headers.includes('Duration')" scope="row" class="px-6 py-4 text-xs">
            <span>{{ session.total_duration }}</span>
        </td>

        <!-- Created Date -->
        <td v-if="headers.includes('Created Date')" scope="row" class="px-6 py-4 text-xs text-gray-500 text-right">
            <span>{{ moment(session.created_at).fromNow() }}</span>
        </td>

    </tr>

</template>

<script>

    import PrimaryBadge from '@components/Badges/PrimaryBadge';
    import DefaultBadge from '@components/Badges/DefaultBadge';
    import WarningBadge from '@components/Badges/WarningBadge';
    import SuccessBadge from '@components/Badges/SuccessBadge';
    import DangerBadge from '@components/Badges/DangerBadge';
    import moment from 'moment'

    export default {
        components: { PrimaryBadge, DefaultBadge, WarningBadge, SuccessBadge, DangerBadge },
        props: {
            index: Number,
            headers: Array,
            session: Object,
            sessions: Array,
            appPayload: Object,
            projectPayload: Object,
            versionPayload: Object,
            hideDuplicateCells: Boolean,
        },
        data() {
            return {
                moment: moment
            }
        },
        methods: {
            showSession() {

                if( this.getProjectName(this.session) == 'Unknown' ) {

                    this.$message({
                        message: 'This session project has been deleted',
                        type: 'warning'
                    });

                }else if( this.getAppName(this.session) == 'Unknown' ) {

                    this.$message({
                        message: 'This session app has been deleted',
                        type: 'warning'
                    });

                }else if( this.getVersionNumber(this.session) == 'Unknown' ) {

                    this.$message({
                        message: 'This session version has been deleted',
                        type: 'warning'
                    });

                }else{

                    this.$inertia.get(route('version.session.show', {
                        project: this.session.project_id,
                        version: this.session.version_id,
                        ussd_session: this.session.id,
                        app: this.session.app_id,
                    }));

                }
            },
            getVersionNumber(session) {
                return (session.version || {}).number || (this.versionPayload || {}).number || 'Unknown';
            },
            getProjectName(session) {
                return (session.project || {}).name || (this.projectPayload || {}).name || 'Unknown';
            },
            getAppName(session) {
                return (session.app || {}).name || (this.appPayload || {}).name || 'Unknown';
            },
            isTheFirstIteration() {
                return this.index == 0;
            },
            notTheSameAsThePreviousAppName() {
                return (this.index > 0 && this.getAppName(this.sessions[this.index - 1]) !== this.getAppName(this.session));
            },
            notTheSameAsThePreviousProjectName() {
                return (this.index > 0 && this.getProjectName(this.sessions[this.index - 1]) !== this.getProjectName(this.session));
            },
            notTheSameAsThePreviousVersionNumber() {
                return (this.index > 0 && this.getVersionNumber(this.sessions[this.index - 1]) !== this.getVersionNumber(this.session));
            }
        }
    };

</script>
