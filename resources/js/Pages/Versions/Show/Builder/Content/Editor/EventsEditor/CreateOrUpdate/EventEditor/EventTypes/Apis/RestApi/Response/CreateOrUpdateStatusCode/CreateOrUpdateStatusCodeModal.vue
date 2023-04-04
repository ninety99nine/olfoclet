<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        @open="resetForm()"
        @close="$emit('close')"
        :primaryAction="createStatusCode"
        :primaryText="modeInCaps + ' Status Code'"
        :defaultAction="cancelCreateStatusCode">

        <!-- Modal Title -->
        <template v-slot:title>{{ modeInCaps + ' Status Code' }}</template>

        <!-- Modal Content -->
        <p v-if="mode == 'clone'" class="text-sm text-gray-500 mb-5">Cloning <span class="text-blue-500 font-bold">{{ statusCode.name }}</span> status code</p>

        <!-- Explainer -->
        <PrimaryAlert class="items-center mb-6">
            <span>
                Use <span class="font-semibold text-green-500">1xx</span>, <span class="font-semibold text-green-500">2xx</span>,
                <span class="font-semibold text-green-500">3xx</span>, <span class="font-semibold text-red-500">4xx</span> or
                <span class="font-semibold text-red-500">5xx</span> to target a collection of status codes.
            </span>
        </PrimaryAlert>

        <!-- Status Code Name -->
        <DefaultInput v-model="form.status" label="Status code" placeholder="200" :error="form.errors.status"></DefaultInput>

        <!-- Status Code Description -->
        <Transition name="fade" mode="out-in" appear>
            <div v-if="matchingStatusCode.code" class="text-xs mt-6">
                <span>Meaning: </span>
                <span :class="[(form.status >= 400 || ['4xx', '5xx'].includes(form.status)) ? 'text-red-500' : 'text-green-500']">{{ matchingStatusCode.desc }}</span>
            </div>
        </Transition>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <PrimaryButton v-if="mode == 'create'" name="trigger" class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <span>Create Status Code</span>
            </PrimaryButton>

            <svg v-else-if="mode == 'clone'" name="trigger" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 cursor-pointer hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>

            <svg v-else-if="mode == 'update'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 cursor-pointer hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>

        </template>

    </DefaultModal>

</template>

<script>

    import _, { cloneDeep } from 'lodash';
    import { useForm } from '@inertiajs/vue3'
    import PrimaryAlert from '@components/Alert/PrimaryAlert';
    import DefaultInput from "@components/Input/DefaultInput";
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import PrimaryButton from "@components/Button/PrimaryButton";

    export default {
        components: { useForm, PrimaryAlert, DefaultInput, DefaultModal, PrimaryButton },
        props: {
            statusCodes: {
                type: Array
            },
            statusCode: {
                type: Object,
                default: null
            },
            index: {
                type: Number,
                default: null
            },
            mode: {
                type: String,
                default: null,
                validator(value) {
                    return ['create', 'clone', 'update'].includes(value)
                }
            },
        },
        data() {
            return {
                form: null,
                useVersionBuilder: useVersionBuilder(),
                commonStatusCodes: [
                    //  1xx
                    {'code': '100', 'desc': 'Continue'},
                    {'code': '101', 'desc': 'Switching Protocols'},
                    {'code': '102', 'desc': 'Processing (WebDAV)'},
                    {'code': '1xx', 'desc': 'Catch Status: 100 <= x < 200'},

                    //  2xx
                    {'code': '200', 'desc': 'OK'},
                    {'code': '201', 'desc': 'Created'},
                    {'code': '202', 'desc': 'Accepted'},
                    {'code': '203', 'desc': 'Non-Authoritative Information'},
                    {'code': '204', 'desc': 'No Content'},
                    {'code': '205', 'desc': 'Reset Content'},
                    {'code': '206', 'desc': 'Partial Content'},
                    {'code': '207', 'desc': 'Multi-Status (WebDAV)'},
                    {'code': '208', 'desc': 'Already Reported (WebDAV)'},
                    {'code': '226', 'desc': 'IM Used'},
                    {'code': '2xx', 'desc': 'Catch Status: 200 <= x < 300'},

                    //  3xx
                    {'code': '300', 'desc': 'Multiple Choices'},
                    {'code': '301', 'desc': 'Moved Permanently'},
                    {'code': '302', 'desc': 'Found'},
                    {'code': '303', 'desc': 'See Other'},
                    {'code': '304', 'desc': 'Not Modified'},
                    {'code': '305', 'desc': 'Use Proxy'},
                    {'code': '306', 'desc': '(Unused)'},
                    {'code': '307', 'desc': 'Temporary Redirect'},
                    {'code': '308', 'desc': 'Permanent Redirect (experimental)'},
                    {'code': '3xx', 'desc': 'Catch Status: 200 <= x < 300'},

                    //  4xx
                    {'code': '400', 'desc': 'Bad Request'},
                    {'code': '401', 'desc': 'Unauthorized'},
                    {'code': '402', 'desc': 'Payment Required'},
                    {'code': '403', 'desc': 'Forbidden'},
                    {'code': '404', 'desc': 'Not Found'},
                    {'code': '405', 'desc': 'Method Not Allowed'},
                    {'code': '406', 'desc': 'Not Acceptable'},
                    {'code': '407', 'desc': 'Proxy Authentication Required'},
                    {'code': '408', 'desc': 'Request Timeout'},
                    {'code': '409', 'desc': 'Conflict'},
                    {'code': '410', 'desc': 'Gone'},
                    {'code': '411', 'desc': 'Length Required'},
                    {'code': '412', 'desc': 'Precondition Failed'},
                    {'code': '413', 'desc': 'Request Entity Too Large'},
                    {'code': '414', 'desc': 'Request-URI Too Long'},
                    {'code': '415', 'desc': 'Unsupported Media Type'},
                    {'code': '416', 'desc': 'Requested Range Not Satisfiable'},
                    {'code': '417', 'desc': 'Expectation Failed'},
                    {'code': '418', 'desc': 'I\'m a teapot (RFC 2324)'},
                    {'code': '420', 'desc': 'Enhance Your Calm (Twitter)'},
                    {'code': '422', 'desc': 'Unprocessable Entity (WebDAV)'},
                    {'code': '423', 'desc': 'Locked (WebDAV)'},
                    {'code': '424', 'desc': 'Failed Dependency (WebDAV)'},
                    {'code': '425', 'desc': 'Reserved for WebDAV'},
                    {'code': '426', 'desc': 'Upgrade Required'},
                    {'code': '428', 'desc': 'Precondition Required'},
                    {'code': '429', 'desc': 'Too Many Requests'},
                    {'code': '431', 'desc': 'Request Header Fields Too Large'},
                    {'code': '449', 'desc': 'Retry With (Microsoft)'},
                    {'code': '450', 'desc': 'Blocked by Windows Parental Controls (Microsoft)'},
                    {'code': '451', 'desc': 'Unavailable For Legal Reasons'},
                    {'code': '499', 'desc': 'Client Closed Request (Nginx)'},
                    {'code': '4xx', 'desc': 'Catch Status: 400 <= x < 500'},

                    //  5xx
                    {'code': '500', 'desc': 'Internal Server Error'},
                    {'code': '501', 'desc': 'Not Implemented'},
                    {'code': '502', 'desc': 'Bad Gateway'},
                    {'code': '503', 'desc': 'Service Unavailable'},
                    {'code': '504', 'desc': 'Gateway Timeout'},
                    {'code': '505', 'desc': 'HTTP Version Not Supported'},
                    {'code': '506', 'desc': 'Variant Also Negotiates (Experimental)'},
                    {'code': '507', 'desc': 'Insufficient Storage (WebDAV)'},
                    {'code': '508', 'desc': 'Loop Detected (WebDAV)'},
                    {'code': '509', 'desc': 'Bandwidth Limit Exceeded (Apache)'},
                    {'code': '510', 'desc': 'Not Extended'},
                    {'code': '511', 'desc': 'Network Authentication Required'},
                    {'code': '598', 'desc': 'Network read timeout error'},
                    {'code': '599', 'desc': 'Network connect timeout error'},
                    {'code': '5xx', 'desc': 'Catch Status: x >= 500'}
                ]
            }
        },
        computed: {
            modeInCaps() {
                return this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
            },
            matchingStatusCode() {

                const matchingStatusCodes = this.commonStatusCodes.filter((commonStatusCode) => {
                    return commonStatusCode.code === this.form.status
                });

                return matchingStatusCodes.length == 0 ? {} : matchingStatusCodes[0];

            }
        },
        methods: {
            resetForm(){

                if( this.mode == 'create') {

                    this.form = useForm({
                        status: ''
                    });

                }else if( this.mode == 'clone') {

                    this.form = useForm(
                         useVersionBuilder().getClonedStatusCode(this.statusCode)
                    );

                }else if( this.mode == 'update') {

                    this.form = useForm({
                        ...useVersionBuilder().getBlankStatusCode(),
                        ..._.cloneDeep(this.statusCode)
                    });

                }
            },
            createStatusCode(closeModal) {

                //  Clear existing errors
                this.form.clearErrors();

                if( this.mode == 'create') {

                    this.form = useForm(

                        //  Get the blank status code matching the form code
                        this.useVersionBuilder.getBlankStatusCode(this.form.status),

                    );

                }

                //  Check if we have an existing statusCode using the same code
                const totalExactMatches = this.useVersionBuilder.searchStatusCodes(this.statusCodes, this.form.status, true).length;

                if( this.form.status.length == 0 ) {

                    this.form.setError('status', 'The status code is required');

                }else if( ['create', 'clone'].includes(this.mode) && totalExactMatches ) {

                    this.form.setError('status', 'This status code is already in use');

                }else if( this.mode == 'update' && totalExactMatches && this.statusCode.code !== this.form.status ) {

                    this.form.setError('status', 'This status code is already in use');

                }

                if( this.form.hasErrors === false ) {

                    let statusCode = this.form.data();

                    if( this.mode == 'update' ) {

                        this.useVersionBuilder.updateStatusCode(this.statusCodes, statusCode, this.index);

                    }else{

                        this.useVersionBuilder.addStatusCode(this.statusCodes, statusCode);

                    }

                    //  Determine the action name e.g created, cloned or updated
                    const actionName = (this.mode + 'd');

                    this.$message({
                        message: 'Status code '+actionName+' successfully',
                        type: 'success'
                    });

                    closeModal();

                }

            },
            cancelCreateStatusCode() {

                //  Clear existing errors
                this.form.clearErrors();

            }
        }
    };

</script>
