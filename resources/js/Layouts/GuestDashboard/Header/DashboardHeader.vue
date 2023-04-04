<template>

    <nav class="flex justify-end px-12 bg-white shadow-md">

        <ol class="inline-flex items-center">
            <li :class="{ 'border-blue-500 bg-blue-50' : showingLogin }" class="border-b-2 border-transparent hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 text-blue-500">
                <Link :href="route('login.show')" class="flex items-center text-sm pt-4 pb-4 px-8 cursor-pointer">
                    <span>Sign In</span>
                </Link>
            </li>
            <li :class="{ 'border-blue-500 bg-blue-50' : showingRegister }" class="border-b-2 border-transparent hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 text-blue-500">
                <Link :href="route('register.show')" class="flex items-center text-sm pt-4 pb-4 px-8 cursor-pointer">
                    <span>Sign Up</span>
                </Link>
            </li>
        </ol>

    </nav>

</template>

<script>

    import { Link } from "@inertiajs/vue3";

    export default {
        components: { Link },
        data() {
            return {
                showingLogin: this.checkIfShowingSignIn(),
                showingRegister: this.checkIfShowingSignUp(),
            }
        },
        watch:{
            /**
             *  Watch for changes on the page url
             */
            '$page.url': function (newUrl, oldUrl) {
                this.showingLogin = this.checkIfShowingSignIn();
                this.showingRegister = this.checkIfShowingSignUp();
            }
        },
        methods: {
            checkIfShowingSignIn() {
                return route().current('login.show');
            },
            checkIfShowingSignUp() {
                return route().current('register.show');
            }
        }
    };

</script>
