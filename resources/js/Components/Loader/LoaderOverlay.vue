<template>
    <Transition name="fade">
        <div v-if="show" :class="'absolute inset-0 z-50 '+bg+' flex items-center justify-center'">
            <Loader :show="show">
                <slot></slot>
            </Loader>
        </div>
    </Transition>
</template>

<script>

import Loader from './Loader';

export default {
    components: { Loader },
    props: {
        bg: {
            type: String,
            default: 'bg-white/75'
        },
        show: {
            type: Boolean,
            default: true
        },
    }
}
</script>

<style>

</style>>
