<template>

    <AutoLinkSettings v-if="selectedTab == 2" :form="form"></AutoLinkSettings>

    <!-- Use "v-show" instead of "v-if" so that the total screens can be counted  -->
    <AutoLinkScreens v-show="selectedTab == 3" @updateCount="updateCount('screens', $event)"></AutoLinkScreens>

    <!-- Use "v-show" instead of "v-if" so that the total displays can be counted  -->
    <AutoLinkDisplays v-show="selectedTab == 4" @updateCount="updateCount('displays', $event)"></AutoLinkDisplays>

</template>

<script>

import AutoLinkSettings from './Settings';
import AutoLinkScreens from '@eventsEditor/CreateOrUpdate/EventEditor/Components/ScreenList';
import AutoLinkDisplays from '@eventsEditor/CreateOrUpdate/EventEditor/Components/DisplayList';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { AutoLinkScreens, AutoLinkDisplays, AutoLinkSettings },
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
                },
                {
                    label: 'Screens',
                    count: this.totalScreens
                },
                {
                    label: 'Displays',
                    count: this.totalDisplays
                }
            ]
        },
        updateCount(type, count) {

            if( type == 'screens' && count !== this.totalScreens) {

                this.totalScreens = count;
                this.updateTabs(this.getTabs());

            }else if( type == 'displays' && count !== this.totalDisplays) {

                this.totalDisplays = count;
                this.updateTabs(this.getTabs());

            }

        }
    },
    created(){
        this.updateTabs(this.getTabs());
    }
}
</script>
