<template>

    <ul>
        <li v-for="(setting, index) in settings" :key="index" :class="setting.name === 'space' ? [] : ['px-4 py-3 cursor-pointer hover:bg-white active:bg-blue-50 hover:border-l-blue-500 border-b-gray-300 border-l-2 text-xs', setting.route === route().current() ? 'bg-white border-l-blue-500' : 'border-l-transparent']"
            @click="$inertia.get(route(setting.route))">

            <div v-if="setting.name === 'space'" class="my-2 border-b"></div>

            <div v-else class="flex items-center">
                <svg v-if="setting.name === 'Account'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-if="setting.name === 'Users'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <svg v-else-if="setting.name === 'Notifications'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <svg v-else-if="setting.name === 'Server Commands'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <svg v-else-if="setting.name === 'Server Status'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <svg v-else-if="setting.name === 'Server Logs'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg v-else-if="setting.name === 'Enviroment Configurations'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span>{{ setting.name }}</span>
            </div>

        </li>
    </ul>

</template>

<script>

    export default {
        data() {
            return {
                settings: [
                    {
                        name: 'Account',
                        route: 'settings.account',
                        classes: ['border-b', 'mb-4']
                    },
                    {
                        name: 'space'
                    },
                    {
                        name: 'Users',
                        route: 'settings.users'
                    },
                    {
                        name: 'Notifications',
                        route: 'settings.notifications',
                        classes: ['border-b', 'mb-4']
                    },
                    {
                        name: 'space'
                    },
                    {
                        name: 'Server Logs',
                        route: 'settings.server.logs'
                    },
                    {
                        name: 'Server Status',
                        route: 'settings.server.status'
                    },
                    {
                        name: 'Server Commands',
                        route: 'settings.server.commands'
                    },
                    {
                        name: 'Enviroment Configurations',
                        route: 'settings.enviroment.configurations'
                    },


                ]
            }
        }
    };

</script>
