<template>

    <SetPropertySettings v-if="selectedTab == 2" :form="form"></SetPropertySettings>

</template>

<script>

import SetPropertySettings from './Settings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { SetPropertySettings },
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
