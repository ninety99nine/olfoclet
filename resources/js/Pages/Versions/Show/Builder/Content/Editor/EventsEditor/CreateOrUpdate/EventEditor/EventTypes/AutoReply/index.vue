<template>

    <AutoReplySettings v-if="selectedTab == 2" :form="form"></AutoReplySettings>

</template>

<script>

import AutoReplySettings from './Settings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { AutoReplySettings },
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
