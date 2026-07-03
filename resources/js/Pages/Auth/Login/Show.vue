<template>

    <Head title="Sign In" />

    <div class="flex flex-row justify-center items-center">

        <div class="w-1/3 mt-24 mb-28">

            <Logo class="m-auto mb-10" width="w-32" />

            <div class="p-5 bg-white rounded-md shadow-md hover:shadow-lg">

                <!-- Title -->
                <h5 class="text-xl font-medium text-gray-900 border-b pb-5 mb-5">Sign In</h5>

                <div class="relative mb-5">

                    <!-- Loading overlay -->
                    <LoaderOverlay :show="form.processing" />

                    <!-- Sign Up form -->
                    <DefaultInput v-model="form.email" label="Email" :disabled="form.processing || form.processing" :error="form.errors.email" @keyup.enter="login()" class="mb-6"></DefaultInput>
                    <DefaultInput v-model="form.password" type="password" label="Password" :disabled="form.processing || form.processing" :error="form.errors.password" @keyup.enter="login()"></DefaultInput>

                </div>

                <div class="flex justify-end">
                    <PrimaryButton :disabled="form.processing" @click="login()">
                        Sign In
                    </PrimaryButton>
                </div>

            </div>

        </div>

    </div>

</template>

<script>

    import { useForm, Head } from '@inertiajs/vue3';

    import Logo from "@components/Logo/Logo";
    import DefaultInput from "@components/Input/DefaultInput";
    import LoaderOverlay from "@components/Loader/LoaderOverlay";
    import PrimaryButton from "@components/Button/PrimaryButton";
    import GuestDashboardLayout from '@layouts/GuestDashboard/GuestDashboardLayout.vue';

    export default {
        layout: GuestDashboardLayout,
        components: { Head, Logo, DefaultInput, LoaderOverlay, PrimaryButton },
        data() {
            return {
                form: useForm({
                    email: '',
                    password: ''
                })
            }
        },
        methods: {
            login() {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to login
                this.form.post(route('login.authenticate'), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (page) => {

                        //  An error-free Inertia visit does NOT guarantee we logged in.
                        //  An expired session/CSRF token (419) is rewritten by Inertia
                        //  into a plain redirect back to the login page that carries no
                        //  validation errors, which would otherwise fire onSuccess here.
                        //  Only treat it as a real login if we actually left the login page.
                        if (page.component === 'Auth/Login/Show') {
                            self.$message({
                                message: page.props.message || 'Your session expired, please try signing in again.',
                                type: 'warning'
                            });
                            return;
                        }

                        self.$message({
                            message: 'Logged In',
                            type: 'success'
                        });
                    },
                    onError: (errors) => {
                        self.$message({
                            message: 'Sorry, we found some mistakes',
                            type: 'error'
                        });
                    },
                });

            },
        }
    };

</script>
