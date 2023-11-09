"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Apps_Create_CreateOrUpdateAppForm_vue"],{

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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Input/DefaultInput */ "./resources/js/Components/Input/DefaultInput.vue");
/* harmony import */ var _components_Badges_PrimaryBadge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Badges/PrimaryBadge */ "./resources/js/Components/Badges/PrimaryBadge.vue");
/* harmony import */ var _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Select/DefaultSelect */ "./resources/js/Components/Select/DefaultSelect.vue");
/* harmony import */ var _components_Switch_DefaultSwitch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Switch/DefaultSwitch */ "./resources/js/Components/Switch/DefaultSwitch.vue");
/* harmony import */ var _components_Checkbox_DefaultCheckbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @components/Checkbox/DefaultCheckbox */ "./resources/js/Components/Checkbox/DefaultCheckbox.vue");
/* harmony import */ var _components_TextArea_DefaultTextArea__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @components/TextArea/DefaultTextArea */ "./resources/js/Components/TextArea/DefaultTextArea.vue");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: _defineProperty({
    DefaultInput: _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_0__["default"],
    PrimaryBadge: _components_Badges_PrimaryBadge__WEBPACK_IMPORTED_MODULE_1__["default"],
    DefaultSelect: _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_2__["default"],
    DefaultSwitch: _components_Switch_DefaultSwitch__WEBPACK_IMPORTED_MODULE_3__["default"],
    DefaultCheckbox: _components_Checkbox_DefaultCheckbox__WEBPACK_IMPORTED_MODULE_4__["default"],
    DefaultTextArea: _components_TextArea_DefaultTextArea__WEBPACK_IMPORTED_MODULE_5__["default"]
  }, "PrimaryBadge", _components_Badges_PrimaryBadge__WEBPACK_IMPORTED_MODULE_1__["default"]),
  props: {
    form: Object,
    mode: String,
    app: {
      type: Object,
      "default": null
    }
  },
  computed: {
    sharedShortCodeOptions: function sharedShortCodeOptions() {
      return this.$page.props.sharedShortCodesPayload.map(function (option) {
        return {
          label: option.code,
          value: option.id
        };
      });
    },
    versionOptions: function versionOptions() {
      var options = (this.app || {}).versions ? this.app.versions : this.$page.props.versionsPayload;
      return options.map(function (option) {
        return {
          label: option.number,
          value: option.id
        };
      });
    }
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=template&id=81888ce4":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=template&id=81888ce4 ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************/
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
  "class": "text-gray-800 font-bold"
};
var _hoisted_3 = {
  key: 1,
  "class": "text-sm text-gray-500 mb-5"
};
var _hoisted_4 = {
  "class": "text-gray-800 font-bold"
};
var _hoisted_5 = {
  key: 2,
  "class": "text-sm text-gray-500 mb-5"
};
var _hoisted_6 = {
  "class": "text-gray-800 font-bold"
};
var _hoisted_7 = {
  "class": "text-xs text-gray-400 ml-2"
};
var _hoisted_8 = {
  "class": "flex items-center justify-between mb-6"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DefaultInput = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultInput");
  var _component_DefaultTextArea = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultTextArea");
  var _component_DefaultSwitch = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSwitch");
  var _component_DefaultSelect = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSelect");
  var _component_PrimaryBadge = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryBadge");
  var _component_DefaultCheckbox = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultCheckbox");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Delete / Restore "), $props.mode == 'Delete' || $props.mode == 'Restore' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 0
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Soft Delete "), $props.mode == 'Delete' && !$props.form.deleted_at ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("p", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("This app will be trashed for 30 days before it's permanently deleted. Please be certain. Enter the confirmation code "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.app.confirmation_code), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" to confirm this action.")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Force Delete "), $props.mode == 'Delete' && $props.form.deleted_at ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("p", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Once you delete this app, there is no going back. Please be certain. Enter the confirmation code "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_4, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.app.confirmation_code), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" to confirm this action.")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Restore "), $props.mode == 'Restore' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("p", _hoisted_5, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Enter the confirmation code "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_6, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.app.confirmation_code), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" to confirm this action.")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
    modelValue: $props.form.confirmation_code,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $props.form.confirmation_code = $event;
    }),
    label: "Confirmation code",
    placeholder: "Enter the confirmation code",
    disabled: $props.form.processing || $props.form.processing,
    error: $props.form.errors.confirmation_code,
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue", "disabled", "error"])], 64 /* STABLE_FRAGMENT */)) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 1
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Create / Update "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
    modelValue: $props.form.name,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
      return $props.form.name = $event;
    }),
    label: "Name",
    placeholder: "My App",
    disabled: $props.form.processing,
    error: $props.form.errors.name,
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue", "disabled", "error"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultTextArea, {
    modelValue: $props.form.description,
    "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
      return $props.form.description = $event;
    }),
    label: "Description",
    placeholder: "This is a budget app",
    disabled: $props.form.processing,
    error: $props.form.errors.description,
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue", "disabled", "error"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSwitch, {
    modelValue: $props.form.online,
    "onUpdate:modelValue": _cache[3] || (_cache[3] = function ($event) {
      return $props.form.online = $event;
    }),
    label: "Online",
    disabled: $props.form.processing,
    error: $props.form.errors.online,
    "class": "mb-6"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_7, " — Your app is " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.form.online ? 'online' : 'offline'), 1 /* TEXT */)];
    }),

    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["modelValue", "disabled", "error"]), !$props.form.online ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultTextArea, {
    key: 0,
    modelValue: $props.form.offline_message,
    "onUpdate:modelValue": _cache[4] || (_cache[4] = function ($event) {
      return $props.form.offline_message = $event;
    }),
    label: "Offline Message",
    placeholder: "This service is currently not available",
    disabled: $props.form.processing,
    error: $props.form.errors.offline_message,
    "class": "mb-4"
  }, null, 8 /* PROPS */, ["modelValue", "disabled", "error"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_8, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSelect, {
    modelValue: $props.form.shared_short_code_id,
    "onUpdate:modelValue": _cache[5] || (_cache[5] = function ($event) {
      return $props.form.shared_short_code_id = $event;
    }),
    options: $options.sharedShortCodeOptions,
    label: "Shared Short Code",
    placeholder: "Select a shared shortcode",
    disabled: $props.form.processing,
    error: $props.form.errors.shared_short_code_id,
    "class": "w-60"
  }, null, 8 /* PROPS */, ["modelValue", "options", "disabled", "error"]), $props.form.shared_code ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_PrimaryBadge, {
    key: 0,
    "class": "mt-4"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)((0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.form.shared_code), 1 /* TEXT */)];
    }),

    _: 1 /* STABLE */
  })) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)])], 64 /* STABLE_FRAGMENT */)), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Update "), $props.mode == 'Update' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 2
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSelect, {
    modelValue: $props.form.active_version_id,
    "onUpdate:modelValue": _cache[6] || (_cache[6] = function ($event) {
      return $props.form.active_version_id = $event;
    }),
    options: $options.versionOptions,
    label: "Active version",
    placeholder: "Select a version",
    disabled: $props.form.processing,
    error: $props.form.errors.active_version_id,
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue", "options", "disabled", "error"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
    modelValue: $props.form.dedicated_code,
    "onUpdate:modelValue": _cache[7] || (_cache[7] = function ($event) {
      return $props.form.dedicated_code = $event;
    }),
    label: "Dedicated Code",
    placeholder: "*123#",
    disabled: $props.form.processing,
    error: $props.form.errors.dedicated_code,
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue", "disabled", "error"]), $props.form.errors.dedicated_code == 'The dedicated code is already used by another app. Do you want to reassign the shortcode?' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultCheckbox, {
    key: 0,
    modelValue: $props.form.overide_dedicated_code,
    "onUpdate:modelValue": _cache[8] || (_cache[8] = function ($event) {
      return $props.form.overide_dedicated_code = $event;
    }),
    label: "Reassign dedicated code to this app",
    disabled: $props.form.processing,
    error: $props.form.errors.overide_dedicated_code,
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue", "disabled", "error"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)], 64 /* STABLE_FRAGMENT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)], 64 /* STABLE_FRAGMENT */);
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
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_DefaultCheckbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_DefaultCheckbox_vue_vue_type_template_id_c2f18bfa__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/Checkbox/DefaultCheckbox.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue":
/*!******************************************************************!*\
  !*** ./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CreateOrUpdateAppForm_vue_vue_type_template_id_81888ce4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateOrUpdateAppForm.vue?vue&type=template&id=81888ce4 */ "./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=template&id=81888ce4");
/* harmony import */ var _CreateOrUpdateAppForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreateOrUpdateAppForm.vue?vue&type=script&lang=js */ "./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_CreateOrUpdateAppForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_CreateOrUpdateAppForm_vue_vue_type_template_id_81888ce4__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue"]])
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

/***/ "./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=script&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=script&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateAppForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateAppForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CreateOrUpdateAppForm.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=script&lang=js");
 

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

/***/ "./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=template&id=81888ce4":
/*!************************************************************************************************!*\
  !*** ./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=template&id=81888ce4 ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateAppForm_vue_vue_type_template_id_81888ce4__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateAppForm_vue_vue_type_template_id_81888ce4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CreateOrUpdateAppForm.vue?vue&type=template&id=81888ce4 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Apps/Create/CreateOrUpdateAppForm.vue?vue&type=template&id=81888ce4");


/***/ })

}]);