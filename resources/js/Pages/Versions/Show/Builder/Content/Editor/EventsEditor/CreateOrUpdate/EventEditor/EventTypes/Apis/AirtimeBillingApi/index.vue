<template>

    <Settings v-if="selectedTab == 2" :form="form"></Settings>
    <OptionalSettings v-if="selectedTab == 3" :form="form"></OptionalSettings>

</template>

<script>

import Settings from './Settings';
import OptionalSettings from './OptionalSettings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { Settings, OptionalSettings },
    watch: {
        'form.event_data.airtime_billing_action': {
            handler: function (after, before) {

                this.updateTabs(this.getTabs());

            },
            deep: true
        }
    },
    methods: {
        getTabs() {
            var tabs = [
                {
                    label: 'Settings'
                }
            ]

            //  If we are deducting fees
            if( this.form.event_data.airtime_billing_action == 'deduct_fee' ) {

                //  Add the optional settings tab
                tabs.push({
                    label: 'Optional'
                });

            }

            return tabs;
        }
    },
    created(){
        this.updateTabs(this.getTabs());
    }
}
</script>
