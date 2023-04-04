<template>

    <EventCollectionSettings v-if="selectedTab == 2" :form="form"></EventCollectionSettings>

</template>

<script>

import EventCollectionSettings from './Settings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { EventCollectionSettings },
    methods: {
        getTabs() {

            const total = this.form.event_data.events.collection.length;
            const count = total == 0 ? 'No Events' : total + (total == 1 ? ' Event' : ' Events');

            return [
                {
                    label: 'Settings',
                    count: count
                }
            ];
        }
    },
    watch:{
        'form.event_data.events': {
            handler: function (after, before) {
                this.updateTabs(this.getTabs());
            },
            deep: true
        }
    },
    created(){
        this.updateTabs(this.getTabs());
    }
}
</script>
