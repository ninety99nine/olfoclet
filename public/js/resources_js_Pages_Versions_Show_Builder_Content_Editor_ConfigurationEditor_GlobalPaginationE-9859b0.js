"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Versions_Show_Builder_Content_Editor_ConfigurationEditor_GlobalPaginationE-9859b0"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _paginationEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @paginationEditor */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    PaginationEditor: _paginationEditor__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_0__.useVersionBuilder)()
    };
  },
  computed: {
    globalPagination: function globalPagination() {
      return this.useVersionBuilder.builder.global_pagination;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Switch_DefaultSwitch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Switch/DefaultSwitch */ "./resources/js/Components/Switch/DefaultSwitch.vue");
/* harmony import */ var _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Select/DefaultSelect */ "./resources/js/Components/Select/DefaultSelect.vue");
/* harmony import */ var _builderComponents_SelectActiveState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @builderComponents/SelectActiveState */ "./resources/js/Pages/Versions/Show/Builder/Components/SelectActiveState.vue");
/* harmony import */ var _components_TextOrCodeEditor_TextOrCodeEditor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @components/TextOrCodeEditor/TextOrCodeEditor */ "./resources/js/Components/TextOrCodeEditor/TextOrCodeEditor.vue");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['global', 'pagination'],
  components: {
    DefaultSwitch: _components_Switch_DefaultSwitch__WEBPACK_IMPORTED_MODULE_1__["default"],
    DefaultSelect: _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_2__["default"],
    SelectActiveState: _builderComponents_SelectActiveState__WEBPACK_IMPORTED_MODULE_3__["default"],
    TextOrCodeEditor: _components_TextOrCodeEditor_TextOrCodeEditor__WEBPACK_IMPORTED_MODULE_4__["default"]
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_0__.useVersionBuilder)(),
      targetOptions: [{
        label: 'Instruction Content',
        value: 'instruction'
      }, {
        label: 'Action Content',
        value: 'action'
      }, {
        label: 'Both',
        value: 'both'
      }],
      separationOptions: [{
        label: 'Words',
        value: 'words'
      }, {
        label: 'Characters',
        value: 'characters'
      }]
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=template&id=3c0c0f5a":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=template&id=3c0c0f5a ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_PaginationEditor = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PaginationEditor");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_PaginationEditor, {
    global: true,
    pagination: $options.globalPagination
  }, null, 8 /* PROPS */, ["pagination"]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=template&id=26c5382a":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=template&id=26c5382a ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "grid grid-cols-2 gap-8 mb-6"
};
var _hoisted_2 = {
  "class": "col-span-1"
};
var _hoisted_3 = {
  "class": "col-span-1"
};
var _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, " If enabled, this feature separates the content by its line breaks before limiting the content. This is useful if the display consists of menus that must not be cut off, especially menus consisting of multiple words. This means each menu will not be split into separate portions and placed in separate pagination groups. ", -1 /* HOISTED */);
var _hoisted_5 = {
  "class": "grid grid-cols-2 gap-8 mb-6"
};
var _hoisted_6 = {
  "class": "col-span-1"
};
var _hoisted_7 = {
  "class": "col-span-1"
};
var _hoisted_8 = {
  "class": "grid grid-cols-2 gap-8 mb-6"
};
var _hoisted_9 = {
  "class": "col-span-1"
};
var _hoisted_10 = {
  "class": "col-span-1"
};
var _hoisted_11 = {
  "class": "grid grid-cols-2 gap-8 mb-6"
};
var _hoisted_12 = {
  "class": "col-span-1"
};
var _hoisted_13 = {
  "class": "col-span-1"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DefaultSwitch = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSwitch");
  var _component_SelectActiveState = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("SelectActiveState");
  var _component_DefaultSelect = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSelect");
  var _component_TextOrCodeEditor = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("TextOrCodeEditor");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Switch "), $props.global == false ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultSwitch, {
    key: 0,
    modelValue: $props.pagination.use_global_pagination,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $props.pagination.use_global_pagination = $event;
    }),
    label: "Global Pagination",
    note: ($props.pagination.use_global_pagination ? 'Disable ' : 'Enable') + ' the use of global pagination',
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue", "note"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), $props.global == true || $props.global == false && $props.pagination.use_global_pagination == false ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: 1
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Active State "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_SelectActiveState, {
    modelValue: $props.pagination.active,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
      return $props.pagination.active = $event;
    }),
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Target "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSelect, {
    modelValue: $props.pagination.content_target.selected_type,
    "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
      return $props.pagination.content_target.selected_type = $event;
    }),
    options: $data.targetOptions,
    label: "Target",
    note: "📃 Content to paginate"
  }, null, 8 /* PROPS */, ["modelValue", "options"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Separation "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSelect, {
    modelValue: $props.pagination.slice.separation_type,
    "onUpdate:modelValue": _cache[3] || (_cache[3] = function ($event) {
      return $props.pagination.slice.separation_type = $event;
    }),
    options: $data.separationOptions,
    label: "Separation",
    note: "✂️ Content separation technique"
  }, null, 8 /* PROPS */, ["modelValue", "options"])])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Enable / Disable Pagination By Line Breaks "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSwitch, {
    modelValue: $props.pagination.paginate_by_line_breaks,
    "onUpdate:modelValue": _cache[4] || (_cache[4] = function ($event) {
      return $props.pagination.paginate_by_line_breaks = $event;
    }),
    note: ($props.pagination.paginate_by_line_breaks ? 'Disable' : 'Enable') + ' separation by line breaks before pagination',
    "class": "mb-6"
  }, {
    info: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_4];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["modelValue", "note"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_5, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_6, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_TextOrCodeEditor, {
    modelValue: $props.pagination.scroll_down.name,
    "onUpdate:modelValue": _cache[5] || (_cache[5] = function ($event) {
      return $props.pagination.scroll_down.name = $event;
    }),
    label: "Scroll ⬇️ Name",
    placeholder: "99. Next",
    note: "Proceed forward name"
  }, null, 8 /* PROPS */, ["modelValue"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_7, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_TextOrCodeEditor, {
    modelValue: $props.pagination.scroll_down.input,
    "onUpdate:modelValue": _cache[6] || (_cache[6] = function ($event) {
      return $props.pagination.scroll_down.input = $event;
    }),
    label: "Scroll ⬇️ Input",
    placeholder: "99",
    note: "Proceed forward input"
  }, null, 8 /* PROPS */, ["modelValue"])])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_8, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_9, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_TextOrCodeEditor, {
    modelValue: $props.pagination.scroll_up.name,
    "onUpdate:modelValue": _cache[7] || (_cache[7] = function ($event) {
      return $props.pagination.scroll_up.name = $event;
    }),
    label: "Scroll ⬆️ Name",
    placeholder: "0. Back",
    note: "Proceed backward name"
  }, null, 8 /* PROPS */, ["modelValue"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_10, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_TextOrCodeEditor, {
    modelValue: $props.pagination.scroll_up.input,
    "onUpdate:modelValue": _cache[8] || (_cache[8] = function ($event) {
      return $props.pagination.scroll_up.input = $event;
    }),
    label: "Scroll ⬆️ Input",
    placeholder: "0",
    note: "Proceed backward input"
  }, null, 8 /* PROPS */, ["modelValue"])])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_11, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_12, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_TextOrCodeEditor, {
    modelValue: $props.pagination.slice.start,
    "onUpdate:modelValue": _cache[9] || (_cache[9] = function ($event) {
      return $props.pagination.slice.start = $event;
    }),
    label: "Start Slice Position",
    placeholder: "0",
    note: "📍 Start pagination offset"
  }, null, 8 /* PROPS */, ["modelValue"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_13, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_TextOrCodeEditor, {
    modelValue: $props.pagination.slice.end,
    "onUpdate:modelValue": _cache[10] || (_cache[10] = function ($event) {
      return $props.pagination.slice.end = $event;
    }),
    label: "End Slice Position",
    placeholder: "0",
    note: "📍 End pagination offset"
  }, null, 8 /* PROPS */, ["modelValue"])])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_TextOrCodeEditor, {
    modelValue: $props.pagination.trailing_end,
    "onUpdate:modelValue": _cache[11] || (_cache[11] = function ($event) {
      return $props.pagination.trailing_end = $event;
    }),
    label: "Trailing Characters",
    placeholder: "...",
    note: "Content continuation hint",
    "class": "w-1/2 mb-6"
  }, null, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSwitch, {
    modelValue: $props.pagination.break_line_before_trail,
    "onUpdate:modelValue": _cache[12] || (_cache[12] = function ($event) {
      return $props.pagination.break_line_before_trail = $event;
    }),
    note: ($props.pagination.break_line_before_trail ? 'Disable ' : 'Enable') + ' line break before trailing characters',
    "class": "mb-4"
  }, null, 8 /* PROPS */, ["modelValue", "note"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSwitch, {
    modelValue: $props.pagination.break_line_after_trail,
    "onUpdate:modelValue": _cache[13] || (_cache[13] = function ($event) {
      return $props.pagination.break_line_after_trail = $event;
    }),
    note: ($props.pagination.break_line_after_trail ? 'Disable ' : 'Enable') + ' line break after trailing characters'
  }, null, 8 /* PROPS */, ["modelValue", "note"])], 64 /* STABLE_FRAGMENT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]);
}

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue":
/*!**********************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_3c0c0f5a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=3c0c0f5a */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=template&id=3c0c0f5a");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_3c0c0f5a__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue":
/*!********************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_26c5382a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=26c5382a */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=template&id=26c5382a");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_26c5382a__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=template&id=3c0c0f5a":
/*!****************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=template&id=3c0c0f5a ***!
  \****************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_3c0c0f5a__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_3c0c0f5a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=3c0c0f5a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalPaginationEditor/index.vue?vue&type=template&id=3c0c0f5a");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=template&id=26c5382a":
/*!**************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=template&id=26c5382a ***!
  \**************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_26c5382a__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_26c5382a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=26c5382a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/PaginationEditor/index.vue?vue&type=template&id=26c5382a");


/***/ })

}]);