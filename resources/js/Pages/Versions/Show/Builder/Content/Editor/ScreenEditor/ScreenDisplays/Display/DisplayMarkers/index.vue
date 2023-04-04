<template>

    <div>
        <MarkersEditor v-model="display.content.markers"></MarkersEditor>
    </div>

</template>

<script>

import MarkersEditor from "@markersEditor";

export default {
    props: ['display'],
    components: { MarkersEditor }
}
</script>
