<?php

namespace App\Traits;

use App\Traits\Base\BaseTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

trait VersionTrait
{
    use BaseTrait;

    public function getCacheName($id)
    {
        return $this->getBaseCacheName().'_'.$id;
    }

    public function findAndCache($id = null)
    {
        if( $id == null) {

            $version = $this;
            $id = $version->id;

        }else{

            //  We failed to retrieve from the cache, therefore perform a query
            $version = DB::table('versions')->select('id', 'number', 'description', 'builder')->find($id);

            //  Convert the builder to an associative array (We want to do this operation once)
            $version->builder = json_decode($version->builder, true);

        }

        //  Cache the version
        Cache::put($this->getCacheName($id), $version);

        //  Return the project
        return $version;
    }

    public function removeFromCache($id = null)
    {
        if( $id == null) {
            $id = $this->id;
        }

        Cache::forget($this->getCacheName($id));
    }

    public function getBuilderTemplate()
    {
        return [
            'screens' => [],
            'markers' => [],
            'application_events' => [
                'on_start' => [
                    'conditional' => [
                        'code' => null,
                        'active' => false
                    ],
                    'collection' => []
                ],
                'on_close' => [
                    'conditional' => [
                        'code' => null,
                        'active' => false
                    ],
                    'collection' => []
                ],
            ],
            'global_events' => [],
            'global_variables' => [],
            'global_pagination' => [
                'active' => [
                    'selected_type' => 'yes',
                    'code' => ''
                ],
                'content_target' => [
                    'selected_type' => 'both'         //  instruction, action, both
                ],
                'paginate_by_line_breaks' => true,
                'slice' => [
                    'separation_type' => 'words',     //  characters, words
                    'start' => [
                        'text' => '0',
                        'code_editor_text' => '',
                        'code_editor_mode' => false
                    ],
                    'end' => [
                        'text' => '160',
                        'code_editor_text' => '',
                        'code_editor_mode' => false
                    ]
                ],
                'scroll_down' => [
                    'name' => [
                        'text' => '99. Next',
                        'code_editor_text' => '',
                        'code_editor_mode' => false
                    ],
                    'input' => [
                        'text' => '99',
                        'code_editor_text' => '',
                        'code_editor_mode' => false
                    ],
                    'visible' => true
                ],
                'scroll_up' => [
                    'name' => [
                        'text' => '88. Prev',
                        'code_editor_text' => '',
                        'code_editor_mode' => false
                    ],
                    'input' => [
                        'text' => '88',
                        'code_editor_text' => '',
                        'code_editor_mode' => false
                    ],
                    'visible' => true
                ],
                'trailing_end' => [
                    'text' => '...',
                    'code_editor_text' => '',
                    'code_editor_mode' => false
                ],
                'break_line_before_trail' => false,
                'break_line_after_trail' => false,
            ],
            'subscription_plans' => [],
            'conditional_screens' => [
                'active' => false,
                'code' => null,
            ],
            'color_scheme'=> [
                'event_colors'=> [
                    'REST API' => '#2D8CF0',
                    'SMS API' => '#2D8CF0',
                    'Airtime Billing API' => '#2D8CF0',
                    'Orange Money API' => '#2D8CF0',
                    'Validation' => '#ED4014',
                    'Formatting' => '#F9E31C',
                    'Set Property' => '#2D8CF0',    // 2
                    'Custom Code' => '#00C2B1',
                    'Auto Link' => '#00BCD4',
                    'Auto Reply' => '#F06292',
                    'Revisit' => '#EA4CA3',         // 1
                    'Redirect' => '#EA4CA3',        // 1
                    'Notification' => '#19BE6B',
                    'Event Collection' => '#FEBD79',
                    'Terminate Session' => '#607D8B',   // 2
                    'Database' => '#19C919',

                    //  'Local Storage' => '#607D8B',
                ]
            ],
            'restrictions' => [
                'selected_type' => 'None',
                'blacklist' => [
                    'active' => false,
                    'numbers' => [
                        'text' => '',
                        'code_editor_text' => '',
                        'code_editor_mode' => false
                    ],
                    'message' => 'Access denied to service'
                ],
                'whitelist' => [
                    'active' => false,
                    'numbers' => [
                        'text' => '',
                        'code_editor_text' => '',
                        'code_editor_mode' => false
                    ],
                    'message' => 'Access denied to service'
                ]
            ],
            'simulator' => [
                'debugger' => [
                    'return_logs' => true,
                    'return_log_types' => [
                        'info', 'warning', 'error',
                    ],
                    'return_summarized_logs' => true,
                ],
                'subscriber' => [
                    'phone_number' => '26772000001',
                ],
                'settings' => [
                    'allow_timeouts' => true,
                    'timeout_limit_in_seconds' => 120,
                    'timeout_message' => 'TIMEOUT: You have exceeded your time limit.',
                ],
            ],
            'log_settings' => [
                'simulator' => [
                    'save_logs' => 'never'  //  never, always, on_fail, on_success
                ],
                'mobile' => [
                    'save_logs' => 'never'  //  never, always, on_fail, on_success
                ],
                'duration' => [
                    'number' => 1,
                    'type' => 'days'
                ],
            ],
            'sms_connection' => [
                'client_credentials' => [
                    'text' => '',
                    'code_editor_text' => '',
                    'code_editor_mode' => false
                ]
            ],
            'airtime_billing_connection' => [
                'client_id' => [
                    'text' => '',
                    'code_editor_text' => '',
                    'code_editor_mode' => false
                ],
                'client_secret' => [
                    'text' => '',
                    'code_editor_text' => '',
                    'code_editor_mode' => false
                ],
            ],
            'firebase_connection' => [
                'json' => [
                    'text' => '',
                    'code_editor_text' => '',
                    'code_editor_mode' => false
                ],
            ],
            'appwrite_connection' => [
                'endpoint' => [
                    'text' => '',
                    'code_editor_text' => '',
                    'code_editor_mode' => false
                ],
                'project_id' => [
                    'text' => '',
                    'code_editor_text' => '',
                    'code_editor_mode' => false
                ],
                'api_key' => [
                    'text' => '',
                    'code_editor_text' => '',
                    'code_editor_mode' => false
                ],
            ]
        ];
    }

    public function repairBuilder($builder = null)
    {
        if( $builder === null ) {

            //  Get the version builder
            $builder = $this->builder;

        }

        //  Get the version builder template
        $builderTemplate = $this->getBuilderTemplate();

        //  This fixes the builder events
        $fixEvents = function($events) use ( &$fixEvents ) {

            foreach($events as $x => $event) {

                //  Fix issues related to the "CRUD API" event handler
                if ($event['type'] == 'CRUD API') {

                    //  Rename the event type
                    $events[$x]['type'] = 'REST API';

                }

                //  Fix issues related to the "SMS API" event handler
                if ($event['type'] == 'SMS API') {

                    //  If the "sender" property is set
                    if( isset($events[$x]['event_data']['sender']) ) {

                        //  Rename the "sender" property to "sender_name"
                        $events[$x]['event_data']['sender_name'] = $events[$x]['event_data']['sender'];
                        unset($events[$x]['event_data']['sender']);

                        //  Add the "sender_number" property
                        $events[$x]['event_data']['sender_number'] = '';

                    }

                    //  If the "recipient" property is set
                    if( isset($events[$x]['event_data']['recipient']) ) {

                        //  Rename the "recipient" property to "recipient_number"
                        $events[$x]['event_data']['recipient_number'] = $events[$x]['event_data']['recipient'];
                        unset($events[$x]['event_data']['recipient']);

                    }

                }

                //  Fix issues related to the "Notification" event handler
                if ($event['type'] == 'Notification') {

                    //  If the "can_expire" property is not set
                    if( !isset($events[$x]['event_data']['can_expire']) ) {

                        //  Add the "can_expire" property
                        $events[$x]['event_data']['can_expire'] = false;

                    }

                    //  If the "expiry_duration_number" property is not set
                    if( !isset($events[$x]['event_data']['expiry_duration_number']) ) {

                        //  Add the "expiry_duration_number" property
                        $events[$x]['event_data']['expiry_duration_number'] = [
                            'text' => '30',
                            'code_editor_text' => '',
                            'code_editor_mode' => false
                        ];

                    }

                    //  If the "expiry_duration_type" property is not set
                    if( !isset($events[$x]['event_data']['expiry_duration_type']) ) {

                        //  Add the "expiry_duration_type" property
                        $events[$x]['event_data']['expiry_duration_type'] = 'Seconds';

                    }

                    //  If the "display_session_type" property is not set
                    if( !isset($events[$x]['event_data']['display_session_type']) ) {

                        //  Add the "display_session_type" property
                        $events[$x]['event_data']['display_session_type'] = 'Any Session';

                    }

                }

                //  Fix issues related to the "REST API" event handler
                if ($event['type'] == 'REST API') {

                    //  (1) ENABLE CODE EDITOR MODE FOR THE RESPONSE STATUS HANDLE ATTRIBUTES

                    //  Get the response status handles
                    $response_status_handles = $events[$x]['event_data']['response']['manual']['response_status_handles'] ?? [];

                    //  Foreach status handle
                    foreach($response_status_handles as $y => $responseStatusHandle) {

                        //  Get the response status handle attributes
                        $attributes = $responseStatusHandle['attributes'];

                        //  Foreach status attribute
                        foreach ($attributes as $z => $attribute) {

                            //  If the attribute does not has a name
                            if( empty($attribute['name']) ) {

                                //  Remove it
                                unset($events[$x]['event_data']['response']['manual']['response_status_handles'][$y]['attributes'][$z]);

                            //  If the variable does not support code editor mode
                            }elseif( !isset($attribute['value']['code_editor_mode']) ) {

                                //  Enable code editor support
                                $events[$x]['event_data']['response']['manual']['response_status_handles'][$y]['attributes'][$z]['value'] = [
                                    'text' => $attribute['value'],  //  Set the old value as the text value
                                    'code_editor_text' => '',
                                    'code_editor_mode' => false
                                ];

                            }

                        }

                    }

                    //  (2) Remove the name field (its pointless)
                    if( isset($events[$x]['event_data']['name']) ) {

                        unset($events[$x]['event_data']['name']);

                    }

                    //  (3) Remove the trigger field (its pointless)
                    if( isset($events[$x]['event_data']['trigger']) ) {

                        unset($events[$x]['event_data']['trigger']);

                    }

                    //  (4) Set the cache field
                    if( !isset($events[$x]['event_data']['cache']) ) {

                        $events[$x]['event_data']['cache'] = [
                            'name' => '',
                            'enabled' => false,
                            'duration' => [
                                'number' => 1,
                                'type' => 'days'
                            ]
                        ];

                    }

                }

                //  Fix issues related to the "Manage User Account" event handler
                if ($event['type'] == 'Manage User Account') {

                    //  Rename the event type
                    $events[$x]['type'] = 'Database';

                    //  If the action is set to "check_existence"
                    if( $events[$x]['event_data']['action'] === 'check_existence' ) {

                        //  Set the action to "read"
                        $events[$x]['event_data']['action'] = 'read';

                    }

                    //  Add database variable function
                    $addVariable = function($name, $value, $defaultValue = null) {
                        return [
                            'name' => $name,
                            'value' => is_array($value) ? $value : [
                                'text' => $value,
                                'code_editor_text' => '',
                                'code_editor_mode' => false
                            ],
                            'on_empty' => [
                                'active' => is_array($defaultValue) ? true : false,
                                'value' => is_array($defaultValue) ? $defaultValue : [
                                    'text' => '',
                                    'code_editor_text' => '',
                                    'code_editor_mode' => false
                                ],
                            ],
                        ];

                    };

                    //  Get the additional fields
                    $additional_fields = $events[$x]['event_data']['additional_fields'] ?? [];

                    //  Foreach additional field
                    foreach($additional_fields as $y => $additionalField) {

                        //  If we are still using the old structure, lets rebuild to the new structure
                        if( isset($additionalField['key']) ) {

                            $name = $additionalField['key'];
                            $value = $additionalField['value'];
                            $defaultValue = $additionalField['on_empty_value']['default']['custom'];
                            $selectedType = $additionalField['on_empty_value']['default']['selected_type'];

                            if($selectedType == 'null') {

                                $defaultValue['code_editor_mode'] = true;
                                $defaultValue['code_editor_text'] = '<?php return null; ?>';

                            }else if($selectedType == 'true') {

                                $defaultValue['code_editor_mode'] = true;
                                $defaultValue['code_editor_text'] = '<?php return true; ?>';

                            }else if($selectedType == 'false') {

                                $defaultValue['code_editor_mode'] = true;
                                $defaultValue['code_editor_text'] = '<?php return false; ?>';

                            }else if($selectedType == 'empty_array') {

                                $defaultValue['code_editor_mode'] = true;
                                $defaultValue['code_editor_text'] = '<?php return []; ?>';

                            }

                            $events[$x]['event_data']['additional_fields'][$y] = $addVariable($name, $value, $defaultValue);

                        }

                    }

                    //  (1) Remove the first name field
                    if( isset($events[$x]['event_data']['first_name']) ) {

                        if( !empty($events[$x]['event_data']['first_name']) ) {

                            if( $events[$x]['event_data']['first_name']['code_editor_mode'] == true ) {

                                //  Set as metadata variable (as replacement)
                                $events[$x]['event_data']['additional_fields'][] = $addVariable('first_name', $events[$x]['event_data']['first_name']['code_editor_text']);

                            }else{

                                //  Set as metadata variable (as replacement)
                                $events[$x]['event_data']['additional_fields'][] = $addVariable('first_name', $events[$x]['event_data']['first_name']['text']);

                            }

                        }

                        unset($events[$x]['event_data']['first_name']);

                    }

                    //  (2) Remove the last name field
                    if( isset($events[$x]['event_data']['last_name']) ) {

                        if( !empty($events[$x]['event_data']['last_name']) ) {

                            if( $events[$x]['event_data']['last_name']['code_editor_mode'] == true ) {

                                //  Set as metadata variable (as replacement)
                                $events[$x]['event_data']['additional_fields'][] = $addVariable('last_name', $events[$x]['event_data']['last_name']['code_editor_text']);

                            }else{

                                //  Set as metadata variable (as replacement)
                                $events[$x]['event_data']['additional_fields'][] = $addVariable('last_name', $events[$x]['event_data']['last_name']['text']);

                            }

                        }

                        unset($events[$x]['event_data']['last_name']);
                    }

                    //  (3) Remove the mobile number field
                    if( isset($events[$x]['event_data']['mobile_number']) ) {

                        unset($events[$x]['event_data']['mobile_number']);

                    }

                    //  (4) Rename the "database_entry_reference_name" field to "reference_name"
                    if( isset($events[$x]['event_data']['database_entry_reference_name']) ) {

                        $events[$x]['event_data']['reference_name'] = $events[$x]['event_data']['database_entry_reference_name'];

                        unset($events[$x]['event_data']['database_entry_reference_name']);

                    }

                    //  (5) Replace the "user_account_reference_name" name field with the "reference_name" name field
                    if( isset($events[$x]['event_data']['user_account_reference_name']) ) {

                        $events[$x]['event_data']['reference_name'] = $events[$x]['event_data']['user_account_reference_name'];

                        unset($events[$x]['event_data']['user_account_reference_name']);

                    }

                    //  (6) Replace the "has_account_reference_name" name field with the "existence_reference_name" name field
                    if( isset($events[$x]['event_data']['has_account_reference_name']) ) {

                        $events[$x]['event_data']['existence_reference_name'] = $events[$x]['event_data']['has_account_reference_name'];

                        unset($events[$x]['event_data']['has_account_reference_name']);

                    }

                    //  (7) Add the "update_approach" field
                    if( !isset($events[$x]['event_data']['update_approach']) ) {

                        $events[$x]['event_data']['update_approach'] = 'merge';

                    }

                }

                //  Fix issues related to the "Database" event handler
                if ($event['type'] == 'Database') {

                    //  Get the additional fields
                    $additional_fields = $events[$x]['event_data']['additional_fields'] ?? [];

                    //  Foreach additional field
                    foreach($additional_fields as $y => $additionalField) {

                        //  If we do not have the "active" property, then set it
                        if( !isset($additionalField['on_empty']['active']) ) {

                            $events[$x]['event_data']['additional_fields'][$y]['on_empty']['active'] = true;

                        }

                    }

                }

                //  Fix issues related to the "Event Collection" event handler
                if( $event['type'] ==  'Event Collection') {

                    //  If the "collection" key does not exist on the event data
                    if( !isset($events[$x]['event_data']['events']['collection']) ) {

                        //  Set the "collection" key with the list of events as the initial value
                        $events[$x]['event_data']['events']['collection'] = $events[$x]['event_data']['events'];

                    }

                    //  If the "conditional" key does not exist on the event data
                    if( !isset($events[$x]['event_data']['events']['conditional']) ) {

                        //  Set the "conditional" key
                        $events[$x]['event_data']['events']['conditional'] = [
                            'code' => null,
                            'active' => false
                        ];

                    }

                    /**
                     *  Remove anything that is misplaced on the "events" key, this makes sure that only
                     *  the "collection" and "conditional" keys and data exist within the "events"
                     *  property
                     */
                    $events[$x]['event_data']['events'] = [
                        'collection' => $events[$x]['event_data']['events']['collection'],
                        'conditional' => $events[$x]['event_data']['events']['conditional']
                    ];

                    //  Fix the nested events of the collection
                    $events[$x]['event_data']['events']['collection'] = $fixEvents($events[$x]['event_data']['events']['collection']);

                }

                //  Check if the event supports comments
                if( !isset($events[$x]['comment']) ) {

                    //  Enable comment support
                    $events[$x]['comment'] = '';

                }
            }

            return $events;
        };

        //  Set any missing values using the builder template
        foreach($builderTemplate as $propertyName => $property_value){

            //  If the property does not exist
            if( !isset($builder[$propertyName]) ){

                //  Set the property and default value
                $builder[$propertyName] = $builderTemplate[$propertyName];

            }

            if( isset($builder['sms_connection']['username']) || isset($builder['sms_connection']['password']) ) {

                $builder['sms_connection'] = $builderTemplate['sms_connection'];

            }

            if( empty($builder['airtime_billing_connection']['client_id']['text']) ){

                $builder['airtime_billing_connection'] = $builderTemplate['airtime_billing_connection'];

            }

            if( $propertyName === 'global_events' ) {

                //  If the global events are nested inside a key called "collection"
                if( isset($builder['global_events']['collection']) ) {

                    //  Extract the nested events one level up
                    $builder['global_events'] = $builder['global_events']['collection'];

                }

                //  Fix specific event related issues
                $builder['global_events'] = $fixEvents($builder['global_events']);

            }

            if( $propertyName === 'application_events' ) {

                //  Restructure "on_start" and "on_close"
                foreach(['on_start', 'on_close'] as $eventName) {

                    $code = function() use ($builder, $eventName) {

                        if( isset($builder['application_events'][$eventName]['conditional']['code']) &&
                            is_string($builder['application_events'][$eventName]['conditional']['code']) ) {

                            return $builder['application_events'][$eventName]['conditional']['code'];

                        }else{

                            return null;

                        }

                    };

                    $active = function() use ($builder, $eventName) {

                        if( isset($builder['application_events'][$eventName]['conditional']['active']) &&
                            is_bool($builder['application_events'][$eventName]['conditional']['active']) ) {

                            return $builder['application_events'][$eventName]['conditional']['active'];

                        }else{

                            return false;

                        }

                    };

                    $collection = function() use ($builder, $eventName) {

                        if( isset($builder['application_events'][$eventName]['collection']) ) {

                            return $builder['application_events'][$eventName]['collection'];

                        }elseif( isset($builder['application_events'][$eventName]) ) {

                            return $builder['application_events'][$eventName];

                        }else{

                            return [];

                        }

                    };

                    //  Set the new structure for the Global Events
                    $builder['application_events'][$eventName] = [

                        'conditional' => [

                            'code' => $code(),
                            'active' => $active(),

                        ],
                        'collection' => $collection()

                    ];

                    //  Fix specific event related issues
                    $builder['application_events'][$eventName]['collection'] = $fixEvents($builder['application_events'][$eventName]['collection']);

                }

            }

            if( $propertyName === 'global_variables' ) {

                foreach($builder['global_variables'] as $gv_key => $global_variable) {

                    //  Unset properties added by the Iview table component
                    unset($builder['global_variables'][$gv_key]['_index']);
                    unset($builder['global_variables'][$gv_key]['_rowKey']);

                    if( $builder['global_variables'][$gv_key]['type'] == 'String' ) {

                        //  Convert the type from "String" to "string" as lowercase
                        $builder['global_variables'][$gv_key]['type'] = 'string';

                    }

                    if( $builder['global_variables'][$gv_key]['type'] == 'Integer' ) {

                        //  Convert the type from "Integer" to "integer" as lowercase
                        $builder['global_variables'][$gv_key]['type'] = 'integer';

                        //  Convert the value key of "number" to "integer"
                        $builder['global_variables'][$gv_key]['value']['integer'] = $builder['global_variables'][$gv_key]['value']['number'];

                        //  Remove the deprecated "number" key name
                        unset($builder['global_variables'][$gv_key]['value']['number']);

                    }

                    if( $builder['global_variables'][$gv_key]['type'] == 'Boolean' ) {

                        //  Convert the type from "Boolean" to "boolean" as lowercase
                        $builder['global_variables'][$gv_key]['type'] = 'boolean';

                    }

                    if( $builder['global_variables'][$gv_key]['type'] == 'Null' ) {

                        //  Convert the type from "Null" to "null" as lowercase
                        $builder['global_variables'][$gv_key]['type'] = 'null';

                    }

                    if( $builder['global_variables'][$gv_key]['type'] == 'Custom' ) {

                        //  Convert the type from "Custom" to "code" as lowercase
                        $builder['global_variables'][$gv_key]['type'] = 'code';

                    }

                }

            }

        }

        //  Foreach version screen
        foreach ($builder['screens'] as $s_key => $screen) {

            /*****************
             *  SCREENS      *
             ****************/

            if( isset($builder['screens'][$s_key]['requirements']) ){
                unset($builder['screens'][$s_key]['requirements']);
            }

            //  Remove the repeat events which contain "before_repeat" and "after_repeat" (Deprecated)
            unset($builder['screens'][$s_key]['repeat']['events']);

            //  Restructure "on_enter", "on_response" and "on_leave"
            foreach(['on_enter', 'on_response', 'on_leave'] as $eventName) {

                $code = function() use ($builder, $s_key, $eventName) {

                    if( isset($builder['screens'][$s_key]['events'][$eventName]['conditional']['code']) &&
                        is_string($builder['screens'][$s_key]['events'][$eventName]['conditional']['code']) ) {

                        return $builder['screens'][$s_key]['events'][$eventName]['conditional']['code'];

                    }else{

                        return null;

                    }

                };

                $active = function() use ($builder, $s_key, $eventName) {

                    if( isset($builder['screens'][$s_key]['events'][$eventName]['conditional']['active']) &&
                        is_bool($builder['screens'][$s_key]['events'][$eventName]['conditional']['active']) ) {

                        return $builder['screens'][$s_key]['events'][$eventName]['conditional']['active'];

                    }else{

                        return false;

                    }

                };

                $collection = function() use ($builder, $s_key, $eventName) {

                    if( isset($builder['screens'][$s_key]['events'][$eventName]['collection']) ) {

                        return $builder['screens'][$s_key]['events'][$eventName]['collection'];

                    }elseif( isset($builder['screens'][$s_key]['events'][$eventName]) ) {

                        return $builder['screens'][$s_key]['events'][$eventName];

                    }else{

                        return [];

                    }

                };

                //  Set the new structure
                $builder['screens'][$s_key]['events'][$eventName] = [

                    'conditional' => [
                        'code' => $code(),
                        'active' => $active(),
                    ],
                    'collection' => $collection()

                ];

                //  Fix specific event related issues
                $builder['screens'][$s_key]['events'][$eventName]['collection'] = $fixEvents($builder['screens'][$s_key]['events'][$eventName]['collection']);

            }

            //  Remove the marker "name" key
            foreach($builder['screens'][$s_key]['markers'] as $m_key => $marker) {

                //  If the marker still uses the name key
                if( isset($builder['screens'][$s_key]['markers'][$m_key]['name']) ){

                    /**
                     *  Flatten the value to simply include the value without the name key.
                     *
                     *  BEFORE: markers = [['name' => 'marker1'], ['name' => 'marker2'], ... ]
                     *
                     *  AFTER:  markers = ['marker1', 'marker2', ... ]
                     */
                    $builder['screens'][$s_key]['markers'][$m_key] = $builder['screens'][$s_key]['markers'][$m_key]['name'];

                }

            }

            foreach ($builder['screens'][$s_key]['displays'] as $d_key => $display) {

                //  If the display uses the old "description" property instead of the new "instruction" property
                if( isset($display['content']['description']) ) {

                    //  Rename from "description" to "instruction"
                    $builder['screens'][$s_key]['displays'][$d_key]['content']['instruction'] = $display['content']['description'];

                    unset($builder['screens'][$s_key]['displays'][$d_key]['content']['description']);

                }

                /*****************
                 *  DISPLAYS     *
                 ****************/

                //  Restructure "on_enter" (previously called "before_reply"), "on_response" (previously called "after_reply") and "on_leave" (recently introduced)
                foreach(['on_enter' => 'before_reply', 'on_response' => 'after_reply', 'on_leave' => ''] as $newEventName => $oldEventName) {

                    $code = function() use ($builder, $s_key, $d_key, $newEventName) {

                        if( isset($builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName]['conditional']['code']) &&
                            is_string($builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName]['conditional']['code']) ) {

                            return $builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName]['conditional']['code'];

                        }else{

                            return null;

                        }

                    };

                    $active = function() use ($builder, $s_key, $d_key, $newEventName) {

                        if( isset($builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName]['conditional']['active']) &&
                            is_bool($builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName]['conditional']['active']) ) {

                            return $builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName]['conditional']['active'];

                        }else{

                            return false;

                        }

                    };

                    $collection = function() use ($builder, $s_key, $d_key, $newEventName, $oldEventName) {

                        if( isset($builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName]['collection']) ) {

                            return $builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName]['collection'];

                        }elseif( isset($builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName]) ) {

                            return $builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName];

                        }elseif( isset($builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$oldEventName]) ) {

                            return $builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$oldEventName];

                        }else{

                            return [];

                        }

                    };

                    $builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName] = [

                        'conditional' => [

                            'code' => $code(),
                            'active' => $active(),

                        ],
                        'collection' => $collection()

                    ];

                    if( !empty($oldEventName) ) {

                        //  Remove "before_reply" and "after_reply" (Deprecated), but the "on_leave" remains the unchanged
                        unset($builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$oldEventName]);

                    }

                    //  Fix specific event related issues
                    $builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName]['collection'] = $fixEvents($builder['screens'][$s_key]['displays'][$d_key]['content']['events'][$newEventName]['collection']);

                }

                //  Set the pagination (use_global_pagination) if not already set
                if( !isset( $builder['screens'][$s_key]['displays'][$d_key]['content']['pagination']['use_global_pagination'] ) ){

                    $builder['screens'][$s_key]['displays'][$d_key]['content']['pagination']['use_global_pagination'] = true;

                }

                //  Set the (display markers) if not already set
                if( !isset($builder['screens'][$s_key]['displays'][$d_key]['content']['markers']) ){

                    $builder['screens'][$s_key]['displays'][$d_key]['content']['markers'] = [];

                }

                //  Remove the marker "name" key
                foreach($builder['screens'][$s_key]['displays'][$d_key]['content']['markers'] as $m_key => $marker) {

                    //  If the marker still uses the name key
                    if( isset($builder['screens'][$s_key]['displays'][$d_key]['content']['markers'][$m_key]['name']) ){

                        /**
                         *  Flatten the value to simply include the value without the name key.
                         *
                         *  BEFORE: markers = [['name' => 'marker1'], ['name' => 'marker2'], ... ]
                         *
                         *  AFTER:  markers = ['marker1', 'marker2', ... ]
                         */
                        $builder['screens'][$s_key]['displays'][$d_key]['content']['markers'][$m_key] = $builder['screens'][$s_key]['displays'][$d_key]['content']['markers'][$m_key]['name'];

                    }

                }

                //  Set the "enable_instruction_emoji" property if it does not already exist
                if(!isset($builder['screens'][$s_key]['displays'][$d_key]['content']['enable_instruction_emoji'])) {

                    $builder['screens'][$s_key]['displays'][$d_key]['content']['enable_instruction_emoji'] = false;

                }

                //  Set the "enable_action_emoji" property if it does not already exist
                if(!isset($builder['screens'][$s_key]['displays'][$d_key]['content']['enable_action_emoji'])) {

                    $builder['screens'][$s_key]['displays'][$d_key]['content']['enable_action_emoji'] = false;

                }

            }


        }

        //  Return the updated version builder
        return $builder;

    }
}
