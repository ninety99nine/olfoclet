<template>

    <!-- Copy To Clipboard -->

    <div @click.stop="copyToClipboard()">

        <slot>

            <!-- Add custom trigger to the slot or default to the following -->
            <span class="flex transition-opacity duration-500 opacity-0 group-hover:opacity-100 py-1 px-2 rounded-md cursor-pointer bg-blue-200 text-blue-500 hover:bg-blue-300 hover:text-blue-600 hover:shadow-sm active:bg-blue-400 active:text-blue-700 active:shadow-md">

                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                <span class="text-xs font-semibold">Copy</span>

            </span>

        </slot>

    </div>

</template>

<script>

    export default {
        props: {
            value: [String, Number, Object],
            message: {
                type: String,
                default: 'Copied'
            }
        },
        methods: {
            copyToClipboard() {

                console.log(`copy to clipboard: ${this.value}`);

                //  Copy to clipboard
                navigator.clipboard.writeText(this.value).then(() => {

                    //  Alert the user that the action took place.
                    this.$message({
                        message: this.message,
                        type: 'success'
                    });

                });

            }
        }
    }
</script>
