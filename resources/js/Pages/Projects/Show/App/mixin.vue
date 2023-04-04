<script>

    import moment from 'moment'
    import InfoPopover from '@components/Popover/InfoPopover';
    import FeaturePopover from '@pages/Apps/Show/Version/Features/FeaturePopover';
    import CreateOrUpdateAppModal from './../../../Apps/Create/CreateOrUpdateAppModal';

    export default {
        props: {
            app: Object
        },
        components: { InfoPopover, FeaturePopover, CreateOrUpdateAppModal },
        data() {
            return {
                moment: moment,
                modalIsClosed: true,
                showingOptions: false,
                isShowingApps: false,
                isShowingTrashedApps: false,
            }
        },
        watch:{
            /**
             *  Watch for changes on the page url
             */
            '$page.url': function (newUrl, oldUrl) {
                this.setActiveRoutes();
            }
        },
        methods: {
            showApp() {
                this.$inertia.get(route('app.show.with.versions', { project: this.route().params.project, app: this.app.id }));
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
            modalClosed() {
                this.modalIsClosed = true;
                this.hideOptions();
            },
            modalOpened() {
                this.modalIsClosed = false;
            },
            showOptions(){
                this.showingOptions = true;
            },
            hideOptions(){
                //  Hide options if the modal is closed
                if( this.modalIsClosed == true ) {
                    this.showingOptions = false;
                }
            }
        },
        created() {
            this.setActiveRoutes();
        }
    };

</script>
