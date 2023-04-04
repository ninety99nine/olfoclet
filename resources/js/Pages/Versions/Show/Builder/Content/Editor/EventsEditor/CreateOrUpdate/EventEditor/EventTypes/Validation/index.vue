<template>

    <ValidationSettings v-if="selectedTab == 2" :form="form"></ValidationSettings>

</template>

<script>

import ValidationSettings from './Settings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { ValidationSettings },
    watch: {
        'form.event_data.rules': {
            handler: function (after, before) {

                this.updateTabs(this.getTabs());

            },
            deep: true
        }
    },
    methods: {
        getTabs() {

            const total = this.form.event_data.rules.length;
            const count = total == 0 ? 'No Rules' : total + (total == 1 ? ' Rule' : ' Rules');

            return [
                {
                    label: 'Settings',
                    count: count
                }
            ]
        }
    },
    created(){
        this.updateTabs(this.getTabs());
    }
}
</script>
