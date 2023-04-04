"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Versions_Show_Builder_Content_Simulator_index_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 *  Reference 1: https://codemyui.com/hexagon-cube-loading-animation/ or
 *  Reference 2: https://codepen.io/CompuIves/pen/Ojjdoj
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    show: {
      type: Boolean,
      "default": true
    },
    withTransition: {
      type: Boolean,
      "default": true
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _inertiajs_vue3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @inertiajs/vue3 */ "./node_modules/@inertiajs/vue3/dist/index.esm.js");
/* harmony import */ var _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Input/DefaultInput */ "./resources/js/Components/Input/DefaultInput.vue");
/* harmony import */ var _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Modal/DefaultModal */ "./resources/js/Components/Modal/DefaultModal.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @components/Button/PrimaryButton */ "./resources/js/Components/Button/PrimaryButton.vue");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    useForm: _inertiajs_vue3__WEBPACK_IMPORTED_MODULE_0__.useForm,
    DefaultInput: _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_1__["default"],
    DefaultModal: _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_2__["default"],
    PrimaryButton: _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_4__["default"]
  },
  props: {
    screen: {
      type: Object,
      "default": null
    }
  },
  data: function data() {
    return {
      form: null,
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_3__.useVersionBuilder)()
    };
  },
  computed: {
    action: function action() {
      return this.screen ? 'Clone' : 'Create';
    }
  },
  methods: {
    resetForm: function resetForm() {
      this.form = (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_0__.useForm)(this.screen ? (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_3__.useVersionBuilder)().getClonedScreen(this.screen) : (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_3__.useVersionBuilder)().getBlankScreen());
    },
    createScreen: function createScreen(closeModal) {
      this.form.clearErrors();

      //  Check if we have an existing screen using the same name
      var totalExactMatches = this.useVersionBuilder.searchScreens(this.form.name, true).length;
      if (this.form.name.length == 0) {
        this.form.setError('name', 'The screen name is required');
      } else if (this.form.name.length < 3) {
        this.form.setError('name', 'The screen name is too short');
      } else if (this.form.name.length > 50) {
        this.form.setError('name', 'The screen name is too long');
      } else if (totalExactMatches > 0) {
        this.form.setError('name', 'This screen name is already in use');
      } else {
        var screen = this.form.data();
        this.useVersionBuilder.addScreen(screen);
        this.useVersionBuilder.selectScreen(screen);
        this.$message({
          message: 'Screen ' + (this.screen ? 'cloned' : 'created') + ' successfully',
          type: 'success'
        });
        closeModal();
      }
    },
    cancelCreateScreen: function cancelCreateScreen() {
      //  Clear existing errors
      this.form.clearErrors();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_Loader_Loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Loader/Loader */ "./resources/js/Components/Loader/Loader.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Loader_Unique_CubeLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Loader/Unique/CubeLoader */ "./resources/js/Components/Loader/Unique/CubeLoader.vue");
/* harmony import */ var _CreateScreen_CreateScreenModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CreateScreen/CreateScreenModal */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['screens'],
  components: {
    Loader: _components_Loader_Loader__WEBPACK_IMPORTED_MODULE_0__["default"],
    CubeLoader: _components_Loader_Unique_CubeLoader__WEBPACK_IMPORTED_MODULE_2__["default"],
    CreateScreenModal: _CreateScreen_CreateScreenModal__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__.useVersionBuilder)()
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_Badges_NumberBadge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Badges/NumberBadge */ "./resources/js/Components/Badges/NumberBadge.vue");
/* harmony import */ var _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Alert/PrimaryAlert */ "./resources/js/Components/Alert/PrimaryAlert.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    logs: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    origin: {
      type: String,
      "default": 'session',
      validator: function validator(value) {
        return ['simulator', 'session'].includes(value);
      }
    },
    showLogs: {
      type: Boolean,
      "default": true
    }
  },
  components: {
    NumberBadge: _components_Badges_NumberBadge__WEBPACK_IMPORTED_MODULE_0__["default"],
    PrimaryAlert: _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      renderkey: 1,
      screenNames: [],
      displayNames: [],
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__.useVersionBuilder)(),
      selectedLogs: ['info', 'warning', 'error']
    };
  },
  //  No reactive props below
  screenInfoListed: [],
  displayInfoListed: [],
  watch: {
    logs: function logs(newValue, oldValue) {
      var _this = this;
      this.$nextTick(function () {
        _this.$options.screenInfoListed = [];
        _this.$options.displayInfoListed = [];
        _this.screenNames = _this.getScreenNames();
        _this.displayNames = _this.getDisplayNames();
      });
      ++this.renderkey;
    }
  },
  computed: {
    totalLogs: function totalLogs() {
      return this.logs.length;
    },
    filteredLogs: function filteredLogs() {
      var _this2 = this;
      if (this.totalLogs) {
        return this.logs.filter(function (log) {
          //  If the log matches the selected log types
          return _this2.selectedLogs.includes(log.type) ||
          //  If the log matches the selected screen name
          _this2.selectedLogs.includes('screen-' + log.screen) ||
          //  If the log matches the selected display name
          _this2.selectedLogs.includes('display-' + log.display);
        });
      }
      return [];
    },
    totalFilteredLogs: function totalFilteredLogs() {
      return this.filteredLogs.length;
    },
    availableLogs: function availableLogs() {
      var _this3 = this;
      return [{
        label: 'Status',
        options: [{
          label: 'Info',
          value: 'info',
          count: this.logs.filter(function (log) {
            return log.type == 'info';
          }).length
        }, {
          label: 'Warnings',
          value: 'warning',
          count: this.logs.filter(function (log) {
            return log.type == 'warning';
          }).length
        }, {
          label: 'Errors',
          value: 'error',
          count: this.logs.filter(function (log) {
            return log.type == 'error';
          }).length
        }]
      }, {
        label: 'Screens',
        options: this.screenNames.map(function (screenName) {
          return {
            label: screenName,
            value: 'screen-' + screenName,
            count: _this3.logs.filter(function (log) {
              //  If the log matches the selected screen name
              return log.screen == screenName;
            }).length
          };
        })
      }, {
        label: 'Displays',
        options: this.displayNames.map(function (displayName) {
          return {
            label: displayName,
            value: 'display-' + displayName,
            count: _this3.logs.filter(function (log) {
              //  If the log matches the selected display name
              return log.display == displayName;
            }).length
          };
        })
      }];
    }
  },
  methods: {
    getScreenNames: function getScreenNames() {
      if (this.logs) {
        var screenNames = this.logs.filter(function (log) {
          return log.screen !== null;
        }).map(function (log) {
          return log.screen;
        });

        //  Remove duplicates
        return _.uniqBy(screenNames);
      }
      return [];
    },
    getDisplayNames: function getDisplayNames() {
      if (this.logs) {
        var displayNames = this.logs.filter(function (log) {
          return log.display !== null;
        }).map(function (log) {
          return log.display;
        });

        //  Remove duplicates
        return _.uniqBy(displayNames);
      }
      return [];
    },
    canShowScreenInfo: function canShowScreenInfo(log) {
      if (log.screen === null || this.$options.screenInfoListed.includes(log.screen)) {
        return false;
      } else {
        this.$options.screenInfoListed.push(log.screen);
        return true;
      }
    },
    canShowDisplayInfo: function canShowDisplayInfo(log) {
      if (log.display === null || this.$options.displayInfoListed.includes(log.display)) {
        return false;
      } else {
        this.$options.displayInfoListed.push(log.display);
        return true;
      }
    },
    getLogClasses: function getLogClasses(log) {
      if (log.type === 'info') {
        return 'bg-blue-100 border-blue-400';
      } else if (log.type === 'warning') {
        return 'bg-yellow-100 border-yellow-500';
      } else if (log.type === 'error') {
        return 'animate-bounce bg-red-100 border-red-500';
      }
    }
  },
  created: function created() {
    this.screenNames = this.getScreenNames();
    this.displayNames = this.getDisplayNames();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");
/* harmony import */ var _components_Loader_Loader_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Loader/Loader.vue */ "./resources/js/Components/Loader/Loader.vue");
/* harmony import */ var _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Input/DefaultInput */ "./resources/js/Components/Input/DefaultInput.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Button_DangerButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Button/DangerButton */ "./resources/js/Components/Button/DangerButton.vue");
/* harmony import */ var _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @components/Button/PrimaryButton */ "./resources/js/Components/Button/PrimaryButton.vue");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: _defineProperty({
    DefaultInput: _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_1__["default"],
    DangerButton: _components_Button_DangerButton__WEBPACK_IMPORTED_MODULE_3__["default"],
    PrimaryButton: _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_4__["default"],
    Loader: _components_Loader_Loader_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  }, "Loader", _components_Loader_Loader_vue__WEBPACK_IMPORTED_MODULE_0__["default"]),
  data: function data() {
    return {
      project: this.$page.props.projectPayload,
      version: this.$page.props.versionPayload,
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__.useVersionBuilder)(),
      app: this.$page.props.appPayload,
      showingUssdPopup: false,
      ussdResponseMsg: '',
      initialReplies: '',
      loading: false,
      request: null,
      form: null
    };
  },
  computed: {
    shortCode: function shortCode() {
      return this.app.short_code || {};
    },
    sharedShortCode: function sharedShortCode() {
      return this.shortCode.shared_code;
    },
    dedicatedShortCode: function dedicatedShortCode() {
      return this.shortCode.dedicated_code;
    },
    primaryShortCode: function primaryShortCode() {
      return this.dedicatedShortCode || this.sharedShortCode;
    },
    modifiedServiceCode: function modifiedServiceCode() {
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
      if (replies) {
        /**
         *  If "this.initialReplies" is "4*5*6" and "this.form.msg"
         *  is "*321#" the combine to form "*321*4*5*6#"
         */
        return this.primaryShortCode.substring(0, this.primaryShortCode.length - 1) + '*' + replies + '#';
      } else {
        return this.primaryShortCode;
      }
    }
  },
  methods: {
    startUssdServiceSimulator: function startUssdServiceSimulator() {
      if (this.loading == false) {
        this.resetUssdSimulator();
        this.startApiSimulationRequest();
        this.showUssdPopup();
      }
    },
    stopUssdSimulator: function stopUssdSimulator() {
      this.stopApiSimulationRequest();
      this.resetUssdSimulator();
      this.cancelUssdCall();
      this.hideUssdPopup();
    },
    resetUssdSimulator: function resetUssdSimulator() {
      var replacement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.form = _objectSpread(_objectSpread({}, this.defaultForm()), replacement);
    },
    cancelUssdCall: function cancelUssdCall() {
      if (this.request) this.request.cancel('Session cancelled');
      this.loading = false;
    },
    defaultForm: function defaultForm() {
      return {
        msg: null,
        request_type: 1,
        session_id: null,
        service_code: null,
        test_mode: true,
        app_id: this.app.id,
        version_id: this.version.id,
        msisdn: this.useVersionBuilder.builder.simulator.subscriber.phone_number
      };
    },
    startLastUssdCall: function startLastUssdCall() {
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
    startApiSimulationRequest: function startApiSimulationRequest() {
      var _this = this;
      var self = this;

      /**
       *  If this is the first request then embbed
       *  the service code within the message.
       */
      if (this.form.request_type == 1) {
        this.form.msg = this.modifiedServiceCode;
      }
      this.loading = true;

      /**
       *  Generate the axios cancel token to allow this request
       *  to be cancelled if this action is required
       *
       *  Reference: https://stackoverflow.com/questions/50516438/cancel-previous-request-using-axios-with-vue-js
       */
      var axiosSource = axios__WEBPACK_IMPORTED_MODULE_5__["default"].CancelToken.source();
      var url = route('launch.ussd.simulation');
      this.request = {
        cancel: axiosSource.cancel
      };
      axios__WEBPACK_IMPORTED_MODULE_5__["default"].post(url, this.form, {
        cancelToken: axiosSource.token
      }).then(function (response) {
        var firstRequest = self.form.request_type == 1;
        var ussdResponse = response.data;
        self.ussdResponseMsg = ussdResponse.msg;
        self.form.session_id = ussdResponse.session_id;
        self.form.request_type = ussdResponse.request_type;
        self.form.service_code = ussdResponse.service_code;
        self.$emit('response', ussdResponse);

        //  If the requestType = 2 it means we want to continue the current session
        if (self.form.request_type == 2) {
          self.emptyInput();
          self.focusOnInput();
          if (firstRequest) {
            self.$message({
              message: 'Simulation started successfully',
              type: 'success'
            });
          }

          //  If the requestType = 3 it means we want to terminate the session
        } else if (self.form.request_type == 3) {
          self.resetUssdSimulator();
          self.emptyInput();
          self.$message({
            message: 'Session ended',
            type: 'warning'
          });

          //  If the requestType = 4 it means the session ended
        } else if (self.form.request_type == 4) {
          self.emptyInput();
          self.$message({
            message: 'Session Timed out',
            type: 'warning'
          });

          //  If the requestType = 5 it means we want to redirect
        } else if (self.form.request_type == 5) {
          //  Note: self.ussdResponse contains the new "Ussd Response" that we must redirect to
          self.redirectUssdSimulator(ussdResponse.msg);
        }
        if (response.status === 200) {} else {
          var _message;
          self.resetUssdSimulator();
          self.hideUssdPopup();
          self.$message({
            message: (_message = (response || {}).message) !== null && _message !== void 0 ? _message : 'Sorry, something went wrong',
            type: 'warning'
          });
        }
      })["catch"](function (error) {
        var _message2;
        _this.resetUssdSimulator();
        _this.hideUssdPopup();
        var message = (_message2 = (error || {}).message) !== null && _message2 !== void 0 ? _message2 : 'Sorry, something went wrong';

        //  Request failed with status code 419 (CSRF token mismatch.)
        if (error.response.status === 419) {
          message = 'Please login';

          //  Proceed to login
          _this.$inertia.get(route('login.show'));
        }
        self.$message({
          message: message,
          type: 'warning'
        });
      })["finally"](function () {
        _this.request = null;
        _this.loading = false;
      });
    },
    stopApiSimulationRequest: function stopApiSimulationRequest() {
      var _this2 = this;
      var url = route('stop.ussd.simulation', {
        session_id: this.form.session_id
      });
      axios__WEBPACK_IMPORTED_MODULE_5__["default"].post(url).then(function (response) {})["catch"](function (error) {
        var _message3;
        var message = (_message3 = (error || {}).message) !== null && _message3 !== void 0 ? _message3 : 'Sorry, something went wrong';

        //  Request failed with status code 419 (CSRF token mismatch.)
        if (error.response.status === 419) {
          message = 'Please login';

          //  Proceed to login
          _this2.$inertia.get(route('login.show'));
        }
        self.$message({
          message: message,
          type: 'warning'
        });
      });
    },
    redirectUssdSimulator: function redirectUssdSimulator(serviceCode) {
      //  Reset the Ussd Simulator
      this.resetUssdSimulator();
      this.focusOnInput();

      //  Update the service code with the redirect service code
      this.form.serviceCode = serviceCode;

      //  Recall the Ussd end point
      this.startApiSimulationRequest();
    },
    showUssdPopup: function showUssdPopup() {
      this.showingUssdPopup = true;
      this.focusOnInput();
    },
    hideUssdPopup: function hideUssdPopup() {
      this.showingUssdPopup = false;
    },
    focusOnInput: function focusOnInput() {
      var _this3 = this;
      setTimeout(function () {
        if (_this3.$refs.ussd_input) _this3.$refs.ussd_input.focus();
      }, 100);
    },
    emptyInput: function emptyInput() {
      this.form.msg = null;
    }
  },
  created: function created() {
    this.form = this.defaultForm();
  },
  beforeUnmount: function beforeUnmount() {
    if (this.form.session_id) {
      this.stopApiSimulationRequest();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Logs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logs */ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue");
/* harmony import */ var _MobileScreen__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MobileScreen */ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue");
/* harmony import */ var _components_MobileDevice_Nexus5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/MobileDevice/Nexus5 */ "./resources/js/Components/MobileDevice/Nexus5.vue");
/* harmony import */ var _Editor_ScreenEditor_NoScreens__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../Editor/ScreenEditor/NoScreens */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    SimulatorLogs: _Logs__WEBPACK_IMPORTED_MODULE_0__["default"],
    MobileScreen: _MobileScreen__WEBPACK_IMPORTED_MODULE_1__["default"],
    Nexus5: _components_MobileDevice_Nexus5__WEBPACK_IMPORTED_MODULE_2__["default"],
    NoScreens: _Editor_ScreenEditor_NoScreens__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__.useVersionBuilder)(),
      response: null
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=template&id=779960f5&scoped=true":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=template&id=779960f5&scoped=true ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _withScopeId = function _withScopeId(n) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.pushScopeId)("data-v-779960f5"), n = n(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.popScopeId)(), n;
};
var _hoisted_1 = {
  "class": "container"
};
var _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createStaticVNode)("<div class=\"cube\" data-v-779960f5><div class=\"sides\" data-v-779960f5><div class=\"top\" data-v-779960f5></div><div class=\"right\" data-v-779960f5></div><div class=\"bottom\" data-v-779960f5></div><div class=\"left\" data-v-779960f5></div><div class=\"front\" data-v-779960f5></div><div class=\"back\" data-v-779960f5></div></div></div>", 1);
var _hoisted_3 = [_hoisted_2];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, _hoisted_3);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=template&id=6ce3b012":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=template&id=6ce3b012 ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "device"
};
var _hoisted_2 = {
  "class": "screen"
};
var _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createStaticVNode)("<div class=\"speaker\"></div><div class=\"camera\"></div><div class=\"powerbutton\"></div><div class=\"volumebutton\"></div><div class=\"nav\"><div class=\"back\" id=\"back\"></div><div class=\"home\"></div><div class=\"overview\"></div></div>", 5);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Screen Content "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "default")]), _hoisted_3]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=template&id=c0687d3a":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=template&id=c0687d3a ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  key: 0,
  "class": "text-sm text-gray-500 mb-5"
};
var _hoisted_2 = {
  "class": "text-blue-500 font-bold"
};
var _hoisted_3 = {
  key: 0,
  name: "trigger",
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2 hover:text-blue-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
}, null, -1 /* HOISTED */);
var _hoisted_5 = [_hoisted_4];
var _hoisted_6 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-3 w-3",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "fill-rule": "evenodd",
  d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z",
  "clip-rule": "evenodd"
})], -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DefaultInput = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultInput");
  var _component_PrimaryButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryButton");
  var _component_DefaultModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Modal "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultModal, {
    defaultText: "Cancel",
    onOpen: _cache[1] || (_cache[1] = function ($event) {
      return $options.resetForm();
    }),
    onClose: _cache[2] || (_cache[2] = function ($event) {
      return _ctx.$emit('close');
    }),
    primaryAction: $options.createScreen,
    primaryText: $options.action + ' Screen',
    defaultAction: $options.cancelCreateScreen
  }, {
    title: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)((0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.action + ' Screen'), 1 /* TEXT */)];
    }),

    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function (_ref) {
      var firePrimaryAction = _ref.firePrimaryAction;
      return [$props.screen ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("p", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Cloning "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.screen.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" screen")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
        modelValue: $data.form.name,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return $data.form.name = $event;
        }),
        label: "Name",
        placeholder: "Home",
        error: $data.form.errors.name,
        onKeyup: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)(firePrimaryAction, ["enter"]),
        autofocus: true
      }, null, 8 /* PROPS */, ["modelValue", "error", "onKeyup"])];
    }),
    trigger: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$props.screen ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_3, _hoisted_5)) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_PrimaryButton, {
        key: 1,
        name: "trigger",
        "class": "px-3"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [_hoisted_6, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "default")];
        }),
        _: 3 /* FORWARDED */
      }))];
    }),

    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["primaryAction", "primaryText", "defaultAction"])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=template&id=0f58dd51":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=template&id=0f58dd51 ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "mt-4"
};
var _hoisted_2 = {
  "class": "flex items-center justify-between bg-white rounded-sm border-x border-t border-dashed border-gray-400 p-5"
};
var _hoisted_3 = {
  "class": "flex"
};
var _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-12 w-12 mr-4",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
})], -1 /* HOISTED */);
var _hoisted_5 = {
  "class": "text-gray-800 text-md mb-1"
};
var _hoisted_6 = {
  "class": "text-gray-600 text-xs"
};
var _hoisted_7 = {
  "class": "flex items-center justify-end"
};
var _hoisted_8 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "ml-2"
}, "Create Screen", -1 /* HOISTED */);
var _hoisted_9 = {
  "class": "border border-dashed border-gray-400 p-5 rounded-b-md"
};
var _hoisted_10 = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-80 w-80 text-blue-100 m-auto",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_11 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1 /* HOISTED */);
var _hoisted_12 = [_hoisted_11];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_CreateScreenModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("CreateScreenModal");
  var _component_Loader = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("Loader");
  var _component_CubeLoader = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("CubeLoader");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [_hoisted_4, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", _hoisted_5, [$data.useVersionBuilder.hasDownloadedBuilder == false ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 0
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Downloading")], 64 /* STABLE_FRAGMENT */)) : $data.useVersionBuilder.hasSavedBuilder == false ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 1
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Saving")], 64 /* STABLE_FRAGMENT */)) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 2
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("No screens")], 64 /* STABLE_FRAGMENT */))]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", _hoisted_6, [$data.useVersionBuilder.hasDownloadedBuilder == false ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 0
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("The application builder is still downloading")], 64 /* STABLE_FRAGMENT */)) : $data.useVersionBuilder.hasSavedBuilder == false ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 1
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("The application builder is still saving")], 64 /* STABLE_FRAGMENT */)) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 2
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Go ahead and create your first screen")], 64 /* STABLE_FRAGMENT */))])])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_7, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Create Screen Modal "), $data.useVersionBuilder.hasDownloadedBuilder && $data.useVersionBuilder.hasSavedBuilder ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_CreateScreenModal, {
    key: 0
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_8];
    }),
    _: 1 /* STABLE */
  })) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 1
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Loader "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_Loader)], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_9, [$data.useVersionBuilder.hasDownloadedBuilder && $data.useVersionBuilder.hasSavedBuilder ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_10, _hoisted_12)) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_CubeLoader, {
    key: 1,
    "class": "py-40"
  }))])]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=template&id=38a4a9ce":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=template&id=38a4a9ce ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "text-sm font-semibold tracking-tight text-gray-600 mb-4"
};
var _hoisted_2 = {
  "class": "flex items-center justify-between mt-2"
};
var _hoisted_3 = {
  "class": "text-xs"
};
var _hoisted_4 = {
  "class": "text-xs text-gray-400 mr-2"
};
var _hoisted_5 = {
  "class": "relative space-y-4 text-xs"
};
var _hoisted_6 = {
  key: 0,
  "class": "relative z-10 bg-sky-50",
  style: {
    width: '20px',
    height: '20px',
    margin: '0 0 -3px -5px'
  }
};
var _hoisted_7 = {
  key: 1,
  "class": "flex relative right-4 z-10 rounded-r-md border border-l-0 border-blue-400 bg-blue-100 py-1 pl-3 pr-2 mb-4"
};
var _hoisted_8 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "flex-none text-blue-500 h-4 w-4 mr-2",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
}), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
})], -1 /* HOISTED */);
var _hoisted_9 = {
  "class": "text-blue-500 font-semibold"
};
var _hoisted_10 = {
  key: 2,
  "class": "flex relative z-10 rounded-r-md border border-emerald-400 bg-emerald-100 py-1 px-2 mb-4 ml-1"
};
var _hoisted_11 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "flex-none text-emerald-500 h-4 w-4 mr-2",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
}), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
})], -1 /* HOISTED */);
var _hoisted_12 = {
  "class": "text-emerald-500 font-semibold"
};
var _hoisted_13 = {
  "class": "flex relative z-10 items-center"
};
var _hoisted_14 = ["innerHTML"];
var _hoisted_15 = ["innerHTML"];
var _hoisted_16 = ["innerHTML"];
var _hoisted_17 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
  "class": "absolute z-0 top-0 bottom-0 border-l border-blue-400",
  style: {
    left: '4px'
  }
}, null, -1 /* HOISTED */);
var _hoisted_18 = {
  key: 0,
  "class": "p-4 rounded-md border border-dashed border-gray-300"
};
var _hoisted_19 = {
  key: 1
};
var _hoisted_20 = {
  key: 0,
  "class": "text-justify"
};
var _hoisted_21 = {
  key: 1,
  "class": "text-justify"
};
var _hoisted_22 = {
  key: 2
};
var _hoisted_23 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "text-justify"
}, " Logs are currently disabled ", -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_NumberBadge = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("NumberBadge");
  var _component_el_option = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("el-option");
  var _component_el_option_group = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("el-option-group");
  var _component_el_select = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("el-select");
  var _component_PrimaryAlert = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryAlert");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h5", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.origin == 'simulator' ? 'Simulator Logs' : 'Session Logs'), 1 /* TEXT */), $options.totalLogs ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_NumberBadge, {
    key: 0,
    count: $options.totalFilteredLogs,
    active: false,
    "class": "ml-2"
  }, null, 8 /* PROPS */, ["count"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]), $props.showLogs == true && $options.totalLogs ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 0
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_el_select, {
    modelValue: $data.selectedLogs,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $data.selectedLogs = $event;
    }),
    multiple: "",
    placeholder: "Select log types",
    "class": "w-full border rounded mb-4"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.availableLogs, function (group) {
        return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_el_option_group, {
          key: group.label,
          label: group.label
        }, {
          "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
            return [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(group.options, function (log) {
              return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_el_option, {
                key: log.value,
                label: log.label + ' (' + log.count + ')',
                value: log.value
              }, {
                "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
                  return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(log.label), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_4, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(log.count == 0 ? '' : '(' + log.count + ')'), 1 /* TEXT */)])];
                }),

                _: 2 /* DYNAMIC */
              }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["label", "value"]);
            }), 128 /* KEYED_FRAGMENT */))];
          }),

          _: 2 /* DYNAMIC */
        }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["label"]);
      }), 128 /* KEYED_FRAGMENT */))];
    }),

    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "fade",
    mode: "out-in",
    appear: ""
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
        key: $data.renderkey,
        "class": "bg-sky-50 rounded-md p-4 overflow-y-auto border",
        style: {
          height: '30em'
        }
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_5, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.filteredLogs, function (log, index) {
        return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
          key: index
        }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Hide Top Vertical Line Overflow "), index == 0 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_6)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Indicate the Screen "), $options.canShowScreenInfo(log) ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_7, [_hoisted_8, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_9, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(log.screen), 1 /* TEXT */)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Indicate the Display "), $options.canShowDisplayInfo(log) ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_10, [_hoisted_11, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_12, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(log.display), 1 /* TEXT */)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Log Information "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_13, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
          "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['rounded-full mr-2 border flex-none', $options.getLogClasses(log)]),
          style: {
            width: '10px',
            height: '10px'
          }
        }, null, 2 /* CLASS */), log.type == 'info' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", {
          key: 0,
          innerHTML: log.description,
          "class": "text-xs text-gray-500"
        }, null, 8 /* PROPS */, _hoisted_14)) : log.type == 'error' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", {
          key: 1,
          innerHTML: log.description,
          "class": "text-xs text-red-400"
        }, null, 8 /* PROPS */, _hoisted_15)) : log.type == 'warning' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", {
          key: 2,
          innerHTML: log.description,
          "class": "text-xs text-yellow-400"
        }, null, 8 /* PROPS */, _hoisted_16)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Vertical Line "), _hoisted_17]);
      }), 128 /* KEYED_FRAGMENT */)), $options.filteredLogs.length == 0 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_18, "No Logs Found")) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)])]))];
    }),
    _: 1 /* STABLE */
  })], 64 /* STABLE_FRAGMENT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), $props.showLogs == true && $options.totalLogs == 0 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_19, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryAlert, null, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" If the logs are related to the simulator "), $props.origin == 'simulator' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_20, " Launch the Simulator to see the applicaiton logs in realtime ")) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" If the logs are related to the session "), $props.origin == 'session' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_21, " This session does not have logs to show ")) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  })])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), $props.origin == 'simulator' && $props.showLogs == false ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_22, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryAlert, null, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_23];
    }),
    _: 1 /* STABLE */
  })])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=template&id=fc532de6":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=template&id=fc532de6 ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "absolute top-20 right-5 left-5"
};
var _hoisted_2 = {
  "class": "bg-white/90 shadow-sm hover:shadow-md rounded-sm p-4 mb-2"
};
var _hoisted_3 = {
  "class": "text-sm font-semibold tracking-tight text-gray-900"
};
var _hoisted_4 = {
  "class": "text-blue-500 mr-1"
};
var _hoisted_5 = {
  "class": "text-xs"
};
var _hoisted_6 = {
  "class": "bg-white/90 shadow-sm hover:shadow-md rounded-sm p-4 mb-2"
};
var _hoisted_7 = {
  "class": "flex justify-between mb-4"
};
var _hoisted_8 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "block text-sm font-medium text-gray-900"
}, "Dialer", -1 /* HOISTED */);
var _hoisted_9 = {
  "class": "flex text-gray-900"
};
var _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
})], -1 /* HOISTED */);
var _hoisted_11 = {
  "class": "block text-sm font-medium"
};
var _hoisted_12 = {
  "class": "bg-white/90 shadow-sm hover:shadow-md rounded-sm p-4"
};
var _hoisted_13 = {
  "class": "text-sm font-semibold tracking-tight text-gray-600 text-justify"
};
var _hoisted_14 = {
  "class": "text-blue-500"
};
var _hoisted_15 = {
  "class": "flex justify-center pt-4 mt-4 border-t border-dashed border-gray-300"
};
var _hoisted_16 = {
  "class": "absolute top-40 right-5 left-5"
};
var _hoisted_17 = {
  "class": "bg-white/90 shadow-sm hover:shadow-md rounded-sm p-4 relative"
};
var _hoisted_18 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "text-gray-600 ml-2"
}, "Loading...", -1 /* HOISTED */);
var _hoisted_19 = {
  key: 1
};
var _hoisted_20 = ["innerHTML"];
var _hoisted_21 = ["disabled"];
var _hoisted_22 = {
  "class": "w-3/4 m-auto flex justify-between mt-4"
};
var _hoisted_23 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, "|", -1 /* HOISTED */);
var _hoisted_24 = {
  "class": "flex justify-end mt-4 border-gray-300"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DefaultInput = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultInput");
  var _component_PrimaryButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryButton");
  var _component_Loader = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("Loader");
  var _component_DangerButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DangerButton");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["h-full relative", {
      'bg-black/50': $data.showingUssdPopup
    }])
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "fade",
    persisted: ""
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_4, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.app.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_5, " — Version " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.version.number), 1 /* TEXT */)])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_6, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_7, [_hoisted_8, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_9, [_hoisted_10, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_11, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.form.msisdn), 1 /* TEXT */)])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
        modelValue: $data.initialReplies,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return $data.initialReplies = $event;
        }),
        placeholder: "*1*2*3",
        prependClasses: ['bg-blue-50 text-blue-500'],
        appendClasses: ['bg-blue-50 text-blue-500']
      }, {
        append: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)((0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.primaryShortCode.substring(0, $options.primaryShortCode.length - 1)) + "* ", 1 /* TEXT */)];
        }),

        prepend: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" # ")];
        }),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["modelValue"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_12, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_13, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Dial "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_14, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.modifiedServiceCode), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" on your mobile device or "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
        "class": "text-blue-500 hover:text-blue-600 active:text-blue-700 underline cursor-pointer",
        onClick: _cache[1] || (_cache[1] = function () {
          return $options.startUssdServiceSimulator && $options.startUssdServiceSimulator.apply($options, arguments);
        })
      }, "Launch Simulator"), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" to experience your application.")])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_15, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryButton, {
        onClick: _cache[2] || (_cache[2] = function ($event) {
          return $options.startUssdServiceSimulator();
        })
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Launch Simulator")];
        }),
        _: 1 /* STABLE */
      })])])], 512 /* NEED_PATCH */), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, !$data.showingUssdPopup]])];
    }),
    _: 1 /* STABLE */
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "fade",
    persisted: ""
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_16, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_17, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Loader "), $data.loading ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_Loader, {
        key: 0,
        withTransition: false
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [_hoisted_18];
        }),
        _: 1 /* STABLE */
      })) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_19, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Ussd Message "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", {
        "class": "text-gray-600 whitespace-pre-wrap mb-4",
        innerHTML: $data.ussdResponseMsg
      }, null, 8 /* PROPS */, _hoisted_20), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Ussd Reply Input "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("input", {
        type: "text",
        "onUpdate:modelValue": _cache[3] || (_cache[3] = function ($event) {
          return $data.form.msg = $event;
        }),
        disabled: $data.loading,
        ref: "ussd_input",
        "class": "ussd_input",
        onKeypress: _cache[4] || (_cache[4] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)(function ($event) {
          return $options.startApiSimulationRequest();
        }, ["enter"])),
        onKeyup: _cache[5] || (_cache[5] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)(function ($event) {
          return $options.stopUssdSimulator();
        }, ["esc"]))
      }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_21), [[vue__WEBPACK_IMPORTED_MODULE_0__.vModelText, $data.form.msg]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Cancel / Send / Resend Buttons "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_22, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
        "class": "text-gray-600 hover:text-red-500 active:text-red-600 cursor-pointer",
        onClick: _cache[6] || (_cache[6] = function ($event) {
          return $options.stopUssdSimulator();
        })
      }, "Cancel"), _hoisted_23, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
        "class": "text-gray-600 hover:text-blue-500 active:text-blue-600 cursor-pointer",
        onClick: _cache[7] || (_cache[7] = function ($event) {
          return $options.startApiSimulationRequest();
        })
      }, "Send")])]))]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Restart / Re-run / Stop Buttons "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_24, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryButton, {
        onClick: _cache[8] || (_cache[8] = function ($event) {
          return $options.startUssdServiceSimulator();
        }),
        "class": "mr-2"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Restart")];
        }),
        _: 1 /* STABLE */
      }, 512 /* NEED_PATCH */), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, !$data.loading]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryButton, {
        onClick: _cache[9] || (_cache[9] = function ($event) {
          return $options.startLastUssdCall();
        })
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Re-run")];
        }),
        _: 1 /* STABLE */
      }, 512 /* NEED_PATCH */), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, !$data.loading]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DangerButton, {
        onClick: _cache[10] || (_cache[10] = function ($event) {
          return $options.stopUssdSimulator();
        })
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Stop")];
        }),
        _: 1 /* STABLE */
      }, 512 /* NEED_PATCH */), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, $data.loading]])])], 512 /* NEED_PATCH */), [[vue__WEBPACK_IMPORTED_MODULE_0__.vShow, $data.showingUssdPopup]])];
    }),
    _: 1 /* STABLE */
  })], 2 /* CLASS */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=template&id=9172a774":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=template&id=9172a774 ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  key: 1,
  "class": "grid grid-cols-3"
};
var _hoisted_2 = {
  "class": "grid-span-1 py-8 px-4"
};
var _hoisted_3 = {
  "class": "grid-span-1"
};
var _hoisted_4 = {
  "class": "flex justify-center pt-8"
};
var _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
  "class": "grid-span-1"
}, null, -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_NoScreens = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("NoScreens");
  var _component_SimulatorLogs = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("SimulatorLogs");
  var _component_MobileScreen = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("MobileScreen");
  var _component_Nexus5 = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("Nexus5");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [$data.useVersionBuilder.hasDownloadedBuilder == false || $data.useVersionBuilder.hasSavedBuilder == false ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_NoScreens, {
    key: 0,
    "class": "p-8"
  })) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_SimulatorLogs, {
    logs: ($data.response || {}).logs,
    showLogs: $data.useVersionBuilder.builder.simulator["debugger"].return_logs,
    origin: "simulator"
  }, null, 8 /* PROPS */, ["logs", "showLogs"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_Nexus5, {
    "class": "scale-75 origin-top"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_MobileScreen, {
        onResponse: _cache[0] || (_cache[0] = function ($event) {
          return $data.response = $event;
        })
      })];
    }),
    _: 1 /* STABLE */
  })])]), _hoisted_5]))]);
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.container[data-v-779960f5] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: row;\n  margin: 0 auto;\n  width: 50%;\n}\n@keyframes rotate-779960f5 {\n0% {\n    transform: rotateX(-37.5deg) rotateY(45deg);\n}\n50% {\n    transform: rotateX(-37.5deg) rotateY(405deg);\n}\n100% {\n    transform: rotateX(-37.5deg) rotateY(405deg);\n}\n}\n.cube[data-v-779960f5], .cube *[data-v-779960f5] {\n  position: absolute;\n  width: 101px;\n  height: 101px;\n}\n.sides[data-v-779960f5] {\n  animation: rotate-779960f5 3s ease infinite;\n  animation-delay: 0.8s;\n  transform-style: preserve-3d;\n  transform: rotateX(-37.5deg) rotateY(45deg);\n}\n.cube .sides *[data-v-779960f5] {\n  box-sizing: border-box;\n  background-color: #1b64f150;\n  border: 1px solid white;\n}\n.cube .sides .top[data-v-779960f5] {\n  animation: top-animation-779960f5 3s ease infinite;\n  animation-delay: 0ms;\n  transform: rotateX(90deg) translateZ(100px);\n  animation-fill-mode: forwards;\n  transform-origin: 50% 50%;\n}\n@keyframes top-animation-779960f5 {\n0% {\n    opacity: 1;\n    transform: rotateX(90deg) translateZ(100px);\n}\n20% {\n    opacity: 1;\n    transform: rotateX(90deg) translateZ(50px);\n}\n70% {\n    opacity: 1;\n    transform: rotateX(90deg) translateZ(50px);\n}\n90% {\n    opacity: 1;\n    transform: rotateX(90deg) translateZ(100px);\n}\n100% {\n    opacity: 1;\n    transform: rotateX(90deg) translateZ(100px);\n}\n}\n.cube .sides .bottom[data-v-779960f5] {\n  animation: bottom-animation-779960f5 3s ease infinite;\n  animation-delay: 0ms;\n  transform: rotateX(-90deg) translateZ(100px);\n  animation-fill-mode: forwards;\n  transform-origin: 50% 50%;\n}\n@keyframes bottom-animation-779960f5 {\n0% {\n    opacity: 1;\n    transform: rotateX(-90deg) translateZ(100px);\n}\n20% {\n    opacity: 1;\n    transform: rotateX(-90deg) translateZ(50px);\n}\n70% {\n    opacity: 1;\n    transform: rotateX(-90deg) translateZ(50px);\n}\n90% {\n    opacity: 1;\n    transform: rotateX(-90deg) translateZ(100px);\n}\n100% {\n    opacity: 1;\n    transform: rotateX(-90deg) translateZ(100px);\n}\n}\n.cube .sides .front[data-v-779960f5] {\n  animation: front-animation-779960f5 3s ease infinite;\n  animation-delay: 100ms;\n  transform: rotateY(0deg) translateZ(100px);\n  animation-fill-mode: forwards;\n  transform-origin: 50% 50%;\n}\n@keyframes front-animation-779960f5 {\n0% {\n    opacity: 1;\n    transform: rotateY(0deg) translateZ(100px);\n}\n20% {\n    opacity: 1;\n    transform: rotateY(0deg) translateZ(50px);\n}\n70% {\n    opacity: 1;\n    transform: rotateY(0deg) translateZ(50px);\n}\n90% {\n    opacity: 1;\n    transform: rotateY(0deg) translateZ(100px);\n}\n100% {\n    opacity: 1;\n    transform: rotateY(0deg) translateZ(100px);\n}\n}\n.cube .sides .back[data-v-779960f5] {\n  animation: back-animation-779960f5 3s ease infinite;\n  animation-delay: 100ms;\n  transform: rotateY(-180deg) translateZ(100px);\n  animation-fill-mode: forwards;\n  transform-origin: 50% 50%;\n}\n@keyframes back-animation-779960f5 {\n0% {\n    opacity: 1;\n    transform: rotateY(-180deg) translateZ(100px);\n}\n20% {\n    opacity: 1;\n    transform: rotateY(-180deg) translateZ(50px);\n}\n70% {\n    opacity: 1;\n    transform: rotateY(-180deg) translateZ(50px);\n}\n90% {\n    opacity: 1;\n    transform: rotateY(-180deg) translateZ(100px);\n}\n100% {\n    opacity: 1;\n    transform: rotateY(-180deg) translateZ(100px);\n}\n}\n.cube .sides .left[data-v-779960f5] {\n  animation: left-animation-779960f5 3s ease infinite;\n  animation-delay: 100ms;\n  transform: rotateY(-90deg) translateZ(100px);\n  animation-fill-mode: forwards;\n  transform-origin: 50% 50%;\n}\n@keyframes left-animation-779960f5 {\n0% {\n    opacity: 1;\n    transform: rotateY(-90deg) translateZ(100px);\n}\n20% {\n    opacity: 1;\n    transform: rotateY(-90deg) translateZ(50px);\n}\n70% {\n    opacity: 1;\n    transform: rotateY(-90deg) translateZ(50px);\n}\n90% {\n    opacity: 1;\n    transform: rotateY(-90deg) translateZ(100px);\n}\n100% {\n    opacity: 1;\n    transform: rotateY(-90deg) translateZ(100px);\n}\n}\n.cube .sides .right[data-v-779960f5] {\n  animation: right-animation-779960f5 3s ease infinite;\n  animation-delay: 100ms;\n  transform: rotateY(90deg) translateZ(100px);\n  animation-fill-mode: forwards;\n  transform-origin: 50% 50%;\n}\n@keyframes right-animation-779960f5 {\n0% {\n    opacity: 1;\n    transform: rotateY(90deg) translateZ(100px);\n}\n20% {\n    opacity: 1;\n    transform: rotateY(90deg) translateZ(50px);\n}\n70% {\n    opacity: 1;\n    transform: rotateY(90deg) translateZ(50px);\n}\n90% {\n    opacity: 1;\n    transform: rotateY(90deg) translateZ(100px);\n}\n100% {\n    opacity: 1;\n    transform: rotateY(90deg) translateZ(100px);\n}\n}\n\n/*\n\n.cube .sides .back {\n    background-color: #f1831b80;\n}\n\n.cube .sides .front {\n    background-color: #f11bdd80;\n}\n\n.cube .sides .right {\n    background-color: #1bc1f180;\n}\n\n.cube .sides .bottom {\n    background-color: #1b64f180;\n}\n\n*/\n\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.device {\n        background: #000;\n        padding: 63px 15px 80px;\n        display: inline-block;\n        position: relative;\n        z-index:9;\n        box-shadow: 0px 0px 1.74px 0.26px rgba(0, 0, 0, 0.004),inset 0px 0px 0px 3px rgba(0, 0, 0, 0.004);\n        border-top-left-radius: 200px 30px;\n            border-top-right-radius: 200px 30px;\n            border-bottom-left-radius: 200px 30px;\n            border-bottom-right-radius: 200px 30px;\n        border:2px solid #525053;\n}\n.device > .screen {\n        height: 640px;\n        width: 360px;\n        background-image: url(\"/images/nexus-5-screen-bg.png\");\n}\n.device > .camera {\n        background: rgb(56, 56, 56);\n        position: absolute;\n        left: 42px;\n        top: 26px;\n        height: 12px;\n        width: 12px;\n        border-radius: 50%;\n        background-image: -ms-linear-gradient( 114deg, rgb(132,129,132) 0%, rgb(14,14,14) 100%);\n        box-shadow: 0.899px 0.438px 0px 0px rgba(0, 0, 0, 0.29),inset 1px 0px 0px 0px rgba(255, 255, 255, 0.26);\n}\n.device > .speaker {\n        background: rgb(56, 56, 56);\n        height: 16px;\n        width: 16px;\n        border-radius: 50%;\n        position: absolute;\n        left: 50%;\n        top: 26px;\n        background-image: -ms-linear-gradient( 114deg, rgb(132,129,132) 0%, rgb(14,14,14) 100%);\n        box-shadow: 0.899px 0.438px 0px 0px rgba(0, 0, 0, 0.29),inset 1px 0px 0px 0px rgba(255, 255, 255, 0.26);\n}\n.device > .camera:after {\n        content:\"\";\n        display:block;\n        border-radius: 50%;\n        background-color: rgb(125, 127, 144);\n        position: absolute;\n        left: 3px;\n        top: 3px;\n        width: 3px;\n        height: 3px;\n        z-index: 7;\n}\n.device > .nav {\n        background: #000;\n        height: 48px;\n        width: 100%;\n        display: flex;\n        padding: 0 39px;\n        box-sizing: border-box;\n        opacity: 0.6;\n}\n.device > .nav > div {\n        border: 2px solid white;\n        height: 16px;\n        width: 16px;\n        margin: 16px 40px;\n}\n.device > .nav > .overview {\n        border-radius: 3px;\n}\n.device > .nav > .home {\n        border-radius: 50%;\n}\n.device > .nav >  .back {\n        border: none;\n        height: 17px;\n        width: 2px;\n        position: relative;\n        background: #fff;\n}\n.device > .nav #back:before {\n        content: \"\";\n        position: absolute;\n        display: block;\n        height: 18px;\n        width: 2px;\n        transform: rotate(45deg);\n        background: #fff;\n        left: -7px;\n        top: -5px;\n        -webkit-transform: rotate(60deg);\n}\n.device > .nav #back:after {\n        content: \"\";\n        position: absolute;\n        display: block;\n        height: 18px;\n        width: 2px;\n        transform: rotate(-60deg);\n        background: #fff;\n        left: -7px;\n        top: 3px;\n        -webkit-transform: rotate(-60deg);\n}\n.device > .powerbutton {\n        background:#000;\n        box-shadow: 0px 0px 0.87px 0.13px rgba(0, 0, 0, 0.58),inset 0px 1px 0px 0px rgba(255, 255, 255, 0.14);\n        position: absolute;\n        left: 390px;\n        top: 101px;\n        width: 5px;\n        height: 51px;\n        z-index: 1;\n}\n.device > .volumebutton {\n        background:#000;\n        position: absolute;\n        left: -6px;\n        top: 152px;\n        width: 6px;\n        height: 110px;\n        z-index: 10;\n}\n\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.ussd_input {\n        padding: 0;\n        width: 100%;\n        border: none;\n        border-radius: 0;\n        background: transparent;\n        box-shadow:none !important;\n        border-bottom: 2px solid #11d8b3 !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CubeLoader_vue_vue_type_style_index_0_id_779960f5_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/dist/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CubeLoader_vue_vue_type_style_index_0_id_779960f5_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CubeLoader_vue_vue_type_style_index_0_id_779960f5_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Nexus5_vue_vue_type_style_index_0_id_6ce3b012_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/dist/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Nexus5_vue_vue_type_style_index_0_id_6ce3b012_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Nexus5_vue_vue_type_style_index_0_id_6ce3b012_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_style_index_0_id_fc532de6_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../../../../node_modules/vue-loader/dist/stylePostLoader.js!../../../../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=style&index=0&id=fc532de6&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_style_index_0_id_fc532de6_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_style_index_0_id_fc532de6_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/Components/Loader/Unique/CubeLoader.vue":
/*!**************************************************************!*\
  !*** ./resources/js/Components/Loader/Unique/CubeLoader.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CubeLoader_vue_vue_type_template_id_779960f5_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CubeLoader.vue?vue&type=template&id=779960f5&scoped=true */ "./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=template&id=779960f5&scoped=true");
/* harmony import */ var _CubeLoader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CubeLoader.vue?vue&type=script&lang=js */ "./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=script&lang=js");
/* harmony import */ var _CubeLoader_vue_vue_type_style_index_0_id_779960f5_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css */ "./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;


const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__["default"])(_CubeLoader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_CubeLoader_vue_vue_type_template_id_779960f5_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render],['__scopeId',"data-v-779960f5"],['__file',"resources/js/Components/Loader/Unique/CubeLoader.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/MobileDevice/Nexus5.vue":
/*!*********************************************************!*\
  !*** ./resources/js/Components/MobileDevice/Nexus5.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Nexus5_vue_vue_type_template_id_6ce3b012__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Nexus5.vue?vue&type=template&id=6ce3b012 */ "./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=template&id=6ce3b012");
/* harmony import */ var _Nexus5_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Nexus5.vue?vue&type=script&lang=js */ "./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=script&lang=js");
/* harmony import */ var _Nexus5_vue_vue_type_style_index_0_id_6ce3b012_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css */ "./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;


const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__["default"])(_Nexus5_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Nexus5_vue_vue_type_template_id_6ce3b012__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/MobileDevice/Nexus5.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue":
/*!*****************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CreateScreenModal_vue_vue_type_template_id_c0687d3a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateScreenModal.vue?vue&type=template&id=c0687d3a */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=template&id=c0687d3a");
/* harmony import */ var _CreateScreenModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreateScreenModal.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_CreateScreenModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_CreateScreenModal_vue_vue_type_template_id_c0687d3a__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue":
/*!********************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NoScreens_vue_vue_type_template_id_0f58dd51__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NoScreens.vue?vue&type=template&id=0f58dd51 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=template&id=0f58dd51");
/* harmony import */ var _NoScreens_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NoScreens.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_NoScreens_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_NoScreens_vue_vue_type_template_id_0f58dd51__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue":
/*!***********************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_38a4a9ce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=38a4a9ce */ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=template&id=38a4a9ce");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_38a4a9ce__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue":
/*!*******************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_fc532de6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=fc532de6 */ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=template&id=fc532de6");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=script&lang=js");
/* harmony import */ var _index_vue_vue_type_style_index_0_id_fc532de6_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.vue?vue&type=style&index=0&id=fc532de6&lang=css */ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;


const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_fc532de6__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue":
/*!******************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_9172a774__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=9172a774 */ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=template&id=9172a774");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_9172a774__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=script&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=script&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CubeLoader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CubeLoader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CubeLoader.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Nexus5_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Nexus5_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Nexus5.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateScreenModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateScreenModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CreateScreenModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoScreens_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoScreens_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./NoScreens.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=script&lang=js":
/*!******************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=template&id=779960f5&scoped=true":
/*!********************************************************************************************************!*\
  !*** ./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=template&id=779960f5&scoped=true ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CubeLoader_vue_vue_type_template_id_779960f5_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CubeLoader_vue_vue_type_template_id_779960f5_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CubeLoader.vue?vue&type=template&id=779960f5&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=template&id=779960f5&scoped=true");


/***/ }),

/***/ "./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=template&id=6ce3b012":
/*!***************************************************************************************!*\
  !*** ./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=template&id=6ce3b012 ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Nexus5_vue_vue_type_template_id_6ce3b012__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Nexus5_vue_vue_type_template_id_6ce3b012__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Nexus5.vue?vue&type=template&id=6ce3b012 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=template&id=6ce3b012");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=template&id=c0687d3a":
/*!***********************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=template&id=c0687d3a ***!
  \***********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateScreenModal_vue_vue_type_template_id_c0687d3a__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateScreenModal_vue_vue_type_template_id_c0687d3a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CreateScreenModal.vue?vue&type=template&id=c0687d3a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/CreateScreen/CreateScreenModal.vue?vue&type=template&id=c0687d3a");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=template&id=0f58dd51":
/*!**************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=template&id=0f58dd51 ***!
  \**************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoScreens_vue_vue_type_template_id_0f58dd51__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoScreens_vue_vue_type_template_id_0f58dd51__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./NoScreens.vue?vue&type=template&id=0f58dd51 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/NoScreens.vue?vue&type=template&id=0f58dd51");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=template&id=38a4a9ce":
/*!*****************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=template&id=38a4a9ce ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_38a4a9ce__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_38a4a9ce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=38a4a9ce */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/Logs/index.vue?vue&type=template&id=38a4a9ce");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=template&id=fc532de6":
/*!*************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=template&id=fc532de6 ***!
  \*************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_fc532de6__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_fc532de6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=fc532de6 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=template&id=fc532de6");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=template&id=9172a774":
/*!************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=template&id=9172a774 ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_9172a774__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_9172a774__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=9172a774 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/index.vue?vue&type=template&id=9172a774");


/***/ }),

/***/ "./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css":
/*!**********************************************************************************************************************!*\
  !*** ./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CubeLoader_vue_vue_type_style_index_0_id_779960f5_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/dist/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Loader/Unique/CubeLoader.vue?vue&type=style&index=0&id=779960f5&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Nexus5_vue_vue_type_style_index_0_id_6ce3b012_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/dist/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/MobileDevice/Nexus5.vue?vue&type=style&index=0&id=6ce3b012&lang=css");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css":
/*!***************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css ***!
  \***************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_style_index_0_id_fc532de6_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../../../../node_modules/vue-loader/dist/stylePostLoader.js!../../../../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=style&index=0&id=fc532de6&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css");


/***/ })

}]);