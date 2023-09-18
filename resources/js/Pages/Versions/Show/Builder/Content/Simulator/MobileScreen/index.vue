<template>
    <div class="h-full relative" :class="{ 'bg-black/50': showingUssdPopup }">

        <Transition name="fade">

            <!-- Main Screen Content -->
            <div v-show="!showingUssdPopup" class="absolute top-20 right-5 left-5">

                <div class="bg-white/90 shadow-sm hover:shadow-md rounded-sm p-4 mb-2">
                    <span class="text-sm font-semibold tracking-tight text-gray-900">
                        <span class="text-blue-500 mr-1">{{ app.name }}</span>
                        <span class="text-xs"> &#8212; Version {{ version.number }}</span>
                    </span>
                </div>

                <div class="bg-white/90 shadow-sm hover:shadow-md rounded-sm p-4 mb-2">

                    <div class="flex justify-between mb-4">
                        <span class="block text-sm font-medium text-gray-900">Dialer</span>

                        <div class="flex text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span class="block text-sm font-medium">{{ form.msisdn }}</span>
                        </div>

                    </div>

                    <DefaultInput v-model="initialReplies" placeholder="*1*2*3"
                        :prependClasses="['bg-blue-50 text-blue-500']"
                        :appendClasses="['bg-blue-50 text-blue-500']">
                        <template #append>
                            {{ primaryShortCode.substring(0, primaryShortCode.length - 1) }}*
                        </template>
                        <template #prepend>
                                #
                        </template>
                    </DefaultInput>

                </div>

                <div class="bg-white/90 shadow-sm hover:shadow-md rounded-sm p-4">
                    <span class="text-sm font-semibold tracking-tight text-gray-600 text-justify">
                        <span>Dial <span class="text-blue-500">{{ modifiedServiceCode }}</span> on your mobile device or <span class="text-blue-500 hover:text-blue-600 active:text-blue-700 underline cursor-pointer" @click="startUssdServiceSimulator">Launch Simulator</span> to experience your application.</span>
                    </span>

                    <div class="flex justify-center pt-4 mt-4 border-t border-dashed border-gray-300">
                        <PrimaryButton @click="startUssdServiceSimulator()">Launch Simulator</PrimaryButton>
                    </div>
                </div>

            </div>

        </Transition>

        <Transition name="fade">

            <div v-show="showingUssdPopup" class="absolute top-40 right-5 left-5">

                <div class="bg-white/90 shadow-sm hover:shadow-md rounded-sm p-4 relative">

                    <!-- Loader -->
                    <Loader v-if="loading" :withTransition="false">
                        <span class="text-gray-600 ml-2">Loading...</span>
                    </Loader>

                    <div v-else>

                        <!-- Ussd Message -->
                        <p class="text-gray-600 whitespace-pre-wrap mb-4" v-html="ussdResponseMsg"></p>

                        <!-- Ussd Reply Input -->
                        <input type="text" v-model="form.msg" :disabled="loading" ref="ussd_input" class="ussd_input" @keypress.enter="startApiSimulationRequest()" @keyup.esc="stopUssdSimulator()" />

                        <!-- Cancel / Send / Resend Buttons -->
                        <div class="w-3/4 m-auto flex justify-between mt-4">
                            <button class="text-gray-600 hover:text-red-500 active:text-red-600 cursor-pointer" @click="stopUssdSimulator()">Cancel</button>
                            <span>|</span>
                            <button class="text-gray-600 hover:text-blue-500 active:text-blue-600 cursor-pointer" @click="startApiSimulationRequest()">Send</button>
                        </div>

                    </div>

                </div>

                <!-- Restart / Re-run / Stop Buttons -->
                <div class="flex justify-end mt-4 border-gray-300">
                    <PrimaryButton v-show="!loading" @click="startUssdServiceSimulator()" class="mr-2">Restart</PrimaryButton>
                    <PrimaryButton v-show="!loading" @click="startLastUssdCall()">Re-run</PrimaryButton>
                    <DangerButton v-show="loading" @click="stopUssdSimulator()">Stop</DangerButton>
                </div>

            </div>

        </Transition>

    </div>
</template>

<script>

    import axios from 'axios';
    import Loader from '@components/Loader/Loader.vue';
    import DefaultInput from "@components/Input/DefaultInput";
    import { useVersionBuilder } from "@stores/VersionBuilder";
    import DangerButton from "@components/Button/DangerButton";
    import PrimaryButton from "@components/Button/PrimaryButton";

    export default {
        components: { DefaultInput, DangerButton, PrimaryButton, Loader, Loader },
        data() {
            return {
                project: this.$page.props.projectPayload,
                version: this.$page.props.versionPayload,
                useVersionBuilder: useVersionBuilder(),
                app: this.$page.props.appPayload,
                showingUssdPopup: false,
                last_session_id: null,
                ussdResponseMsg: '',
                initialReplies: '',
                loading: false,
                request: null,
                form: null
            }
        },
        computed: {
            shortCode(){
                return (this.app.short_code || {});
            },
            sharedShortCode(){
                return this.shortCode.shared_code;
            },
            dedicatedShortCode(){
                return this.shortCode.dedicated_code;
            },
            primaryShortCode(){
                return this.dedicatedShortCode || this.sharedShortCode;
            },
            modifiedServiceCode(){

                //  Replace all matches with nothing (An empty string)
                function replaceWithNothing(match, offset, string) {

                    return '';

                }

                /**
                 *  This pattern searches any character that is not a Digit, Alphabet, Space
                 *  or an Asterix symbol, or any starting or ending Asterix symbol e.g
                 *
                 *  convert "1*#*3" to "1*3"
                 *  convert "1*?*3" to "1*3"
                 *  convert "***1*2*3" to "1*2*3"
                 *  convert "1*2*3***" to "1*2*3"
                 */
                var pattern = /[^0-9a-zA-Z\s*]|^[*]+|[*]+$/g;

                //  Replace all invalid characters with nothing
                var replies = this.initialReplies.replace(pattern, replaceWithNothing);

                /**
                 *  This pattern searches any duplicate '*' occurances e.g
                 *
                 *  convert "1**3" to "1*3"
                 *  convert "1***3" to "1*3"
                 */
                var pattern = /[*]{2,}/g;

                //  Replace duplicate '*' with nothing e.g *1**
                replies = replies.replace(pattern, replaceWithNothing);

                if( replies ){

                    /**
                     *  If "this.initialReplies" is "4*5*6" and "this.form.msg"
                     *  is "*321#" the combine to form "*321*4*5*6#"
                     */
                    return this.primaryShortCode.substring(0, this.primaryShortCode.length - 1)+'*'+replies+'#';

                }else{

                    return this.primaryShortCode;

                }

            },
        },
        methods: {
            startUssdServiceSimulator(){
                if( this.loading == false ) {
                    this.resetUssdSimulator();
                    this.startApiSimulationRequest();
                    this.showUssdPopup();
                }
            },
            stopUssdSimulator(){
                this.stopApiSimulationRequest();
                this.resetUssdSimulator();
                this.cancelUssdCall();
                this.hideUssdPopup();
            },
            resetUssdSimulator(replacement = {}){
                this.form = {
                    ...this.defaultForm(),

                    //  This can replace the default form
                    ...replacement
                };
            },
            cancelUssdCall(){
                if (this.request) this.request.cancel('Session cancelled');
                this.loading = false;
            },
            defaultForm(){
                return {
                    msg: null,
                    request_type: 1,
                    session_id: null,
                    service_code: null,

                    test_mode: true,
                    app_id: this.app.id,
                    version_id: this.version.id,
                    msisdn: this.useVersionBuilder.builder.simulator.subscriber.phone_number
                }
            },
            startLastUssdCall(){

                //  Update the session id with the last request sesison id
                var sessionId = this.form.session_id;

                //  Update the request type to "2" which means continue existing session
                var requestType = 2;

                //  Reset the simulator with these details
                this.resetUssdSimulator({
                    session_id: sessionId,
                    request_type: requestType
                });

                //  Recall the Ussd end point
                this.startApiSimulationRequest();
            },
            startApiSimulationRequest() {

                var self = this;

                /**
                 *  If this is the first request then embbed
                 *  the service code within the message.
                 */
                if( this.form.request_type == 1 ) {

                    this.form.msg = this.modifiedServiceCode;

                }

                this.loading = true;

                /**
                 *  Generate the axios cancel token to allow this request
                 *  to be cancelled if this action is required
                 *
                 *  Reference: https://stackoverflow.com/questions/50516438/cancel-previous-request-using-axios-with-vue-js
                 */
                const axiosSource = axios.CancelToken.source();

                const url = route('launch.ussd.simulation');
                this.request = { cancel: axiosSource.cancel };

                axios.post(url, this.form, { cancelToken: axiosSource.token })
                    .then((response) => {

                        let firstRequest = (self.form.request_type == 1);
                        let ussdResponse = response.data;

                        self.last_session_id = ussdResponse.session_id;

                        self.ussdResponseMsg = ussdResponse.msg;
                        self.form.session_id = ussdResponse.session_id;
                        self.form.request_type = ussdResponse.request_type;
                        self.form.service_code = ussdResponse.service_code;

                        self.$emit('response', ussdResponse);

                        //  If the requestType = 2 it means we want to continue the current session
                        if( self.form.request_type == 2 ){

                            self.emptyInput();
                            self.focusOnInput();

                            if( firstRequest ) {

                                self.$message({
                                    message: 'Simulation started successfully',
                                    type: 'success'
                                });

                            }

                        //  If the requestType = 3 it means we want to terminate the session
                        }else if( self.form.request_type == 3 ){

                            self.resetUssdSimulator();
                            self.emptyInput();

                            self.$message({
                                message: 'Session ended',
                                type: 'warning'
                            });

                        //  If the requestType = 4 it means the session ended
                        }else if( self.form.request_type == 4 ){

                            self.emptyInput();

                            self.$message({
                                message: 'Session Timed out',
                                type: 'warning'
                            });

                        //  If the requestType = 5 it means we want to redirect
                        }else if( self.form.request_type == 5 ){

                            //  Note: self.ussdResponse contains the new "Ussd Response" that we must redirect to
                            self.redirectUssdSimulator( ussdResponse.msg );

                        }

                        if( response.status === 200 ) {

                        }else{

                            self.resetUssdSimulator();
                            self.hideUssdPopup();

                            self.$message({
                                message: (response || {}).message ?? 'Sorry, something went wrong',
                                type: 'warning'
                            })

                        }

                    }).catch((error) => {

                        this.resetUssdSimulator();
                        this.hideUssdPopup();

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

                    })
                    .finally(() => {

                        this.request = null;
                        this.loading = false;

                    });
            },
            stopApiSimulationRequest() {

                const url = route('stop.ussd.simulation', { session_id: this.last_session_id });

                axios.post(url)
                    .then((response) => {

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

                    });
            },
            redirectUssdSimulator( serviceCode ){

                //  Reset the Ussd Simulator
                this.resetUssdSimulator();

                this.focusOnInput();

                //  Update the service code with the redirect service code
                this.form.serviceCode = serviceCode;

                //  Recall the Ussd end point
                this.startApiSimulationRequest();

            },
            showUssdPopup(){
                this.showingUssdPopup = true;
                this.focusOnInput();
            },
            hideUssdPopup(){
                this.showingUssdPopup = false;
            },
            focusOnInput(){
                setTimeout(() => {
                    if( this.$refs.ussd_input ) this.$refs.ussd_input.focus();
                }, 100);
            },
            emptyInput(){
                this.form.msg = null;
            }
        },
        created(){
            this.form = this.defaultForm();
        },
        beforeUnmount() {
            if( this.form.session_id ) {
                this.stopApiSimulationRequest();
            }
        }
    }
</script>

<style>
    .ussd_input {
        padding: 0;
        width: 100%;
        border: none;
        border-radius: 0;
        box-shadow: none;
        background: transparent;
        box-shadow:none !important;
        border-bottom: 2px solid #11d8b3 !important;
    }
</style>
