<template>

    <CustomCodeSettings v-if="selectedTab == 2" :form="form"></CustomCodeSettings>

    <!-- Use "v-show" instead of "v-if" so that the total variables and total methods can be counted  -->
    <CustomCodeVariables v-show="selectedTab == 3" @updateCount="updateCount('variables', $event)"></CustomCodeVariables>
    <CustomCodeMethods v-show="selectedTab == 4" @updateCount="updateCount('methods', $event)"></CustomCodeMethods>

</template>

<script>

import CustomCodeMethods from './Methods';
import CustomCodeSettings from './Settings';
import CustomCodeVariables from './Variables';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { CustomCodeMethods, CustomCodeSettings, CustomCodeVariables },
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
                    label: 'Variables',
                    count: this.totalVariables
                },
                {
                    label: 'Methods',
                    count: this.totalMethods
                }
            ]
        },
        updateCount(type, count) {
            if( type == 'variables' && count !== this.totalVariables) {

                this.totalVariables = count;
                this.updateTabs(this.getTabs());

            }else if( type == 'methods' && count !== this.totalMethods) {

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
