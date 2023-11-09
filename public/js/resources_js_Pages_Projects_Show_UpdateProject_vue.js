"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Projects_Show_UpdateProject_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _inertiajs_vue3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @inertiajs/vue3 */ "./node_modules/@inertiajs/vue3/dist/index.esm.js");
/* harmony import */ var _Create_ManageProjectForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../Create/ManageProjectForm */ "./resources/js/Pages/Projects/Create/ManageProjectForm.vue");
/* harmony import */ var _components_Loader_LoaderOverlay__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Loader/LoaderOverlay */ "./resources/js/Components/Loader/LoaderOverlay.vue");
/* harmony import */ var _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Button/PrimaryButton */ "./resources/js/Components/Button/PrimaryButton.vue");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    ManageProjectForm: _Create_ManageProjectForm__WEBPACK_IMPORTED_MODULE_1__["default"],
    LoaderOverlay: _components_Loader_LoaderOverlay__WEBPACK_IMPORTED_MODULE_2__["default"],
    PrimaryButton: _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  props: {
    projectPayload: Object
  },
  data: function data() {
    return {
      form: (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_0__.useForm)({
        name: this.projectPayload.name,
        online: this.projectPayload.online,
        description: this.projectPayload.description,
        offline_message: this.projectPayload.offline_message
      })
    };
  },
  methods: {
    saveChanges: function saveChanges() {
      var self = this;

      //  Clear existing errors
      this.form.clearErrors();

      //  Attempt to update project
      this.form.put(route('project.update', {
        project: this.route().params.project
      }), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: function onSuccess() {
          self.$message({
            message: 'Project updated successfully',
            type: 'success'
          });
        },
        onError: function onError(errors) {
          self.$message({
            message: 'Sorry, we found some mistakes',
            type: 'error'
          });
        }
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=template&id=35fd80cc":
/*!********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=template&id=35fd80cc ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "p-5 bg-white rounded-t-md shadow-md hover:shadow-lg"
};
var _hoisted_2 = {
  "class": "text-xl font-medium text-gray-900 border-b pb-5 mb-5"
};
var _hoisted_3 = {
  "class": "relative mb-5"
};
var _hoisted_4 = {
  "class": "flex justify-end"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_LoaderOverlay = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("LoaderOverlay");
  var _component_ManageProjectForm = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("ManageProjectForm");
  var _component_PrimaryButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryButton");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Project name "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h5", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.form.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Loading overlay "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_LoaderOverlay, {
    show: $data.form.processing
  }, null, 8 /* PROPS */, ["show"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Project form "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_ManageProjectForm, {
    form: $data.form,
    mode: "Update"
  }, null, 8 /* PROPS */, ["form"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryButton, {
    disabled: $data.form.processing,
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return $options.saveChanges();
    })
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Save Changes ")];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["disabled"])])]);
}

/***/ }),

/***/ "./resources/js/Pages/Projects/Show/UpdateProject.vue":
/*!************************************************************!*\
  !*** ./resources/js/Pages/Projects/Show/UpdateProject.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _UpdateProject_vue_vue_type_template_id_35fd80cc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UpdateProject.vue?vue&type=template&id=35fd80cc */ "./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=template&id=35fd80cc");
/* harmony import */ var _UpdateProject_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UpdateProject.vue?vue&type=script&lang=js */ "./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_UpdateProject_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_UpdateProject_vue_vue_type_template_id_35fd80cc__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Projects/Show/UpdateProject.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UpdateProject_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UpdateProject_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./UpdateProject.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=template&id=35fd80cc":
/*!******************************************************************************************!*\
  !*** ./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=template&id=35fd80cc ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UpdateProject_vue_vue_type_template_id_35fd80cc__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UpdateProject_vue_vue_type_template_id_35fd80cc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./UpdateProject.vue?vue&type=template&id=35fd80cc */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Projects/Show/UpdateProject.vue?vue&type=template&id=35fd80cc");


/***/ })

}]);