<template>

    <!-- Modal -->
    <DefaultModal
        @open="reset()"
        defaultText="Cancel"
        :primaryAction="importFile"
        :primaryText="form.processing ? '': 'Import'">

        <!-- Modal Title -->
        <template v-slot:title>Import Version</template>

        <!-- Explainer -->
        <PrimaryAlert class="mb-4">

            <span class="block text-justify">
                Select a previously exported <span class="font-semibold text-blue-500">Project File</span> to begin importing the project. Note that this import process will replace your current version's screens, displays, events, settings e.t.c. After you import any Project File you must <span class="font-semibold text-green-500">Save Changes</span> to finalize the process. This will permanently update the changes. If the JSON file imported is very large, it may take some time to save changes.
            </span>

        </PrimaryAlert>

        <template v-if="progressPercentage == null">

            <!-- Upload File -->
            <el-upload
                action="/"
                :multiple="false"
                :auto-upload="false"
                :file-list="fileList"
                :on-change="beforeUpload">

                <DefaultButton class="px-3 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>{{ file ? 'Replace' : 'Select' }} File</span>
                </DefaultButton>

                <template #tip v-if="!file">
                    <span class="text-xs text-gray-400">Select the exported JSON File</span>
                </template>

            </el-upload>

            <div v-if="file" class="flex justify-between border rounded-md p-2 mt-2">

                <div class="flex">
                    <div class="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-400 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>

                    <div>
                        <p class="text-gray-700 mb-1">{{ file.name }}</p>
                        <span class="text-gray-500 text-xs">
                            <span>{{ getFileSize(file.size) }}</span>
                            <span class="text-gray-300 italic"> &#8212; application/json</span>
                        </span>
                    </div>
                </div>

                <svg @click="reset()" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500 active:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>

            </div>

            <div v-if="file">
                <h1 class="text-gray-700 text-xs font-semibold my-4">Properties To Import</h1>
                <div class="grid grid-cols-2 bg-blue-50 p-4 rounded-md">
                    <div v-for="(property, index) in properties" :key="index" class="col-span-1">
                        <input :id="'property-checkbox-'+index" type="checkbox" v-model="property.checked" class="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
                        <label :for="'property-checkbox-'+index">{{ property.label }}</label>
                    </div>
                </div>
            </div>

        </template>

        <template v-else>

            <!-- Uploading & Downloading Progress -->
            <Transition name="slide-up">

                <div class="grid grid-cols-12 gap-8 justify-center mb-4">

                    <div class="col-span-8">

                        <!-- Uploading & Downloading Progress Bar -->
                        <DefaultProgressBar :width="progressPercentage"></DefaultProgressBar>

                    </div>

                    <div class="col-span-4 flex items-center justify-end">

                        <span @click="cancelRequest()" class="flex items-center text-xs text-red-500 hover:text-red-600 active:text-red-700 cursor-pointer ml-8">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Cancel</span>
                        </span>

                    </div>

                </div>

            </Transition>

        </template>

        <DefaultError v-if="error" :error="error" class="mt-2"></DefaultError>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <!-- Import Button -->
            <DefaultButton class="rounded-r-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span>Import</span>
            </DefaultButton>

        </template>

    </DefaultModal>

</template>

<script>

    import { h } from 'vue'
    import DefaultError from '@components/Error/DefaultError';
    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultButton from '@components/Button/DefaultButton';
    import PrimaryButton from "@components/Button/PrimaryButton";
    import DefaultProgressBar from "@components/ProgressBar/DefaultProgressBar";

    export default {
        props: ['form'],
        components: { DefaultError, PrimaryAlert, DefaultModal, DefaultButton, PrimaryButton, DefaultProgressBar },
        data() {
            return {
                file: null,
                error: null,
                fileList: [],
                builder: null,
                request: null,
                properties: [],
                isLoading: false,
                uploadMessage: null,
                progressPercentage: null,
                uploadProgressPercentage: null,
                downloadProgressPercentage: null,
                useVersionBuilder: useVersionBuilder()
            }
        },
        methods: {
            beforeUpload (file) {

                this.reset();

                const rawFile = file.raw;

                if(rawFile.type == 'application/json') {

                    //  Set the raw JSON file
                    this.file = rawFile;

                    var reader = new FileReader();

                    //  On load of the JSON file
                    reader.onload = function(event) {

                        try {

                            //  Get the JSON data
                            const builder = JSON.parse(event.target.result);

                            const properties = Object.keys(builder);

                            //  Check if the builder has the following properties
                            if( properties.includes('screens') && properties.includes('simulator') ) {

                                this.builder = builder;
                                this.properties = properties.map((property) => {
                                    return {
                                        label: property.split('_').join(' '),
                                        value: property,
                                        checked: true
                                    }
                                });

                            }else{

                                this.setImportError('The file imported is not a valid Builder File');

                            }

                        } catch (e) {

                            this.reset();
                            this.setImportError('Failed to process the file');

                        }

                    }.bind(this);

                    if( this.file ) {

                        //  Read the JSON file
                        reader.readAsText(this.file);

                    }

                }else{

                    this.setImportError('The file imported is not a valid JSON File');

                }

            },
            reset() {
                this.file = null;
                this.fileList = [];
                this.builder = null;
                this.properties = [];
                this.unsetImportError();
            },
            setImportError(msg = ''){
                this.error = msg;

                setTimeout(() => {
                    this.unsetImportError();
                }, 3000);
            },
            unsetImportError(){
                this.error = '';
            },
            getFileSize(fileSize){

                //  1 kb = 1024 bytes
                var kb = (1024);

                //  1 mb = (kb * 1024) bytes
                var mb = (kb * 1024);

                fileSize = parseInt(fileSize);

                //  If the file size is less than 1000 bytes
                if( fileSize >= mb ) {
                    fileSize = Math.round(fileSize/mb *100)/100 + ' MB';
                }else if( fileSize >= kb ){
                    fileSize = Math.round(fileSize/kb *100)/100 + ' KB';
                }else{
                    fileSize + ' Bytes';
                }

                return fileSize;
            },
            importFile (closeModal) {

                if( this.builder ) {

                    //  Get the value of the builder properties
                    const propertyValues = this.properties.map((property) => {
                        return property.value;
                    });

                    //  Get the value of the unselected builder properties
                    const unselectedPropertyNames = this.properties
                        .filter((property) => {
                            return property.checked == false;
                        }).map((property) => {
                            return property.value;
                        });

                    //  Foreach of the builder properties
                    for (let index = 0; index < propertyValues.length; index++) {

                        var propertyValue = propertyValues[index];

                        //  If the property is unselected
                        if( unselectedPropertyNames.includes(propertyValue) ) {

                            //  Delete the property from the builder
                            delete this.builder[propertyValue];

                        }

                    }

                    const mergedBuilder = {
                        ...this.useVersionBuilder.builder,  //  Current builder properties
                        ...this.builder,                    //  Imported builder properties
                    };

                    this.uploadToRepairFile(mergedBuilder, closeModal);

                }else{

                    this.setImportError('Select a JSON File to upload');

                }

            },
            uploadToRepairFile(builderForRepair, closeModal) {

                this.isLoading = true;

                console.log('builderForRepair');
                console.log(builderForRepair);

                /**
                 *  Attempt to update version
                 *
                 *  Note that we use "FormData()" to make use of the "multipart/form-data"
                 *  which is useful for tracking the upload progress.
                 */
                let formData = new FormData();
                formData.append('builder', JSON.stringify(builderForRepair));

                const url = route('version.repair', { project: this.route().params.project, app: this.route().params.app, version: this.route().params.version });

                /**
                 *  Generate the axios cancel token to allow this request
                 *  to be cancelled if this action is required
                 *
                 *  Reference: https://stackoverflow.com/questions/50516438/cancel-previous-request-using-axios-with-vue-js
                 */
                const axiosSource = axios.CancelToken.source();
                this.request = { cancel: axiosSource.cancel };

                const config = {

                    //  Upload Progress
                    onUploadProgress: event => {

                        this.uploadMessage = 'Uploading file for repair analysis';

                        this.uploadProgressPercentage = Math.round(
                            (event.loaded * 100) / event.total
                        );

                        this.calculateProgress();

                    },

                    //  Dowload Progress
                    onDownloadProgress: event => {

                        this.uploadMessage = 'Downloading repaired file';

                        this.downloadProgressPercentage = Math.round(
                            (event.loaded * 100) / event.total
                        );

                        this.calculateProgress();

                    },

                    cancelToken: axiosSource.token

                };

                const self = this;

                axios.post(url, formData, config)
                    .then((response) => {

                        //  Get the builder
                        const builder = response.data;

                        //  Update the project version builder
                        self.useVersionBuilder.setBuilder(builder);

                        //  Select a screen by default
                        this.useVersionBuilder.selectRecomendedScreen();

                        //  Indicate that the builder has been imported
                        this.useVersionBuilder.hasImportedBuilder = true;

                        self.$message({
                            type: 'success',
                            message: h('p', null, [
                                h('span', null, 'Import successful'),
                                h('div', { class: 'text-xs mt-2' }, 'The builder was imported successfully.'),
                                h('div', { class: 'text-xs mt-2' }, 'Click "Save Changes" to permanently save these updates. Refresh the page to undo the import.')
                            ]),
                            duration: 8000
                        });

                        closeModal();

                    }).catch((error) => {

                        var message = (error || {}).message ?? 'Sorry, something went wrong';

                        //  Request failed with status code 419 (CSRF token mismatch.)
                        if( error.response.status === 419 ) {

                            message = 'Please login';

                            //  Proceed to login
                            this.$inertia.get(route('login.show'));

                        }

                        self.$message({
                            message: message,
                            type: 'warning'
                        });

                    }).finally(() => {

                        this.resetRequest();

                    });

            },
            calculateProgress(){

                const total = (this.uploadProgressPercentage || 0) + (this.downloadProgressPercentage || 0);

                this.progressPercentage = Math.round(
                    total * 100 / 200
                );

            },
            cancelRequest(){
                if (this.request) this.request.cancel('File repair cancelled');
                this.resetRequest();
            },
            resetRequest(){
                this.request = null;
                this.isLoading = false;
                this.uploadMessage = null;
                this.progressPercentage = null;
                this.uploadProgressPercentage = null;
                this.downloadProgressPercentage = null;
            }
        }
    };

</script>
