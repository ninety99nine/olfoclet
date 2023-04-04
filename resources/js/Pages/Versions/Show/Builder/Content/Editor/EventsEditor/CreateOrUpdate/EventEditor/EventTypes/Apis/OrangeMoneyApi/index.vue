<template>

    <OrangeMoneySettings v-if="selectedTab == 2" :form="form"></OrangeMoneySettings>

</template>

<script>

import OrangeMoneySettings from './Settings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { OrangeMoneySettings },
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
