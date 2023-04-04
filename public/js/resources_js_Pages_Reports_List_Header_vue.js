"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Reports_List_Header_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Popover_InfoPopover__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../Popover/InfoPopover */ "./resources/js/Components/Popover/InfoPopover.vue");
/* harmony import */ var _Error_DefaultError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../Error/DefaultError */ "./resources/js/Components/Error/DefaultError.vue");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    InfoPopover: _Popover_InfoPopover__WEBPACK_IMPORTED_MODULE_1__["default"],
    DefaultError: _Error_DefaultError__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  props: {
    modelValue: Boolean,
    label: String,
    info: String,
    note: String,
    size: {
      type: String,
      "default": 'xs'
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    error: {
      type: String,
      "default": ''
    }
  },
  data: function data() {
    return {
      uniqueId: (0,lodash__WEBPACK_IMPORTED_MODULE_0__.uniqueId)('input-'),
      localModelValue: this.modelValue
    };
  },
  watch: {
    modelValue: function modelValue(newValue, oldValue) {
      this.localModelValue = newValue;
    },
    localModelValue: function localModelValue(newValue, oldValue) {
      this.$emit('update:modelValue', newValue);
      this.$emit('onChange', newValue);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    var _this$route$params$pr, _this$route$params$ve, _this$route$params$ap;
    return {
      selectedProject: (_this$route$params$pr = this.route().params.project) !== null && _this$route$params$pr !== void 0 ? _this$route$params$pr : 'any',
      selectedVersion: (_this$route$params$ve = this.route().params.version) !== null && _this$route$params$ve !== void 0 ? _this$route$params$ve : 'any',
      selectedApp: (_this$route$params$ap = this.route().params.app) !== null && _this$route$params$ap !== void 0 ? _this$route$params$ap : 'any',
      projectOptions: [],
      versionOptions: [],
      appOptions: []
    };
  },
  methods: {
    setProjectOptions: function setProjectOptions() {
      this.projectOptions = this.$page.props.projectOptions ? [{
        label: 'Any',
        value: 'any'
      }].concat(_toConsumableArray(this.$page.props.projectOptions.map(function (option) {
        return {
          label: option.name,
          value: option.id
        };
      }))) : [];
    },
    setAppOptions: function setAppOptions() {
      var _this = this;
      var options = [{
        label: 'Any',
        value: 'any'
      }];

      //  If the project options exist
      if ((this.$page.props.projectOptions || []).length) {
        //  Check if a project has been selected
        if (this.selectedProject !== 'any') {
          //  Get the selected project
          var project = this.$page.props.projectOptions.find(function (option) {
            return option.id == _this.selectedProject;
          });

          //  Get the selected project app options
          project.apps.forEach(function (option) {
            options.push({
              label: option.name,
              value: option.id
            });
          });
        }
      } else if ((this.$page.props.appOptions || []).length) {
        //  Get the route provided options
        this.$page.props.appOptions.forEach(function (option) {
          options.push({
            label: option.name,
            value: option.id
          });
        });
      }
      this.appOptions = options;
    },
    setVersionOptions: function setVersionOptions() {
      var _this2 = this;
      var options = [{
        label: 'Any',
        value: 'any'
      }];

      //  If the project options exist
      if ((this.$page.props.projectOptions || []).length) {
        //  Check if a project has been selected
        if (this.selectedProject !== 'any') {
          //  Get the selected project
          var project = this.$page.props.projectOptions.find(function (option) {
            return option.id == _this2.selectedProject;
          });

          //  If the app options exist
          if (project.apps.length) {
            //  Check if an app has been selected
            if (this.selectedApp !== 'any') {
              //  Get the selected app
              var app = project.apps.find(function (option) {
                return option.id == _this2.selectedApp;
              });

              //  Get the selected project app options
              app.versions.forEach(function (option) {
                options.push({
                  label: option.number,
                  value: option.id
                });
              });
            }
          }
        }

        //  If the app options exist
      } else if ((this.$page.props.appOptions || []).length) {
        //  Check if an app has been selected
        if (this.selectedApp !== 'any') {
          //  Get the selected app
          var _app = this.$page.props.appOptions.find(function (option) {
            return option.id == _this2.selectedApp;
          });

          //  Get the selected project app options
          _app.versions.forEach(function (option) {
            options.push({
              label: option.number,
              value: option.id
            });
          });
        }

        //  If the version options exist
      } else if ((this.$page.props.versionOptions || []).length) {
        //  Get the version options
        this.$page.props.versionOptions.forEach(function (option) {
          options.push({
            label: option.number,
            value: option.id
          });
        });
      } else {
        return [];
      }
      this.versionOptions = options;
    },
    onSelectProjectOption: function onSelectProjectOption() {
      this.selectedApp = 'any';
      this.selectedVersion = 'any';
      this.setAppOptions();
      this.refreshContent();
    },
    onSelectAppOption: function onSelectAppOption() {
      this.selectedVersion = 'any';
      this.setVersionOptions();
      this.refreshContent();
    }
  },
  created: function created() {
    this.setProjectOptions();
    this.setVersionOptions();
    this.setAppOptions();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Header.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Header.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");
/* harmony import */ var _mixins_ModelFilterMixin_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @mixins/ModelFilterMixin.vue */ "./resources/js/Mixins/ModelFilterMixin.vue");
/* harmony import */ var _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Select/DefaultSelect */ "./resources/js/Components/Select/DefaultSelect.vue");
/* harmony import */ var _components_Checkbox_DefaultCheckbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Checkbox/DefaultCheckbox */ "./resources/js/Components/Checkbox/DefaultCheckbox.vue");
/* harmony import */ var _components_SearchBar_DefaultSearchBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/SearchBar/DefaultSearchBar */ "./resources/js/Components/SearchBar/DefaultSearchBar.vue");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  mixins: [_mixins_ModelFilterMixin_vue__WEBPACK_IMPORTED_MODULE_0__["default"]],
  props: ['hideDuplicateCells'],
  components: {
    DefaultSelect: _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_1__["default"],
    DefaultSearchBar: _components_SearchBar_DefaultSearchBar__WEBPACK_IMPORTED_MODULE_3__["default"],
    DefaultCheckbox: _components_Checkbox_DefaultCheckbox__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: function data() {
    return {
      localHideDuplicateCells: this.hideDuplicateCells,
      //  General stats
      totalAccounts: this.$page.props.statistics.totalAccounts,
      //  Origin stats
      totalMobileAccounts: this.$page.props.statistics.totalMobileAccounts,
      totalSimulatorAccounts: this.$page.props.statistics.totalSimulatorAccounts,
      origin: 'any',
      originOptions: [{
        label: 'Any',
        value: 'any'
      }, {
        label: 'Mobile',
        value: 'mobile'
      }, {
        label: 'Simulator',
        value: 'simulator'
      }],
      search: null,
      request: null,
      refreshContentInterval: null,
      appId: this.route().params.app,
      projectId: this.route().params.project,
      versionId: this.route().params.version
    };
  },
  watch: {
    hideDuplicateCells: function hideDuplicateCells(newValue, oldValue) {
      this.localHideDuplicateCells = newValue;
    },
    localHideDuplicateCells: function localHideDuplicateCells(newValue, oldValue) {
      this.$emit('update:hideDuplicateCells', newValue);
    }
  },
  methods: {
    updateHideDuplicateCells: function updateHideDuplicateCells(value) {
      localHideDuplicateCells = value;
    },
    refreshContent: function refreshContent() {
      var _this = this;
      var canCancel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      //  If we can't cancel the previous request that has not eneded, then deny refreshing of content
      if (canCancel == false && this.request) return;

      //  If we can cancel the previous
      if (canCancel == true) {
        //  If the request is cancellable, cancel the previous request
        if (this.request) this.request.cancel();

        //  Start loader
        this.$emit('isLoading', true);
      }

      /**
       *  Generate the axios cancel token to allow this request
       *  to be cancelled if this action is required
       *
       *  Reference: https://stackoverflow.com/questions/50516438/cancel-previous-request-using-axios-with-vue-js
       */
      var axiosSource = axios__WEBPACK_IMPORTED_MODULE_4__["default"].CancelToken.source();
      this.request = {
        cancel: axiosSource.cancel
      };
      var config = {
        cancelToken: axiosSource.token
      };
      var url;
      if (this.selectedProject !== 'any' && this.selectedApp !== 'any' && this.selectedVersion !== 'any') {
        var _this$route$params$pa;
        //  /projects/1/apps/1/versions/1/accounts
        url = route('version.accounts.show', {
          project: this.selectedProject,
          version: this.selectedVersion,
          app: this.selectedApp,
          //  Query params
          page: (_this$route$params$pa = this.route().params.page) !== null && _this$route$params$pa !== void 0 ? _this$route$params$pa : 1,
          requestType: this.requestType,
          origin: this.origin,
          status: this.status,
          search: this.search
        });
      } else if (this.selectedProject !== 'any' && this.selectedApp !== 'any') {
        var _this$route$params$pa2;
        //  /projects/1/apps/1/accounts
        url = route('app.accounts.show', {
          project: this.selectedProject,
          app: this.selectedApp,
          //  Query params
          page: (_this$route$params$pa2 = this.route().params.page) !== null && _this$route$params$pa2 !== void 0 ? _this$route$params$pa2 : 1,
          requestType: this.requestType,
          origin: this.origin,
          status: this.status,
          search: this.search
        });
      } else if (this.selectedProject !== 'any') {
        var _this$route$params$pa3;
        //  /projects/1/accounts
        url = route('project.accounts.show', {
          project: this.selectedProject,
          //  Query params
          page: (_this$route$params$pa3 = this.route().params.page) !== null && _this$route$params$pa3 !== void 0 ? _this$route$params$pa3 : 1,
          requestType: this.requestType,
          origin: this.origin,
          status: this.status,
          search: this.search
        });
      } else {
        var _this$route$params$pa4;
        //  /accounts
        url = route('accounts.show', {
          //  Query params
          page: (_this$route$params$pa4 = this.route().params.page) !== null && _this$route$params$pa4 !== void 0 ? _this$route$params$pa4 : 1,
          requestType: this.requestType,
          origin: this.origin,
          status: this.status,
          search: this.search
        });
      }
      axios__WEBPACK_IMPORTED_MODULE_4__["default"].get(url, config).then(function (response) {
        var statistics = response.data.statistics;
        _this.totalAccounts = statistics.totalAccounts, _this.totalMobileAccounts = statistics.totalMobileAccounts, _this.totalSimulatorAccounts = statistics.totalSimulatorAccounts, _this.$emit('response', response.data);

        //  Stop loader
        _this.$emit('isLoading', false);

        //  Set the request to null to grant refreshing of content
        _this.request = null;
      });
    },
    cleanUp: function cleanUp() {
      clearInterval(this.refreshContentInterval);
      this.refreshContentInterval = null;
    }
  },
  created: function created() {
    //  Keep refreshing this page content every 3 seconds
    this.refreshContentInterval = setInterval(function () {
      this.refreshContent(false);
    }.bind(this), 3000);
  },
  unmounted: function unmounted() {
    this.cleanUp();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=template&id=c2f18bfa":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=template&id=c2f18bfa ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "flex items-center"
};
var _hoisted_2 = ["id", "disabled"];
var _hoisted_3 = ["for"];
var _hoisted_4 = {
  key: 1,
  "class": "text-xs text-gray-400 ml-2"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_InfoPopover = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("InfoPopover");
  var _component_DefaultError = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultError");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("input", {
    id: $data.uniqueId,
    type: "checkbox",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $data.localModelValue = $event;
    }),
    disabled: $props.disabled,
    "class": "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
  }, null, 8 /* PROPS */, _hoisted_2), [[vue__WEBPACK_IMPORTED_MODULE_0__.vModelCheckbox, $data.localModelValue]]), $props.label ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("label", {
    key: 0,
    "for": $data.uniqueId,
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)('text-' + $props.size + ' font-medium text-gray-900 ml-2')
  }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.label), 11 /* TEXT, CLASS, PROPS */, _hoisted_3)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Note "), $props.note ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_4, " — " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.note), 1 /* TEXT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Info Text "), $props.info ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_InfoPopover, {
    key: 2,
    info: $props.info,
    "class": "ml-2"
  }, null, 8 /* PROPS */, ["info"])) : _ctx.$slots.info ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 3
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Info Slot "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_InfoPopover, {
    "class": "ml-2"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "info")];
    }),
    _: 3 /* FORWARDED */
  })], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultError, {
    error: $props.error,
    "class": "mt-2"
  }, null, 8 /* PROPS */, ["error"])]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Header.vue?vue&type=template&id=5f7d3896":
/*!************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Header.vue?vue&type=template&id=5f7d3896 ***!
  \************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "flex items-center justify-between mb-6"
};
var _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h1", {
  "class": "text-xl font-semibold text-gray-700 mb-2"
}, "Accounts", -1 /* HOISTED */);
var _hoisted_3 = {
  "class": "flex divide-x border rounded-md py-2 px-6"
};
var _hoisted_4 = {
  "class": "text-center text-xs m-auto pr-6"
};
var _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", {
  "class": "mb-2 text-gray-400"
}, "Total Accounts", -1 /* HOISTED */);
var _hoisted_6 = {
  "class": "text-center text-xs m-auto px-6"
};
var _hoisted_7 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", {
  "class": "mb-2 text-gray-400"
}, "Mobile", -1 /* HOISTED */);
var _hoisted_8 = {
  "class": "text-gray-300 font-semibold text-lg"
};
var _hoisted_9 = {
  "class": "text-center text-xs m-auto px-6"
};
var _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", {
  "class": "mb-2 text-gray-400"
}, "Simulator", -1 /* HOISTED */);
var _hoisted_11 = {
  "class": "text-gray-300 font-semibold text-lg"
};
var _hoisted_12 = {
  "class": "flex items-end justify-between mb-6"
};
var _hoisted_13 = {
  "class": "flex justify-center bg-blue-50 p-2"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DefaultSelect = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSelect");
  var _component_DefaultSearchBar = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSearchBar");
  var _component_DefaultCheckbox = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultCheckbox");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [_hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [_hoisted_5, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", {
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)([($data.totalAccounts == 0 ? 'text-gray-300' : 'text-blue-500') + ' font-semibold text-lg'])
  }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.totalAccounts), 3 /* TEXT, CLASS */)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_6, [_hoisted_7, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", _hoisted_8, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.totalMobileAccounts), 1 /* TEXT */)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_9, [_hoisted_10, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", _hoisted_11, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.totalSimulatorAccounts), 1 /* TEXT */)])])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_12, [_ctx.projectOptions.length >= 2 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultSelect, {
    key: 0,
    modelValue: _ctx.selectedProject,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return _ctx.selectedProject = $event;
    }),
    options: _ctx.projectOptions,
    onChange: _cache[1] || (_cache[1] = function ($event) {
      return _ctx.onSelectProjectOption();
    }),
    label: "Project",
    placeholder: "Select project",
    "class": "w-40"
  }, null, 8 /* PROPS */, ["modelValue", "options"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), _ctx.appOptions.length >= 2 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultSelect, {
    key: 1,
    modelValue: _ctx.selectedApp,
    "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
      return _ctx.selectedApp = $event;
    }),
    options: _ctx.appOptions,
    onChange: _cache[3] || (_cache[3] = function ($event) {
      return _ctx.onSelectAppOption();
    }),
    label: "App",
    placeholder: "Select app",
    "class": "w-40"
  }, null, 8 /* PROPS */, ["modelValue", "options"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), _ctx.versionOptions.length >= 2 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultSelect, {
    key: 2,
    modelValue: _ctx.selectedVersion,
    "onUpdate:modelValue": _cache[4] || (_cache[4] = function ($event) {
      return _ctx.selectedVersion = $event;
    }),
    options: _ctx.versionOptions,
    onChange: _cache[5] || (_cache[5] = function ($event) {
      return $options.refreshContent();
    }),
    label: "Version",
    placeholder: "Select version",
    "class": "w-40"
  }, null, 8 /* PROPS */, ["modelValue", "options"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSelect, {
    modelValue: $data.origin,
    "onUpdate:modelValue": _cache[6] || (_cache[6] = function ($event) {
      return $data.origin = $event;
    }),
    options: $data.originOptions,
    onChange: _cache[7] || (_cache[7] = function ($event) {
      return $options.refreshContent();
    }),
    label: "Filter by origin",
    placeholder: "Select origin",
    "class": "w-60"
  }, null, 8 /* PROPS */, ["modelValue", "options"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSearchBar, {
    modelValue: $data.search,
    "onUpdate:modelValue": _cache[8] || (_cache[8] = function ($event) {
      return $data.search = $event;
    }),
    onOnSearch: _cache[9] || (_cache[9] = function ($event) {
      return $options.refreshContent();
    }),
    placeholder: "Search sessions"
  }, null, 8 /* PROPS */, ["modelValue"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_13, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultCheckbox, {
    modelValue: $data.localHideDuplicateCells,
    "onUpdate:modelValue": _cache[10] || (_cache[10] = function ($event) {
      return $data.localHideDuplicateCells = $event;
    }),
    onOnChange: $options.updateHideDuplicateCells,
    label: "Remove Duplicates"
  }, null, 8 /* PROPS */, ["modelValue", "onOnChange"])])]);
}

/***/ }),

/***/ "./resources/js/Components/Checkbox/DefaultCheckbox.vue":
/*!**************************************************************!*\
  !*** ./resources/js/Components/Checkbox/DefaultCheckbox.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DefaultCheckbox_vue_vue_type_template_id_c2f18bfa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DefaultCheckbox.vue?vue&type=template&id=c2f18bfa */ "./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=template&id=c2f18bfa");
/* harmony import */ var _DefaultCheckbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DefaultCheckbox.vue?vue&type=script&lang=js */ "./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_DefaultCheckbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_DefaultCheckbox_vue_vue_type_template_id_c2f18bfa__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Checkbox/DefaultCheckbox.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Mixins/ModelFilterMixin.vue":
/*!**************************************************!*\
  !*** ./resources/js/Mixins/ModelFilterMixin.vue ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ModelFilterMixin_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelFilterMixin.vue?vue&type=script&lang=js */ "./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");



;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_ModelFilterMixin_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"], [['__file',"resources/js/Mixins/ModelFilterMixin.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Reports/List/Header.vue":
/*!****************************************************!*\
  !*** ./resources/js/Pages/Reports/List/Header.vue ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Header_vue_vue_type_template_id_5f7d3896__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Header.vue?vue&type=template&id=5f7d3896 */ "./resources/js/Pages/Reports/List/Header.vue?vue&type=template&id=5f7d3896");
/* harmony import */ var _Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Header.vue?vue&type=script&lang=js */ "./resources/js/Pages/Reports/List/Header.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Header_vue_vue_type_template_id_5f7d3896__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Reports/List/Header.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=script&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=script&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DefaultCheckbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DefaultCheckbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DefaultCheckbox.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js":
/*!**************************************************************************!*\
  !*** ./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ModelFilterMixin_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ModelFilterMixin_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./ModelFilterMixin.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Reports/List/Header.vue?vue&type=script&lang=js":
/*!****************************************************************************!*\
  !*** ./resources/js/Pages/Reports/List/Header.vue?vue&type=script&lang=js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Header.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Header.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=template&id=c2f18bfa":
/*!********************************************************************************************!*\
  !*** ./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=template&id=c2f18bfa ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DefaultCheckbox_vue_vue_type_template_id_c2f18bfa__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DefaultCheckbox_vue_vue_type_template_id_c2f18bfa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DefaultCheckbox.vue?vue&type=template&id=c2f18bfa */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/Checkbox/DefaultCheckbox.vue?vue&type=template&id=c2f18bfa");


/***/ }),

/***/ "./resources/js/Pages/Reports/List/Header.vue?vue&type=template&id=5f7d3896":
/*!**********************************************************************************!*\
  !*** ./resources/js/Pages/Reports/List/Header.vue?vue&type=template&id=5f7d3896 ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Header_vue_vue_type_template_id_5f7d3896__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Header_vue_vue_type_template_id_5f7d3896__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Header.vue?vue&type=template&id=5f7d3896 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Header.vue?vue&type=template&id=5f7d3896");


/***/ })

}]);