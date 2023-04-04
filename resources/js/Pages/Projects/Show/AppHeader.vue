<template>

    <div>

        <div class="flex items-end justify-between mb-6">

            <div>
                <h1 class="text-xl font-semibold text-gray-700 mb-2">{{ isShowingApps ? 'Apps' : 'Trashed Apps' }}</h1>
                <h2 class="text-sm text-gray-400">Select an app to {{ isShowingApps ? 'build' : 'restore' }}</h2>
            </div>

            <div class="flex items-center space-x-2">
                <DefaultSwitch :value="isShowingTrashedApps" @change="toggleApps()" note="Show trashed apps" :disabled="isChangingRoute"></DefaultSwitch>
                <NumberBadge v-if="projectPayload.trashed_apps_count" :count="projectPayload.trashed_apps_count"></NumberBadge>
            </div>

        </div>

        <div class="flex items-center justify-between mb-12">

            <div>

                <!-- Grid View Button -->
                <component :is="view == 'grid' ? 'PrimaryButton' : 'DefaultButton'" class="rounded-r-none px-8" @click="changeView('grid')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid
                </component>

                <!-- Table View Button -->
                <component :is="view == 'table' ? 'PrimaryButton' : 'DefaultButton'" class="rounded-l-none px-8" @click="changeView('table')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Table
                </component>

            </div>

            <DefaultSearchBar v-model="search" @onSearch="startSearch" placeholder="Search apps"/>

        </div>

        <!-- Explainer -->
        <PrimaryAlert v-if="isShowingTrashedApps" class="mb-12">
            <span>Showing trashed apps</span>
        </PrimaryAlert>

    </div>

</template>

<script>

    import NumberBadge from '@components/Badges/NumberBadge';
    import PrimaryAlert from "@components/Alert/PrimaryAlert";
    import PrimaryButton from "@components/Button/PrimaryButton";
    import DefaultButton from "@components/Button/DefaultButton";
    import DefaultSwitch from "@components/Switch/DefaultSwitch";
    import DefaultSearchBar from "@components/SearchBar/DefaultSearchBar";

    export default {
        props: ['view'],
        components: { NumberBadge, PrimaryAlert, PrimaryButton, DefaultButton, DefaultSwitch, DefaultSearchBar },
        data() {
            return {
                isShowingApps: false,
                isChangingRoute: false,
                isShowingTrashedApps: false,
                search: this.route().params.search,
                projectPayload: this.$page.props.projectPayload
            }
        },
        watch:{
            /**
             *  Watch for changes on the page props
             */
            '$page.props': function (newUrl, oldUrl) {
                this.projectPayload = this.$page.props.projectPayload;
            },
            /**
             *  Watch for changes on the page url
             */
            '$page.url': function (newUrl, oldUrl) {
                this.setActiveRoutes();
            }
        },
        methods: {
            changeView(updatedView) {
                this.$emit('updateView', updatedView);
            },
            startSearch(search) {
                const routeName = this.isShowingApps ? 'project.show.with.apps' : 'project.show.with.trashed.apps';
                this.$inertia.get(route(routeName, { project: this.route().params.project }), { search: search }, {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true
                });
            },
            setActiveRoutes() {
                this.isShowingApps = this.checkIfShowingApps();
                this.isShowingTrashedApps = this.checkIfShowingTrashedApps();
            },
            checkIfShowingApps() {
                return route().current('project.show.with.apps', { project: this.route().params.project });
            },
            checkIfShowingTrashedApps() {
                return route().current('project.show.with.trashed.apps', { project: this.route().params.project });
            },
            toggleApps(){
                this.isShowingTrashedApps ? this.showApps() : this.showTrashedApps();
            },
            showApps() {
                this.changeRoute(route('project.show.with.apps', { project: this.route().params.project }));
            },
            showTrashedApps() {
                this.changeRoute(route('project.show.with.trashed.apps', { project: this.route().params.project }));
            },
            changeRoute(url) {

                this.isChangingRoute = true;

                /**
                 *  Wait for the switch to complete its sliding animation before we navigate to the given url.
                 *  This is so that the switch animation is smoother. The slide transition is 150ms as seen
                 *  on the ".toggle-bg:after" CSS style of the rendered DefaultSwitch component
                 */
                setTimeout(() => {

                    this.$inertia.get(url, {}, {
                        preserveScroll: true,
                        replace: true
                    });

                }, 150);

            }
        },
        created() {
            this.setActiveRoutes();
        }
    };

</script>
