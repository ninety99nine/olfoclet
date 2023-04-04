<template>

    <PaginationEditor :global="false" :pagination="display.content.pagination" class="mb-6"></PaginationEditor>

</template>

<script>

import PaginationEditor from '@paginationEditor'

export default {
    props: ['display'],
    components: { PaginationEditor }
}
</script>
