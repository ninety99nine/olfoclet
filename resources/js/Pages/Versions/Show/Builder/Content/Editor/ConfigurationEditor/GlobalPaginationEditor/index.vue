<template>

    <PaginationEditor :global="true" :pagination="globalPagination"></PaginationEditor>

</template>

<script>

import { useVersionBuilder } from "@stores/VersionBuilder";
import PaginationEditor from '@paginationEditor'

export default {
    components: { PaginationEditor },
    data() {
        return {
            useVersionBuilder: useVersionBuilder()
        }
    },
    computed: {
        globalPagination() {
            return this.useVersionBuilder.builder.global_pagination
        }
    }
}
</script>
