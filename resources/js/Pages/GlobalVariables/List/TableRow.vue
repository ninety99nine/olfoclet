<template>

    <tr @click="showGlobalVariable" class="group border-b cursor-pointer hover:bg-gray-50">

        <!-- Project -->
        <td v-if="headers.includes('Project')" scope="row" class="px-6 py-4 text-xs whitespace-nowrap">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && (isTheFirstIteration() || notTheSameAsThePreviousProjectName()))">
                {{ getProjectName(globalVariable) }}
            </span>
        </td>

        <!-- App -->
        <td  v-if="headers.includes('App')" scope="row" class="px-6 py-4 text-xs whitespace-nowrap">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && (isTheFirstIteration() || notTheSameAsThePreviousAppName()))">
                {{ getAppName(globalVariable) }}
            </span>
        </td>

        <!-- Version -->
        <td  v-if="headers.includes('Version')" scope="row" class="px-6 py-4 text-xs whitespace-nowrap">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && (isTheFirstIteration() || notTheSameAsThePreviousVersionNumber()))">
                {{ getVersionNumber(globalVariable) }}
            </span>
        </td>

        <!-- Mobile Number -->
        <td scope="row" class="px-6 py-4 text-xs">
            <span v-if="hideDuplicateCells == false || (hideDuplicateCells == true && index === 0)">
                {{ globalVariable.account.mobile_number }}
            </span>
        </td>

        <!-- Metadata -->
        <td v-if="headers.includes('Metadata')" scope="row" :class="['px-6 py-4 text-xs', { 'whitespace-pre-wrap' : prettifyJson }]">
            <span>{{ globalVariable.metadata }}</span>
        </td>

        <!-- Updated Date -->
        <td v-if="headers.includes('Updated')" scope="row" class="px-6 py-4 text-xs text-gray-500 text-right">
            <span>{{ moment(globalVariable.updated_at).fromNow() }}</span>
        </td>

        <!-- Created Date -->
        <td v-if="headers.includes('Created')" scope="row" class="px-6 py-4 text-xs text-gray-500 text-right">
            <span>{{ moment(globalVariable.created_at).fromNow() }}</span>
        </td>

    </tr>

</template>

<script>

    import moment from 'moment'

    export default {
        props: {
            index: Number,
            headers: Array,
            appPayload: Object,
            prettifyJson: Boolean,
            globalVariable: Object,
            projectPayload: Object,
            versionPayload: Object,
            globalVariables: Array,
            hideDuplicateCells: Boolean,
        },
        data() {
            return {
                moment: moment,
            }
        },
        methods: {
            showGlobalVariable() {

                if( this.getProjectName(this.globalVariable) == 'Unknown' ) {

                    this.$message({
                        message: 'This global variable project has been deleted',
                        type: 'warning'
                    });

                }else if( this.getAppName(this.globalVariable) == 'Unknown' ) {

                    this.$message({
                        message: 'This global variable app has been deleted',
                        type: 'warning'
                    });

                }else if( this.getVersionNumber(this.globalVariable) == 'Unknown' ) {

                    this.$message({
                        message: 'This global variable version has been deleted',
                        type: 'warning'
                    });

                }else{

                    this.$inertia.get(route('version.global.variable.show', {
                        project: this.globalVariable.project_id,
                        version: this.globalVariable.version_id,
                        global_variable: this.globalVariable.id,
                        app: this.globalVariable.app_id,
                    }));

                }

            },
            getVersionNumber(globalVariable) {
                return (globalVariable.version || {}).number || (this.versionPayload || {}).number || 'Unknown';
            },
            getProjectName(globalVariable) {
                return (globalVariable.project || {}).name || (this.projectPayload || {}).name || 'Unknown';
            },
            getAppName(globalVariable) {
                return (globalVariable.app || {}).name || (this.appPayload || {}).name || 'Unknown';
            },
            isTheFirstIteration() {
                return this.index == 0;
            },
            notTheSameAsThePreviousAppName() {
                return (this.index > 0 && this.getAppName(this.globalVariables[this.index - 1]) !== this.getAppName(this.globalVariable));
            },
            notTheSameAsThePreviousProjectName() {
                return (this.index > 0 && this.getProjectName(this.globalVariables[this.index - 1]) !== this.getProjectName(this.globalVariable));
            },
            notTheSameAsThePreviousVersionNumber() {
                return (this.index > 0 && this.getVersionNumber(this.globalVariables[this.index - 1]) !== this.getVersionNumber(this.globalVariable));
            }
        }
    };

</script>
