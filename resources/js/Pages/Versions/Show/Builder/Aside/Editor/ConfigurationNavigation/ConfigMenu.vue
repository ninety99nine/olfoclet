<template>

    <!-- Configuration Menu -->
    <li @click="onClick" :class="setBorders()">
        <div :class="['group overflow-hidden text-xs text-gray-700 flex justify-between border rounded-md cursor-pointer relative p-2 mb-1 hover:bg-blue-50 hover:border-blue-300 hover:shadow', active ? 'border-blue-300 bg-blue-100 shadow' : 'border-transparent' ]">
            <div class="flex justify-between w-full">

                <div class="flex">
                    <!-- Icons -->
                    <svg v-if="configMenu.name == 'Sms Connection'" xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 mr-2', active ? 'text-blue-500' : 'text-gray-400']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <svg v-else-if="configMenu.name == 'Restrictions'" xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 mr-2', active ? 'text-blue-500' : 'text-gray-400']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                    <svg v-else-if="configMenu.name == 'Firebase Connection'" xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 mr-2', active ? 'text-blue-500' : 'text-gray-400']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                    <svg v-else-if="configMenu.name == 'AppWrite Connection'" xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 mr-2', active ? 'text-blue-500' : 'text-gray-400']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    <svg v-else-if="configMenu.name == 'Airtime Billing Connection'" xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 mr-2', active ? 'text-blue-500' : 'text-gray-400']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else-if="configMenu.name == 'Global Pagination'" xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 mr-2', active ? 'text-blue-500' : 'text-gray-400']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <svg  v-else-if="configMenu.name == 'Select Screens Conditionally'" xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 mr-2', active ? 'text-blue-500' : 'text-gray-400']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg v-else-if="configMenu.name == 'Json File'" xmlns="http://www.w3.org/2000/svg" :class="['h-4 w-4 mr-2', active ? 'text-blue-500' : 'text-gray-400']" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>

                    <!-- Name -->
                    <span v-if="configMenu.name" :class="{ 'text-blue-500 font-semibold': active }">{{ configMenu.name }}</span>
                </div>

                <!-- Counter -->
                <NumberBadge v-if="configMenu.count" :count="configMenu.count" :active="active" class="absolute top-1 right-2"></NumberBadge>

                <!-- Badge Note -->
                <component v-if="configMenu.note" :is="configMenu.note.type+'Badge'" class="absolute transition-all duration-500 top-1.5 right-0 opacity-100 group-hover:-right-24">
                    {{ configMenu.note.message }}
                </component>

            </div>
        </div>
    </li>

</template>

<script>

    import { useVersionBuilder } from '@stores/VersionBuilder';
    import SuccessBadge from '@components/Badges/SuccessBadge';
    import WarningBadge from '@components/Badges/WarningBadge';
    import PrimaryBadge from '@components/Badges/PrimaryBadge';
    import DefaultBadge from '@components/Badges/DefaultBadge';
    import DangerBadge from '@components/Badges/DangerBadge';
    import NumberBadge from '@components/Badges/NumberBadge';

    export default {
        props: ['configMenus', 'configMenu', 'index'],
        components: { SuccessBadge, WarningBadge, PrimaryBadge, DefaultBadge, DangerBadge, NumberBadge, },
        data(){
            return {
                useVersionBuilder: useVersionBuilder()
            }
        },
        computed: {
            active() {
                return this.useVersionBuilder.selectedConfigMenu == this.configMenu.name
            }
        },
        methods: {
            onClick() {
                this.useVersionBuilder.selectConfigMenu(this.configMenu.name);
            },
            setBorders(){
                if(this.configMenu.borders && this.configMenu.borders.length) {

                    var borders = '';

                    for (let index = 0; index < this.configMenu.borders.length; index++) {
                        if( this.configMenu.borders[index] == 't' ) {

                            borders += ' mt-2 pt-2 border-dashed border-'+this.configMenu.borders[index];

                        }else if( this.configMenu.borders[index] == 'b' ) {

                        borders += ' mb-2 pb-2 border-dashed border-'+this.configMenu.borders[index];

                        }
                    }

                    return borders;

                }

                return '';
            },
        }
    };

</script>
