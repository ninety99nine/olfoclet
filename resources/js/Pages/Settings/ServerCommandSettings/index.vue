<template>

    <div>

        <PrimaryAlert class="mb-6">
            <span>Run server commands</span>
        </PrimaryAlert>

        <div class="flex justify-between mb-6">
            <DefaultSelect v-model="command" :options="commands" class="w-40"></DefaultSelect>
            <PrimaryButton @click.stop="runCommand()" :disabled="isLoading">Run Command</PrimaryButton>
        </div>

        <div :class="['relative', { 'py-8' : (!response && isLoading) }]">

            <!-- Loading overlay -->
            <LoaderOverlay :show="isLoading" />

            <CodeEditor v-if="response" v-model="response" :display_language="false" :read_only="true" :show_read_only="false" height="auto"></CodeEditor>

        </div>

    </div>

</template>

<script>

    import axios from 'axios';
    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import CodeEditor from "@components/CodeEditor/CodeEditor";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import PrimaryButton from "@components/Button/PrimaryButton";
    import LoaderOverlay from '@components/Loader/LoaderOverlay';

    export default {
        components: { CodeEditor, PrimaryAlert, DefaultSelect, PrimaryButton, LoaderOverlay },
        data() {
            return {
                commands: this.$page.props.commands.map((command) => { return { label: command } }),
                command: this.$page.props.commands[0],
                response: null,
                isLoading: false,
            }
        },
        methods: {
            runCommand() {

                const self = this;

                this.isLoading = true;

                const data = { command: this.command };

                const url = route('settings.server.commands.run');

                axios.post(url, data)
                    .then((response) => {

                        this.response = response.data;

                        self.$message({
                            message: 'Command executed successfully',
                            type: 'success'
                        });

                    }).catch((error) => {

                        var message = (error || {}).message ?? 'Sorry, something went wrong';

                        //  Request failed with status code 419 (CSRF token mismatch.)
                        if( error.response.status === 419 ) {

                            message = 'Please login';

                            //  Proceed to login
                            this.$inertia.get(route('login.show'));

                        }else{

                            this.response = (((error || {}).response || {}).data || {}).message;

                        }

                        self.$message({
                            message: message,
                            type: 'warning'
                        });

                    }).finally(() => {

                        this.isLoading = false;

                    });

            }
        }
    };

</script>
