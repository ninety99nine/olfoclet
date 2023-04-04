<script>

    import moment from 'moment';
    import FeaturePopover from './Features/FeaturePopover';
    import CreateOrUpdateVersionModal from './../../../Versions/Create/CreateOrUpdateVersionModal';

    export default {
        props: {
            version: Object,
            appPayload: Object
        },
        components: { FeaturePopover, CreateOrUpdateVersionModal },
        data() {
            return {
                moment: moment,
                modalIsClosed: true,
                showingOptions: false,
                isShowingVersions: false,
                isShowingTrashedVersions: false,
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
            showVersion() {
                this.$inertia.get(route('version.show', { project: this.route().params.project, app: this.route().params.app, version: this.version.id }));
            },
            setActiveRoutes() {
                this.isShowingVersions = this.checkIfShowingVersions();
                this.isShowingTrashedVersions = this.checkIfShowingTrashedVersions();
            },
            checkIfShowingVersions() {
                return route().current('app.show.with.versions', { project: this.route().params.project, app: this.route().params.app });
            },
            checkIfShowingTrashedVersions() {
                return route().current('app.show.with.trashed.versions', { project: this.route().params.project, app: this.route().params.app });
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
