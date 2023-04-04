<template>

    <DatabaseSettings v-if="selectedTab == 2" :form="form"></DatabaseSettings>

</template>

<script>

import DatabaseSettings from './Settings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { DatabaseSettings },
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
