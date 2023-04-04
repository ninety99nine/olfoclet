"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Versions_Show_Builder_Aside_Simulator_index_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Input/DefaultInput */ "./resources/js/Components/Input/DefaultInput.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Switch_DefaultSwitch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Switch/DefaultSwitch */ "./resources/js/Components/Switch/DefaultSwitch.vue");
/* harmony import */ var _components_TextArea_DefaultTextArea__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/TextArea/DefaultTextArea */ "./resources/js/Components/TextArea/DefaultTextArea.vue");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    DefaultInput: _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_0__["default"],
    DefaultSwitch: _components_Switch_DefaultSwitch__WEBPACK_IMPORTED_MODULE_2__["default"],
    DefaultTextArea: _components_TextArea_DefaultTextArea__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__.useVersionBuilder)()
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=template&id=21ecfac5":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=template&id=21ecfac5 ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
  "class": "flex items-center justify-between border-b border-dotted pb-2 mb-8"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h5", {
  "class": "text-sm font-semibold tracking-tight text-gray-600"
}, "Simulator Settings")], -1 /* HOISTED */);
var _hoisted_2 = {
  "class": "text-xs text-gray-400 ml-2"
};
var _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
  "class": "border-b border-dotted pb-4 my-8"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h5", {
  "class": "text-sm font-semibold tracking-tight text-gray-600"
}, "Log Settings"), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h5", {
  "class": "text-xs tracking-tight text-gray-400 mt-4 italic text-justify"
}, "Showing the debugging logs may slow down the performance of the simulator. Turn off the logs for better performance")], -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DefaultInput = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultInput");
  var _component_DefaultSwitch = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSwitch");
  var _component_DefaultTextArea = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultTextArea");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Heading "), _hoisted_1, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Mobile Number "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
    modelValue: $data.useVersionBuilder.builder.simulator.subscriber.phone_number,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $data.useVersionBuilder.builder.simulator.subscriber.phone_number = $event;
    }),
    label: "Mobile number",
    placeholder: "26772001234",
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Allow Timeout "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSwitch, {
    modelValue: $data.useVersionBuilder.builder.simulator.settings.allow_timeouts,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
      return $data.useVersionBuilder.builder.simulator.settings.allow_timeouts = $event;
    }),
    label: "Allow Timeouts",
    "class": "mb-6"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, " — " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.useVersionBuilder.builder.simulator.settings.allow_timeouts ? 'Timeout enabled' : 'Timeout disabled'), 1 /* TEXT */)];
    }),

    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Timeout In Seconds "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
    modelValue: $data.useVersionBuilder.builder.simulator.settings.timeout_limit_in_seconds,
    "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
      return $data.useVersionBuilder.builder.simulator.settings.timeout_limit_in_seconds = $event;
    }),
    type: "number",
    label: "Timeout In Seconds",
    placeholder: "120",
    disabled: $data.useVersionBuilder.builder.simulator.settings.allow_timeouts == false,
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue", "disabled"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Timeout Message "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultTextArea, {
    modelValue: $data.useVersionBuilder.builder.simulator.settings.timeout_message,
    "onUpdate:modelValue": _cache[3] || (_cache[3] = function ($event) {
      return $data.useVersionBuilder.builder.simulator.settings.timeout_message = $event;
    }),
    label: "Timeout Message",
    disabled: $data.useVersionBuilder.builder.simulator.settings.allow_timeouts == false
  }, null, 8 /* PROPS */, ["modelValue", "disabled"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Heading "), _hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Show Debugging Logs "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSwitch, {
    modelValue: $data.useVersionBuilder.builder.simulator["debugger"].return_logs,
    "onUpdate:modelValue": _cache[4] || (_cache[4] = function ($event) {
      return $data.useVersionBuilder.builder.simulator["debugger"].return_logs = $event;
    }),
    label: "Show Debugging Logs",
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Summarize Debugging Logs "), $data.useVersionBuilder.builder.simulator["debugger"].return_logs ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultSwitch, {
    key: 0,
    modelValue: $data.useVersionBuilder.builder.simulator["debugger"].return_summarized_logs,
    "onUpdate:modelValue": _cache[5] || (_cache[5] = function ($event) {
      return $data.useVersionBuilder.builder.simulator["debugger"].return_summarized_logs = $event;
    }),
    label: "Summarize Debugging Logs",
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]);
}

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue":
/*!****************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_21ecfac5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=21ecfac5 */ "./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=template&id=21ecfac5");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_21ecfac5__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=script&lang=js":
/*!****************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=template&id=21ecfac5":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=template&id=21ecfac5 ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_21ecfac5__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_21ecfac5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=21ecfac5 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Aside/Simulator/index.vue?vue&type=template&id=21ecfac5");


/***/ })

}]);