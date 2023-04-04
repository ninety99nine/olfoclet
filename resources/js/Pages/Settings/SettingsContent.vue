<template>

    <div class="bg-white rounded-md shadow-md hover:shadow-lg p-8">

        <AccountSettings v-if="selectedSettings === 'settings.account'"></AccountSettings>
        <ServerStatusSettings v-if="selectedSettings === 'settings.server.status'"></ServerStatusSettings>
        <ServerCommandSettings v-if="selectedSettings === 'settings.server.commands'"></ServerCommandSettings>
        <ServerLogsSettings v-if="selectedSettings === 'settings.server.logs'"></ServerLogsSettings>
        <EnvironmentConfigurationSettings v-if="selectedSettings === 'settings.enviroment.configurations'"></EnvironmentConfigurationSettings>

    </div>

</template>

<script>

    import AccountSettings from './AccountSettings';
    import ServerStatusSettings from './ServerStatusSettings';
    import ServerCommandSettings from './ServerCommandSettings';
    import ServerLogsSettings from './ServerLogsSettings';
    import EnvironmentConfigurationSettings from './EnvironmentConfigurationSettings';

    export default {
        components: { AccountSettings, ServerStatusSettings, ServerCommandSettings, ServerLogsSettings, EnvironmentConfigurationSettings },
        data() {
            return {
                selectedSettings: this.getSelectedSettings()
            }
        },
        methods: {
            getSelectedSettings() {
                return route().current();
            }
        }
    };

</script>
