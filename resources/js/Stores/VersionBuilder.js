import { defineStore } from 'pinia'
import _, { pullAt, cloneDeep } from 'lodash';

/**
 *  Reference: https://pinia.vuejs.org/core-concepts/
 */
export const useVersionBuilder = defineStore('version_builder', {
    state: () => {
        return {
            builder: {},
            selectedScreen: null,
            selectedDisplay: null,
            selectedConfigMenu: null,

            hasSavedBuilder: true,
            hasImportedBuilder: false,
            hasDownloadedBuilder: false,

            filterEventSearch: '',
            filterScreenSearch: '',
            filterDisplaySearch: '',
        }
    },
    /**
     *  Add comments foreach getter to offer typescript support
     */
    getters: {

        //  Screen related getters
        screens: (state) => state.builder.screens ?? [],
        totalScreens(state) {
            return this.screens.length;
        },
        hasScreens(state) {
            return this.totalScreens > 0;
        },
        filteredScreens(state) {
            return state.filterScreenSearch ? this.searchScreens(state.filterScreenSearch) : this.screens;
        },

        //  Display related getters
        screenDisplays: (state) => (state.selectedScreen || {}).displays ?? [],
        totalScreenDisplays(state) {
            return this.screenDisplays.length;
        },
        hasScreenDisplays(state) {
            return this.totalScreenDisplays > 0;
        },
        filteredScreenDisplays(state) {
            return state.filterDisplaySearch ? this.searchScreenDisplays(state.filterDisplaySearch) : this.screenDisplays;
        },

        //  Global variable related getters
        globalVariables: (state) => state.builder.global_variables ?? [],

        //  Global event related getters
        globalEvents: (state) => state.builder.global_events ?? [],

        //  Event related getters
        screenEvents(state) {
            if(!state.selectedScreen) return [];
            return [
                ...state.selectedScreen.events.on_enter.collection,
                ...state.selectedScreen.events.on_leave.collection,
                ...state.selectedScreen.events.on_response.collection
            ];
        },
        totalScreenEvents(state) {
            return this.screenEvents.length;
        },
        hasScreenEvents(state) {
            return this.totalScreenEvents > 0;
        },

        //  Markers
        totalScreenMarkers(state) {
            return this.selectedScreen ? this.selectedScreen['markers'].length: 0;
        },
        screenAndDisplayMarkers(state) {

            var markers = [];

            for (let x = 0; x < this.screens.length; x++) {

                const screen = this.screens[x];
                const screenMarkers = screen['markers'];

                //  Add the screen markers
                markers.push(...screenMarkers);

                for (let y = 0; y < screen['displays'].length; y++) {

                    const display = screen['displays'][y];
                    const displayMarkers =display['content']['markers'];

                    //  Add the display markers
                    markers.push(...displayMarkers);
                }

            }

            return markers;
        },
    },
    actions: {

        setBuilder(builder){
            this.builder = builder ? builder : {};
        },
        generateId(){
            return Date.now();
        },
        selectConfigMenu(menuName){
            this.unselectScreen();
            this.unselectDisplay();
            this.selectedConfigMenu = menuName;
        },
        unselectConfigMenu(){
            this.selectedConfigMenu = null;
        },
        unselectEverything(){
            this.unselectScreen();
            this.unselectDisplay();
            this.unselectConfigMenu();
        },

        //  Marker Methods
        searchMarkers(markers, search, exactMatch = false) {
            if( search !== null && search !== '' ) {
                return markers.filter((marker) => {

                    search = search.toString().toLowerCase();
                    const markerName = marker.toLowerCase();

                    const matchesMarkerName = (exactMatch === true)
                        ? markerName === search
                        : markerName.includes(search);

                    return matchesMarkerName;
                });
            }else{
                return markers;
            }
        },
        getBlankMarker() {

            return {
                name: ''
            }

        },
        getClonedMarker(marker){
            return {
                name: marker
            }
        },
        addMarker(markers, marker){
            markers.push(marker.name);
        },
        updateMarker(markers, marker, index){
            markers.splice(index, 1, marker.name);
        },
        removeMarkerByIndex(markers, index) {
            markers.splice(index, 1);
        },

        //  Screen Methods

        selectScreen(input){
            if(typeof input === 'object') {

                const screen = input;
                this.selectedScreen = screen;

            }else if(typeof input === 'string') {

                const screenId = input;
                this.selectedScreen = this.searchScreens(screenId)[0];

            }

            this.unselectDisplay();
            this.unselectConfigMenu();
        },
        unselectScreen(){
            this.selectedScreen = null;
        },
        selectRecomendedScreen() {

            //  If we have screens
            if( this.screens.length ){

                //  Check existence of screen marked as the first screen
                if( this.hasScreenMarkedAsFirstDisplayScreen() ) {

                    //  Get the screen marked as the first display screen
                    const screenMarkedAsFirstDisplay = this.getScreenMarkedAsFirstDisplayScreen();

                    //  Set the screen as the first to show
                    this.selectScreen(screenMarkedAsFirstDisplay);

                }else{

                    //  Otherwise get the first listed screen
                    this.selectScreen(this.screens[0]);

                }

            }

        },
        hasSelectedSpecificScreen(input){
            if(typeof input === 'object') {

                const screen = input;
                return this.selectedScreen.id == screen.id;

            }else if(typeof input === 'string') {

                const screenId = input;
                return this.selectedScreen.id == screenId;

            }else{

                return false;

            }
        },
        hasScreenMarkedAsFirstDisplayScreen(){

            /**
             *  Check if we have at least one screen marked as the first display screen
             */
            return this.screens.filter((screen) => {
                return screen.first_display_screen == true;
            }).length ? true : false;

        },
        getScreenMarkedAsFirstDisplayScreen(){

            /**
             *  Return the first screen marked as the first display screen
             */
            return this.screens.find((screen) => {
                return screen.first_display_screen == true;
            });

        },
        markScreenAsFirstDisplayScreen(screen){

            const currScreen = this.searchScreen(screen);

            if( currScreen ) currScreen['first_display_screen'] = true;

        },
        searchScreens(search, exactMatch = false) {
            return this.screens.filter((screen) => {

                const matchesScreenId = (exactMatch === true)
                    ? screen.id.toString().toLowerCase() === search.toString().toLowerCase()
                    : screen.id.toString().toLowerCase().includes(search.toString().toLowerCase());

                const matchesScreenName = (exactMatch === true)
                    ? screen.name.toLowerCase() === search.toString().toLowerCase()
                    : screen.name.toLowerCase().includes(search.toString().toLowerCase());

                return (matchesScreenId || matchesScreenName);
            });
        },
        searchScreen(input){
            if(typeof input === 'object') {

                const currScreen = input;
                return this.screens.find((screen) => screen.id === currScreen.id)

            }else if(typeof input === 'string') {

                const screenId = input;
                return this.screens.find((screen) => screen.id === screenId)

            }
        },
        getBlankScreen() {

            /** Determine whether this must be the first display screen by default.
             *  Generally if we don't already have any screen assigned as the
             *  first display screen, then we make this screen the first
             *  display screen by default.
             */
            const isFirstDisplayScreen = (this.hasScreenMarkedAsFirstDisplayScreen() == false);
            const id = 'screen_' + this.generateId();

            return {
                id: id,
                name: '',
                events: {
                    on_enter: {
                        conditional: {
                            code: null,
                            active: false
                        },
                        collection: []
                    },
                    on_leave: {
                        conditional: {
                            code: null,
                            active: false
                        },
                        collection: []
                    },
                    on_response: {
                        conditional: {
                            code: null,
                            active: false
                        },
                        collection: []
                    }
                },
                repeat: {
                    active: {
                        selected_type: 'no',
                        code: ''
                    },
                    selected_type: 'repeat_on_number',  //  repeat_on_number, repeat_on_items, custom_repeat
                    repeat_on_number: {
                        value:{
                            text: '3',
                            code_editor_text: '',
                            code_editor_mode: false
                        },
                        total_loops_reference_name: 'total_items',
                        loop_index_reference_name: 'loop_index',
                        loop_number_reference_name: 'loop_number',
                        is_first_loop_reference_name: 'is_first_loop',
                        is_last_loop_reference_name: 'is_last_loop',
                        on_no_loop: {
                            selected_type: 'do_nothing',    //  do_nothing, link
                            link: {
                                text: '',
                                code_editor_text: '',
                                code_editor_mode: false
                            }
                        },
                        after_last_loop: {
                            selected_type: 'do_nothing',    //  do_nothing, link
                            link: {
                                text: '',
                                code_editor_text: '',
                                code_editor_mode: false
                            }
                        }
                    },
                    repeat_on_items: {
                        group_reference: {
                            text: '{{ items }}',
                            code_editor_text: '',
                            code_editor_mode: false
                        },
                        item_reference_name: 'item',
                        total_loops_reference_name: 'total_items',
                        loop_index_reference_name: 'item_index',
                        loop_number_reference_name: 'item_number',
                        is_first_loop_reference_name: 'is_first_item',
                        is_last_loop_reference_name: 'is_last_item',
                        on_no_loop: {
                            selected_type: 'do_nothing',    //  do_nothing, link
                            link: {
                                text: '',
                                code_editor_text: '',
                                code_editor_mode: false
                            }
                        },
                        after_last_loop: {
                            selected_type: 'do_nothing',    //  do_nothing, link
                            link: {
                                text: '',
                                code_editor_text: '',
                                code_editor_mode: false
                            }
                        }
                    }
                },
                first_display_screen: isFirstDisplayScreen,
                conditional_displays: {
                    active: false,
                    code: null
                },
                displays: [],
                markers: []

            }
        },
        getClonedScreen(screen){
            var clonedScreen = _.cloneDeep(screen);
            delete clonedScreen.first_display_screen;
            delete clonedScreen.id;

            return {
                ...this.getBlankScreen(),
                ...clonedScreen
            };
        },
        addScreen(screen){
            this.screens.push(screen);
        },
        removeScreen(input){
            if(typeof input === 'object') {

                const screen = input;
                const index = this.screens.map(function(screen) { return screen.id }).indexOf(screen.id);
                this.removeScreenByIndex(index);

            }else if(typeof input === 'string') {

                const screenId = input;
                const index = this.screens.map(function(screen) { return screen.id }).indexOf(screenId);
                this.removeScreenByIndex(index);

            }
        },
        removeScreenByIndex(index) {
            this.screens.splice(index, 1);
        },


        //  Display Methods

        selectDisplay(input){
            if(typeof input === 'object') {

                const display = input;
                this.selectedDisplay = display;

            }else if(typeof input === 'string') {

                const displayId = input;
                this.selectedDisplay = this.searchScreenDisplays(displayId)[0];

            }
        },
        unselectDisplay(){
            this.selectedDisplay = null;
        },
        selectRecomendedDisplay() {

            //  If we have displays
            if( this.screenDisplays.length ){

                //  Check existence of display marked as the first display
                if( this.hasDisplayMarkedAsFirstDisplay() ) {

                    //  Get the display marked as the first display
                    const displayMarkedAsFirstDisplay = this.getDisplayMarkedAsFirstDisplay();

                    //  Set the display as the first to show
                    this.selectDisplay(displayMarkedAsFirstDisplay);

                }else{

                    //  Otherwise get the first listed display
                    this.selectDisplay(this.screenDisplays[0]);

                }

            }

        },
        hasSelectedSpecificDisplay(input){
            if(this.selectedDisplay && typeof input === 'object') {

                const display = input;
                return this.selectedDisplay.id == display.id;

            }else if(this.selectedDisplay && typeof input === 'string') {

                const displayId = input;
                return this.selectedDisplay.id == displayId;

            }else{

                return false;

            }
        },
        hasDisplayMarkedAsFirstDisplay(){

            /**
             *  Check if we have at least one display marked as the first display
             */
            return this.screenDisplays.filter((display) => {
                return display.first_display == true;
            }).length ? true : false;

        },
        getDisplayMarkedAsFirstDisplay(){

            /**
             *  Return the first display marked as the first display
             */
            return this.screenDisplays.find((display) => {
                return display.first_display == true;
            });

        },
        markDisplayAsFirstDisplay(display){

            const currDisplay = this.searchScreenDisplayById(display);

            if( currDisplay ) currDisplay['first_display'] = true;

        },
        searchScreenDisplays(search, exactMatch = false) {
            return this.screenDisplays.filter((display) => {

                const matchesDisplayId = (exactMatch === true)
                    ? display.id.toString().toLowerCase() === search.toString().toLowerCase()
                    : display.id.toString().toLowerCase().includes(search.toString().toLowerCase());

                const matchesDisplayName = (exactMatch === true)
                    ? display.name.toLowerCase() === search.toString().toLowerCase()
                    : display.name.toLowerCase().includes(search.toString().toLowerCase());

                return (matchesDisplayId || matchesDisplayName);
            });
        },
        searchScreenDisplayById(input){
            if(typeof input === 'object') {

                const currDisplay = input;
                return this.screenDisplays.find((display) => display.id === currDisplay.id)

            }else if(typeof input === 'string') {

                const displayId = input;
                return this.screenDisplays.find((display) => display.id === displayId)

            }
        },
        getBlankDisplay() {

            /** Determine whether this must be the first display by default.
             *  Generally if we don't already have any display assigned as the
             *  first display, then we make this display the first
             *  display by default.
             */
            const isFirstDisplay = (this.hasDisplayMarkedAsFirstDisplay() == false);
            const id = 'display_' + this.generateId();

            return {
                id: id,
                name: '',
                hexColor: '#CECECE',
                first_display: isFirstDisplay,
                content: {

                    //  Display marker settings
                    markers: [],

                    //  Display instruction settings
                    instruction: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },

                    enable_instruction_emoji: false,
                    enable_action_emoji: false,

                    //  Display action settings
                    action: {
                        selected_type: 'no_action',  //  no_action, input_value, select_option
                        input_value: {
                            selected_type: 'single_value_input',    //  single_value_input, multi_value_input
                            single_value_input: {
                                reference_name: null,
                                link:{
                                    text: '',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                }
                            },
                            multi_value_input: {
                                separator: 'spaces',
                                reference_names: ['first_name', 'last_name'],
                                link:{
                                    text: '',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                }
                            }
                        },
                        select_option: {
                            selected_type: 'static_options',    //  static_options, dynamic_options, code_editor_options
                            static_options: {
                                options: [
                                    /*  Example option
                                    {
                                        name: {
                                            text: '1. My Option',
                                            code_editor_text: '',
                                            code_editor_mode: false
                                        },
                                        active: {
                                            selected_type: 'yes',
                                            code: ''
                                        },
                                        value: {
                                            text: '',
                                            code_editor_text: '',
                                            code_editor_mode: false
                                        },
                                        input: {
                                            text: '1',
                                            code_editor_text: '',
                                            code_editor_mode: false
                                        },
                                        separator: {
                                            top: {
                                                text: '',
                                                code_editor_text: '',
                                                code_editor_mode: false
                                            },
                                            bottom: {
                                                text: '',
                                                code_editor_text: '',
                                                code_editor_mode: false
                                            }
                                        },
                                        link:{
                                            text: '',
                                            code_editor_text: '',
                                            code_editor_mode: false
                                        },
                                        hexColor: '#CECECE',
                                        comment: ''
                                    }
                                    */
                                ],
                                reference_name: 'selected_option',
                                no_results_message: {
                                    text: 'No options found',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                },
                                incorrect_option_selected_message: {
                                    text: 'You selected an incorrect option. Go back and try again',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                }
                            },
                            dynamic_options: {
                                group_reference: {
                                    text: '{{ options }}',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                },
                                template_reference_name: 'option',
                                template_display_name: {
                                    text: '',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                },
                                template_value: {
                                    text: '',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                },
                                reference_name: 'selected_option',
                                no_results_message: {
                                    text: 'No options found',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                },
                                incorrect_option_selected_message: {
                                    text: 'You selected an incorrect option. Go back and try again',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                },
                                link:{
                                    text: '',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                }
                            },
                            code_editor_options: {
                                code_editor_text: null,
                                reference_name: 'selected_option',
                                no_results_message: {
                                    text: 'No options found',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                },
                                incorrect_option_selected_message: {
                                    text: 'You selected an incorrect option. Go back and try again',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                }
                            }
                        }
                    },

                    //  Repeat navigation settings
                    screen_repeat_navigation: {
                        forward_navigation: [],
                        backward_navigation: []
                    },

                    //  Event settings
                    events: {
                        on_enter: {
                            conditional: {
                                code: null,
                                active: false
                            },
                            collection: []
                        },
                        on_leave: {
                            conditional: {
                                code: null,
                                active: false
                            },
                            collection: []
                        },
                        on_response: {
                            conditional: {
                                code: null,
                                active: false
                            },
                            collection: []
                        }
                    },

                    //  Pagination settings
                    pagination: {
                        use_global_pagination: true,
                        active: {
                            selected_type: 'yes',
                            code: ''
                        },
                        content_target: {
                            selected_type: 'both'         //  instruction, action, both
                        },
                        paginate_by_line_breaks: true,

                        slice: {
                            separation_type: 'words',     //  characters, words
                            start: {
                                text: '0',
                                code_editor_text: '',
                                code_editor_mode: false
                            },
                            end: {
                                text: '160',
                                code_editor_text: '',
                                code_editor_mode: false
                            }
                        },
                        scroll_down: {
                            name: {
                                text: '99. Next',
                                code_editor_text: '',
                                code_editor_mode: false
                            },
                            input: {
                                text: '99',
                                code_editor_text: '',
                                code_editor_mode: false
                            },
                            visible: true
                        },
                        scroll_up: {
                            name: {
                                text: '88. Prev',
                                code_editor_text: '',
                                code_editor_mode: false
                            },
                            input: {
                                text: '88',
                                code_editor_text: '',
                                code_editor_mode: false
                            },
                            visible: true
                        },
                        trailing_end: {
                            text: '...',
                            code_editor_text: '',
                            code_editor_mode: false
                        },
                        break_line_before_trail: false,
                        break_line_after_trail: false,
                    }

                }

            }
        },
        getClonedDisplay(display){
            var clonedDisplay = _.cloneDeep(display);
            delete clonedDisplay.first_display;
            delete clonedDisplay.id;

            return {
                ...this.getBlankDisplay(),
                ...clonedDisplay
            };
        },
        addDisplay(display){
            this.screenDisplays.push(display);
        },
        removeDisplay(input){
            if(typeof input === 'object') {

                const display = input;
                const index = this.screenDisplays.map(function(display) { return display.id }).indexOf(display.id);
                this.removeDisplayByIndex(index);

            }else if(typeof input === 'string') {

                const displayId = input;
                const index = this.screenDisplays.map(function(display) { return display.id }).indexOf(displayId);
                this.removeDisplayByIndex(index);

            }
        },
        removeDisplayByIndex(index) {
            this.screenDisplays.splice(index, 1);
        },

        //  Global Variable Methods
        searchGlobalVariables(search, exactMatch = false) {
            if( search !== null && search !== '' ) {
                return this.globalVariables.filter((globalVariable) => {

                    search = search.toString().toLowerCase();
                    const globalVariableName = globalVariable.name.toLowerCase();

                    const matchesGlobalVariableName = (exactMatch === true)
                        ? globalVariableName === search
                        : globalVariableName.includes(search);

                    return matchesGlobalVariableName;
                });
            }else{
                return this.globalVariables;
            }
        },
        getBlankGlobalVariable() {
            return {
                name: '',
                type: 'string',
                value: {
                    string: '',
                    integer: '0',
                    boolean: 'false',
                    code: null
                },
                is_global: false,
                is_constant: false
            }
        },
        getClonedGlobalVariable(globalVariable){
            const clonedGlobalVariable = _.cloneDeep(globalVariable);

            return {
                ...this.getBlankGlobalVariable(),
                ...clonedGlobalVariable
            };
        },
        addGlobalVariable(globalVariable){
            this.globalVariables.push(globalVariable);
        },
        updateGlobalVariable(globalVariable, index){
            this.globalVariables.splice(index, 1, globalVariable);
        },
        removeGlobalVariableByIndex(index) {
            this.globalVariables.splice(index, 1);
        },
        removeGlobalVariablesByIndexes(indexes) {
            _.pullAt(this.globalVariables, indexes);
        },

        //  Navigation Methods
        searchNavigations(navigations, search, exactMatch = false) {
            if( search !== null && search !== '' ) {
                return navigations.filter((navigation) => {

                    search = search.toString().toLowerCase();
                    const navigationName = navigation.name.toLowerCase();

                    const matchesNavigationName = (exactMatch === true)
                        ? navigationName === search
                        : navigationName.includes(search);

                    return matchesNavigationName;
                });
            }else{
                return navigations;
            }
        },
        getBlankNavigation() {

            const id = 'navigation_' + this.generateId();

            return {
                id: id,
                name: '',
                active: {
                    selected_type: 'yes',
                    code: ''
                },
                selected_type: 'custom',  //  custom, regex
                custom: {
                    inputs: {
                        text: '1, 2, 3',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    step: {
                        text: '1',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    link: {
                        text: this.selectedScreen.id,
                        code_editor_text: '',
                        code_editor_mode: false
                    }
                },
                regex: {
                    rule: {
                        text: '/[a-zA-Z]+/',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    step: {
                        text: '1',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    link: {
                        text: this.selectedScreen.id,
                        code_editor_text: '',
                        code_editor_mode: false
                    }
                },
                hexColor: '#CECECE',
                comment: ''
            }
        },
        getClonedNavigation(navigation){
            const clonedNavigation = _.cloneDeep(navigation);

            return {
                ...this.getBlankNavigation(),
                ...clonedNavigation
            };
        },
        addNavigation(navigations, navigation){
            navigations.push(navigation);
        },
        updateNavigation(navigations, navigation, index){
            navigations.splice(index, 1, navigation);
        },
        removeNavigationByIndex(navigations, index) {
            navigations.splice(index, 1);
        },

        //  Event Methods
        searchEvents(events, search, exactMatch = false) {
            if( search !== null && search !== '' ) {

                search = search.toString().toLowerCase();

                return events.filter((event) => {

                    const matchesEventId = (exactMatch === true)
                        ? event.id.toString().toLowerCase() === search
                        : event.id.toString().toLowerCase().includes(search);

                    const matchesEventName = (exactMatch === true)
                        ? event.name.toLowerCase() === search
                        : event.name.toLowerCase().includes(search);

                    return matchesEventId || matchesEventName;
                });

            }else{
                return events;
            }
        },
        suggestEventName(events, originalName, tries = 0) {

            //  Suggest a name
            const suggestedName = (tries == 0) ? originalName : originalName +' '+tries;

            //  Check if we have an existing event using the same name
            const totalExactMatches = this.searchEvents(events, suggestedName, true).length;

            //  If the suggested name exists
            if( totalExactMatches > 0 ) {

                //  Try another name
                return this.suggestEventName(events, originalName, ++tries)

            }else{

                //  Return the suggested name
                return suggestedName;

            }

        },
        getBlankEvent(type) {

            var event = {};

            if( type == 'REST API' ){

                event = this.get_REST_API_Event();

            }else if( type == 'SMS API' ){

                event = this.get_SMS_API_Event();

            }else if( type == 'Email API' ){

                event = this.get_Email_API_Event();

            }else if( type == 'Airtime Billing API' ){

                event = this.get_Airtime_Billing_API_Event();

            }else if( type == 'Orange Money API' ){

                event = this.get_Orange_Money_API_Event();

            }else if( type == 'Validation' ){

                event = this.get_Validation_Event();

            }else if( type == 'Formatting' ){

                event = this.get_Formatting_Event();

            }else if( type == 'Set Property' ){

                event = this.get_Set_Property_Event();

            }else if( type == 'Custom Code' ){

                event = this.get_Custom_Code_Event();

            }else if( type == 'Firebase Connection' ){

                event = this.get_Firebase_Connection_Event();

            }else if( type == 'AppWrite Connection' ){

                event = this.get_AppWrite_Connection_Event();

            }else if( type == 'Auto Link' ){

                event = this.get_Auto_Link_Event();

            }else if( type == 'Auto Reply' ){

                event = this.get_Auto_Reply_Event();

            }else if( type == 'Revisit' ){

                event = this.get_Revisit_Event();

            }else if( type == 'Redirect' ){

                event = this.get_Redirect_Event();

            }else if( type == 'Database' ){

                event = this.get_Manage_User_Account_Event();

            }else if( type == 'Notification' ){

                event = this.get_Notification_Event();

            }else if( type == 'Event Collection' ){

                event = this.get_Event_Collection_Event();

            }else if( type == 'Terminate Session' ){

                event = this.get_Terminate_Session_Event();

            }

            //  Set the Hex Color according to the event color scheme otherwise set default color
            const hexColor = this.builder.color_scheme.event_colors[type] || '#CECECE';
            const id = 'event_' + this.generateId();

            //  Overide the general event structure with the relevant event specific data
            return Object.assign({
                id: id,
                name: type,
                type: type,
                global: false,
                active: {
                    selected_type: 'yes',
                    code: ''
                },
                run_next_events: {
                    selected_type: 'yes',
                    code: ''
                },
                event_data: {
                    //  Specific event data goes here
                },
                hexColor: hexColor,
                comment: ''

            }, event);
        },
        get_REST_API_Event(){

            return {
                event_data: {
                    url: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    method: 'get',
                    cache: {
                        name: '',
                        enabled: false,
                        duration: {
                            number: 1,
                            type: 'days',    //  seconds, minutes, hours, days, weeks, months, years
                        }
                    },
                    query_params: [],
                    form_data: {
                        convert_to_json: true,
                        use_custom_code: false,
                        params: [],
                        code: ''
                    },
                    headers: [],
                    response:{
                        general: {
                            default_success_message: {
                                text: 'Completed successfully',
                                code_editor_text: '',
                                code_editor_mode: false
                            },
                            default_error_message: {
                                text:'Sorry, we are experiencing technical difficulties',
                                code_editor_text: '',
                                code_editor_mode: false
                            },
                        },
                        selected_type: 'automatic', //  automatic, manual
                        automatic: {
                            on_handle_success: 'use_default_success_msg',   //  do_nothing, use_default_success_msg
                            on_handle_error: 'use_default_error_msg',       //  do_nothing, use_default_error_msg
                        },
                        manual:{
                            response_status_handles: [
                                {
                                    status: '200',
                                    reference_name: 'response',              //  e.g "response", "api_response", "api_data",
                                    attributes: [
                                        {
                                            name: 'data',
                                            value: {
                                                text: '{{ response.data }}',
                                                code_editor_text: '',
                                                code_editor_mode: false
                                            }
                                        }
                                    ],
                                    on_handle: {
                                        selected_type: 'use_custom_msg',   //  do_nothing, use_custom_msg
                                        use_custom_msg: {
                                            text: '',
                                            code_editor_text: '',
                                            code_editor_mode: false
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        get_SMS_API_Event(){

            return {
                event_data: {
                    sender_name: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    sender_number: {
                        text: '{{ ussd.msisdn }}',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    recipient_number: {
                        text: '{{ ussd.msisdn }}',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    message: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                }
            }

        },
        get_Email_API_Event(){

            return {
                event_data: {
                    sender_name: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    sender_email: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    recipient_email: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    subject: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    message: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                }
            }

        },
        get_Airtime_Billing_API_Event(){

            return {
                event_data: {

                    //  Required fields (By Mobile network)
                    airtime_billing_action: 'deduct_fee',       //  deduct_fee, get_product_inventory_data, get_usage_consumption_data
                    cancel_on_insufficient_funds: true,
                    msisdn: {
                        text: '{{ ussd.msisdn }}',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    amount: {
                        text: '1.00',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    currency: {
                        text: 'BWP',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    description: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },

                    //  Optional fields (By Mobile network)
                    product_id: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    service_id: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    purchase_category_code: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    on_behalf_of: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },

                    //  Optional fields (By Our platform)
                    response_reference_name: 'airtime_billing_response',
                    insufficient_funds_message: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    show_successful_payment_message: 'yes_then_terminate',  //  yes_then_terminate, yes_then_do_not_terminate, no_then_terminate, no_then_do_not_terminate
                    successful_payment_message: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                }
            }

        },
        get_Orange_Money_API_Event(){

            return {
                event_data: {
                    msisdn: {
                        text: '{{ ussd.msisdn }}',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    amount: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    payment_reference: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    merchant_code: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    endpoint: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                }
            }

        },
        get_Validation_Event(){

            return {
                event_data: {
                    target: {
                        text: '',              //  e.g "{{ product.quantity }}"
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    rules: []
                }
            }

        },
        get_Formatting_Event(){

            return {
                event_data: {
                    target: {
                        text: '',                   //  e.g "{{ product.quantity }}"
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    reference_name: '',             //  e.g "product_name"
                    rules: []
                }
            }

        },
        get_Set_Property_Event(){

            return {
                event_data: {
                    reference_name: '',             //  e.g "product_name"
                    property: {
                        text: '',                   //  e.g "{{ product.quantity }}"
                        code_editor_text: '',
                        code_editor_mode: false
                    }
                }
            }

        },
        get_Custom_Code_Event(){

            return {
                event_data: {
                    code: ''
                }
            }

        },
        get_Firebase_Connection_Event(){

            return {
                event_data: {
                    code: ''
                }
            }

        },
        get_AppWrite_Connection_Event(){

            return {
                event_data: {
                    reference_name: 'response',
                    events: {
                        on_request_success: {
                            conditional: {
                                code: null,
                                active: false
                            },
                            collection: []
                        },
                        on_request_fail: {
                            conditional: {
                                code: null,
                                active: false
                            },
                            collection: []
                        }
                    },
                    code: ''
                }
            }

        },
        get_Auto_Link_Event(){

            return {
                event_data: {
                    trigger: {
                        selected_type: 'automatic',     //  automatic, manual
                        manual: {
                            input: {
                                text: '',
                                code_editor_text: '',
                                code_editor_mode: false
                            }
                        }
                    },
                    link: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    }
                }
            }

        },
        get_Auto_Reply_Event(){

            return {
                event_data: {
                    automatic_replies: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    }
                }
            }

        },
        get_Revisit_Event(){

            return {
                event_data: {
                    general: {
                        trigger: {
                            selected_type: 'automatic',     //  automatic, manual
                            manual: {
                                input: {
                                    text: '',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                }
                            }
                        },
                        automatic_replies: {
                            text: '',
                            code_editor_text: '',
                            code_editor_mode: false
                        }
                    },
                    revisit_type: {
                        selected_type: 'home_revisit',      //  home_revisit, screen_revisit, marked_revisit
                        screen_revisit: {
                            link: {
                                text: '',
                                code_editor_text: '',
                                code_editor_mode: false
                            },
                        },
                        marked_revisit: {
                            selected_marker : ''
                        }
                    }
                }
            }

        },
        get_Redirect_Event(){

            return {
                event_data: {
                    general: {
                        trigger: {
                            selected_type: 'automatic',    //  automatic, manual
                            manual: {
                                input: {
                                    text: '',
                                    code_editor_text: '',
                                    code_editor_mode: false
                                }
                            }
                        }
                    },
                    service_code: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    }
                }
            }

        },
        get_Manage_User_Account_Event(){

            //  First name variable
            var firstName = this.getBlankDatabaseVariable();
            firstName.name = 'first_name';
            firstName.value.text = 'John';

            //  Last name variable
            var lastName = this.getBlankDatabaseVariable();
            lastName.name = 'last_name';
            lastName.value.text = 'Doe';

            return {
                event_data: {
                    existence_reference_name: 'profile_exists',
                    reference_name: 'profile',
                    action: 'create_or_update',     //  create, read, update, delete, read_or_create, create_or_update
                    additional_fields: [
                        firstName,
                        lastName
                    ],
                    update_approach: 'merge',
                }
            }

        },
        get_Notification_Event(){

            return {
                event_data: {
                    message: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    can_expire: false,
                    expiry_duration_number: {
                        text: '30',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    expiry_duration_type: 'Seconds',
                    display_session_type: 'Any Session',
                    continue_text: {
                        text: '1. Continue',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    msisdn: {
                        text: '{{ ussd.msisdn }}',
                        code_editor_text: '',
                        code_editor_mode: false
                    }
                }
            }

        },
        get_Event_Collection_Event(){

            return {
                event_data: {
                    events: {
                        conditional: {
                            code: null,
                            active: false
                        },
                        collection: []
                    }
                }
            }

        },
        get_Terminate_Session_Event(){

            return {}

        },
        getClonedEvent(event){
            var clonedEvent = _.cloneDeep(event);
            delete clonedEvent.id;

            return {
                ...this.getBlankEvent(),
                ...clonedEvent
            };
        },
        addEvent(events, event){
            events.push(event);
        },
        updateEvent(events, event, index){
            events.splice(index, 1, event);
        },
        removeEventByIndex(events, index) {
            events.splice(index, 1);
        },
        removeEventsByIndexes(events, indexes) {
            _.pullAt(events, indexes);
        },

        //  REST Api Event Query Param Methods
        searchQueryParams(queryParams, search, exactMatch = false) {
            if( search !== null && search !== '' ) {

                search = search.toString().toLowerCase();

                return queryParams.filter((queryParam) => {

                    const matchesQueryParamName = (exactMatch === true)
                        ? queryParam.name.toLowerCase() === search
                        : queryParam.name.toLowerCase().includes(search);

                    return matchesQueryParamName;
                });

            }else{
                return queryParams;
            }
        },
        getBlankQueryParam(){
            return {
                name: '',
                value:{
                    text: '',
                    code_editor_text: '',
                    code_editor_mode: false
                }
            }
        },
        getClonedQueryParam(queryParam){
            const clonedQueryParam = _.cloneDeep(queryParam);

            return {
                ...this.getBlankQueryParam(),
                ...clonedQueryParam
            };
        },
        addQueryParam(queryParams, queryParam){
            queryParams.push(queryParam);
        },
        updateQueryParam(queryParams, queryParam, index){
            queryParams.splice(index, 1, queryParam);
        },
        removeQueryParamByIndex(queryParams, index) {
            queryParams.splice(index, 1);
        },
        removeQueryParamsByIndexes(queryParams, indexes) {
            _.pullAt(queryParams, indexes);
        },

        //  REST Api Event Header Methods
        searchHeaders(headers, search, exactMatch = false) {
            if( search !== null && search !== '' ) {

                search = search.toString().toLowerCase();

                return headers.filter((header) => {

                    const matchesHeaderName = (exactMatch === true)
                        ? header.name.toLowerCase() === search
                        : header.name.toLowerCase().includes(search);

                    return matchesHeaderName;
                });

            }else{
                return headers;
            }
        },
        getBlankHeader(){
            return {
                name: '',
                value:{
                    text: '',
                    code_editor_text: '',
                    code_editor_mode: false
                }
            }
        },
        getClonedHeader(header){
            const clonedHeader = _.cloneDeep(header);

            return {
                ...this.getBlankHeader(),
                ...clonedHeader
            };
        },
        addHeader(headers, header){
            headers.push(header);
        },
        updateHeader(headers, header, index){
            headers.splice(index, 1, header);
        },
        removeHeaderByIndex(headers, index) {
            headers.splice(index, 1);
        },
        removeHeadersByIndexes(headers, indexes) {
            _.pullAt(headers, indexes);
        },

        //  REST Api Event Body Param Methods
        searchBodyParams(params, search, exactMatch = false) {
            if( search !== null && search !== '' ) {

                search = search.toString().toLowerCase();

                return params.filter((param) => {

                    const matchesBodyParamName = (exactMatch === true)
                        ? param.name.toLowerCase() === search
                        : param.name.toLowerCase().includes(search);

                    return matchesBodyParamName;
                });

            }else{
                return params;
            }
        },
        getBlankBodyParam(){
            return {
                name: '',
                value:{
                    text: '',
                    code_editor_text: '',
                    code_editor_mode: false
                }
            }
        },
        getClonedBodyParam(param){
            const clonedBodyParam = _.cloneDeep(param);

            return {
                ...this.getBlankBodyParam(),
                ...clonedBodyParam
            };
        },
        addBodyParam(params, param){
            params.push(param);
        },
        updateBodyParam(params, param, index){
            params.splice(index, 1, param);
        },
        removeBodyParamByIndex(params, index) {
            params.splice(index, 1);
        },
        removeBodyParamsByIndexes(params, indexes) {
            _.pullAt(params, indexes);
        },

        //  REST Api Event Status Code Methods
        searchStatusCodes(statusCodes, search, exactMatch = false) {
            if( search !== null && search !== '' ) {

                search = search.toString().toLowerCase();

                return statusCodes.filter((statusCode) => {

                    const matchesStatusCode = (exactMatch === true)
                        ? statusCode.status.toLowerCase() === search
                        : statusCode.status.toLowerCase().includes(search);

                    return matchesStatusCode;
                });

            }else{
                return statusCodes;
            }
        },
        getBlankStatusCode(statusCode){
            return {
                status: statusCode,             //  e.g "100", "200" and "300"
                reference_name: 'response',     //  e.g "response", "api_response", "api_data",
                attributes: [
                    {
                        name: 'data',
                        value: {
                            text: '{{ response.data }}',
                            code_editor_text: '',
                            code_editor_mode: false
                        }
                    }
                ],
                on_handle: {
                    selected_type: 'use_custom_msg',   //  do_nothing, use_custom_msg
                    use_custom_msg: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    }
                }
            };
        },
        getClonedStatusCode(statusCode){
            const clonedStatusCode = _.cloneDeep(statusCode);

            return {
                ...this.getBlankStatusCode(),
                ...clonedStatusCode
            };
        },
        addStatusCode(statusCodes, statusCode){
            statusCodes.push(statusCode);
        },
        updateStatusCode(statusCodes, statusCode, index){
            statusCodes.splice(index, 1, statusCode);
        },
        removeStatusCodeByIndex(statusCodes, index) {
            statusCodes.splice(index, 1);
        },
        removeStatusCodesByIndexes(statusCodes, indexes) {
            _.pullAt(statusCodes, indexes);
        },

        //  REST Api Event Status Code Attribute Methods
        searchStatusCodeAttributes(attributes, search, exactMatch = false) {
            if( search !== null && search !== '' ) {

                search = search.toString().toLowerCase();

                return attributes.filter((attribute) => {

                    const matchesStatusCodeAttribute = (exactMatch === true)
                        ? attribute.name.toLowerCase() === search
                        : attribute.name.toLowerCase().includes(search);

                    return matchesStatusCodeAttribute;
                });

            }else{
                return attributes;
            }
        },
        getBlankStatusCodeAttribute(attribute){
            return {
                name: '',
                value:{
                    text: '',
                    code_editor_text: '',
                    code_editor_mode: false
                }
            };
        },
        getClonedStatusCodeAttribute(attribute){
            const clonedStatusCodeAttribute = _.cloneDeep(attribute);

            return {
                ...this.getBlankStatusCodeAttribute(),
                ...clonedStatusCodeAttribute
            };
        },
        addStatusCodeAttribute(attributes, attribute){
            attributes.push(attribute);
        },
        updateStatusCodeAttribute(attributes, attribute, index){
            attributes.splice(index, 1, attribute);
        },
        removeStatusCodeAttributeByIndex(attributes, index) {
            attributes.splice(index, 1);
        },
        removeStatusCodeAttributesByIndexes(attributes, indexes) {
            _.pullAt(attributes, indexes);
        },

        //  Validation Event Methods
        searchValidationRules(validationRules, search, exactMatch = false) {
            if( search !== null && search !== '' ) {

                search = search.toString().toLowerCase();

                return validationRules.filter((param) => {

                    const matchesValidationRuleName = (exactMatch === true)
                        ? param.name.toLowerCase() === search
                        : param.name.toLowerCase().includes(search);

                    return matchesValidationRuleName;
                });

            }else{
                return validationRules;
            }
        },
        addSelectedValidationRules(validationRules, selectedRules){

            for (let index = 0; index < selectedRules.length; index++) {

                var selectedRule = selectedRules[index];

                const exists = validationRules.map((rule) => rule.type).includes(selectedRule.type);

                if( exists == false) {

                    //  Set the active state details
                    selectedRule['active'] = {
                        selected_type: 'yes',
                        code: ''
                    }

                    if( selectedRule['type'] !== 'custom_code' ) {

                        //  If we have the value property
                        if( selectedRule['value'] ){

                            //  Restructure the value property structure
                            selectedRule['value'] = {
                                text: selectedRule['value'],
                                code_editor_text: '',
                                code_editor_mode: false
                            }

                        }

                        //  If we have the second value property
                        if( selectedRule['value_2'] ){

                            //  Restructure the value property structure
                            selectedRule['value_2'] = {
                                text: selectedRule['value_2'],
                                code_editor_text: '',
                                code_editor_mode: false
                            }

                        }

                    }

                    //  Restructure the error message property structure
                    selectedRule['error_msg'] = {
                        text: selectedRule['error_msg'],
                        code_editor_text: '',
                        code_editor_mode: false
                    },

                    //  Set the default color
                    selectedRule['hexColor'] = '#CECECE';

                    //  Add the validation rule
                    validationRules.push(selectedRule);

                }

            }
        },
        addValidationRule(validationRules, validationRule){
            validationRules.push(validationRule);
        },
        updateValidationRule(validationRules, validationRule, index){
            validationRules.splice(index, 1, validationRule);
        },
        removeValidationRuleByIndex(validationRules, index) {
            validationRules.splice(index, 1);
        },
        removeValidationRulesByIndexes(validationRules, indexes) {
            _.pullAt(validationRules, indexes);
        },

        //  Formatting Event Methods
        searchFormattingRules(formattingRules, search, exactMatch = false) {
            if( search !== null && search !== '' ) {

                search = search.toString().toLowerCase();

                return formattingRules.filter((param) => {

                    const matchesFormattingRuleName = (exactMatch === true)
                        ? param.name.toLowerCase() === search
                        : param.name.toLowerCase().includes(search);

                    return matchesFormattingRuleName;
                });

            }else{
                return formattingRules;
            }
        },
        addSelectedFormattingRules(formattingRules, selectedRules){

            for (let index = 0; index < selectedRules.length; index++) {

                var selectedRule = selectedRules[index];

                const exists = formattingRules.map((rule) => rule.type).includes(selectedRule.type);

                if( exists == false) {

                    //  Set the active state details
                    selectedRule['active'] = {
                        selected_type: 'yes',
                        code: ''
                    }

                    if( selectedRule['type'] !== 'custom_code' ) {

                        //  If we have the value property
                        if( selectedRule['value'] ){

                            //  Restructure the value property structure
                            selectedRule['value'] = {
                                text: selectedRule['value'],
                                code_editor_text: '',
                                code_editor_mode: false
                            }

                        }

                        //  If we have the second value property
                        if( selectedRule['value_2'] ){

                            //  Restructure the value property structure
                            selectedRule['value_2'] = {
                                text: selectedRule['value_2'],
                                code_editor_text: '',
                                code_editor_mode: false
                            }

                        }

                    }

                    //  Set the default color
                    selectedRule['hexColor'] = '#CECECE';

                    //  Add the formatting rule
                    formattingRules.push(selectedRule);

                }

            }
        },
        addFormattingRule(formattingRules, formattingRule){
            formattingRules.push(formattingRule);
        },
        updateFormattingRule(formattingRules, formattingRule, index){
            formattingRules.splice(index, 1, formattingRule);
        },
        removeFormattingRuleByIndex(formattingRules, index) {
            formattingRules.splice(index, 1);
        },
        removeFormattingRulesByIndexes(formattingRules, indexes) {
            _.pullAt(formattingRules, indexes);
        },

        //  Database Event Methods
        searchDatabaseVariables(variables, search, exactMatch = false) {
            if( search !== null && search !== '' ) {
                return variables.filter((variable) => {

                    search = search.toString().toLowerCase();
                    const variableName = variable.name.toLowerCase();

                    const matchesDatabaseVariableName = (exactMatch === true)
                        ? variableName === search
                        : variableName.includes(search);

                    return matchesDatabaseVariableName;
                });
            }else{
                return variables;
            }
        },
        getBlankDatabaseVariable() {
            return {
                name: '',
                value:{
                    text: '',
                    code_editor_text: '',
                    code_editor_mode: false
                },
                on_empty: {
                    active: false,
                    value: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                },
            }
        },
        getClonedDatabaseVariable(variable){
            const clonedDatabaseVariable = _.cloneDeep(variable);

            return {
                ...this.getBlankDatabaseVariable(),
                ...clonedDatabaseVariable
            };
        },
        addDatabaseVariable(variables, variable){
            variables.push(variable);
        },
        updateDatabaseVariable(variables, variable, index){
            variables.splice(index, 1, variable);
        },
        removeDatabaseVariableByIndex(variables, index) {
            variables.splice(index, 1);
        },
        removeDatabaseVariablesByIndexes(variables, indexes) {
            _.pullAt(variables, indexes);
        },




        //  Display Static Option Action Methods
        searchStaticOptionsByName(staticOptions, name, exactMatch = false) {

            var search = name.code_editor_mode == false ? name.text: name.code_editor_text;

            if( ['', null].includes(search) == false ) {

                search = search.toString().toLowerCase();

                return staticOptions.filter((staticOption) => {

                    const matchesStaticOptionNameText = (exactMatch === true)
                        ? staticOption.name.code_editor_mode == false && staticOption.name.text.toLowerCase() === search
                        : staticOption.name.code_editor_mode == false && staticOption.name.text.toLowerCase().includes(search);

                    const matchesStaticOptionNameCode = (exactMatch === true)
                        ? staticOption.name.code_editor_mode == true && staticOption.name.code_editor_text.toLowerCase() === search
                        : staticOption.name.code_editor_mode == true && staticOption.name.code_editor_text.toLowerCase().includes(search);

                    return matchesStaticOptionNameText || matchesStaticOptionNameCode;

                });

            }else{
                return staticOptions;
            }
        },
        searchStaticOptionsByInput(staticOptions, input, exactMatch = false) {

            var search = input.code_editor_mode == false ? input.text: input.code_editor_text;

            if( ['', null].includes(search) == false ) {

                search = search.toString().toLowerCase();

                return staticOptions.filter((staticOption) => {

                    const matchesStaticOptionInputText = (exactMatch === true)
                        ? staticOption.input.code_editor_mode == false && staticOption.input.text.toLowerCase() === search
                        : staticOption.input.code_editor_mode == false && staticOption.input.text.toLowerCase().includes(search);

                    const matchesStaticOptionInputCode = (exactMatch === true)
                        ? staticOption.input.code_editor_mode == true && staticOption.input.code_editor_text.toLowerCase() === search
                        : staticOption.input.code_editor_mode == true && staticOption.input.code_editor_text.toLowerCase().includes(search);

                    return matchesStaticOptionInputText || matchesStaticOptionInputCode;

                });

            }else{
                return staticOptions;
            }
        },
        getBlankStaticOption(staticOptions = []){

            const id = 'static_option_' + this.generateId();
            const optionNumber = (staticOptions.length + 1).toString();

            return {
                id: id,
                active: {
                    selected_type: 'yes',
                    code: ''
                },
                name: {
                    text: optionNumber + '. My Option',
                    code_editor_text: '',
                    code_editor_mode: false
                },
                value: {
                    text: '',
                    code_editor_text: '',
                    code_editor_mode: false
                },
                input: {
                    text: optionNumber,
                    code_editor_text: '',
                    code_editor_mode: false
                },
                separator: {
                    top: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    },
                    bottom: {
                        text: '',
                        code_editor_text: '',
                        code_editor_mode: false
                    }
                },
                link:{
                    text: '',
                    code_editor_text: '',
                    code_editor_mode: false
                },
                hexColor: '#CECECE',
                comment: ''
            }
        },
        getClonedStaticOption(staticOption){
            const clonedStaticOption = _.cloneDeep(staticOption);

            return {
                ...this.getBlankStaticOption(),
                ...clonedStaticOption
            };
        },
        addStaticOption(staticOptions, staticOption){
            staticOptions.push(staticOption);
        },
        updateStaticOption(staticOptions, staticOption, index){
            staticOptions.splice(index, 1, staticOption);
        },
        removeStaticOptionByIndex(staticOptions, index) {
            staticOptions.splice(index, 1);
        },
        removeStaticOptionsByIndexes(staticOptions, indexes) {
            _.pullAt(staticOptions, indexes);
        },

    },
})
