<template>

    <div>

        <Teleport to="body">

            <Transition name="fade">
                <div v-if="isOpen" class="animated fadeInUp fixed inset-0 z-40 overflow-y-auto overflow-x-hidden h-full flex justify-center items-center bg-blue-900/50">
                    <div :class="['p-4', 'm-auto', width]">
                        <div class="relative bg-white rounded-lg shadow">

                            <div class="flex justify-between items-start p-5 rounded-t border-b">
                                <h3 class="text-xl font-medium text-gray-900">

                                    <!-- Title Slot -->
                                    <slot name="title">Title</slot>

                                </h3>
                                <button @click.stop="fireDefaultAction()" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="defaultModal">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                </button>
                            </div>

                            <div class="p-6">

                                <!-- Loading overlay -->
                                <LoaderOverlay :show="isLoading" />

                                <p class="text-sm leading-relaxed text-gray-500">

                                    <!-- Body Slot -->
                                    <slot :fireDefaultAction="fireDefaultAction" :firePrimaryAction="firePrimaryAction" :fireDangerAction="fireDangerAction">
                                        Content
                                    </slot>

                                </p>

                            </div>

                            <div class="border-gray-200 border-t flex justify-end py-6 px-6">
                                <DefaultButton v-if="defaultText" @click.stop="fireDefaultAction()" :disabled="isLoading" class="ml-2">{{ defaultText }}</DefaultButton>
                                <DangerButton v-if="dangerText" @click.stop="fireDangerAction()" :disabled="isLoading" class="ml-2">{{ dangerText }}</DangerButton>
                                <PrimaryButton v-if="primaryText" @click.stop="firePrimaryAction()" :disabled="isLoading" class="ml-2">{{ primaryText }}</PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>

        </Teleport>

        <div @click.stop="open">
            <slot name="trigger"></slot>
        </div>
    </div>

</template>

<script>
    import DangerButton from "./../Button/DangerButton";
    import DefaultButton from "./../Button/DefaultButton";
    import LoaderOverlay from "./../Loader/LoaderOverlay";
    import PrimaryButton from "./../Button/PrimaryButton";

    export default {
        props: {
            width: {
                type: String,
                default: 'w-2/5'
            },
            defaultText: String,
            defaultAction: {
                type: Function,
                default: () => {}
            },

            dangerText: String,
            dangerAction: {
                type: Function,
                default: () => {}
            },

            primaryText: String,
            primaryAction: {
                type: Function,
                default: () => {}
            },

            isLoading: {
                type: Boolean,
                default: false
            }
        },
        components: { DangerButton, PrimaryButton, DefaultButton, LoaderOverlay },
        data() {
            return {
                isOpen: false
            }
        },
        methods: {
            open() {
                this.$emit('open');
                this.isOpen = true
            },
            close() {
                this.$emit('close');
                this.isOpen = false;
            },
            fireDefaultAction() {
                this.defaultAction();

                //  Always close after the default action
                this.close();
            },
            firePrimaryAction() {
                this.primaryAction(
                    /**
                     *  Pass the close method as a parameter.
                     *  This allows the primaryAction to
                     *  receive this method a parameter
                     *  that can be executed later
                     */
                    this.close
                );
            },
            fireDangerAction() {
                this.dangerAction(
                    /**
                     *  Pass the close method as a parameter.
                     *  This allows the dangerAction to
                     *  receive this method a parameter
                     *  that can be executed later
                     */
                    this.close
                );
            }
        }
    };
</script>
