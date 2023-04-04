<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        primaryText="Copy Properties"
        :primaryAction="copyProperties">

        <!-- Modal Title -->
        <template v-slot:title>Copy Properties</template>

        <div class="grid grid-cols-3 gap-4">
            <div v-for="(property, index) in properties" :key="index" @click="toggleSelection(index)" class="col-span-1 relative flex items-center justify-center bg-gray-50 border hover:bg-blue-50 hover:border-blue-200 active:bg-blue-100 active:border-blue-400 hover:shadow-md rounded-md py-10 text-xs text-gray-800 cursor-pointer">
                <span v-if="properties[index].selected" class="absolute top-2 right-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
                <div>
                    <p>{{ property.name }}</p>
                </div>
            </div>
        </div>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <li class="block px-4 py-2 hover:bg-gray-100 cursor-pointer" name="trigger">
                <span>Copy Properties</span>
            </li>

        </template>

    </DefaultModal>

</template>

<script>

    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import PrimaryButton from "@components/Button/PrimaryButton";

    export default {
        components: { DefaultModal, PrimaryButton },
        data() {
            return {
                properties: [
                    {
                        name: 'Displays',
                        value: 'displays',
                        selected: false,
                    },
                    {
                        name: 'Events',
                        value: 'events',
                        selected: false,
                    },
                    {
                        name: 'Markers',
                        value: 'markers',
                        selected: false,
                    },
                    {
                        name: 'Repeat',
                        value: 'repeat',
                        selected: false,
                    }
                ],
                screen: useVersionBuilder().selectedScreen
            }
        },
        methods: {
            toggleSelection(index) {
                this.properties[index].selected = !this.properties[index].selected;
            },
            copyProperties(closeModal) {

                var screenProperties = {};

                for (let index = 0; index < this.properties.length; index++) {

                    var propertyValue = this.properties[index].value;
                    var propertySelected = this.properties[index].selected;

                    if( propertySelected ) {

                        screenProperties[propertyValue] = this.screen[propertyValue];

                    }

                }

                //  Reset the selected properties
                this.properties.forEach((property) => {
                    property.selected = false;
                });

                //  Store the screen properties
                window.localStorage.setItem('screen_properties', JSON.stringify(screenProperties));

                this.$message({
                    message: 'Screen properties copied',
                    type: 'success'
                });

                closeModal();

            }
        }
    };

</script>
