<template>

    <div class="relative">

        <!-- Dropdown Trigger -->
        <div :id="dropdownTriggerId">

            <slot name="trigger">

                <!-- Default Dropdown Trigger -->
                <DefaultButton>
                    <span v-if="name" class="mr-2">{{ name }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </DefaultButton>

            </slot>


        </div>

        <!-- Dropdown Menu -->
        <div :id="dropdownMenuId" :class="['z-10 hidden bg-white divide-y divide-gray-100 rounded shadow', dropdownClasses]">

            <slot name="menu">

                <!-- Default Dropdown Menu -->
                <ul class="py-1 text-sm text-gray-700" aria-labelledby="dropdownButton">

                    <!-- Custom menus to add to the top -->
                    <slot name="prependMenus"></slot>

                    <!-- Menus to add -->
                    <li v-for="(menu, index) in menus" :key="index">
                        <span :class="['block px-4 py-2 hover:bg-gray-100 cursor-pointer', setBorders(menu)]" @click="onSelect(menu, index)">{{ menu.label }}</span>
                    </li>

                    <!-- Custom menus to add to the bottom -->
                    <slot name="appendMenus"></slot>

                </ul>

            </slot>

        </div>

    </div>

</template>

<script>

    import DefaultButton from './../Button/DefaultButton';

    export default {
        components: { DefaultButton },
        props: {
            name: String,
            menus: {
                type: Array,
                default: () => {
                    return []
                }
            },
            dropdownClasses: {
                type: String,
                default: 'w-44'
            },
            placement: {
                type: String,
                default: 'bottom-end',
                validator(value) {
                    // The value must match one of these strings
                    return [
                        'top', 'top-start', 'top-end',
                        'left', 'left-start', 'left-end',
                        'right', 'right-start', 'right-end',
                        'bottom', 'bottom-start', 'bottom-end',
                    ].includes(value)
                }
            }
        },
        data(){
            return {
                dropdown: null,
                dropdownMenuId: 'dropdown_menu_' + this.generateId(),
                dropdownTriggerId: 'dropdown_trigger_' + this.generateId(),
            }
        },
        methods: {
            generateId(){
                return Math.floor(Math.random() * 100);
            },
            setBorders(menu){
                if(menu.borders && menu.borders.length) {

                    var borders = '';

                    for (let index = 0; index < menu.borders.length; index++) {
                        borders += ' border-'+menu.borders[index];
                    }

                    return borders;

                }

                return '';
            },
            onSelect(menu, index){
                this.$emit('onSelect', menu, index);

                //  If the menu has an onclick method, execute the method
                if(menu.onclick) menu.onclick();

                //  Force hide the dropdown
                this.dropdown.hide();
            }
        },
        mounted() {

            // set the dropdown menu element
            const targetEl = document.getElementById(this.dropdownMenuId);

            // set the element that trigger the dropdown menu on click
            const triggerEl = document.getElementById(this.dropdownTriggerId);

            // Dropdown options with default values
            const options = {
                placement: this.placement,
                onHide: () => {
                    this.$emit('onHide');
                },
                onShow: () => {
                    this.$emit('onShow');
                }
            };

            this.dropdown = new Dropdown(targetEl, triggerEl, options);

        }
    }
</script>
