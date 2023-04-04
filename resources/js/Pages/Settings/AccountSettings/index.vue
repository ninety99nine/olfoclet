<template>

    <div>

        <PrimaryAlert class="mb-6">
            <span>Change your account password</span>
        </PrimaryAlert>

        <DefaultInput v-model="form.curr_password" type="password" label="Current Password" :disabled="form.processing" :error="form.errors.curr_password" @keyup.enter="changePassword()" class="mb-4"></DefaultInput>
        <DefaultInput v-model="form.new_password" type="password" label="New Password" :disabled="form.processing" :error="form.errors.new_password" @keyup.enter="changePassword()" class="mb-4"></DefaultInput>
        <DefaultInput v-model="form.new_password_confirmation" type="password" label="Confirm New Password" :disabled="form.processing" :error="form.errors.new_password_confirmation" @keyup.enter="changePassword()" class="mb-6"></DefaultInput>

        <div class="flex justify-end">
            <PrimaryButton @click.stop="changePassword()" :disabled="form.processing">Change Password</PrimaryButton>
        </div>
    </div>

</template>

<script>

    import { useForm } from '@inertiajs/vue3';
    import DefaultInput from "@components/Input/DefaultInput";
    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import PrimaryButton from "@components/Button/PrimaryButton";

    export default {
        components: { DefaultInput, PrimaryAlert, PrimaryButton },
        data() {
            return {
                form: useForm({
                    new_password: '',
                    curr_password: '',
                    new_password_confirmation: ''
                })
            }
        },
        methods: {
            changePassword() {

                const self = this;

                this.form.clearErrors();

                this.form.post(route('settings.account.update'), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {

                        self.$message({
                            message: 'Password changed successfully',
                            type: 'success'
                        });

                        self.form.reset();

                    },
                    onError: (errors) => {

                        self.$message({
                            message: 'Sorry, we found some mistakes',
                            type: 'error'
                        });

                    },
                });

            }
        }
    };

</script>
