<template>

    <TerminateSessionSettings v-if="selectedTab == 2" :form="form"></TerminateSessionSettings>

</template>

<script>

import TerminateSessionSettings from './Settings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { TerminateSessionSettings },
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
