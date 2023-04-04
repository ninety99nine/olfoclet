<template>

    <div>
        <div class="flex items-center">

            <!-- Icons -->
            <svg v-if="title == 'Sms Connection'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <svg v-else-if="title == 'Restrictions'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
            <svg v-else-if="title == 'Firebase Connection'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
            <svg v-else-if="title == 'AppWrite Connection'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <svg v-else-if="title == 'Airtime Billing Connection'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="title == 'Global Pagination'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg v-else-if="title == 'Select Screens Conditionally'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>

            <!-- Title -->
            <h1 class="text-md font-semibold text-gray-600 ml-2">{{ title }}</h1>

        </div>

        <!-- Description -->
        <p class="text-xs text-gray-500 mt-4 text-justify border-y border-dotted py-6 my-6">

            <!-- Description Snipit -->
            <template v-for="(descriptionSnipet, index) in descriptionSnipets" :key="index">
                <template v-for="(snipitInfo, snipitType) in descriptionSnipet" :key="snipitInfo">

                    <!-- Ordinary Text-->
                    <span v-if="snipitType == 'text'">{{ snipitInfo }}</span>

                    <!-- Higlighted Text-->
                    <span v-else-if="snipitType == 'bold'" class="text-gray-700 font-bold">{{ snipitInfo }}</span>

                    <!-- Higlighted Text-->
                    <span v-else-if="snipitType == 'highlight'" class="text-blue-500 font-semibold">{{ snipitInfo }}</span>

                    <!-- Link Text-->
                    <span class="inline-flex items-center mx-1" v-else-if="snipitType == 'link'" >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <a :href="snipitInfo.href" class="text-blue-500 font-semibold hover:underline hover:text-blue-600" target="_blank">{{ snipitInfo.text }}</a>
                    </span>

                    <!-- Break Line -->
                    <template v-if="snipitType == 'break'">
                        <br v-for="index in snipitInfo" :key="index" />
                    </template>

                </template>
            </template>

        </p>

    </div>

</template>

<script>
    import DefaultInput from '@components/Input/DefaultInput';
    import { useVersionBuilder } from '@stores/VersionBuilder';

    export default {
        components: { DefaultInput },
        data(){
            return {
                useVersionBuilder: useVersionBuilder()
            }
        },
        computed: {
            title(){
                return this.useVersionBuilder.selectedConfigMenu;
            },
            descriptionSnipets(){

                if( this.title == 'Airtime Billing Connection' ) {
                    return [
                        {
                            text: 'Use '
                        },
                        {
                            highlight: 'Airtime Billing Connection',
                        },
                        {
                            text: ' to setup the Airtime Billing account credentials.'
                        },
                        {
                            break: 3
                        },
                        {
                            text: 'This can be used for any of the following uses:'
                        },
                        {
                            break: 2
                        },
                        {
                            text: '(1) To bill subscribers on their '
                        },
                        {
                            bold: 'postpaid / prepaid'
                        },
                        {
                            text: ' airtime balance'
                        },
                        {
                            break: 2
                        },
                        {
                            text: '(2) To query the '
                        },
                        {
                            highlight: 'Usage Consumption'
                        },
                        {
                            text: ' (Information on the airtime balance, data balance and sms quantities remaining)'
                        },
                        {
                            break: 2
                        },
                        {
                            text: '(3) To query the '
                        },
                        {
                            highlight: 'Product Inventory'
                        },
                        {
                            text: ' (Information on the mobile number status such as '
                        },
                        {
                            bold: 'active / inactive'
                        },
                        {
                            text: ' or rating type such as '
                        },
                        {
                            bold: 'prepaid / postpaid'
                        },
                        {
                            text: ')'
                        },
                    ];
                }else if( this.title == 'Global Variables' ) {
                    return [
                        {
                            text: 'Use '
                        },
                        {
                            highlight: 'Global Variables',
                        },
                        {
                            text: ' to set initial variables on every running session'
                        }
                    ]
                }else if( this.title == 'Global Events' ) {
                    return [
                        {
                            text: 'Use '
                        },
                        {
                            highlight: 'Global Events',
                        },
                        {
                            text: ' to share events between application lifecycle stages, screens or displays'
                        }
                    ]
                }else if( this.title == 'Application Events' ) {
                    return [
                        {
                            text: 'Use '
                        },
                        {
                            highlight: 'Application Events',
                        },
                        {
                            text: ' to run events at various instances of the application lifecycle'
                        }
                    ]
                }else if( this.title == 'Global Pagination' ) {
                    return [
                        {
                            text: 'Use '
                        },
                        {
                            highlight: 'Global Pagination',
                        },
                        {
                            text: ' to set the default pagination settings for content on displays'
                        }
                    ]
                }else if( this.title == 'Firebase Connection' ) {
                    return [
                        {
                            text: 'Connect to your '
                        },
                        {
                            highlight: 'Firebase project',
                        },
                        {
                            break: 2
                        },
                        {
                            text: 'Download the service account file from the  '
                        },
                        {
                            link: {
                                text: 'Firebase Console',
                                href: 'https://console.firebase.google.com'
                            },
                        },
                        {
                            break: 2
                        },
                        {
                            text: 'Read the following '
                        },
                        {
                            link: {
                                text: 'Article',
                                href: 'https://support.google.com/firebase/answer/7015592?hl=en#zippy=%2Cin-this-article'
                            },
                        },
                        {
                            text: 'or watch the following '
                        },
                        {
                            link: {
                                text: 'Youtube Video',
                                href: 'https://www.youtube.com/watch?v=qXFJ6E1D-c8'
                            },
                        },
                        {
                            text: ' for more information'
                        },
                    ]
                }else if( this.title == 'AppWrite Connection' ) {
                    return [
                        {
                            text: 'Login to your '
                        },
                        {
                            highlight: 'AppWrite dashboard',
                        },
                        {
                            text: ', then navigate to '
                        },
                        {
                            highlight: 'Settings',
                        },
                        {
                            text: ' to acquire the '
                        },
                        {
                            highlight: 'Project ID',
                        },
                        {
                            text: ' and the '
                        },
                        {
                            highlight: 'Api Endpoint.',
                        },
                        {
                            break: 2
                        },
                        {
                            text: 'Navigate to the '
                        },
                        {
                            highlight: 'API keys',
                        },
                        {
                            text: ' menu to add a new API Key.'
                        },
                        {
                            break: 2
                        },
                        {
                            text: 'Refer to the '
                        },
                        {
                            link: {
                                text: 'AppWrite Docs',
                                href: 'https://appwrite.io/docs'
                            },
                        },
                        {
                            text: ' to learn more.'
                        }
                    ]
                }else if( this.title == 'Sms Connection' ) {
                    return [
                        {
                            text: 'Use '
                        },
                        {
                            highlight: 'SMS Connection '
                        },
                        {
                            text: 'to setup the '
                        },
                        {
                            highlight: 'SMPP Account Credentials '
                        },
                        {
                            text: 'in order to send SMS '
                        },
                    ]
                }else if( this.title == 'Restrictions' ) {
                    return [
                        {
                            text: 'Use '
                        },
                        {
                            highlight: 'Restrictions '
                        },
                        {
                            text: 'to '
                        },
                        {
                            highlight: 'Grant '
                        },
                        {
                            text: 'or '
                        },
                        {
                            highlight: 'Block '
                        },
                        {
                            text: 'application access to specific mobile numbers'
                        }
                    ]
                }else if( this.title == 'Select Screens Conditionally' ) {
                    return [
                        {
                            text: 'Conditionally determine the first screen to load everytime the application is launched'
                        }
                    ]
                }else if( this.title == 'Color Scheme' ) {
                    return [
                        {
                            text: 'Use '
                        },
                        {
                            highlight: 'Color Scheme',
                        },
                        {
                            text: ' to set the default colors for highlighting related events'
                        }
                    ]
                }else if( this.title == 'Log Settings' ) {
                    return [
                        {
                            text: 'Use '
                        },
                        {
                            highlight: 'Log Settings',
                        },
                        {
                            text: ' to determine when to save the session logs'
                        }
                    ]
                }
            }
        }
    };

</script>
