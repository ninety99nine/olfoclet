export default {

    restApi: (form) => {

        if( form.event_data.url.code_editor_mode == false && ['', null].includes(form.event_data.url.text) ) {

            form.setError('url', 'The url is required');

        }else if( form.event_data.url.code_editor_mode == true && ['', null].includes(form.event_data.url.code_editor_text) ) {

            form.setError('url', 'The url is required');

        }

        if( form.event_data.url.code_editor_mode == true && ['', null].includes(form.event_data.cache.name) ) {

            form.setError('cache_name', 'The cache name is required');

        }

        if( form.event_data.cache.enabled == true && ['', null].includes(form.event_data.cache.duration.number) ) {

            form.setError('cache_duration_number', 'The cache duration is required');

        }else if( form.event_data.url.code_editor_mode == true && ['', null].includes(form.event_data.cache.duration.type) ) {

            form.setError('cache_duration_type', 'The cache duration is required');

        }

        if( form.event_data.query_params.length > 0 ) {

            for (let index = 0; index < form.event_data.query_params.length; index++) {

                const query_param = form.event_data.query_params[index];

                if( ['', null].includes(query_param.name) ) {

                    form.setError('query_params', 'The query param name is required');

                }else if( query_param.value.code_editor_mode == false && ['', null].includes(query_param.value.text) ) {

                    form.setError('query_params', 'The query param value is required');

                }else if( query_param.value.code_editor_mode == true && ['', null].includes(query_param.value.code_editor_text) ) {

                    form.setError('query_params', 'The query param value is required');

                }

            }

        }

        if( form.event_data.headers.length > 0 ) {

            for (let index = 0; index < form.event_data.headers.length; index++) {

                const header = form.event_data.headers[index];

                if( ['', null].includes(header.name) ) {

                    form.setError('headers', 'The header name is required');

                }else if( header.value.code_editor_mode == false && ['', null].includes(header.value.text) ) {

                    form.setError('headers', 'The header value is required');

                }else if( header.value.code_editor_mode == true && ['', null].includes(header.value.code_editor_text) ) {

                    form.setError('headers', 'The header value is required');

                }

            }

        }

        if( form.event_data.form_data.params.length > 0 ) {

            for (let index = 0; index < form.event_data.form_data.params.length; index++) {

                const header = form.event_data.form_data.params[index];

                if( ['', null].includes(header.name) ) {

                    form.setError('form_data_params', 'The form body name is required');

                }else if( header.value.code_editor_mode == false && ['', null].includes(header.value.text) ) {

                    form.setError('form_data_params', 'The form body value is required');

                }else if( header.value.code_editor_mode == true && ['', null].includes(header.value.code_editor_text) ) {

                    form.setError('form_data_params', 'The form body value is required');

                }

            }

        }

        if( form.event_data.response.selected_type == 'automatic' ) {

            if( form.event_data.response.general.default_success_message.code_editor_mode == false && ['', null].includes(form.event_data.response.general.default_success_message.text) ) {

                form.setError('default_success_message', 'The default success message is required');

            }else if( form.event_data.response.general.default_success_message.code_editor_mode == true && ['', null].includes(form.event_data.response.general.default_success_message.code_editor_text) ) {

                form.setError('default_success_message', 'The default success message is required');

            }

            if( form.event_data.response.general.default_error_message.code_editor_mode == false && ['', null].includes(form.event_data.response.general.default_error_message.text) ) {

                form.setError('default_error_message', 'The default error message is required');

            }else if( form.event_data.response.general.default_error_message.code_editor_mode == true && ['', null].includes(form.event_data.response.general.default_error_message.code_editor_text) ) {

                form.setError('default_error_message', 'The default error message is required');

            }

        }

        if( form.event_data.response.selected_type == 'manual' ) {

            for (let x = 0; x < form.event_data.response.manual.response_status_handles.length; x++) {

                const status_handle = form.event_data.response.manual.response_status_handles[x];

                for (let y = 0; y < status_handle.attributes.length; y++) {

                    const attribute = status_handle.attributes[y];

                    if( ['', null].includes(attribute.name) ) {

                        form.setError('status_handle_attributes', 'The response attribute is required');

                    }else if( attribute.code_editor_mode == false && ['', null].includes(attribute.text) ) {

                        form.setError('status_handle_attributes', 'The response attribute is required');

                    }else if( attribute.code_editor_mode == true && ['', null].includes(attribute.code_editor_text) ) {

                        form.setError('status_handle_attributes', 'The response attribute is required');

                    }

                }

            }

        }

        form.event_data.response.manual.response_status_handles


    },

    smsApi: (form) => {

        if( form.event_data.sender_name.code_editor_mode == false && ['', null].includes(form.event_data.sender_name.text) ) {

            form.setError('sender_name', 'The sender name is required');

        }else if( form.event_data.sender_name.code_editor_mode == true && ['', null].includes(form.event_data.sender_name.code_editor_text) ) {

            form.setError('sender_name', 'The sender name is required');

        }

        if( form.event_data.sender_number.code_editor_mode == false && ['', null].includes(form.event_data.sender_number.text) ) {

            form.setError('sender_number', 'The sender number is required');

        }else if( form.event_data.sender_number.code_editor_mode == true && ['', null].includes(form.event_data.sender_number.code_editor_text) ) {

            form.setError('sender_number', 'The sender number is required');

        }

        if( form.event_data.recipient_number.code_editor_mode == false && ['', null].includes(form.event_data.recipient_number.text) ) {

            form.setError('recipient_number', 'The recipient number is required');

        }else if( form.event_data.recipient_number.code_editor_mode == true && ['', null].includes(form.event_data.recipient_number.code_editor_text) ) {

            form.setError('recipient_number', 'The recipient number is required');

        }

        if( form.event_data.message.code_editor_mode == false && ['', null].includes(form.event_data.message.text) ) {

            form.setError('message', 'The message is required');

        }else if( form.event_data.message.code_editor_mode == true && ['', null].includes(form.event_data.message.code_editor_text) ) {

            form.setError('message', 'The message is required');

        }

    },

    orangeMoneyApi: (form) => {

        if( form.event_data.msisdn.code_editor_mode == false && ['', null].includes(form.event_data.msisdn.text) ) {

            form.setError('msisdn', 'The msisdn is required');

        }else if( form.event_data.msisdn.code_editor_mode == true && ['', null].includes(form.event_data.msisdn.code_editor_text) ) {

            form.setError('msisdn', 'The msisdn is required');

        }

        if( form.event_data.amount.code_editor_mode == false && ['', null].includes(form.event_data.amount.text) ) {

            form.setError('amount', 'The amount is required');

        }else if( form.event_data.amount.code_editor_mode == true && ['', null].includes(form.event_data.amount.code_editor_text) ) {

            form.setError('amount', 'The amount is required');

        }

        if( form.event_data.payment_reference.code_editor_mode == false && ['', null].includes(form.event_data.payment_reference.text) ) {

            form.setError('payment_reference', 'The payment reference number is required');

        }else if( form.event_data.payment_reference.code_editor_mode == true && ['', null].includes(form.event_data.payment_reference.code_editor_text) ) {

            form.setError('payment_reference', 'The payment reference number is required');

        }

        if( form.event_data.merchant_code.code_editor_mode == false && ['', null].includes(form.event_data.merchant_code.text) ) {

            form.setError('merchant_code', 'The merchant code is required');

        }else if( form.event_data.merchant_code.code_editor_mode == true && ['', null].includes(form.event_data.merchant_code.code_editor_text) ) {

            form.setError('merchant_code', 'The merchant code is required');

        }

        /*  At the moment this field is not required, so let's disable its validation

        if( form.event_data.endpoint.code_editor_mode == false && ['', null].includes(form.event_data.endpoint.text) ) {

            form.setError('endpoint', 'The endpoint is required');

        }else if( form.event_data.endpoint.code_editor_mode == true && ['', null].includes(form.event_data.endpoint.code_editor_text) ) {

            form.setError('endpoint', 'The endpoint is required');

        }

        */

    },

    airtimeBillingApi: (form) => {

        if( ['', null].includes(form.event_data.airtime_billing_action) ) {

            form.setError('airtime_billing_action', 'The action is required');

        }

        if( ['', null].includes(form.event_data.response_reference_name) ) {

            form.setError('response_reference_name', 'The response reference name is required');

        }

        if( form.event_data.msisdn.code_editor_mode == false && ['', null].includes(form.event_data.msisdn.text) ) {

            form.setError('msisdn', 'The msisdn is required');

        }else if( form.event_data.msisdn.code_editor_mode == true && ['', null].includes(form.event_data.msisdn.code_editor_text) ) {

            form.setError('msisdn', 'The msisdn is required');

        }

        if( form.event_data.amount.code_editor_mode == false && ['', null].includes(form.event_data.amount.text) ) {

            form.setError('amount', 'The amount is required');

        }else if( form.event_data.amount.code_editor_mode == true && ['', null].includes(form.event_data.amount.code_editor_text) ) {

            form.setError('amount', 'The amount is required');

        }

        if( form.event_data.currency.code_editor_mode == false && ['', null].includes(form.event_data.currency.text) ) {

            form.setError('currency', 'The currency is required');

        }else if( form.event_data.currency.code_editor_mode == true && ['', null].includes(form.event_data.currency.code_editor_text) ) {

            form.setError('currency', 'The currency is required');

        }

        if( form.event_data.description.code_editor_mode == false && ['', null].includes(form.event_data.description.text) ) {

            form.setError('description', 'The description is required');

        }else if( form.event_data.description.code_editor_mode == true && ['', null].includes(form.event_data.description.code_editor_text) ) {

            form.setError('description', 'The description is required');

        }

    },

    validation: (form) => {

        if( form.event_data.target.code_editor_mode == false && ['', null].includes(form.event_data.target.text) ) {

            form.setError('target', 'The target is required');

        }else if( form.event_data.target.code_editor_mode == true && ['', null].includes(form.event_data.target.code_editor_text) ) {

            form.setError('target', 'The target is required');

        }

    },

    formatting: (form) => {

        if( form.event_data.target.code_editor_mode == false && ['', null].includes(form.event_data.target.text) ) {

            form.setError('target', 'The target is required');

        }else if( form.event_data.target.code_editor_mode == true && ['', null].includes(form.event_data.target.code_editor_text) ) {

            form.setError('target', 'The target is required');

        }

    },

    setProperty: (form) => {

        if( ['', null].includes(form.event_data.reference_name) ) {

            form.setError('reference_name', 'The property reference name is required');

        }

    },

    customCode: (form) => {

        if( ['', null].includes(form.event_data.code) ) {

            form.setError('reference_name', 'The custom code is required');

        }

    },

    autoLink: (form) => {

        if( ['', null].includes(form.event_data.trigger.selected_type) ) {

            form.setError('selected_type', 'The trigger type is required');

        }

        if( form.event_data.trigger.selected_type == 'manual' ) {

            if( form.event_data.trigger.manual.input.code_editor_mode == false && ['', null].includes(form.event_data.trigger.manual.input.text) ) {

                form.setError('input', 'The trigger input is required');

            }else if( form.event_data.trigger.manual.input.code_editor_mode == true && ['', null].includes(form.event_data.trigger.manual.input.code_editor_text) ) {

                form.setError('input', 'The trigger input is required');

            }

        }

        if( form.event_data.link.code_editor_mode == false && ['', null].includes(form.event_data.link.text) ) {

            form.setError('link', 'The link is required');

        }else if( form.event_data.link.code_editor_mode == true && ['', null].includes(form.event_data.link.code_editor_text) ) {

            form.setError('link', 'The link is required');

        }

    },

    autoReply: (form) => {

        if( form.event_data.automatic_replies.code_editor_mode == false && ['', null].includes(form.event_data.automatic_replies.text) ) {

            form.setError('automatic_replies', 'The replies are required');

        }else if( form.event_data.automatic_replies.code_editor_mode == true && ['', null].includes(form.event_data.automatic_replies.code_editor_text) ) {

            form.setError('automatic_replies', 'The replies are required');

        }

    },

    revisit: (form) => {

        if( ['', null].includes(form.event_data.general.trigger.selected_type) ) {

            form.setError('trigger_selected_type', 'The trigger type is required');

        }

        if( form.event_data.general.trigger.selected_type == 'manual' ) {

            if( form.event_data.general.trigger.manual.input.code_editor_mode == false && ['', null].includes(form.event_data.general.trigger.manual.input.text) ) {

                form.setError('input', 'The trigger input is required');

            }else if( form.event_data.general.trigger.manual.input.code_editor_mode == true && ['', null].includes(form.event_data.general.trigger.manual.input.code_editor_text) ) {

                form.setError('input', 'The trigger input is required');

            }

        }

        if( ['', null].includes(form.event_data.revisit_type.selected_type) ) {

            form.setError('revisit_selected_type', 'The trigger type is required');

        }

        if( form.event_data.revisit_type.selected_type == 'screen_revisit' ) {

            if( form.event_data.revisit_type.screen_revisit.link.code_editor_mode == false && ['', null].includes(form.event_data.revisit_type.screen_revisit.link.text) ) {

                form.setError('link', 'The link is required');

            }else if( form.event_data.revisit_type.screen_revisit.link.code_editor_mode == true && ['', null].includes(form.event_data.revisit_type.screen_revisit.link.code_editor_text) ) {

                form.setError('link', 'The link is required');

            }

        }

        if( form.event_data.revisit_type.selected_type == 'marked_revisit' ) {

            if( ['', null].includes(form.event_data.revisit_type.marked_revisit.selected_marker) ) {

                form.setError('selected_marker', 'The marker is required');

            }

        }

    },

    redirect: (form) => {

        if( ['', null].includes(form.event_data.general.trigger.selected_type) ) {

            form.setError('selected_type', 'The trigger type is required');

        }

        if( form.event_data.general.trigger.selected_type == 'manual' ) {

            if( form.event_data.general.trigger.manual.input.code_editor_mode == false && ['', null].includes(form.event_data.general.trigger.manual.input.text) ) {

                form.setError('input', 'The trigger input is required');

            }else if( form.event_data.general.trigger.manual.input.code_editor_mode == true && ['', null].includes(form.event_data.general.trigger.manual.input.code_editor_text) ) {

                form.setError('input', 'The trigger input is required');

            }

        }

        if( form.event_data.service_code.code_editor_mode == false && ['', null].includes(form.event_data.service_code.text) ) {

            form.setError('service_code', 'The service code is required');

        }else if( form.event_data.service_code.code_editor_mode == true && ['', null].includes(form.event_data.service_code.code_editor_text) ) {

            form.setError('service_code', 'The service code is required');

        }

    },

    notification: (form) => {

        if( form.event_data.message.code_editor_mode == false && ['', null].includes(form.event_data.message.text) ) {

            form.setError('message', 'The message is required');

        }else if( form.event_data.message.code_editor_mode == true && ['', null].includes(form.event_data.message.code_editor_text) ) {

            form.setError('message', 'The message is required');

        }

        if( form.event_data.continue_text.code_editor_mode == false && ['', null].includes(form.event_data.continue_text.text) ) {

            form.setError('continue_text', 'The continue text is required');

        }else if( form.event_data.continue_text.code_editor_mode == true && ['', null].includes(form.event_data.continue_text.code_editor_text) ) {

            form.setError('continue_text', 'The continue text is required');

        }

        if( form.event_data.msisdn.code_editor_mode == false && ['', null].includes(form.event_data.msisdn.text) ) {

            form.setError('msisdn', 'The msisdn is required');

        }else if( form.event_data.msisdn.code_editor_mode == true && ['', null].includes(form.event_data.msisdn.code_editor_text) ) {

            form.setError('msisdn', 'The msisdn is required');

        }

    },

    eventCollection: (form) => {

        if( form.event_data.events.collection.length == 0 ) {

            form.setError('events', 'The events are required');

        }

    },

    terminateSession: (form) => {


    },

    database: (form) => {

        if( ['', null].includes(form.event_data.action) ) {

            form.setError('action', 'The action is required');

        }

        if( ['', null].includes(form.event_data.reference_name) ) {

            form.setError('reference_name', 'The reference name is required');

        }

        if( ['create', 'update', 'read_or_create', 'create_or_update'].includes(form.event_data.action) ) {

            if( form.event_data.additional_fields.length == 0 ) {

                form.setError('additional_fields', 'The variables are required');

            }

            if( form.event_data.action == 'update' && ['', null].includes(form.event_data.update_approach) ) {

                form.setError('update_approach', 'The update approach is required');

            }

        }

    },




}
