<template>

    <RedirectSettings v-if="selectedTab == 2" :form="form"></RedirectSettings>

</template>

<script>

import RedirectSettings from './Settings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { RedirectSettings },
    data() {
        return {
            totalScreens: 0,
            totalDisplays: 0
        }
    },
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
