<template>

    <div class="flex items-center">
        <div class="text-xs text-gray-500 mr-6">
            <span class="mr-2">{{ pagination.total }} {{ pagination.total == 1 ? 'result' : 'results' }}</span>
            <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        </div>
        <nav>
            <ul class="inline-flex items-center -space-x-px text-xs cursor-pointer">
                <template v-for="link in pagination.links" :key="link.label">

                    <!-- Previous Link -->
                    <li v-if="link.label === 'Previous'">
                        <span @click="navigate(link)" class="block py-3 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                            <span class="sr-only">Previous</span>
                            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        </span>
                    </li>

                    <!-- Next Link -->
                    <li v-else-if="link.label === 'Next'">
                        <span @click="navigate(link)" class="block py-3 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                            <span class="sr-only">Next</span>
                            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                        </span>
                    </li>

                    <!-- Link Number (Active) -->
                    <li v-else-if="link.active == true">
                        <span @click="navigate(link)" aria-current="page" class="z-10 py-3 px-3 leading-tight text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700">
                            {{ link.label }}
                        </span>
                    </li>

                    <!-- Link Number (Inactive) -->
                    <li v-else-if="link.active == false">
                        <span @click="navigate(link)" class="py-3 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                            {{ link.label }}
                        </span>
                    </li>

                </template>
            </ul>
        </nav>
    </div>

</template>
<script>
export default {
    props: ['pagination'],
    methods: {
        navigate(link) {

            if(link.url) {

                const options = {
                    preserveScroll: true,
                    preserveState: true,
                    //  replace: true
                };

                this.$inertia.get(link.url, {}, options);

            }

        }
    }
}
</script>
