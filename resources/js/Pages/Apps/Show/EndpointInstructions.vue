<template>

    <div class="p-5 mt-4 bg-white shadow-md hover:shadow-lg">

        <h5 class="text-xl font-medium text-gray-900 border-b pb-5 mb-5">Endpoint</h5>

        <div class="relative mb-5">

            <!-- Endpoint -->
            <PrimaryAlert>

                <span>
                    <span class="block">Request the Mobile Network Operator to point the Shortcode to the following POST endpoint.</span>
                </span>

            </PrimaryAlert>

            <div class="flex justify-end my-4">
                <DefaultCodeSnippet>{{ endpoint }}</DefaultCodeSnippet>
            </div>

            <div class="flex justify-end">
                <DefaultButton @click="copyToClipboard()">
                    Copy Endpoint
                </DefaultButton>
            </div>

        </div>

    </div>

</template>

<script>

    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import DefaultButton from "@components/Button/DefaultButton";
    import DefaultCodeSnippet from "@components/CodeSnippet/DefaultCodeSnippet";

    export default {
        components: { PrimaryAlert, DefaultButton, DefaultCodeSnippet },
        data() {
            return {
                endpoint: route('launch.ussd')
            }
        },
        methods: {
            copyToClipboard() {

                //  Copy to clipboard
                navigator.clipboard.writeText(this.endpoint).then(() => {

                    //  Alert the user that the action took place.
                    this.$message({
                        message: 'Copied Endpoint',
                        type: 'success'
                    });

                });

            }
        }
    };

</script>
