"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Versions_Show_Builder_Content_Simulator_MobileScreen_index_vue"],{

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
      last_session_id: null,
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
        self.last_session_id = ussdResponse.session_id;
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
        session_id: this.last_session_id
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

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css":
/*!***************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css ***!
  \***************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_style_index_0_id_fc532de6_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../../../../node_modules/vue-loader/dist/stylePostLoader.js!../../../../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=style&index=0&id=fc532de6&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Simulator/MobileScreen/index.vue?vue&type=style&index=0&id=fc532de6&lang=css");


/***/ })

}]);