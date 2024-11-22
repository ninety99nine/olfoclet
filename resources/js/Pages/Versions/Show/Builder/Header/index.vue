<template>

    <div>

        <!-- Action Explainer -->
        <WarningAlert v-if="useVersionBuilder.hasImportedBuilder || useVersionBuilder.hasUnsavedBuilderFromLocalStorage" class="w-1/2 mb-6">

            <span>
                This builder has not been saved. Please <span class="font-semibold text-blue-500">Save Changes</span> so that the simulator can reflect the imported changes.
                Then again you could refresh the browser to omit the imported changes.
            </span>

        </WarningAlert>

        <div class="flex justify-between mb-4">

            <!-- Back Button -->
            <BackButton :disabled="isSaving || isDownloading">Versions</BackButton>

            <div>

                <!-- Editor Button -->
                <component :is="showEditor == true ? 'PrimaryButton' : 'DefaultButton'" class="rounded-r-none px-8" :disabled="isSaving || isDownloading" @click="$emit('showEditorState', true)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Editor
                </component>

                <!-- Simulator Button -->
                <component :is="showEditor == false ? 'PrimaryButton' : 'DefaultButton'" class="rounded-l-none px-8" :disabled="isSaving || isDownloading" @click="$emit('showEditorState', false)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Simulator
                </component>

            </div>

            <div class="flex">

                <Transition name="fade">

                    <div v-if="!isSaving && !isDownloading" class="flex items-center mr-8">

                        <!-- Import Button -->
                        <ImportVersionModal :form="form"></ImportVersionModal>

                        <!-- Export Button -->
                        <ExportVersionModal :form="form"></ExportVersionModal>

                    </div>

                </Transition>

                <div class="flex items-center space-x-2">

                    <!-- Undo Changes Button -->
                    <div v-if="useVersionBuilder.hasUnsavedBuilderFromLocalStorage">
                        <UndoChangesModal :form="form"></UndoChangesModal>
                    </div>

                    <!-- Save Changes Button -->
                    <PrimaryButton :disabled="isSaving || isDownloading" @click="updateVersion()">Save Changes</PrimaryButton>

                </div>

            </div>

        </div>

        <!-- Saving Progress -->
        <Transition name="fade">

            <div v-if="isSaving == true && progressPercentage !== null" class="grid grid-cols-12 gap-8 justify-center mb-4">

                <div class="col-span-8">

                    <!-- Saving Progress Bar -->
                    <DefaultProgressBar :width="progressPercentage"></DefaultProgressBar>

                </div>

                <div class="col-span-4 flex items-center justify-between">

                    <!-- Saving Conversation -->
                    <Transition name="fade" mode="out-in" appear>
                        <span v-if="stillLoadingConversation" :key="stillLoadingConversation" class="text-gray-400 text-xs">
                            <span>{{ stillLoadingConversation }}</span>
                        </span>
                    </Transition>

                    <span @click="cancelRequest()" class="flex items-center text-xs text-red-500 hover:text-red-600 active:text-red-700 cursor-pointer ml-8">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Cancel</span>
                    </span>

                </div>

            </div>

        </Transition>

        <!-- Downloading Progress -->
        <Transition name="slide-up">

            <div v-if="isDownloading == true && downloadInSeconds >= 1" class="grid grid-cols-12 gap-8 justify-center mb-4">

                <div class="col-span-9">

                    <!-- Downloading Progress Bar -->
                    <DefaultProgressBar :width="progressPercentage"></DefaultProgressBar>

                </div>

                <div class="col-span-3 flex items-center justify-end">

                    <!-- Downloading Conversation -->
                    <Transition name="slide-up" mode="out-in" appear>
                        <span v-if="stillLoadingConversation" :key="stillLoadingConversation" class="text-gray-400 text-xs">
                            <span>{{ stillLoadingConversation }}</span>
                        </span>
                    </Transition>

                </div>

            </div>

        </Transition>

        <!-- Saving Error -->
        <DefaultError :error="error" class="my-4"></DefaultError>

    </div>

</template>

<script>

    import axios from 'axios';
    import BackButton from "./BackButton";
    import { useForm } from '@inertiajs/vue3';
    import DefaultError from "@components/Error/DefaultError";
    import WarningAlert from "@components/Alert/WarningAlert";
    import WarningBadge from '@components/Badges/WarningBadge';
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultButton from "@components/Button/DefaultButton";
    import PrimaryButton from "@components/Button/PrimaryButton";
    import UndoChangesModal from './UndoChanges/UndoChangesModal';
    import ImportVersionModal from './ImportVersion/ImportVersionModal';
    import ExportVersionModal from './ExportVersion/ExportVersionModal';
    import DefaultProgressBar from "@components/ProgressBar/DefaultProgressBar";

    export default {
        props: {
            showEditor: Boolean,
        },
        components: { BackButton, DefaultError, WarningAlert, WarningBadge, DefaultButton, PrimaryButton, UndoChangesModal, ImportVersionModal, ExportVersionModal, DefaultProgressBar },
        data(){
            return {
                useVersionBuilder: useVersionBuilder(),
                project: this.$page.props.projectPayload,
                version: this.$page.props.versionPayload,
                app: this.$page.props.appPayload,
                downloadInSecondsInterval: null,
                stillLoadingConversation: null,
                progressPercentage: null,
                downloadInSeconds: 0,
                isDownloading: false,
                startingConvo: null,
                form: useForm({}),
                isSaving: false,
                request: null
            }
        },
        watch: {
            // Watch the builder state and store it in localStorage on changes
            'useVersionBuilder.builder': {
                handler(newBuilder, oldBuilder) {

                    // Only run if the oldBuilder is not an empty object
                    if (!_.isEmpty(oldBuilder)) {

                        // Update localStorage
                        this.useVersionBuilder.setUnsavedBuilderOnLocalStorage(newBuilder);

                    }

                },
                deep: true
            }
        },
        computed: {
            error() {
                return this.form.errors.number || this.form.errors.description ||
                       this.form.errors.builder || this.form.errors.reset_builder || this.form.errors.confirmation_code
            }
        },
        methods: {
            getStillLoadingConversations() {

                return [
                    this.isSaving ? 'Saving changes ...' : 'Downloading app...',
                    '🙂 Take a break for now',
                    '🕑 This may take some time',
                    '☕ Did you have a cup of coffee?',
                    '🥇 Big projects take time to ' + (this.isSaving ? 'save' : 'download'),
                    '😎 Just be patient in the meantime',
                    '👌 This is all part of the process',
                    '🥪 Did you get something to eat?',
                    '🚶 This is a good time to relax',
                    '👊 Still saving, don\'t worry',
                    '👊 Still ' + (this.isSaving ? 'saving' : 'downloading') + ', don\'t worry',
                    '👀 I know, just one moment please',
                    '🥂C We are almost there',
                ];
            },
            startConvo(startIndex = 0) {

                const stillLoadingConversations = this.getStillLoadingConversations();

                this.stillLoadingConversation = stillLoadingConversations[startIndex];

                const totalConversations = stillLoadingConversations.length;

                const nextIndex = startIndex == (totalConversations - 1) ? 0 : (startIndex + 1);

                this.startingConvo = setTimeout(() => this.startConvo(nextIndex) , 10000);

            },
            stopConvo() {
                clearInterval(this.startingConvo);
            },
            updateVersion() {

                //  Indicate that the builder has not been saved
                this.useVersionBuilder.hasSavedBuilder = false;

                this.isSaving = true;

                //  Start the conversation
                this.startConvo();

                /**
                 *  Attempt to update version
                 *
                 *  Note that we use "post" instead of "put" when saving. This is because we want to make use
                 *  of the "multipart/form-data" which is useful for tracking the upload progress. However
                 *  the "multipart/form-data" does not support the put, patch or delete methods. We need
                 *  to use "post" method while appending the "{ _method: 'put' }" parameters as part of
                 *  the "form" data to allowing saving data while also enabling the upload progress
                 *  tracker.
                 */
                let formData = new FormData();
                formData.append('_method', 'put');
                formData.append('builder', JSON.stringify(this.useVersionBuilder.builder));

                const url = route('version.update', { project: this.route().params.project, app: this.route().params.app, version: this.route().params.version });

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
                        this.progressPercentage = Math.round(
                            (event.loaded * 100) / event.total
                        );
                    },

                    cancelToken: axiosSource.token

                };

                const self = this;

                axios.post(url, formData, config)
                    .then((response) => {

                        self.$message({
                            message: 'Changes saved successfully',
                            type: 'success'
                        });

                        //  Remove builder from local storage (Changes have been saved)
                        this.useVersionBuilder.removeUnsavedBuilderFromLocalStorage();

                        //  Turn off indication that the builder has been imported
                        this.useVersionBuilder.hasImportedBuilder = false;

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
            downloadVersion() {

                this.isDownloading = true;

                //  Start the conversation
                this.startConvo();

                const url = route('version.show', { project: this.route().params.project, app: this.route().params.app, version: this.route().params.version });

                const config = {

                    //  Dowload Progress
                    onDownloadProgress: event => {

                        this.progressPercentage = Math.round(
                            (event.loaded * 100) / event.total
                        );
                    }

                };

                this.downloadInSecondsInterval = setInterval(() => { ++this.downloadInSeconds }, 1000);

                const self = this;

                axios.get(url, config)
                    .then((response) => {

                        //  If the download took 5 seconds or longer, notify the user on the download success
                        if( self.downloadInSeconds >= 5 ) {

                            self.$message({
                                message: 'Download successful',
                                type: 'success'
                            });

                        }

                        const builder = response.data;

                        //  Store the version builder as the stored state builder
                        this.useVersionBuilder.setBuilder(builder);

                        //  Select a screen by default
                        this.useVersionBuilder.selectRecomendedScreen();

                    }).catch((error) => {

                        self.$message({
                            message: (error || {}).message ?? 'Sorry, something went wrong',
                            type: 'warning'
                        });

                    }).finally(() => {

                        this.resetRequest();

                    });

            },
            cancelRequest(){
                if (this.request) this.request.cancel('Saving cancelled');
                this.useVersionBuilder.selectRecomendedScreen();
                this.resetRequest();
            },
            resetRequest(){
                this.stopConvo();
                this.request = null;
                this.isSaving = false;
                this.isDownloading = false;
                this.downloadInSeconds = 0;
                this.progressPercentage = null;
                clearInterval(this.downloadInSecondsInterval);

                //  Indicate that the builder has been saved
                this.useVersionBuilder.hasSavedBuilder = true;

                //  Indicate that the builder has been downloaded
                this.useVersionBuilder.hasDownloadedBuilder = true;
            }
        },
        unmounted() {
            //  Stop the conversation
            this.stopConvo();
        },
        created(){

            this.useVersionBuilder.project = this.project;
            this.useVersionBuilder.version = this.version;
            this.useVersionBuilder.app = this.app;

            this.downloadVersion();
        }
    };

</script>
