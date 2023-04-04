"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Settings_AccountSettings_index_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _inertiajs_vue3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @inertiajs/vue3 */ "./node_modules/@inertiajs/vue3/dist/index.esm.js");
/* harmony import */ var _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Input/DefaultInput */ "./resources/js/Components/Input/DefaultInput.vue");
/* harmony import */ var _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Alert/PrimaryAlert */ "./resources/js/Components/Alert/PrimaryAlert.vue");
/* harmony import */ var _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Button/PrimaryButton */ "./resources/js/Components/Button/PrimaryButton.vue");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    DefaultInput: _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_1__["default"],
    PrimaryAlert: _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_2__["default"],
    PrimaryButton: _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {
      form: (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_0__.useForm)({
        new_password: '',
        curr_password: '',
        new_password_confirmation: ''
      })
    };
  },
  methods: {
    changePassword: function changePassword() {
      var self = this;
      this.form.clearErrors();
      this.form.post(route('settings.account.update'), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: function onSuccess() {
          self.$message({
            message: 'Password changed successfully',
            type: 'success'
          });
          self.form.reset();
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=template&id=b8001a60":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=template&id=b8001a60 ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, "Change your account password", -1 /* HOISTED */);
var _hoisted_2 = {
  "class": "flex justify-end"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_PrimaryAlert = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryAlert");
  var _component_DefaultInput = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultInput");
  var _component_PrimaryButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryButton");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryAlert, {
    "class": "mb-6"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_1];
    }),
    _: 1 /* STABLE */
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
    modelValue: $data.form.curr_password,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $data.form.curr_password = $event;
    }),
    type: "password",
    label: "Current Password",
    disabled: $data.form.processing,
    error: $data.form.errors.curr_password,
    onKeyup: _cache[1] || (_cache[1] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)(function ($event) {
      return $options.changePassword();
    }, ["enter"])),
    "class": "mb-4"
  }, null, 8 /* PROPS */, ["modelValue", "disabled", "error"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
    modelValue: $data.form.new_password,
    "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
      return $data.form.new_password = $event;
    }),
    type: "password",
    label: "New Password",
    disabled: $data.form.processing,
    error: $data.form.errors.new_password,
    onKeyup: _cache[3] || (_cache[3] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)(function ($event) {
      return $options.changePassword();
    }, ["enter"])),
    "class": "mb-4"
  }, null, 8 /* PROPS */, ["modelValue", "disabled", "error"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
    modelValue: $data.form.new_password_confirmation,
    "onUpdate:modelValue": _cache[4] || (_cache[4] = function ($event) {
      return $data.form.new_password_confirmation = $event;
    }),
    type: "password",
    label: "Confirm New Password",
    disabled: $data.form.processing,
    error: $data.form.errors.new_password_confirmation,
    onKeyup: _cache[5] || (_cache[5] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)(function ($event) {
      return $options.changePassword();
    }, ["enter"])),
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue", "disabled", "error"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryButton, {
    onClick: _cache[6] || (_cache[6] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)(function ($event) {
      return $options.changePassword();
    }, ["stop"])),
    disabled: $data.form.processing
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Change Password")];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["disabled"])])]);
}

/***/ }),

/***/ "./resources/js/Pages/Settings/AccountSettings/index.vue":
/*!***************************************************************!*\
  !*** ./resources/js/Pages/Settings/AccountSettings/index.vue ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_b8001a60__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=b8001a60 */ "./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=template&id=b8001a60");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_b8001a60__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Settings/AccountSettings/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=script&lang=js":
/*!***************************************************************************************!*\
  !*** ./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=script&lang=js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=template&id=b8001a60":
/*!*********************************************************************************************!*\
  !*** ./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=template&id=b8001a60 ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_b8001a60__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_b8001a60__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=b8001a60 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Settings/AccountSettings/index.vue?vue&type=template&id=b8001a60");


/***/ })

}]);