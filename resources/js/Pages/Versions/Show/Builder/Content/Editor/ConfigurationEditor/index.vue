<template>

    <AirtimeBillingConnectionEditor v-if="useVersionBuilder.selectedConfigMenu == 'Airtime Billing Connection'"></AirtimeBillingConnectionEditor>
    <ConditionalScreenEditor v-else-if="useVersionBuilder.selectedConfigMenu == 'Select Screens Conditionally'"></ConditionalScreenEditor>
    <AppWriteConnectionEditor v-else-if="useVersionBuilder.selectedConfigMenu == 'AppWrite Connection'"></AppWriteConnectionEditor>
    <FirebaseConnectionEditor v-else-if="useVersionBuilder.selectedConfigMenu == 'Firebase Connection'"></FirebaseConnectionEditor>
    <ApplicationEventsEditor v-else-if="useVersionBuilder.selectedConfigMenu == 'Application Events'"></ApplicationEventsEditor>
    <GlobalPaginationEditor v-else-if="useVersionBuilder.selectedConfigMenu == 'Global Pagination'"></GlobalPaginationEditor>
    <GlobalVariablesEditor v-else-if="useVersionBuilder.selectedConfigMenu == 'Global Variables'"></GlobalVariablesEditor>
    <SmsConnectionEditor v-else-if="useVersionBuilder.selectedConfigMenu == 'Sms Connection'"></SmsConnectionEditor>
    <GlobalEventsEditor v-else-if="useVersionBuilder.selectedConfigMenu == 'Global Events'"></GlobalEventsEditor>
    <RestrictionEditor v-else-if="useVersionBuilder.selectedConfigMenu == 'Restrictions'"></RestrictionEditor>
    <ColorSchemeEditor v-else-if="useVersionBuilder.selectedConfigMenu == 'Color Scheme'"></ColorSchemeEditor>
    <LogSettingsEditor v-else-if="useVersionBuilder.selectedConfigMenu == 'Log Settings'"></LogSettingsEditor>

</template>

<script>

    import LogSettingsEditor from "./LogSettingsEditor";
    import RestrictionEditor from "./RestrictionEditor";
    import ColorSchemeEditor from "./ColorSchemeEditor";
    import GlobalEventsEditor from "./GlobalEventsEditor";
    import SmsConnectionEditor from "./SmsConnectionEditor";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import GlobalVariablesEditor from "./GlobalVariablesEditor";
    import GlobalPaginationEditor from "./GlobalPaginationEditor";
    import ConditionalScreenEditor from "./ConditionalScreenEditor";
    import ApplicationEventsEditor from "./ApplicationEventsEditor";
    import AppWriteConnectionEditor from "./AppWriteConnectionEditor";
    import FirebaseConnectionEditor from "./FirebaseConnectionEditor";
    import AirtimeBillingConnectionEditor from "./AirtimeBillingConnectionEditor";

    export default {
        components: { LogSettingsEditor, RestrictionEditor, ColorSchemeEditor, SmsConnectionEditor, GlobalVariablesEditor, GlobalPaginationEditor, GlobalEventsEditor, ConditionalScreenEditor, ApplicationEventsEditor, AirtimeBillingConnectionEditor, AppWriteConnectionEditor, FirebaseConnectionEditor },
        data(){
            return {
                useVersionBuilder: useVersionBuilder()
            }
        }
    };

</script>
