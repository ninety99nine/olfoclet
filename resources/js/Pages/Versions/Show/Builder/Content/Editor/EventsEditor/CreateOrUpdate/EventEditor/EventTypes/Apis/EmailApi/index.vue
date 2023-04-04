<template>

    <MessageSettings v-if="selectedTab == 2" :form="form"></MessageSettings>
    <SenderAndRecipientSettings v-if="selectedTab == 3" :form="form"></SenderAndRecipientSettings>

</template>

<script>

import MessageSettings from './Message';
import SenderAndRecipientSettings from './SenderAndRecipient';

export default {
    props: ['form', 'selectedTab', 'updateTabs'],
    components: { SenderAndRecipientSettings, MessageSettings },
    methods: {
        getTabs() {
            return [
                {
                    label: 'Message'
                },
                {
                    label: 'Sender / Recipient'
                }
            ]
        }
    },
    created(){
        this.updateTabs(this.getTabs());
    }
}
</script>
