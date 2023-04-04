<template>

    <div>

        <div class="flex justify-between mb-6">

            <!-- Loader -->
            <Loader v-if="isLoading && !response">
                <span class="text-xs text-gray-400 ml-2">Cheking status...</span>
            </Loader>

            <PrimaryAlert v-else>
                <span>Server Service Status</span>
            </PrimaryAlert>

            <!-- Refresh Button -->
            <PrimaryButton @click.stop="getReport()" :disabled="isLoading">Refresh</PrimaryButton>

        </div>

        <div v-if="response" class="space-y-4">

            <div v-for="(reports, groupName, groupIndex) in response" :key="groupIndex" class="space-y-6">

                <!-- Foreach Report -->
                <div v-for="(report, name, index) in reports" :key="index">

                    <!-- Report Name -->
                    <h2 class="text-sm font-semibold text-blue-500">{{ name }}</h2>

                    <!-- Report Description -->
                    <h3 v-if="report['description']" class="text-xs text-gray-400 whitespace-pre-wrap mt-2">{{ report['description'] }}</h3>

                    <!-- Report Message -->
                    <div class="relative mt-4">

                        <!-- Loading overlay -->
                        <LoaderOverlay :show="isLoading" />

                        <CodeEditor v-model="reports[name]['message']" :display_language="false" :read_only="true" :show_read_only="false" height="auto"></CodeEditor>

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import axios from 'axios';
    import Loader from '@components/Loader/Loader';
    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import CodeEditor from "@components/CodeEditor/CodeEditor";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import PrimaryButton from "@components/Button/PrimaryButton";
    import LoaderOverlay from '@components/Loader/LoaderOverlay';

    export default {
        components: { Loader, PrimaryAlert, CodeEditor, DefaultSelect, PrimaryButton, LoaderOverlay },
        data() {
            return {
                isLoading: false,
                response: null
            }
        },
        methods: {
            getReport() {

                const self = this;

                this.isLoading = true;

                const url = route('settings.server.status.check');

                axios.post(url)
                    .then((response) => {

                        this.response = response.data;

                    }).catch((error) => {

                        var message = (error || {}).message ?? 'Sorry, something went wrong';

                        //  Request failed with status code 419 (CSRF token mismatch.)
                        if( error.response.status === 419 ) {

                            message = 'Please login';

                            //  Proceed to login
                            this.$inertia.get(route('login.show'));

                        }

                        self.$message({
                            message: message,
                            type: 'warning'
                        });

                    }).finally(() => {

                        this.isLoading = false;

                    });

            }
        },
        created() {
            this.getReport();
        }
    };

</script>
