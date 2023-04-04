<template>

    <RestRequest v-if="selectedTab == 2" :form="form"></RestRequest>
    <RestQuery v-else-if="selectedTab == 3" :form="form"></RestQuery>
    <RestBody v-else-if="selectedTab == 4" :form="form"></RestBody>
    <RestHeaders v-else-if="selectedTab == 5" :form="form"></RestHeaders>
    <RestResponse v-else-if="selectedTab == 6" :form="form"></RestResponse>

</template>

<script>

import RestBody from './Body';
import RestQuery from './Query';
import RestHeaders from './Headers';
import RestRequest from './Request';
import RestResponse from './Response';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { RestBody, RestQuery, RestHeaders, RestRequest, RestResponse },
    watch: {
        'form.event_data.headers': {
            handler: function (after, before) {

                this.updateTabs(this.getTabs());

            },
            deep: true
        },
        'form.event_data.query_params': {
            handler: function (after, before) {

                this.updateTabs(this.getTabs());

            },
            deep: true
        },
        'form.event_data.form_data.params': {
            handler: function (after, before) {

                this.updateTabs(this.getTabs());

            },
            deep: true
        }
    },
    methods: {
        getTabs() {
            return [
                {
                    label: 'Request'
                },
                {
                    label: 'Query',
                    count: this.form.event_data.query_params.length
                },
                {
                    label: 'Body',
                    count: this.form.event_data.form_data.params.length
                },
                {
                    label: 'Headers',
                    count: this.form.event_data.headers.length
                },
                {
                    label: 'Response'
                }
            ]
        }
    },
    created(){
        this.updateTabs(this.getTabs());
    }
}
</script>
