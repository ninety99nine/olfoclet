<script>

    export default {
        data() {
            return {
                selectedProject: this.route().params.project ?? 'any',
                selectedVersion: this.route().params.version ?? 'any',
                selectedApp: this.route().params.app ?? 'any',
                projectOptions: [],
                versionOptions: [],
                appOptions: []
            }
        },
        methods: {
            setProjectOptions() {
                this.projectOptions = this.$page.props.projectOptions ? [
                    {
                        label: 'Any',
                        value: 'any'
                    },
                    ...this.$page.props.projectOptions.map((option) => {
                        return {
                            label: option.name,
                            value: option.id
                        }
                    })
                ] : [];
            },
            setAppOptions() {

                var options = [{
                    label: 'Any',
                    value: 'any'
                }];

                //  If the project options exist
                if( (this.$page.props.projectOptions || []).length ) {

                    //  Check if a project has been selected
                    if(this.selectedProject !== 'any') {

                        //  Get the selected project
                        const project = this.$page.props.projectOptions.find((option) => option.id == this.selectedProject);

                        //  Get the selected project app options
                        project.apps.forEach(option => {
                            options.push({
                                label: option.name,
                                value: option.id
                            });
                        });

                    }
                }else if( (this.$page.props.appOptions || []).length ) {

                    //  Get the route provided options
                    this.$page.props.appOptions.forEach(option => {
                        options.push({
                            label: option.name,
                            value: option.id
                        });
                    });

                }

                this.appOptions = options;
            },
            setVersionOptions() {

                var options = [{
                    label: 'Any',
                    value: 'any'
                }];

                //  If the project options exist
                if( (this.$page.props.projectOptions || []).length ) {

                    //  Check if a project has been selected
                    if(this.selectedProject !== 'any') {

                        //  Get the selected project
                        const project = this.$page.props.projectOptions.find((option) => option.id == this.selectedProject);

                        //  If the app options exist
                        if( project.apps.length ) {

                            //  Check if an app has been selected
                            if(this.selectedApp !== 'any') {

                                //  Get the selected app
                                const app = project.apps.find((option) => option.id == this.selectedApp);

                                //  Get the selected project app options
                                app.versions.forEach(option => {
                                    options.push({
                                        label: option.number,
                                        value: option.id
                                    });
                                });

                            }
                        }

                    }

                //  If the app options exist
                }else if( (this.$page.props.appOptions || []).length ) {

                    //  Check if an app has been selected
                    if(this.selectedApp !== 'any') {

                        //  Get the selected app
                        const app = this.$page.props.appOptions.find((option) => option.id == this.selectedApp);

                        //  Get the selected project app options
                        app.versions.forEach(option => {
                            options.push({
                                label: option.number,
                                value: option.id
                            });
                        });

                    }

                //  If the version options exist
                }else if( (this.$page.props.versionOptions || []).length ) {

                    //  Get the version options
                    this.$page.props.versionOptions.forEach(option => {
                        options.push({
                            label: option.number,
                            value: option.id
                        });
                    });

                }else{

                    return [];

                }

                this.versionOptions = options;
            },
            onSelectProjectOption() {
                this.selectedApp = 'any';
                this.selectedVersion = 'any';
                this.setAppOptions();
                this.refreshContent();
            },
            onSelectAppOption() {
                this.selectedVersion = 'any';
                this.setVersionOptions();
                this.refreshContent();
            }
        },
        created() {
            this.setProjectOptions();
            this.setVersionOptions();
            this.setAppOptions();

        }
    };

</script>
