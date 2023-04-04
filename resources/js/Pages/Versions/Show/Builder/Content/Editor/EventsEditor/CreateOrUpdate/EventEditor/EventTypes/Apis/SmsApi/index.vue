<template>

    <SmsSettings v-if="selectedTab == 2" :form="form"></SmsSettings>

</template>

<script>

import SmsSettings from './Settings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { SmsSettings },
    methods: {
        getTabs() {
            return [
                {
                    label: 'Settings'
                }
            ]
        }
    },
    created(){
        this.updateTabs(this.getTabs());
    }
}
</script>
