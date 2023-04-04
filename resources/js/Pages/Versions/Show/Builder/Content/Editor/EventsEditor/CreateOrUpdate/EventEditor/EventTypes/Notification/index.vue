<template>

    <NotificationSettings v-if="selectedTab == 2" :form="form"></NotificationSettings>

</template>

<script>

import NotificationSettings from './Settings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { NotificationSettings },
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
