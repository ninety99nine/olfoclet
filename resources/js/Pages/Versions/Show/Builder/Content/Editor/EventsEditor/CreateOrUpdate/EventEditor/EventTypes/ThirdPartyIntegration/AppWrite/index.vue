<template>

    <AppWriteSettings v-if="selectedTab == 2" :form="form"></AppWriteSettings>

    <!-- Use "v-show" instead of "v-if" so that the total variables and total methods can be counted  -->
    <AppWriteMethods v-show="selectedTab == 3" @updateCount="updateCount('methods', $event)"></AppWriteMethods>

</template>

<script>

import AppWriteMethods from './Methods';
import AppWriteSettings from './Settings';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { AppWriteMethods, AppWriteSettings },
    data() {
        return {
            totalVariables: 0,
            totalMethods: 0,
        }
    },
    methods: {
        getTabs() {
            return [
                {
                    label: 'Settings'
                },
                {
                    label: 'Methods',
                    count: this.totalMethods
                }
            ]
        },
        updateCount(type, count) {
            if( type == 'methods' && count !== this.totalMethods) {

                this.totalMethods = count;
                this.updateTabs(this.getTabs());

            }
        }
    },
    created(){
        this.updateTabs(this.getTabs());
    }
}
</script>
