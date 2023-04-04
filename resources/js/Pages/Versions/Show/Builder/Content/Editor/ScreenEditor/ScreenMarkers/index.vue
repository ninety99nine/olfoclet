<template>

    <MarkersEditor v-model="markers"></MarkersEditor>

</template>

<script>

import MarkersEditor from "@markersEditor";
import { useVersionBuilder } from '@stores/VersionBuilder';

export default {
    components: { MarkersEditor },
    data() {
        return {
            useVersionBuilder: useVersionBuilder()
        }
    },
    computed: {
        markers: {
            get() {
                return this.useVersionBuilder.selectedScreen.markers;
            },
            set(markers) {
                return this.useVersionBuilder.selectedScreen.markers = markers;
            }
        }
    }
}
</script>
