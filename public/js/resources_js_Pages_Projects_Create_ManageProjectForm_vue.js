"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Projects_Create_ManageProjectForm_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Input/DefaultInput */ "./resources/js/Components/Input/DefaultInput.vue");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    DefaultInput: _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  props: {
    form: Object,
    mode: String,
    project: Object
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=template&id=13d5fdbe":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=template&id=13d5fdbe ***!
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
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DefaultInput = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultInput");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Delete / Restore "), $props.mode == 'Delete' || $props.mode == 'Restore' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 0
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Soft Delete "), $props.mode == 'Delete' && !$props.form.deleted_at ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("p", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("This project will be trashed for 30 days before it's permanently deleted. Please be certain. Enter the confirmation code "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.project.confirmation_code), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" to confirm this action.")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Force Delete "), $props.mode == 'Delete' && $props.form.deleted_at ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("p", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Once you delete this project, there is no going back. Please be certain. Enter the confirmation code "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_4, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.project.confirmation_code), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" to confirm this action.")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Restore "), $props.mode == 'Restore' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("p", _hoisted_5, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Enter the confirmation code "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_6, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.project.confirmation_code), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" to confirm this action.")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
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
    placeholder: "My Project",
    disabled: $props.form.processing,
    error: $props.form.errors.name,
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue", "disabled", "error"])], 64 /* STABLE_FRAGMENT */))], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */);
}

/***/ }),

/***/ "./resources/js/Pages/Projects/Create/ManageProjectForm.vue":
/*!******************************************************************!*\
  !*** ./resources/js/Pages/Projects/Create/ManageProjectForm.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ManageProjectForm_vue_vue_type_template_id_13d5fdbe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ManageProjectForm.vue?vue&type=template&id=13d5fdbe */ "./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=template&id=13d5fdbe");
/* harmony import */ var _ManageProjectForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ManageProjectForm.vue?vue&type=script&lang=js */ "./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_ManageProjectForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_ManageProjectForm_vue_vue_type_template_id_13d5fdbe__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Projects/Create/ManageProjectForm.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=script&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=script&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ManageProjectForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ManageProjectForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./ManageProjectForm.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=template&id=13d5fdbe":
/*!************************************************************************************************!*\
  !*** ./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=template&id=13d5fdbe ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ManageProjectForm_vue_vue_type_template_id_13d5fdbe__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ManageProjectForm_vue_vue_type_template_id_13d5fdbe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./ManageProjectForm.vue?vue&type=template&id=13d5fdbe */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Create/ManageProjectForm.vue?vue&type=template&id=13d5fdbe");


/***/ })

}]);