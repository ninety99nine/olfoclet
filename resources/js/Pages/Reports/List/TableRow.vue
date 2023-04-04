<template>

    <tr v-for="(version, index) in account.versions" :key="index" @click="showAccount(version)" :class="['group cursor-pointer hover:bg-gray-50', { 'border-b' : (account.versions.length - 1 === index) }]">

        <!-- Mobile Number -->
        <td scope="row" class="px-6 py-4 text-xs">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && index === 0)">{{ account.mobile_number }}</span>
        </td>

        <!-- Project -->
        <td v-if="headers.includes('Project')" scope="row" class="px-6 py-4 text-xs whitespace-nowrap">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && (isTheFirstIteration(index) || notTheSameAsThePreviousProjectName(index, version)))">
                {{ getProjectName(version) }}
            </span>
        </td>

        <!-- App -->
        <td  v-if="headers.includes('App')" scope="row" class="px-6 py-4 text-xs whitespace-nowrap">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && (isTheFirstIteration(index) || notTheSameAsThePreviousAppName(index, version)))">
                {{ getAppName(version) }}
            </span>
        </td>

        <!-- Version -->
        <td  v-if="headers.includes('Version')" scope="row" class="px-6 py-4 text-xs whitespace-nowrap">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && (isTheFirstIteration(index) || notTheSameAsThePreviousVersionNumber(index, version)))">
                {{ getVersionNumber(version) }}
            </span>
        </td>

        <!-- Origin -->
        <td scope="row" class="px-6 py-4 text-xs">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && index === 0)" :class="{ 'text-blue-500' : !account.test }">{{ account.origin }}</span>
        </td>

        <!-- Sessions -->
        <td scope="row" class="text-center px-6 py-4 text-xs">
            <span>{{ account.sessions_count }}</span>
        </td>

        <!-- Notifications -->
        <td scope="row" class="text-center px-6 py-4 text-xs">
            <span>{{ account.session_notifications_count }}</span>
        </td>

        <!-- Database Entries -->
        <td scope="row" class="text-center px-6 py-4 text-xs">
            <span>{{ account.database_entries_count }}</span>
        </td>

        <!-- Global Variables -->
        <td scope="row" class="text-center px-6 py-4 text-xs">
            <span>{{ account.global_variables_count }}</span>
        </td>

        <!-- Created Date -->
        <td scope="row" class="px-6 py-4 text-xs text-gray-500">
            <span>{{ getCreatedDate(version) }}</span>
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
            headers: Array,
            account: Object,
            appPayload: Object,
            projectPayload: Object,
            versionPayload: Object,
            hideDuplicateCells: Boolean,
        },
        data() {
            return {
                moment: moment,
            }
        },
        methods: {
            showAccount(version) {
                this.$inertia.get(route('version.account.show', {
                    project: version.app.project.id,
                    ussd_account: this.account.id,
                    app: version.app.id,
                    version: version.id
                }));
            },
            getVersionNumber(version) {
                return version.number;
            },
            getAppName(version) {
                return version.app.name;
            },
            getProjectName(version) {
                return version.app.project.name;
            },
            getCreatedDate(version) {
                return this.moment(version.pivot.created_at).fromNow();
            },
            isTheFirstIteration(index) {
                return index == 0;
            },
            notTheSameAsThePreviousAppName(index, version) {
                return (index > 0 && this.account.versions[index - 1].app.name !== version.app.name);
            },
            notTheSameAsThePreviousProjectName(index, version) {
                return (index > 0 && this.account.versions[index - 1].app.project.name !== version.app.project.name)
            },
            notTheSameAsThePreviousVersionNumber(index, version) {
                return (index > 0 && this.account.versions[index - 1].number !== version.number)
            }
        }
    };

</script>
