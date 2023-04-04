"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Versions_Show_Builder_Content_Editor_ScreenEditor_ScreenDisplays_Display_D-f3d30e"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @inertiajs/vue3 */ "./node_modules/@inertiajs/vue3/dist/index.esm.js");
/* harmony import */ var _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Input/DefaultInput */ "./resources/js/Components/Input/DefaultInput.vue");
/* harmony import */ var _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Modal/DefaultModal */ "./resources/js/Components/Modal/DefaultModal.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @components/Select/DefaultSelect */ "./resources/js/Components/Select/DefaultSelect.vue");
/* harmony import */ var _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @components/Button/PrimaryButton */ "./resources/js/Components/Button/PrimaryButton.vue");
/* harmony import */ var _components_TextArea_DefaultTextArea__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @components/TextArea/DefaultTextArea */ "./resources/js/Components/TextArea/DefaultTextArea.vue");
/* harmony import */ var _builderComponents_SelectActiveState__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @builderComponents/SelectActiveState */ "./resources/js/Pages/Versions/Show/Builder/Components/SelectActiveState.vue");
/* harmony import */ var _components_ColorPicker_DefaultColorPicker__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @components/ColorPicker/DefaultColorPicker */ "./resources/js/Components/ColorPicker/DefaultColorPicker.vue");
/* harmony import */ var _components_TextOrCodeEditor_TextOrCodeEditor__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @components/TextOrCodeEditor/TextOrCodeEditor */ "./resources/js/Components/TextOrCodeEditor/TextOrCodeEditor.vue");
/* harmony import */ var _builderComponents_ScreenOrDisplaySelector__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @builderComponents/ScreenOrDisplaySelector */ "./resources/js/Pages/Versions/Show/Builder/Components/ScreenOrDisplaySelector.vue");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }












/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    useForm: _inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__.useForm,
    DefaultInput: _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_2__["default"],
    DefaultModal: _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_3__["default"],
    DefaultSelect: _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_5__["default"],
    PrimaryButton: _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_6__["default"],
    DefaultColorPicker: _components_ColorPicker_DefaultColorPicker__WEBPACK_IMPORTED_MODULE_9__["default"],
    DefaultTextArea: _components_TextArea_DefaultTextArea__WEBPACK_IMPORTED_MODULE_7__["default"],
    SelectActiveState: _builderComponents_SelectActiveState__WEBPACK_IMPORTED_MODULE_8__["default"],
    TextOrCodeEditor: _components_TextOrCodeEditor_TextOrCodeEditor__WEBPACK_IMPORTED_MODULE_10__["default"],
    ScreenOrDisplaySelector: _builderComponents_ScreenOrDisplaySelector__WEBPACK_IMPORTED_MODULE_11__["default"]
  },
  props: {
    navigations: {
      type: Array
    },
    navigation: {
      type: Object,
      "default": null
    },
    index: {
      type: Number,
      "default": null
    },
    mode: {
      type: String,
      "default": null,
      validator: function validator(value) {
        return ['create', 'clone', 'update'].includes(value);
      }
    }
  },
  data: function data() {
    return {
      form: null,
      navigationTypes: [{
        label: 'Custom Inputs',
        value: 'custom'
      }, {
        label: 'Regex Match',
        value: 'regex'
      }],
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__.useVersionBuilder)()
    };
  },
  computed: {
    modeInCaps: function modeInCaps() {
      return this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
    }
  },
  methods: {
    resetForm: function resetForm() {
      if (this.mode == 'create') {
        this.form = (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__.useForm)((0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__.useVersionBuilder)().getBlankNavigation());
      } else if (this.mode == 'clone') {
        this.form = (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__.useForm)((0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__.useVersionBuilder)().getClonedNavigation(this.navigation));
      } else if (this.mode == 'update') {
        this.form = (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__.useForm)(_objectSpread(_objectSpread({}, (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__.useVersionBuilder)().getBlankNavigation()), lodash__WEBPACK_IMPORTED_MODULE_0___default().cloneDeep(this.navigation)));
      }
    },
    createNavigation: function createNavigation(closeModal) {
      //  Clear existing errors
      this.form.clearErrors();

      //  Check if we have an existing navigation using the same name
      var totalExactMatches = this.useVersionBuilder.searchNavigations(this.navigations, this.form.name, true).length;
      if (this.form.name.length == 0) {
        this.form.setError('name', 'The navigation name is required');
      } else if (this.form.name.length < 3) {
        this.form.setError('name', 'The navigation name is too short');
      } else if (this.form.name.length > 50) {
        this.form.setError('name', 'The navigation name is too long');
      } else if (['create', 'clone'].includes(this.mode) && totalExactMatches) {
        this.form.setError('name', 'This navigation name is already in use');
      } else if (this.mode == 'update' && totalExactMatches && this.navigation.name !== this.form.name) {
        this.form.setError('name', 'This navigation name is already in use');
      }
      if (this.form.selected_type == 'custom') {
        if (this.form[this.form.selected_type].inputs.code_editor_mode == false && ['', null].includes(this.form[this.form.selected_type].inputs.text)) {
          this.form.setError('inputs', 'The navigation input is required');
        } else if (this.form[this.form.selected_type].inputs.code_editor_mode == true && ['', null].includes(this.form[this.form.selected_type].inputs.code_editor_text)) {
          this.form.setError('inputs', 'The navigation input is required');
        }
      } else if (this.form.selected_type == 'regex') {
        if (this.form[this.form.selected_type].rule.code_editor_mode == false && ['', null].includes(this.form[this.form.selected_type].rule.text)) {
          this.form.setError('rule', 'The navigation regex rule is required');
        } else if (this.form[this.form.selected_type].rule.code_editor_mode == true && ['', null].includes(this.form[this.form.selected_type].rule.code_editor_text)) {
          this.form.setError('rule', 'The navigation regex rule is required');
        }
      }
      if (this.form[this.form.selected_type].step.code_editor_mode == false && ['', null].includes(this.form[this.form.selected_type].step.text)) {
        this.form.setError('step', 'The navigation step is required');
      } else if (this.form[this.form.selected_type].step.code_editor_mode == true && ['', null].includes(this.form[this.form.selected_type].step.code_editor_text)) {
        this.form.setError('step', 'The navigation step is required');
      }
      if (this.form[this.form.selected_type].link.code_editor_mode == false && ['', null].includes(this.form[this.form.selected_type].link.text)) {
        this.form.setError('link', 'The navigation link is required');
      } else if (this.form[this.form.selected_type].link.code_editor_mode == true && ['', null].includes(this.form[this.form.selected_type].link.code_editor_text)) {
        this.form.setError('link', 'The navigation link is required');
      }
      if (this.form.hasErrors === false) {
        var navigation = this.form.data();
        if (this.mode == 'update') {
          this.useVersionBuilder.updateNavigation(this.navigations, navigation, this.index);
        } else {
          this.useVersionBuilder.addNavigation(this.navigations, navigation);
        }

        //  Determine the action name e.g created, cloned or updated
        var actionName = this.mode + 'd';
        this.$message({
          message: 'Navigation ' + actionName + ' successfully',
          type: 'success'
        });
        closeModal();
      }
    },
    cancelCreateNavigation: function cancelCreateNavigation() {
      //  Clear existing errors
      this.form.clearErrors();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Modal/DefaultModal */ "./resources/js/Components/Modal/DefaultModal.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Button/PrimaryButton */ "./resources/js/Components/Button/PrimaryButton.vue");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    DefaultModal: _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_0__["default"],
    PrimaryButton: _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  props: {
    navigations: {
      type: Object,
      "default": function _default() {
        return [];
      }
    },
    navigation: {
      type: Object,
      "default": null
    },
    index: {
      type: Number,
      "default": null
    },
    showButton: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__.useVersionBuilder)()
    };
  },
  methods: {
    deleteNavigation: function deleteNavigation(closeModal) {
      //  Remove the current navigation
      this.useVersionBuilder.removeNavigationByIndex(this.navigations, this.index);
      this.$message({
        message: 'Navigation deleted successfully',
        type: 'success'
      });
      closeModal();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue3_slide_up_down__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue3-slide-up-down */ "./node_modules/vue3-slide-up-down/dist/vue3-slide-up-down.es.js");
/* harmony import */ var _components_CopyToClipboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/CopyToClipboard */ "./resources/js/Components/CopyToClipboard/index.vue");
/* harmony import */ var _components_Popover_InfoPopover__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Popover/InfoPopover */ "./resources/js/Components/Popover/InfoPopover.vue");
/* harmony import */ var _components_Badges_SuccessBadge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Badges/SuccessBadge */ "./resources/js/Components/Badges/SuccessBadge.vue");
/* harmony import */ var _components_Badges_PrimaryBadge__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @components/Badges/PrimaryBadge */ "./resources/js/Components/Badges/PrimaryBadge.vue");
/* harmony import */ var _components_Badges_WarningBadge__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @components/Badges/WarningBadge */ "./resources/js/Components/Badges/WarningBadge.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _Delete_DeleteNavigationModal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Delete/DeleteNavigationModal */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue");
/* harmony import */ var _components_ColorPicker_DefaultColorPicker__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @components/ColorPicker/DefaultColorPicker */ "./resources/js/Components/ColorPicker/DefaultColorPicker.vue");
/* harmony import */ var _CreateOrUpdate_CreateOrUpdateNavigationModal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./CreateOrUpdate/CreateOrUpdateNavigationModal */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue");










/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['navigations', 'navigation', 'index'],
  components: {
    SlideUpDown: vue3_slide_up_down__WEBPACK_IMPORTED_MODULE_0__["default"],
    CopyToClipboard: _components_CopyToClipboard__WEBPACK_IMPORTED_MODULE_1__["default"],
    InfoPopover: _components_Popover_InfoPopover__WEBPACK_IMPORTED_MODULE_2__["default"],
    SuccessBadge: _components_Badges_SuccessBadge__WEBPACK_IMPORTED_MODULE_3__["default"],
    PrimaryBadge: _components_Badges_PrimaryBadge__WEBPACK_IMPORTED_MODULE_4__["default"],
    WarningBadge: _components_Badges_WarningBadge__WEBPACK_IMPORTED_MODULE_5__["default"],
    DeleteNavigationModal: _Delete_DeleteNavigationModal__WEBPACK_IMPORTED_MODULE_7__["default"],
    DefaultColorPicker: _components_ColorPicker_DefaultColorPicker__WEBPACK_IMPORTED_MODULE_8__["default"],
    CreateOrUpdateNavigationModal: _CreateOrUpdate_CreateOrUpdateNavigationModal__WEBPACK_IMPORTED_MODULE_9__["default"]
  },
  data: function data() {
    return {
      active: false,
      clipboards: [{
        label: 'Copy Name',
        value: this.navigation.name,
        message: 'Copied the Navigation Name'
      }],
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_6__.useVersionBuilder)()
    };
  },
  computed: {
    totalExactMatches: function totalExactMatches() {
      return this.useVersionBuilder.searchNavigations(this.navigations, this.navigation.name, true).length;
    }
  },
  methods: {
    toggleSelection: function toggleSelection() {
      this.active = !this.active;
    },
    copyNavigation: function copyNavigation() {
      //  Store to local storage
      window.localStorage.setItem('navigation', JSON.stringify(this.navigation));
      this.$message({
        message: 'Navigation Copied',
        type: 'success'
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue_draggable_next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue-draggable-next */ "./node_modules/vue-draggable-next/dist/vue-draggable-next.esm-bundler.js");
/* harmony import */ var _NoNavigations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NoNavigations */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue");
/* harmony import */ var _NavigationMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NavigationMenu */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['modelValue', 'searchTerm'],
  components: {
    draggable: vue_draggable_next__WEBPACK_IMPORTED_MODULE_3__.VueDraggableNext,
    NoNavigations: _NoNavigations__WEBPACK_IMPORTED_MODULE_0__["default"],
    NavigationMenu: _NavigationMenu__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__.useVersionBuilder)()
    };
  },
  computed: {
    filteredNavigations: {
      get: function get() {
        var _this = this;
        return this.modelValue.filter(function (navigation) {
          var matchesNavigationName = navigation.name.toLowerCase().includes(_this.searchTerm.toLowerCase());
          return _this.searchTerm == '' || matchesNavigationName;
        });
      },
      set: function set(navigations) {
        //  Allow re-ordering when the navigation filtering input is empty
        if (this.searchTerm == '') {
          //  this.$emit('update', navigations);
          this.$emit('update:modelValue', navigations);
        } else {
          this.$message({
            message: 'You cannot reorder navigations while searching',
            type: 'warning'
          });
        }
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CreateOrUpdate_CreateOrUpdateNavigationModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateOrUpdate/CreateOrUpdateNavigationModal */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['navigations'],
  components: {
    CreateOrUpdateNavigationModal: _CreateOrUpdate_CreateOrUpdateNavigationModal__WEBPACK_IMPORTED_MODULE_0__["default"]
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue3_slide_up_down__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue3-slide-up-down */ "./node_modules/vue3-slide-up-down/dist/vue3-slide-up-down.es.js");
/* harmony import */ var _NavigationMenus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NavigationMenus */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Badges_SuccessBadge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Badges/SuccessBadge */ "./resources/js/Components/Badges/SuccessBadge.vue");
/* harmony import */ var _components_SearchBar_DefaultSearchBar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @components/SearchBar/DefaultSearchBar */ "./resources/js/Components/SearchBar/DefaultSearchBar.vue");
/* harmony import */ var _CreateOrUpdate_CreateOrUpdateNavigationModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CreateOrUpdate/CreateOrUpdateNavigationModal */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue");






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    modelValue: Array,
    title: String,
    note: String,
    highlight: {
      type: Boolean,
      "default": true
    },
    collapsable: {
      type: Boolean,
      "default": true
    }
  },
  components: {
    NavigationMenus: _NavigationMenus__WEBPACK_IMPORTED_MODULE_1__["default"],
    SlideUpDown: vue3_slide_up_down__WEBPACK_IMPORTED_MODULE_0__["default"],
    SuccessBadge: _components_Badges_SuccessBadge__WEBPACK_IMPORTED_MODULE_3__["default"],
    DefaultSearchBar: _components_SearchBar_DefaultSearchBar__WEBPACK_IMPORTED_MODULE_4__["default"],
    CreateOrUpdateNavigationModal: _CreateOrUpdate_CreateOrUpdateNavigationModal__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  data: function data() {
    return {
      searchTerm: '',
      setInterval: null,
      hasNavigationToPaste: false,
      isShowingNavigations: false,
      canShowNavigationsSummary: false,
      localModelValue: this.modelValue,
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__.useVersionBuilder)()
    };
  },
  watch: {
    modelValue: function modelValue(newValue, oldValue) {
      this.localModelValue = newValue;
    },
    localModelValue: function localModelValue(newValue, oldValue) {
      this.$emit('update:modelValue', newValue);
    }
  },
  computed: {
    screen: function screen() {
      return this.useVersionBuilder.selectedScreen;
    }
  },
  methods: {
    pasteNavigation: function pasteNavigation() {
      var navigation = window.localStorage.getItem('navigation');
      if (navigation !== null) {
        //  Convert to JSON object
        navigation = JSON.parse(navigation);

        //  Clone to change the navigation id
        navigation = this.useVersionBuilder.getClonedNavigation(navigation);

        //  Add navigation
        this.localModelValue.push(navigation);
        window.localStorage.removeItem('navigation');
        this.hasNavigationToPaste = false;
        this.$message({
          message: 'Navigation Pasted',
          type: 'success'
        });
      }
    },
    checkPastableNavigation: function checkPastableNavigation() {
      var navigation = window.localStorage.getItem('navigation');
      this.hasNavigationToPaste = navigation !== null;
    }
  },
  created: function created() {
    var _this = this;
    setTimeout(function () {
      _this.isShowingNavigations = true;
      _this.canShowNavigationsSummary = true;
    }, 100);

    //  Run every 1 second
    this.setInterval = setInterval(function () {
      _this.checkPastableNavigation();
    }, 1000);
  },
  beforeUnmount: function beforeUnmount() {
    clearInterval(this.setInterval);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=template&id=fcdf9fa0":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=template&id=fcdf9fa0 ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  "class": "flex items-end justify-between"
};
var _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-3 w-3",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "fill-rule": "evenodd",
  d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z",
  "clip-rule": "evenodd"
})], -1 /* HOISTED */);
var _hoisted_5 = {
  key: 0,
  "class": "ml-2"
};
var _hoisted_6 = {
  key: 1,
  name: "trigger",
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2 cursor-pointer hover:text-blue-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_7 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
}, null, -1 /* HOISTED */);
var _hoisted_8 = [_hoisted_7];
var _hoisted_9 = {
  key: 2,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2 cursor-pointer hover:text-blue-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
}, null, -1 /* HOISTED */);
var _hoisted_11 = [_hoisted_10];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _this = this;
  var _component_SelectActiveState = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("SelectActiveState");
  var _component_DefaultInput = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultInput");
  var _component_DefaultSelect = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSelect");
  var _component_TextOrCodeEditor = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("TextOrCodeEditor");
  var _component_ScreenOrDisplaySelector = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("ScreenOrDisplaySelector");
  var _component_DefaultTextArea = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultTextArea");
  var _component_DefaultColorPicker = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultColorPicker");
  var _component_PrimaryButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryButton");
  var _component_DefaultModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Modal "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultModal, {
    defaultText: "Cancel",
    onOpen: _cache[9] || (_cache[9] = function ($event) {
      return $options.resetForm();
    }),
    onClose: _cache[10] || (_cache[10] = function ($event) {
      return _ctx.$emit('close');
    }),
    primaryAction: $options.createNavigation,
    primaryText: $options.modeInCaps + ' Navigation',
    defaultAction: $options.cancelCreateNavigation
  }, {
    title: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)((0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.modeInCaps + ' Navigation'), 1 /* TEXT */)];
    }),

    trigger: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$props.mode == 'create' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_PrimaryButton, {
        key: 0,
        name: "trigger",
        "class": "px-3"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [_hoisted_4, _ctx.$slots["default"] ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_5, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "default")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
        }),
        _: 3 /* FORWARDED */
      })) : $props.mode == 'clone' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_6, _hoisted_8)) : $props.mode == 'update' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_9, _hoisted_11)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$props.mode == 'clone' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("p", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Cloning "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.navigation.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" navigation")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_SelectActiveState, {
        modelValue: $data.form.active,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return $data.form.active = $event;
        }),
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
        modelValue: $data.form.name,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
          return $data.form.name = $event;
        }),
        label: "Name",
        error: $data.form.errors.name,
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "error"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSelect, {
        modelValue: $data.form.selected_type,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
          return $data.form.selected_type = $event;
        }),
        options: $data.navigationTypes,
        label: "Navigation Trigger",
        error: $data.form.errors.selected_type,
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "options", "error"]), $data.form.selected_type == 'custom' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        key: 1
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Input(s) "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_TextOrCodeEditor, {
        modelValue: $data.form[_this.form.selected_type].inputs,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = function ($event) {
          return $data.form[_this.form.selected_type].inputs = $event;
        }),
        label: "Input(s)",
        placeholder: "1, 2, 3",
        error: $data.form.errors.inputs,
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "error"])], 64 /* STABLE_FRAGMENT */)) : $data.form.selected_type == 'regex' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        key: 2
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Regex Pattern "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_TextOrCodeEditor, {
        modelValue: $data.form[_this.form.selected_type].rule,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = function ($event) {
          return $data.form[_this.form.selected_type].rule = $event;
        }),
        label: "Regex Rule",
        placeholder: "/[a-zA-Z]+/",
        error: $data.form.errors.rule,
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "error"])], 64 /* STABLE_FRAGMENT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_TextOrCodeEditor, {
        modelValue: $data.form[_this.form.selected_type].step,
        "onUpdate:modelValue": _cache[5] || (_cache[5] = function ($event) {
          return $data.form[_this.form.selected_type].step = $event;
        }),
        label: "Step",
        placeholder: "1",
        note: "Loops to navigate",
        error: $data.form.errors.step,
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "error"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_ScreenOrDisplaySelector, {
        modelValue: $data.form[_this.form.selected_type].link,
        "onUpdate:modelValue": _cache[6] || (_cache[6] = function ($event) {
          return $data.form[_this.form.selected_type].link = $event;
        }),
        label: "Navigation Target",
        info: "Screen to trigger navigation",
        showDisplays: false,
        error: $data.form.errors.link,
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "error"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Comment "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultTextArea, {
        modelValue: $data.form.comment,
        "onUpdate:modelValue": _cache[7] || (_cache[7] = function ($event) {
          return $data.form.comment = $event;
        }),
        label: "Comment",
        "class": "flex-1 mr-4"
      }, null, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Color Picker "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultColorPicker, {
        modelValue: $data.form.hexColor,
        "onUpdate:modelValue": _cache[8] || (_cache[8] = function ($event) {
          return $data.form.hexColor = $event;
        })
      }, null, 8 /* PROPS */, ["modelValue"])])];
    }),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["primaryAction", "primaryText", "defaultAction"])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=template&id=6f2d6ae0":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=template&id=6f2d6ae0 ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "text-sm text-gray-500 mb-5"
};
var _hoisted_2 = {
  "class": "text-blue-500 font-bold"
};
var _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-3 w-3",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "fill-rule": "evenodd",
  d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z",
  "clip-rule": "evenodd"
})], -1 /* HOISTED */);
var _hoisted_4 = {
  key: 1,
  name: "trigger",
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2 hover:text-red-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
}, null, -1 /* HOISTED */);
var _hoisted_6 = [_hoisted_5];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_PrimaryButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryButton");
  var _component_DefaultModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Modal "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultModal, {
    defaultText: "Cancel",
    onOpen: _cache[0] || (_cache[0] = function ($event) {
      return _ctx.$emit('open');
    }),
    onClose: _cache[1] || (_cache[1] = function ($event) {
      return _ctx.$emit('close');
    }),
    dangerText: "Delete Navigation",
    dangerAction: $options.deleteNavigation
  }, {
    title: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Delete Navigation")];
    }),
    trigger: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$props.showButton ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_PrimaryButton, {
        key: 0,
        name: "trigger",
        "class": "px-3"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [_hoisted_3];
        }),
        _: 1 /* STABLE */
      })) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_4, _hoisted_6))];
    }),
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Are you sure you want to delete the "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.navigation.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" navigation. After this navigation is deleted you cannot recover it again.")])];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["dangerAction"])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=template&id=4c6065d9":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=template&id=4c6065d9 ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "col-span-6 flex items-center"
};
var _hoisted_2 = {
  "class": "col-span-6 flex justify-end items-center relative"
};
var _hoisted_3 = {
  "class": "flex items-center text-gray-400 text-xs transition-all duration-300 opacity-100 group-repeat-navigation-menu-hover:opacity-0"
};
var _hoisted_4 = {
  "class": "absolute right-8 flex items-center justify-end transition-all duration-300 opacity-0 group-repeat-navigation-menu-hover:opacity-100"
};
var _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 cursor-grab hover:text-blue-500 active:cursor-grabbing draggble-handle",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M4 6h16M4 10h16M4 14h16M4 18h16"
})], -1 /* HOISTED */);
var _hoisted_6 = {
  "class": "ml-4 mr-1"
};
var _hoisted_7 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
  "class": "border-t border-dashed pt-4 mt-4"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", {
  "class": "text-xs text-gray-600 break-normal"
}, "Navigation details ...")], -1 /* HOISTED */);
var _hoisted_8 = {
  "class": "flex justify-between p-4"
};
var _hoisted_9 = {
  "class": "text-xs mr-4"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_SuccessBadge = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("SuccessBadge");
  var _component_WarningBadge = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("WarningBadge");
  var _component_PrimaryBadge = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryBadge");
  var _component_CopyToClipboard = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("CopyToClipboard");
  var _component_CreateOrUpdateNavigationModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("CreateOrUpdateNavigationModal");
  var _component_DeleteNavigationModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DeleteNavigationModal");
  var _component_InfoPopover = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("InfoPopover");
  var _component_DefaultColorPicker = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultColorPicker");
  var _component_SlideUpDown = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("SlideUpDown");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['rounded-md border', $data.active ? 'shadow-sm border-2 my-4' : 'mb-2']),
    style: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeStyle)({
      borderLeftColor: $props.navigation.hexColor,
      borderLeftWidth: '4px'
    })
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    onClick: _cache[1] || (_cache[1] = function ($event) {
      return $options.toggleSelection();
    }),
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['grid grid-cols-12 group-repeat-navigation-menu text-xs text-gray-700 py-2 px-4 cursor-pointer', $data.active ? 'border-b border-dashed bg-blue-50 rounded-tr-md' : 'bg-gray-50 rounded-r-md']),
    style: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeStyle)({
      backgroundColor: $props.navigation.hexColor + '05'
    })
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [$props.navigation.name && $options.totalExactMatches == 1 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    key: 0,
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)({
      'text-blue-500 font-semibold': $data.active
    })
  }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.navigation.name), 3 /* TEXT, CLASS */)) : $props.navigation.name && $options.totalExactMatches > 1 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    key: 1,
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['text-red-500', {
      'font-semibold italic': $data.active
    }])
  }, "Duplicate name", 2 /* CLASS */)) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    key: 2,
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['text-red-500', {
      'font-semibold italic': $data.active
    }])
  }, "No name", 2 /* CLASS */))]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [$props.navigation.active.selected_type == 'yes' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_SuccessBadge, {
    key: 0
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Active")];
    }),
    _: 1 /* STABLE */
  })) : $props.navigation.active.selected_type == 'no' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_WarningBadge, {
    key: 1
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Inactive")];
    }),
    _: 1 /* STABLE */
  })) : $props.navigation.active.selected_type == 'conditional' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_PrimaryBadge, {
    key: 2
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Conditional")];
    }),
    _: 1 /* STABLE */
  })) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Copy To Clipboard "), ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($data.clipboards, function (clipboard, index) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_CopyToClipboard, {
      value: clipboard.value,
      message: clipboard.message,
      key: index,
      "class": "whitespace-nowrap mr-2"
    }, {
      "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
        return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryBadge, {
          clickable: true
        }, {
          "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
            return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)((0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(clipboard.label), 1 /* TEXT */)];
          }),

          _: 2 /* DYNAMIC */
        }, 1024 /* DYNAMIC_SLOTS */)];
      }),

      _: 2 /* DYNAMIC */
    }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["value", "message"]);
  }), 128 /* KEYED_FRAGMENT */)), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Copy Badge "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryBadge, {
    onClick: _cache[0] || (_cache[0] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)(function ($event) {
      return $options.copyNavigation();
    }, ["stop"])),
    clickable: true,
    "class": "whitespace-nowrap mr-4"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Copy Navigation")];
    }),
    _: 1 /* STABLE */
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Edit Icon "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_CreateOrUpdateNavigationModal, {
    navigations: $props.navigations,
    navigation: $props.navigation,
    index: $props.index,
    mode: "update"
  }, null, 8 /* PROPS */, ["navigations", "navigation", "index"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Delete Icon "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DeleteNavigationModal, {
    navigations: $props.navigations,
    navigation: $props.navigation,
    index: $props.index
  }, null, 8 /* PROPS */, ["navigations", "navigation", "index"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Clone Icon "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_CreateOrUpdateNavigationModal, {
    navigations: $props.navigations,
    navigation: $props.navigation,
    mode: "clone"
  }, null, 8 /* PROPS */, ["navigations", "navigation"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Move Icon "), _hoisted_5]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Info Popover "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_6, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_InfoPopover, {
    title: $props.navigation.type
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_7];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["title"])])])], 6 /* CLASS, STYLE */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_SlideUpDown, {
    modelValue: $data.active,
    "onUpdate:modelValue": _cache[3] || (_cache[3] = function ($event) {
      return $data.active = $event;
    }),
    duration: 300
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_8, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Comment "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_9, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.navigation.comment ? $props.navigation.comment : 'No comments'), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Color Picker "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultColorPicker, {
        modelValue: $props.navigation.hexColor,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
          return $props.navigation.hexColor = $event;
        })
      }, null, 8 /* PROPS */, ["modelValue"])])];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["modelValue"])], 6 /* CLASS, STYLE */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=template&id=4357f66a":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=template&id=4357f66a ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_NavigationMenu = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("NavigationMenu");
  var _component_NoNavigations = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("NoNavigations");
  var _component_draggable = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("draggable");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_draggable, {
    invertSwap: true,
    handle: ".draggble-handle",
    "item-key": "navigation-menus",
    "ghost-class": "bg-yellow-100",
    modelValue: $options.filteredNavigations,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $options.filteredNavigations = $event;
    })
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Static Option "), ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.filteredNavigations, function (element, index) {
        return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_NavigationMenu, {
          index: index,
          key: element.id,
          navigations: $props.modelValue,
          navigation: element
        }, null, 8 /* PROPS */, ["index", "navigations", "navigation"]);
      }), 128 /* KEYED_FRAGMENT */)), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" No Static Options Placeholder "), $options.filteredNavigations.length == 0 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_NoNavigations, {
        key: 0,
        navigations: $props.modelValue
      }, null, 8 /* PROPS */, ["navigations"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["modelValue"]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=template&id=6a1f4b08":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=template&id=6a1f4b08 ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "flex items-center justify-between bg-white rounded-sm border border-dashed border-gray-400 p-5"
};
var _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createStaticVNode)("<div class=\"flex\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-12 w-12 mr-4\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"1\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z\"></path></svg><div><p class=\"text-gray-800 text-md mb-1\">No navigations</p><p class=\"text-gray-600 text-xs\">Go ahead and create your first navigation</p></div></div>", 1);
var _hoisted_3 = {
  "class": "flex justify-end"
};
var _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, "Create Navigation", -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_CreateOrUpdateNavigationModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("CreateOrUpdateNavigationModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [_hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Create Navigation Modal "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_CreateOrUpdateNavigationModal, {
    navigations: $props.navigations,
    mode: "create"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_4];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["navigations"])])]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=template&id=7cf7cb9c":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=template&id=7cf7cb9c ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "flex items-center justify-between border-b border-dotted pb-4 mb-4"
};
var _hoisted_2 = {
  key: 0,
  "class": "flex items-center"
};
var _hoisted_3 = {
  key: 0,
  "class": "text-sm font-semibold tracking-tight text-gray-600"
};
var _hoisted_4 = {
  key: 1,
  "class": "text-xs text-gray-400 ml-2"
};
var _hoisted_5 = {
  "class": "flex items-center"
};
var _hoisted_6 = {
  key: 0,
  "class": "flex items-center"
};
var _hoisted_7 = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-6 w-6 cursor-pointer",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_8 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
}, null, -1 /* HOISTED */);
var _hoisted_9 = [_hoisted_8];
var _hoisted_10 = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-6 w-6 cursor-pointer",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_11 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
}, null, -1 /* HOISTED */);
var _hoisted_12 = [_hoisted_11];
var _hoisted_13 = {
  key: 0
};
var _hoisted_14 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "mr-2"
}, "📌", -1 /* HOISTED */);
var _hoisted_15 = {
  key: 0,
  "class": "text-blue-500 font-bold text-xs"
};
var _hoisted_16 = {
  key: 1,
  "class": "text-blue-500 font-bold text-xs"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DefaultSearchBar = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSearchBar");
  var _component_SuccessBadge = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("SuccessBadge");
  var _component_CreateOrUpdateNavigationModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("CreateOrUpdateNavigationModal");
  var _component_NavigationMenus = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("NavigationMenus");
  var _component_SlideUpDown = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("SlideUpDown");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)({
      'p-4 rounded-lg bg-gray-50 shadow-md border': $props.highlight
    })
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [$props.title || $props.note ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Navigation Title "), $props.title ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("h5", _hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.title), 1 /* TEXT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Note "), $props.note ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_4, " — " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.note), 1 /* TEXT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "fade"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$data.isShowingNavigations ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultSearchBar, {
        key: 0,
        modelValue: $data.searchTerm,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return $data.searchTerm = $event;
        }),
        placeholder: "Search navigations"
      }, null, 8 /* PROPS */, ["modelValue"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_5, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "fade"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$data.isShowingNavigations ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_6, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Paste Navigation "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
        name: "fade"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [$data.hasNavigationToPaste ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_SuccessBadge, {
            key: 0,
            onClick: _cache[1] || (_cache[1] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)(function ($event) {
              return $options.pasteNavigation();
            }, ["stop"])),
            clickable: true,
            "class": "mr-4"
          }, {
            "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
              return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Paste")];
            }),
            _: 1 /* STABLE */
          })) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
        }),
        _: 1 /* STABLE */
      }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Add Navigation Button & Modal "), $data.localModelValue.length ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_CreateOrUpdateNavigationModal, {
        key: 0,
        navigations: $data.localModelValue,
        mode: "create",
        "class": "mr-4"
      }, null, 8 /* PROPS */, ["navigations"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Collapse Arrows "), $props.collapsable ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    key: 0,
    onClick: _cache[2] || (_cache[2] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)(function ($event) {
      return $data.isShowingNavigations = !$data.isShowingNavigations;
    }, ["stop"])),
    "class": "text-gray-400"
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "fade",
    mode: "out-in"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$data.isShowingNavigations ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_7, _hoisted_9)) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_10, _hoisted_12))];
    }),
    _: 1 /* STABLE */
  })])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_SlideUpDown, {
    modelValue: $data.isShowingNavigations,
    "onUpdate:modelValue": _cache[4] || (_cache[4] = function ($event) {
      return $data.isShowingNavigations = $event;
    }),
    duration: 300
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Navigation Menus "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_NavigationMenus, {
        modelValue: $data.localModelValue,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = function ($event) {
          return $data.localModelValue = $event;
        }),
        searchTerm: $data.searchTerm,
        "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['transition-all duration-1000', $data.isShowingNavigations ? 'mb-0' : 'mb-8'])
      }, null, 8 /* PROPS */, ["modelValue", "searchTerm", "class"])];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "fade"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$data.canShowNavigationsSummary == true && $data.isShowingNavigations == false ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_13, [_hoisted_14, $data.localModelValue.length == 0 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_15, "No Navigations")) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_16, "Found " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.localModelValue.length) + " " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.localModelValue.length == 1 ? ' Navigation' : ' Navigations'), 1 /* TEXT */))])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  })], 2 /* CLASS */);
}

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue ***!
  \******************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CreateOrUpdateNavigationModal_vue_vue_type_template_id_fcdf9fa0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateOrUpdateNavigationModal.vue?vue&type=template&id=fcdf9fa0 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=template&id=fcdf9fa0");
/* harmony import */ var _CreateOrUpdateNavigationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreateOrUpdateNavigationModal.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_CreateOrUpdateNavigationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_CreateOrUpdateNavigationModal_vue_vue_type_template_id_fcdf9fa0__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue ***!
  \**************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DeleteNavigationModal_vue_vue_type_template_id_6f2d6ae0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DeleteNavigationModal.vue?vue&type=template&id=6f2d6ae0 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=template&id=6f2d6ae0");
/* harmony import */ var _DeleteNavigationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DeleteNavigationModal.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_DeleteNavigationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_DeleteNavigationModal_vue_vue_type_template_id_6f2d6ae0__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue":
/*!************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue ***!
  \************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NavigationMenu_vue_vue_type_template_id_4c6065d9__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NavigationMenu.vue?vue&type=template&id=4c6065d9 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=template&id=4c6065d9");
/* harmony import */ var _NavigationMenu_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NavigationMenu.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_NavigationMenu_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_NavigationMenu_vue_vue_type_template_id_4c6065d9__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue":
/*!*************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue ***!
  \*************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NavigationMenus_vue_vue_type_template_id_4357f66a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NavigationMenus.vue?vue&type=template&id=4357f66a */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=template&id=4357f66a");
/* harmony import */ var _NavigationMenus_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NavigationMenus.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_NavigationMenus_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_NavigationMenus_vue_vue_type_template_id_4357f66a__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue":
/*!***********************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue ***!
  \***********************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NoNavigations_vue_vue_type_template_id_6a1f4b08__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NoNavigations.vue?vue&type=template&id=6a1f4b08 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=template&id=6a1f4b08");
/* harmony import */ var _NoNavigations_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NoNavigations.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_NoNavigations_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_NoNavigations_vue_vue_type_template_id_6a1f4b08__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue":
/*!***************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue ***!
  \***************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_7cf7cb9c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=7cf7cb9c */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=template&id=7cf7cb9c");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_7cf7cb9c__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateNavigationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateNavigationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CreateOrUpdateNavigationModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteNavigationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteNavigationModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DeleteNavigationModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NavigationMenu_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NavigationMenu_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./NavigationMenu.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NavigationMenus_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NavigationMenus_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./NavigationMenus.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoNavigations_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoNavigations_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./NoNavigations.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=template&id=fcdf9fa0":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=template&id=fcdf9fa0 ***!
  \************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateNavigationModal_vue_vue_type_template_id_fcdf9fa0__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateNavigationModal_vue_vue_type_template_id_fcdf9fa0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CreateOrUpdateNavigationModal.vue?vue&type=template&id=fcdf9fa0 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/CreateOrUpdate/CreateOrUpdateNavigationModal.vue?vue&type=template&id=fcdf9fa0");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=template&id=6f2d6ae0":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=template&id=6f2d6ae0 ***!
  \********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteNavigationModal_vue_vue_type_template_id_6f2d6ae0__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteNavigationModal_vue_vue_type_template_id_6f2d6ae0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DeleteNavigationModal.vue?vue&type=template&id=6f2d6ae0 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/Delete/DeleteNavigationModal.vue?vue&type=template&id=6f2d6ae0");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=template&id=4c6065d9":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=template&id=4c6065d9 ***!
  \******************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NavigationMenu_vue_vue_type_template_id_4c6065d9__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NavigationMenu_vue_vue_type_template_id_4c6065d9__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./NavigationMenu.vue?vue&type=template&id=4c6065d9 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenu.vue?vue&type=template&id=4c6065d9");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=template&id=4357f66a":
/*!*******************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=template&id=4357f66a ***!
  \*******************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NavigationMenus_vue_vue_type_template_id_4357f66a__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NavigationMenus_vue_vue_type_template_id_4357f66a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./NavigationMenus.vue?vue&type=template&id=4357f66a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NavigationMenus.vue?vue&type=template&id=4357f66a");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=template&id=6a1f4b08":
/*!*****************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=template&id=6a1f4b08 ***!
  \*****************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoNavigations_vue_vue_type_template_id_6a1f4b08__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoNavigations_vue_vue_type_template_id_6a1f4b08__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./NoNavigations.vue?vue&type=template&id=6a1f4b08 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/NoNavigations.vue?vue&type=template&id=6a1f4b08");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=template&id=7cf7cb9c":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=template&id=7cf7cb9c ***!
  \*********************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_7cf7cb9c__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_7cf7cb9c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=7cf7cb9c */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenDisplays/Display/DisplayNavigation/NavigationsEditor/index.vue?vue&type=template&id=7cf7cb9c");


/***/ })

}]);