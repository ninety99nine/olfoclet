<template>

    <Head title="Sign Up" />

    <div class="flex flex-row justify-center items-center">

        <div class="w-1/3 mt-24 mb-28">

            <Logo class="m-auto mb-10" width="w-32" />

            <div class="p-5 bg-white rounded-md shadow-md hover:shadow-lg">

                <!-- Title -->
                <h5 class="text-xl font-medium text-gray-900 border-b pb-5 mb-5">Sign Up</h5>

                <div class="relative mb-5">

                    <!-- Loading overlay -->
                    <LoaderOverlay :show="form.processing" />

                    <!-- Register form -->
                    <DefaultInput v-model="form.name" label="Name" :disabled="form.processing" :error="form.errors.name" @keyup.enter="register()" class="mb-4"></DefaultInput>
                    <DefaultInput v-model="form.email" label="Email" :disabled="form.processing" :error="form.errors.email" @keyup.enter="register()" class="mb-4"></DefaultInput>
                    <DefaultInput v-model="form.password" type="password" label="Password" :disabled="form.processing" :error="form.errors.password" @keyup.enter="register()" class="mb-4"></DefaultInput>
                    <DefaultInput v-model="form.password_confirmation" type="password" label="Confirm Password" :disabled="form.processing" :error="form.errors.password_confirmation" @keyup.enter="register()" class="mb-4"></DefaultInput>

                    <!-- Toggle Sign Into Account -->
                    <DefaultSwitch v-model="form.signin_with_acount" :disabled="form.processing" :error="form.errors.signin_with_acount" note="Sign In with new account" class="mb-4"></DefaultSwitch>


                    <!-- Explainer -->
                    <PrimaryAlert class="mb-6">

                        <span>
                            For security reasons please provide your security
                            <span class="font-semibold text-green-500">Email</span>
                            and
                            <span class="font-semibold text-green-500">Password</span>
                            to create this account
                        </span>

                    </PrimaryAlert>

                    <div class="grid grid-cols-2 gap-4">

                        <DefaultInput v-model="form.security_email" type="text" label="Security Email" :disabled="form.processing" :error="form.errors.security_email" @keyup.enter="register()"></DefaultInput>
                        <DefaultInput v-model="form.security_password" type="password" label="Security Password" :disabled="form.processing" :error="form.errors.security_password" @keyup.enter="register()"></DefaultInput>

                    </div>

                </div>

                <div class="flex justify-end">
                    <PrimaryButton :disabled="form.processing" @click="register()">
                        Sign Up
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
    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import LoaderOverlay from "@components/Loader/LoaderOverlay";
    import PrimaryButton from "@components/Button/PrimaryButton";
    import DefaultSwitch from '@components/Switch/DefaultSwitch';
    import GuestDashboardLayout from '../../../Layouts/GuestDashboard/GuestDashboardLayout.vue';

    export default {
        layout: GuestDashboardLayout,
        components: { Head, Logo, DefaultInput, PrimaryAlert, LoaderOverlay, DefaultSwitch, PrimaryButton },
        data() {
            return {
                form: useForm({
                    name: '',
                    email: '',
                    password: '',
                    security_email: '',
                    security_password: '',
                    signin_with_acount: true,
                    password_confirmation: ''
                })
            }
        },
        methods: {
            register() {

                const self = this;

                //  Clear existing errors
                this.form.clearErrors();

                //  Attempt to register
                this.form.post(route('register.create'), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        self.$message({
                            message: 'Account created',
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
