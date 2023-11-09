<template>

    <!-- Configuration Menus -->
    <ul class="border bg-gray-50 rounded-md p-2 mt-4">

        <ConfigMenu v-for="(configMenu, index) in configMenus" :key="index" :configMenus="configMenus" :configMenu="configMenu" :index="index"></ConfigMenu>

        <li v-if="error">
            <DangerAlert>{{ error }}</DangerAlert>
        </li>

    </ul>

</template>

<script>

    import ConfigMenu from './ConfigMenu';
    import DangerAlert from '@components/Alert/DangerAlert';
    import { useVersionBuilder } from '@stores/VersionBuilder';

    export default {
        components: { ConfigMenu, DangerAlert },
        data(){
            return {
                error: '',
                configMenus: [],
                useVersionBuilder: useVersionBuilder()
            }
        },
        watch:{
            'useVersionBuilder.builder.application_events.on_start.collection': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
            'useVersionBuilder.builder.application_events.on_close.collection': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
            'useVersionBuilder.builder.global_headers': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
            'useVersionBuilder.builder.global_events': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
            'useVersionBuilder.builder.global_variables': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
            'useVersionBuilder.builder.conditional_screens': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
            'useVersionBuilder.builder.restrictions': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
            'useVersionBuilder.builder.firebase_connection': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
            'useVersionBuilder.builder.appwrite_connection': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
            'useVersionBuilder.builder.sms_connection': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
            'useVersionBuilder.builder.airtime_billing_connection': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
            'useVersionBuilder.builder.log_settings': {
                handler: function (after, before) {
                    this.configMenus = this.getConfigMenus();
                },
                deep: true
            },
        },
        methods: {
            getConfigMenus() {

                /**
                 *  When importing older version builders, its possible that issues may arise
                 *  due to incompatabilities of the JSON file structure. In such cases, let
                 *  us prevent the frontend
                 */
                try {

                    const totalGlobalEvents = this.useVersionBuilder.globalEvents.length;
                    const totalGlobalHeaders = this.useVersionBuilder.globalHeaders.length;
                    const totalGlobalVariables = this.useVersionBuilder.globalVariables.length;

                    const totalApplicaitonEvents = this.useVersionBuilder.builder.application_events.on_start.collection.length
                                                + this.useVersionBuilder.builder.application_events.on_close.collection.length;

                    if( this.useVersionBuilder.builder.restrictions.selected_type == 'None' ) {

                        var restrictionNote = {
                            type: 'Default',
                            message: this.useVersionBuilder.builder.restrictions.selected_type
                        };

                    }else{

                        var restrictionNote = {
                            type: 'Primary',
                            message: this.useVersionBuilder.builder.restrictions.selected_type
                        };

                    }

                    //  If the firebase configuration are not set via the text editor (Not set)
                    if( this.useVersionBuilder.builder.firebase_connection.json.code_editor_mode == false && [null, ''].includes(this.useVersionBuilder.builder.firebase_connection.json.text)) {

                        var firebaseNote = {
                            type: 'Default',
                            message: 'Incomplete'
                        };

                    //  If the firebase configuration are set via the code editor (Verify credentials)
                    }else if( this.useVersionBuilder.builder.firebase_connection.json.code_editor_mode == true ) {
                        var firebaseNote = {
                            type: 'Primary',
                            message: 'Verify'
                        };
                    }else{

                        var firebaseNote = {
                            type: 'Success',
                            message: 'Complete'
                        };

                    }

                    //  If the appwrite configuration are not set via the text editor (Not set)
                    if(
                        this.useVersionBuilder.builder.appwrite_connection.endpoint.code_editor_mode == false && [null, ''].includes(this.useVersionBuilder.builder.appwrite_connection.endpoint.text) ||
                        this.useVersionBuilder.builder.appwrite_connection.project_id.code_editor_mode == false && [null, ''].includes(this.useVersionBuilder.builder.appwrite_connection.project_id.text) ||
                        this.useVersionBuilder.builder.appwrite_connection.api_key.code_editor_mode == false && [null, ''].includes(this.useVersionBuilder.builder.appwrite_connection.api_key.text)
                    ) {

                        var appwriteNote = {
                            type: 'Default',
                            message: 'Incomplete'
                        };

                    //  If the appwrite configuration are set via the code editor (Verify credentials)
                    }else if(
                        this.useVersionBuilder.builder.appwrite_connection.endpoint.code_editor_mode == true ||
                        this.useVersionBuilder.builder.appwrite_connection.project_id.code_editor_mode == true  ||
                        this.useVersionBuilder.builder.appwrite_connection.api_key.code_editor_mode == true
                    ) {
                        var appwriteNote = {
                            type: 'Primary',
                            message: 'Verify'
                        };
                    }else{

                        var appwriteNote = {
                            type: 'Success',
                            message: 'Complete'
                        };

                    }

                    //  If the airtime billing configuration are not set via the text editor (Not set)
                    if(
                        this.useVersionBuilder.builder.airtime_billing_connection.client_id.code_editor_mode == false && [null, ''].includes(this.useVersionBuilder.builder.airtime_billing_connection.client_id.text) ||
                        this.useVersionBuilder.builder.airtime_billing_connection.client_secret.code_editor_mode == false && [null, ''].includes(this.useVersionBuilder.builder.airtime_billing_connection.client_secret.text)
                    ) {
                        var airtimeBillingNote = {
                            type: 'Default',
                            message: 'Incomplete'
                        };

                    //  If the airtime billing configuration are set via the code editor (Verify credentials)
                    }else if(
                        this.useVersionBuilder.builder.airtime_billing_connection.client_id.code_editor_mode == true ||
                        this.useVersionBuilder.builder.airtime_billing_connection.client_secret.code_editor_mode == true
                    ) {
                        var airtimeBillingNote = {
                            type: 'Primary',
                            message: 'Verify'
                        };
                    }else{

                        var airtimeBillingNote = {
                            type: 'Success',
                            message: 'Complete'
                        };

                    }

                    //  If the sms configuration are not set via the text editor (Not set)
                    if(
                        this.useVersionBuilder.builder.sms_connection.client_credentials.code_editor_mode == false && [null, ''].includes(this.useVersionBuilder.builder.sms_connection.client_credentials.text)
                    ) {
                        var smsNote = {
                            type: 'Default',
                            message: 'Incomplete'
                        };

                    //  If the sms configuration are set via the code editor (Verify credentials)
                    }else if(
                        this.useVersionBuilder.builder.sms_connection.client_credentials.code_editor_mode == true
                    ) {
                        var smsNote = {
                            type: 'Primary',
                            message: 'Verify'
                        };
                    }else{
                        var smsNote = {
                            type: 'Success',
                            message: 'Complete'
                        };
                    }

                    const conditionalScreensNote = this.useVersionBuilder.builder.conditional_screens.active
                        ? {
                            type: 'Primary',
                            message: 'Yes'
                        }
                        : {
                            type: 'Default',
                            message: 'No'
                        };

                    const logSettingsNote =
                        this.useVersionBuilder.builder.log_settings.mobile.save_logs !== 'never' ||
                        this.useVersionBuilder.builder.log_settings.simulator.save_logs !== 'never'
                            ? {
                                type: 'Primary',
                                message: 'Enabled'
                            }
                            : {
                                type: 'Default',
                                message: 'Disabled'
                            };

                    return [
                        {
                            name: 'Global Variables',
                            onClick: () => {},
                            count: totalGlobalVariables,
                        },
                        {
                            name: 'Global Headers',
                            onClick: () => {},
                            borders: ['b'],
                            count: totalGlobalHeaders
                        },
                        {
                            name: 'Global Events',
                            onClick: () => {},
                            count: totalGlobalEvents
                        },
                        {
                            name: 'Application Events',
                            onClick: () => {},
                            borders: ['b'],
                            count: totalApplicaitonEvents
                        },
                        {
                            name: 'Global Pagination',
                            onClick: () => {},
                        },
                        {
                            name: 'Restrictions',
                            onClick: () => {},
                            note: restrictionNote
                        },
                        {
                            name: 'Select Screens Conditionally',
                            onClick: () => {},
                            note: conditionalScreensNote
                        },
                        {
                            name: 'Sms Connection',
                            onClick: () => {},
                            borders: ['t'],
                            note: smsNote

                        },
                        {
                            name: 'Firebase Connection',
                            onClick: () => {},
                            note: firebaseNote
                        },
                        {
                            name: 'AppWrite Connection',
                            onClick: () => {},
                            note: appwriteNote
                        },
                        {
                            name: 'Airtime Billing Connection',
                            onClick: () => {},
                            borders: ['b'],
                            note: airtimeBillingNote
                        },
                        {
                            name: 'Log Settings',
                            onClick: () => {},
                            note: logSettingsNote
                        },
                        {
                            name: 'Color Scheme',
                            onClick: () => {},
                        },
                    ]

                } catch (error) {

                    this.error = 'The applicaiton menus failed to load because the builder is not compatible';

                    console.log('The application encoutered an error, see the error logged below');
                    console.error(error);

                    console.log('Refer to the application builder logged below');
                    console.log(this.useVersionBuilder.builder);

                    return [];

                }
            }
        },
        mounted(){
            this.configMenus = this.getConfigMenus();
        }
    };

</script>
