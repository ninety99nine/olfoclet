<template>

    <!-- Modal -->
    <DefaultModal
        defaultText="Cancel"
        @open="resetForm()"
        @close="$emit('close')"
        :primaryAction="createEvent"
        :defaultAction="cancelCreateEvent"
        :width="mode == 'create' ? 'w-2/5' : 'w-1/2'"
        :primaryText="['clone', 'update'].includes(mode) ? modeInCaps + ' Event' : ''">

        <!-- Modal Title -->
        <template v-slot:title>{{ modeInCaps + ' Event' }}</template>

        <!-- Modal Content - Pass Default Slot Props (firePrimaryAction) -->
        <template v-slot="{ firePrimaryAction }">

            <!-- Event Selector -->
            <EventSelector v-if="mode == 'create'" :form="form" :firePrimaryAction="firePrimaryAction"></EventSelector>

            <!-- Event Editor -->
            <EventEditor v-else :form="form" :event="event" :mode="mode"></EventEditor>

        </template>

        <!-- Modal Trigger -->
        <template v-slot:trigger>

            <PrimaryButton v-if="mode == 'create'" name="trigger" class="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <slot></slot>
            </PrimaryButton>

            <!-- Clone Icon -->
            <svg v-else-if="mode == 'clone'" name="trigger" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 cursor-pointer hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>

            <!-- Edit Icon -->
            <svg v-else-if="mode == 'update'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 cursor-pointer hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>

        </template>

    </DefaultModal>

</template>

<script>

    import _, { cloneDeep } from 'lodash';
    import EventEditor from './EventEditor'
    import eventValidation from './validation'
    import EventSelector from './EventSelector'
    import { useForm } from '@inertiajs/vue3'
    import DefaultModal from "@components/Modal/DefaultModal";
    import { useVersionBuilder } from '@stores/VersionBuilder';
    import PrimaryButton from "@components/Button/PrimaryButton";

    export default {
        components: { useForm, EventEditor, EventSelector, DefaultModal, PrimaryButton },
        props: {
            events: {
                type: Object,
                default: () => {
                    return [];
                }
            },
            event: {
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
                useVersionBuilder: useVersionBuilder()
            }
        },
        computed: {
            modeInCaps() {

                return this.mode.charAt(0).toUpperCase() + this.mode.slice(1);

            }
        },
        methods: {
            resetForm(){

                if( this.mode == 'create') {

                    this.form = useForm({
                        name: ''
                    });

                }else if( this.mode == 'clone') {

                    this.form = useForm(
                         this.useVersionBuilder.getClonedEvent(this.event)
                    );

                }else if( this.mode == 'update') {

                    this.form = useForm({
                        ...this.useVersionBuilder.getBlankEvent(),
                        ..._.cloneDeep(this.event)
                    });

                }
            },
            createEvent(closeModal) {

                //  Clear existing errors
                this.form.clearErrors();

                if( this.mode == 'create') {

                    this.form = useForm({

                        //  Get the blank event matching the form name
                        ...this.useVersionBuilder.getBlankEvent(this.form.name),

                        //  Get the suggested event name
                        ...{
                            name: this.useVersionBuilder.suggestEventName(this.events, this.form.name)
                        }

                    });

                }

                //  Check if we have an existing event using the same name
                const totalExactMatches = this.useVersionBuilder.searchEvents(this.events, this.form.name, true).length;

                if( this.form.name.length == 0 ) {

                    this.form.setError('name', 'The event name is required');

                }else if( this.form.name.length < 3 ) {

                    this.form.setError('name', 'The event name is too short');

                }else if( this.form.name.length > 50 ) {

                    this.form.setError('name', 'The event name is too long');

                }else if( ['create', 'clone'].includes(this.mode) && totalExactMatches ) {

                    this.form.setError('name', 'This event name is already in use');

                }else if( this.mode == 'update' && totalExactMatches && this.event.name !== this.form.name ) {

                    this.form.setError('name', 'This event name is already in use');

                }else if( ['update', 'clone'].includes(this.mode) ) {

                    //  Validate on event type

                    if( this.form.type == 'REST API' ) {

                       eventValidation.restApi(this.form);

                    }else if( this.form.type == 'SMS API' ) {

                       eventValidation.smsApi(this.form);

                    }else if( this.form.type == 'Airtime Billing API' ) {

                       eventValidation.airtimeBillingApi(this.form);

                    }else if( this.form.type == 'Orange Money API' ) {

                       eventValidation.orangeMoneyApi(this.form);

                    }else if( this.form.type == 'Email API' ) {

                       eventValidation.emailApi(this.form);

                    }else if( this.form.type == 'Validation' ) {

                       eventValidation.validation(this.form);

                    }else if( this.form.type == 'Formatting' ) {

                       eventValidation.formatting(this.form);

                    }else if( this.form.type == 'Set Property' ) {

                       eventValidation.setProperty(this.form);

                    }else if( this.form.type == 'Custom Code' ) {

                       eventValidation.customCode(this.form);

                    }else if( this.form.type == 'Auto Link' ) {

                       eventValidation.autoLink(this.form);

                    }else if( this.form.type == 'Auto Reply' ) {

                       eventValidation.autoReply(this.form);

                    }else if( this.form.type == 'Revisit' ) {

                       eventValidation.revisit(this.form);

                    }else if( this.form.type == 'Redirect' ) {

                       eventValidation.redirect(this.form);

                    }else if( this.form.type == 'Notification' ) {

                       eventValidation.notification(this.form);

                    }else if( this.form.type == 'Event Collection' ) {

                       eventValidation.eventCollection(this.form);

                    }else if( this.form.type == 'Terminate Session' ) {

                       eventValidation.terminateSession(this.form);

                    }else if( this.form.type == 'Database' ) {

                       eventValidation.database(this.form);

                    }

                }

                if( this.form.hasErrors === false ) {

                    let event = this.form.data();

                    if( this.mode == 'update' ) {

                        this.useVersionBuilder.updateEvent(this.events, event, this.index);

                    }else{

                        this.useVersionBuilder.addEvent(this.events, event);

                    }

                    //  Determine the action name e.g created, cloned or updated
                    const actionName = (this.mode + 'd');

                    this.$message({
                        message: 'Event '+actionName+' successfully',
                        type: 'success'
                    });

                    closeModal();

                }else{

                    this.$message({
                        message: 'Sorry, we found some mistakes',
                        type: 'error'
                    });

                }

            },
            cancelCreateEvent() {

                //  Clear existing errors
                this.form.clearErrors();

            }
        }
    };

</script>
