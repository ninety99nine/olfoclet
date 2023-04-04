"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Versions_Show_Builder_Content_Editor_ConfigurationEditor_GlobalVariablesEd-33e790"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _components_CodeEditor_CodeEditor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @components/CodeEditor/CodeEditor */ "./resources/js/Components/CodeEditor/CodeEditor.vue");
/* harmony import */ var _components_Input_VariableInput__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @components/Input/VariableInput */ "./resources/js/Components/Input/VariableInput.vue");
/* harmony import */ var _components_Switch_DefaultSwitch__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @components/Switch/DefaultSwitch */ "./resources/js/Components/Switch/DefaultSwitch.vue");
/* harmony import */ var _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @components/Select/DefaultSelect */ "./resources/js/Components/Select/DefaultSelect.vue");
/* harmony import */ var _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @components/Button/PrimaryButton */ "./resources/js/Components/Button/PrimaryButton.vue");
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
    CodeEditor: _components_CodeEditor_CodeEditor__WEBPACK_IMPORTED_MODULE_5__["default"],
    DefaultSwitch: _components_Switch_DefaultSwitch__WEBPACK_IMPORTED_MODULE_7__["default"],
    DefaultSelect: _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_8__["default"],
    PrimaryButton: _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_9__["default"],
    VariableInput: _components_Input_VariableInput__WEBPACK_IMPORTED_MODULE_6__["default"]
  },
  props: {
    variable: {
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
      typeOptions: [{
        label: 'String',
        value: 'string'
      }, {
        label: 'Integer',
        value: 'integer'
      }, {
        label: 'Boolean',
        value: 'boolean'
      }, {
        label: 'Code',
        value: 'code'
      }, {
        label: 'Null',
        value: 'null'
      }, {
        label: 'Empty Array',
        value: 'empty array'
      }],
      booleanOptions: [{
        label: 'True',
        value: 'true'
      }, {
        label: 'False',
        value: 'false'
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
        this.form = (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__.useForm)((0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__.useVersionBuilder)().getBlankGlobalVariable());
      } else if (this.mode == 'clone') {
        this.form = (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__.useForm)((0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__.useVersionBuilder)().getClonedGlobalVariable(this.variable));
      } else if (this.mode == 'update') {
        this.form = (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__.useForm)(_objectSpread(_objectSpread({}, (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__.useVersionBuilder)().getBlankGlobalVariable()), lodash__WEBPACK_IMPORTED_MODULE_0___default().cloneDeep(this.variable)));
      }
    },
    createVariable: function createVariable(closeModal) {
      //  Check if we have an existing variable using the same name
      var totalExactMatches = this.useVersionBuilder.searchGlobalVariables(this.form.name, true).length;
      if (this.form.name.length == 0) {
        this.form.setError('name', 'The variable name is required');
      } else if (this.form.name.length < 3) {
        this.form.setError('name', 'The variable name is too short');
      } else if (this.form.name.length > 50) {
        this.form.setError('name', 'The variable name is too long');
      } else if (['create', 'clone'].includes(this.mode) && totalExactMatches) {
        this.form.setError('name', 'This variable name is already in use');
      } else if (this.mode == 'update' && totalExactMatches && this.variable.name !== this.form.name) {
        this.form.setError('name', 'This variable name is already in use');
      }
      if (this.form.type === 'boolean' && this.form.value["boolean"] == null) {
        this.form.setError('value', 'The variable boolean is required');
      } else if (this.form.type === 'integer' && this.form.value.integer == null) {
        this.form.setError('value', 'The variable integer is required');
      } else if (this.form.type === 'code' && this.form.value.code == null) {
        this.form.setError('value', 'The variable code is required');
      }
      if (this.form.hasErrors === false) {
        var variable = this.form.data();
        if (this.mode == 'update') {
          this.useVersionBuilder.updateGlobalVariable(variable, this.index);
        } else {
          this.useVersionBuilder.addGlobalVariable(variable);
        }

        //  Determine the action name e.g created, cloned or updated
        var actionName = this.mode + 'd';
        this.$message({
          message: 'Variable ' + actionName + ' successfully',
          type: 'success'
        });
        closeModal();
      }
    },
    cancelCreateVariable: function cancelCreateVariable() {
      //  Clear existing errors
      this.form.clearErrors();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_Button_DangerButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Button/DangerButton */ "./resources/js/Components/Button/DangerButton.vue");
/* harmony import */ var _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Modal/DefaultModal */ "./resources/js/Components/Modal/DefaultModal.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    DangerButton: _components_Button_DangerButton__WEBPACK_IMPORTED_MODULE_0__["default"],
    DefaultModal: _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  props: {
    variable: Object,
    indexes: Array,
    index: Number,
    mode: {
      type: String,
      "default": 'single',
      validator: function validator(value) {
        return ['single', 'multiple'].includes(value);
      }
    }
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__.useVersionBuilder)()
    };
  },
  methods: {
    deleteVariable: function deleteVariable(closeModal) {
      if (this.mode == 'single') {
        this.useVersionBuilder.removeGlobalVariableByIndex(this.index);
        this.$message({
          message: 'Variable deleted successfully',
          type: 'success'
        });
        this.$emit('deleted');
      } else if (this.mode == 'multiple' && this.indexes.length) {
        this.useVersionBuilder.removeGlobalVariablesByIndexes(this.indexes);
        this.$message({
          message: (this.indexes == 1 ? 'Variable' : 'Variables') + ' deleted successfully',
          type: 'success'
        });
        this.$emit('deleted');
      }
      closeModal();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue_draggable_next__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vue-draggable-next */ "./node_modules/vue-draggable-next/dist/vue-draggable-next.esm-bundler.js");
/* harmony import */ var _components_Popover_InfoPopover__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Popover/InfoPopover */ "./resources/js/Components/Popover/InfoPopover.vue");
/* harmony import */ var _components_TextEditor_TextEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/TextEditor/TextEditor */ "./resources/js/Components/TextEditor/TextEditor.vue");
/* harmony import */ var _components_CodeEditor_HiddenCode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/CodeEditor/HiddenCode */ "./resources/js/Components/CodeEditor/HiddenCode/index.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Button_DangerButton_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @components/Button/DangerButton.vue */ "./resources/js/Components/Button/DangerButton.vue");
/* harmony import */ var _components_SearchBar_DefaultSearchBar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @components/SearchBar/DefaultSearchBar */ "./resources/js/Components/SearchBar/DefaultSearchBar.vue");
/* harmony import */ var _DeleteVariable_DeleteVariableModal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DeleteVariable/DeleteVariableModal */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue");
/* harmony import */ var _CreateOrUpdateVariable_CreateOrUpdateVariableModal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CreateOrUpdateVariable/CreateOrUpdateVariableModal */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    draggable: vue_draggable_next__WEBPACK_IMPORTED_MODULE_8__.VueDraggableNext,
    InfoPopover: _components_Popover_InfoPopover__WEBPACK_IMPORTED_MODULE_0__["default"],
    TextEditor: _components_TextEditor_TextEditor__WEBPACK_IMPORTED_MODULE_1__["default"],
    HiddenCode: _components_CodeEditor_HiddenCode__WEBPACK_IMPORTED_MODULE_2__["default"],
    DefaultSearchBar: _components_SearchBar_DefaultSearchBar__WEBPACK_IMPORTED_MODULE_5__["default"],
    CreateOrUpdateVariableModal: _CreateOrUpdateVariable_CreateOrUpdateVariableModal__WEBPACK_IMPORTED_MODULE_7__["default"],
    DangerButton: _components_Button_DangerButton_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    DeleteVariableModal: _DeleteVariable_DeleteVariableModal__WEBPACK_IMPORTED_MODULE_6__["default"]
  },
  data: function data() {
    return {
      headers: ['Name', 'Type', 'Value', {
        name: 'Global',
        info: 'Once the value is evaluated and set, it will be preserved for the next session'
      }, {
        name: 'Constant',
        info: 'Once the value is evaluated and set, it cannot be modified or overridden during application runtime. This value can only be modified here as a global variable'
      }],
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_3__.useVersionBuilder)(),
      globalCheckboxChecked: false,
      checkedIndexes: [],
      searchIndexes: [],
      hasResults: true,
      totalResults: 0,
      searchTerm: ''
    };
  },
  watch: {
    'useVersionBuilder.builder.global_variables': {
      handler: function handler(after, before) {
        //  Start a search using the given search term
        this.startSearch(this.searchTerm);
      },
      deep: true
    },
    searchTerm: function searchTerm(newSearchTerm, oldSearchTerm) {
      //  Start a search using the given search term
      this.startSearch(newSearchTerm);
    }
  },
  methods: {
    startSearch: function startSearch(searchTerm) {
      var _this = this;
      //  Reset the search indexes
      this.searchIndexes = [];
      this.useVersionBuilder.builder.global_variables.map(function (global_variable, index) {
        //  Convert the serach term to lowercase
        searchTerm = searchTerm.toLowerCase();

        //  Check if we have the search term
        var hasSearchTerm = searchTerm !== '';

        //  Check if the global variable name matches the search term
        var nameMatchesSearchTerm = global_variable.name.toLowerCase().includes(searchTerm);

        //  Check if the global variable type matches the search term
        var typeMatchesSearchTerm = global_variable.type.toLowerCase().includes(searchTerm);

        //  Check if the global variable string matches the search term
        var stringMatchesSearchTerm = global_variable.type == 'string' && (global_variable.value.string || '').toString().toLowerCase().includes(searchTerm);

        //  Check if the global variable integer matches the search term
        var integerMatchesSearchTerm = global_variable.type == 'integer' && (global_variable.value.integer || '').toString().toLowerCase().includes(searchTerm);

        //  Check if the global variable boolean matches the search term
        var booleanMatchesSearchTerm = global_variable.type == 'boolean' && global_variable.value["boolean"].toString().toLowerCase().includes(searchTerm);

        //  Check if the global variable code matches the search term
        var codeMatchesSearchTerm = global_variable.type == 'code' && global_variable.value.code.toString().toLowerCase().includes(searchTerm);

        //  Determine if we have a match from the possible matches above
        var matchesSearchTerm = nameMatchesSearchTerm || typeMatchesSearchTerm || stringMatchesSearchTerm || integerMatchesSearchTerm || booleanMatchesSearchTerm || codeMatchesSearchTerm;

        //  If we do not have the search term or the search term has a matching result
        if (hasSearchTerm == false || hasSearchTerm == true && matchesSearchTerm == true) {
          //  Indicate that this global variable must be shown within the search results
          _this.searchIndexes.push(index);
        } else {}
      });
      this.totalResults = this.searchIndexes.length;
      this.hasResults = this.totalResults > 0;
    },
    toggleSingleCheckmark: function toggleSingleCheckmark(index) {
      var removeAt = this.checkedIndexes.indexOf(index);

      //  If this index already exists
      if (removeAt >= 0) {
        //  Remove the index (This will uncheck the checkbox)
        this.checkedIndexes.splice(removeAt, 1).sort();
      } else {
        //  Add the index (This will check the checkbox)
        this.checkedIndexes.push(index);
        this.checkedIndexes.sort();
      }
    },
    toggleMultipleCheckmarks: function toggleMultipleCheckmarks(event) {
      var _this2 = this;
      //  Uncheck the checked checkboxes
      this.checkedIndexes = [];
      if (event.target.checked) {
        //  Check all the checkboxes
        this.useVersionBuilder.builder.global_variables.forEach(function (global_variable, index) {
          return _this2.checkedIndexes.push(index);
        });
      }
    },
    resetCheckboxes: function resetCheckboxes() {
      this.checkedIndexes = [];
      this.globalCheckboxChecked = false;
    }
  },
  created: function created() {
    //  Start a search using the given search term (which is an empty search term)
    this.startSearch(this.searchTerm);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=template&id=6dabad19":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=template&id=6dabad19 ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
var _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-3 w-3 mr-2",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "fill-rule": "evenodd",
  d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z",
  "clip-rule": "evenodd"
})], -1 /* HOISTED */);
var _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, "Create Variable", -1 /* HOISTED */);
var _hoisted_5 = {
  key: 1,
  name: "trigger",
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2 cursor-pointer hover:text-blue-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_6 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
}, null, -1 /* HOISTED */);
var _hoisted_7 = [_hoisted_6];
var _hoisted_8 = {
  key: 2,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2 cursor-pointer hover:text-blue-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_9 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
}, null, -1 /* HOISTED */);
var _hoisted_10 = [_hoisted_9];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_VariableInput = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("VariableInput");
  var _component_DefaultSelect = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSelect");
  var _component_DefaultInput = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultInput");
  var _component_CodeEditor = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("CodeEditor");
  var _component_DefaultSwitch = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSwitch");
  var _component_PrimaryButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryButton");
  var _component_DefaultModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Modal "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultModal, {
    defaultText: "Cancel",
    onOpen: _cache[10] || (_cache[10] = function ($event) {
      return $options.resetForm();
    }),
    onClose: _cache[11] || (_cache[11] = function ($event) {
      return _ctx.$emit('close');
    }),
    primaryAction: $options.createVariable,
    primaryText: $options.modeInCaps + ' Variable',
    defaultAction: $options.cancelCreateVariable
  }, {
    title: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)((0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.modeInCaps + ' Variable'), 1 /* TEXT */)];
    }),

    trigger: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$props.mode == 'create' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_PrimaryButton, {
        key: 0,
        name: "trigger",
        "class": "px-3"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [_hoisted_3, _hoisted_4];
        }),
        _: 1 /* STABLE */
      })) : $props.mode == 'clone' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_5, _hoisted_7)) : $props.mode == 'update' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_8, _hoisted_10)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$props.mode == 'clone' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("p", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Cloning "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.variable.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" variable")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_VariableInput, {
        modelValue: $data.form.name,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return $data.form.name = $event;
        }),
        label: "Name",
        error: $data.form.errors.name,
        onOnSetError: _cache[1] || (_cache[1] = function ($event) {
          return $data.form.setError('name', $event);
        }),
        onOnClearError: _cache[2] || (_cache[2] = function ($event) {
          return $data.form.clearErrors('name');
        }),
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "error"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSelect, {
        modelValue: $data.form.type,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = function ($event) {
          return $data.form.type = $event;
        }),
        options: $data.typeOptions,
        label: "Select Type",
        placeholder: "Select the variable type",
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "options"]), $data.form.type === 'string' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultInput, {
        key: 1,
        modelValue: $data.form.value.string,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = function ($event) {
          return $data.form.value.string = $event;
        }),
        label: "String",
        error: $data.form.errors.value,
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "error"])) : $data.form.type === 'integer' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultInput, {
        key: 2,
        type: "number",
        modelValue: $data.form.value.integer,
        "onUpdate:modelValue": _cache[5] || (_cache[5] = function ($event) {
          return $data.form.value.integer = $event;
        }),
        label: "Integer",
        error: $data.form.errors.value,
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "error"])) : $data.form.type === 'boolean' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultSelect, {
        key: 3,
        modelValue: $data.form.value["boolean"],
        "onUpdate:modelValue": _cache[6] || (_cache[6] = function ($event) {
          return $data.form.value["boolean"] = $event;
        }),
        options: $data.booleanOptions,
        label: "Select Boolean",
        error: $data.form.errors.value,
        placeholder: "Select boolean value",
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "options", "error"])) : $data.form.type === 'code' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_CodeEditor, {
        key: 4,
        modelValue: $data.form.value.code,
        "onUpdate:modelValue": _cache[7] || (_cache[7] = function ($event) {
          return $data.form.value.code = $event;
        }),
        error: $data.form.errors.value,
        height: "300px",
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "error"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSwitch, {
        modelValue: $data.form.is_constant,
        "onUpdate:modelValue": _cache[8] || (_cache[8] = function ($event) {
          return $data.form.is_constant = $event;
        }),
        label: "Make Constant",
        info: "Once the value is evaluated and set, it cannot be modified or overridden during application runtime. This value can only be modified here as a global variable",
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSwitch, {
        modelValue: $data.form.is_global,
        "onUpdate:modelValue": _cache[9] || (_cache[9] = function ($event) {
          return $data.form.is_global = $event;
        }),
        label: "Save for next session",
        info: "Once the value is evaluated and set, it will be preserved for the next session",
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue"])];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["primaryAction", "primaryText", "defaultAction"])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=template&id=189ddb0e":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=template&id=189ddb0e ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  "class": "text-sm text-gray-500 mb-5"
};
var _hoisted_4 = {
  "class": "text-blue-500 font-bold"
};
var _hoisted_5 = {
  key: 0,
  name: "trigger",
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2 hover:text-red-500 cursor-pointer",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_6 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
}, null, -1 /* HOISTED */);
var _hoisted_7 = [_hoisted_6];
var _hoisted_8 = {
  key: 0,
  "class": "flex items-center justify-end"
};
var _hoisted_9 = {
  "class": "text-gray-500 text-xs mr-4"
};
var _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-1",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
})], -1 /* HOISTED */);
var _hoisted_11 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, "Delete", -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DangerButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DangerButton");
  var _component_DefaultModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Modal "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultModal, {
    defaultText: "Cancel",
    onOpen: _cache[0] || (_cache[0] = function ($event) {
      return _ctx.$emit('open');
    }),
    onClose: _cache[1] || (_cache[1] = function ($event) {
      return _ctx.$emit('close');
    }),
    dangerText: "Delete Variable",
    dangerAction: $options.deleteVariable
  }, {
    title: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Delete Variable")];
    }),
    trigger: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$props.mode == 'single' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_5, _hoisted_7)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
        name: "fade"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [$props.mode == 'multiple' && $props.indexes.length ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_8, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_9, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.indexes.length + ($props.indexes.length == 1 ? ' variable' : ' variables')) + " selected", 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DangerButton, {
            "class": "mr-2"
          }, {
            "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
              return [_hoisted_10, _hoisted_11];
            }),
            _: 1 /* STABLE */
          })])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
        }),
        _: 1 /* STABLE */
      })];
    }),

    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$props.mode == 'single' && $props.variable ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("p", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Are you sure you want to delete the "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.variable.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" variable. After this variable is deleted you cannot recover it again.")])) : $props.mode == 'multiple' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        key: 1
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Modal Content (If we are deleting multiple variable) "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Are you sure you want to delete "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_4, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.indexes.length), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.indexes.length == 1 ? 'variable' : 'variables') + ". After " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.indexes.length == 1 ? 'this variable is deleted you cannot recover it again' : 'these variables are deleted you cannot recover them again') + ".", 1 /* TEXT */)])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["dangerAction"])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=template&id=356a2cf2":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=template&id=356a2cf2 ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "grid grid-cols-12 mb-4 items-center"
};
var _hoisted_2 = {
  "class": "col-span-6"
};
var _hoisted_3 = {
  "class": "col-span-6"
};
var _hoisted_4 = {
  "class": "flex items-center justify-end"
};
var _hoisted_5 = {
  "class": "relative overflow-x-auto shadow-md"
};
var _hoisted_6 = {
  "class": "w-full text-sm text-left text-gray-500"
};
var _hoisted_7 = {
  "class": "text-xs text-gray-700 uppercase bg-gray-50"
};
var _hoisted_8 = {
  key: 0,
  scope: "col",
  "class": "p-4"
};
var _hoisted_9 = {
  "class": "flex items-center"
};
var _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("label", {
  "for": "checkbox-all",
  "class": "sr-only"
}, "checkbox", -1 /* HOISTED */);
var _hoisted_11 = {
  "class": "flex items-center"
};
var _hoisted_12 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("th", {
  scope: "col",
  "class": "px-6 py-3"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "sr-only"
}, "Edit")], -1 /* HOISTED */);
var _hoisted_13 = {
  key: 0,
  "class": "w-4 p-4"
};
var _hoisted_14 = {
  "class": "flex items-center"
};
var _hoisted_15 = ["checked", "onChange"];
var _hoisted_16 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("label", {
  "for": "checkbox-table-1",
  "class": "sr-only"
}, "checkbox", -1 /* HOISTED */);
var _hoisted_17 = {
  scope: "row",
  "class": "px-6 py-4 text-xs whitespace-nowrap font-medium text-gray-900"
};
var _hoisted_18 = {
  scope: "row",
  "class": "px-6 py-4 text-xs whitespace-nowrap font-normal text-gray-500"
};
var _hoisted_19 = {
  scope: "row",
  "class": "px-6 py-4 text-xs whitespace-nowrap font-normal text-gray-500"
};
var _hoisted_20 = {
  key: 0
};
var _hoisted_21 = {
  key: 1
};
var _hoisted_22 = {
  key: 2
};
var _hoisted_23 = {
  key: 3,
  "class": "capitalize"
};
var _hoisted_24 = {
  scope: "row",
  "class": "px-6 py-4 text-xs whitespace-nowrap font-normal text-gray-500"
};
var _hoisted_25 = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 text-green-500 ml-4",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_26 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
}, null, -1 /* HOISTED */);
var _hoisted_27 = [_hoisted_26];
var _hoisted_28 = {
  scope: "row",
  "class": "px-6 py-4 text-xs whitespace-nowrap font-normal text-gray-500"
};
var _hoisted_29 = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 text-green-500 ml-4",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_30 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
}, null, -1 /* HOISTED */);
var _hoisted_31 = [_hoisted_30];
var _hoisted_32 = {
  scope: "row"
};
var _hoisted_33 = {
  "class": "flex justify-end"
};
var _hoisted_34 = {
  "class": "w-24 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-end mr-4"
};
var _hoisted_35 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 hover:text-blue-500 cursor-grab active:cursor-grabbing draggble-handle",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M4 6h16M4 10h16M4 14h16M4 18h16"
})], -1 /* HOISTED */);
var _hoisted_36 = {
  key: 0,
  "class": "flex items-center justify-center bg-gray-50 p-8"
};
var _hoisted_37 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "text-gray-500 text-xs"
}, "No Results", -1 /* HOISTED */);
var _hoisted_38 = [_hoisted_37];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DefaultSearchBar = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSearchBar");
  var _component_DeleteVariableModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DeleteVariableModal");
  var _component_CreateOrUpdateVariableModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("CreateOrUpdateVariableModal");
  var _component_InfoPopover = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("InfoPopover");
  var _component_TextEditor = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("TextEditor");
  var _component_HiddenCode = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("HiddenCode");
  var _component_draggable = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("draggable");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Search Bar "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSearchBar, {
    modelValue: $data.searchTerm,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $data.searchTerm = $event;
    }),
    placeholder: "Search",
    totalResults: $data.totalResults
  }, null, 8 /* PROPS */, ["modelValue", "totalResults"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Delete Modal Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DeleteVariableModal, {
    indexes: $data.checkedIndexes,
    mode: "multiple",
    onDeleted: _cache[1] || (_cache[1] = function ($event) {
      return $options.resetCheckboxes();
    })
  }, null, 8 /* PROPS */, ["indexes"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Create Modal Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_CreateOrUpdateVariableModal, {
    mode: "create"
  })])])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Table "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_5, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("table", _hoisted_6, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("thead", _hoisted_7, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("tr", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Table Header Checkbox "), $data.hasResults ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("th", _hoisted_8, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_9, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("input", {
    id: "checkbox-all",
    type: "checkbox",
    "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
      return $data.globalCheckboxChecked = $event;
    }),
    onChange: _cache[3] || (_cache[3] = function ($event) {
      return $options.toggleMultipleCheckmarks($event);
    }),
    "class": "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
  }, null, 544 /* HYDRATE_EVENTS, NEED_PATCH */), [[vue__WEBPACK_IMPORTED_MODULE_0__.vModelCheckbox, $data.globalCheckboxChecked]]), _hoisted_10])])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Table Header Columns Names "), ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($data.headers, function (header, index) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("th", {
      key: index,
      scope: "col",
      "class": "px-6 py-3"
    }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_11, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Header Name "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(header.name ? header.name : header), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Header Info "), header.info ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_InfoPopover, {
      key: 0,
      info: header.info,
      "class": "ml-2"
    }, null, 8 /* PROPS */, ["info"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)])]);
  }), 128 /* KEYED_FRAGMENT */)), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Table Header Edit Action "), _hoisted_12])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Table Draggable Rows "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_draggable, {
    tag: "tbody",
    invertSwap: true,
    handle: ".draggble-handle",
    "item-key": "global-variables",
    "ghost-class": "bg-yellow-100",
    modelValue: $data.useVersionBuilder.builder.global_variables,
    "onUpdate:modelValue": _cache[4] || (_cache[4] = function ($event) {
      return $data.useVersionBuilder.builder.global_variables = $event;
    })
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($data.useVersionBuilder.builder.global_variables, function (element, index) {
        return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [$data.searchIndexes.includes(index) ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("tr", {
          key: index,
          "class": "group border-b hover:bg-gray-50"
        }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Table Body Checkbox "), $data.hasResults ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("td", _hoisted_13, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_14, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("input", {
          id: "checkbox-table-1",
          type: "checkbox",
          checked: $data.checkedIndexes.includes(index),
          onChange: function onChange($event) {
            return $options.toggleSingleCheckmark(index);
          },
          "class": "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_15), _hoisted_16])])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Name "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("td", _hoisted_17, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(element.name), 1 /* TEXT */)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Type "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("td", _hoisted_18, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(element.type), 1 /* TEXT */)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Value "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("td", _hoisted_19, [element.type == 'null' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_20, "Null")) : element.type == 'empty array' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_21, "[]")) : element.type == 'integer' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_22, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(element.value.integer), 1 /* TEXT */)) : element.type == 'boolean' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_23, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(element.value["boolean"]), 1 /* TEXT */)) : element.type == 'string' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_TextEditor, {
          key: 4,
          modelValue: element.value.string,
          "onUpdate:modelValue": function onUpdateModelValue($event) {
            return element.value.string = $event;
          },
          read_only: true
        }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])) : element.type == 'code' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_HiddenCode, {
          key: 5,
          modelValue: $data.useVersionBuilder.builder.global_variables[index].value.code,
          "onUpdate:modelValue": function onUpdateModelValue($event) {
            return $data.useVersionBuilder.builder.global_variables[index].value.code = $event;
          }
        }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Is Global "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("td", _hoisted_24, [element.is_global ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_25, _hoisted_27)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Is Contant "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("td", _hoisted_28, [element.is_constant ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_29, _hoisted_31)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("td", _hoisted_32, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_33, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_34, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Update Modal Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_CreateOrUpdateVariableModal, {
          variable: element,
          index: index,
          mode: "update"
        }, null, 8 /* PROPS */, ["variable", "index"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Clone Modal Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_CreateOrUpdateVariableModal, {
          variable: element,
          mode: "clone"
        }, null, 8 /* PROPS */, ["variable"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Delete Modal Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DeleteVariableModal, {
          variable: element,
          index: index,
          mode: "single"
        }, null, 8 /* PROPS */, ["variable", "index"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Move Icon "), _hoisted_35])])])])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)], 64 /* STABLE_FRAGMENT */);
      }), 256 /* UNKEYED_FRAGMENT */))];
    }),

    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["modelValue"])]), $data.hasResults == false ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_36, _hoisted_38)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)])]);
}

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue":
/*!******************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue ***!
  \******************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CreateOrUpdateVariableModal_vue_vue_type_template_id_6dabad19__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateOrUpdateVariableModal.vue?vue&type=template&id=6dabad19 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=template&id=6dabad19");
/* harmony import */ var _CreateOrUpdateVariableModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreateOrUpdateVariableModal.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_CreateOrUpdateVariableModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_CreateOrUpdateVariableModal_vue_vue_type_template_id_6dabad19__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue":
/*!**************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue ***!
  \**************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DeleteVariableModal_vue_vue_type_template_id_189ddb0e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DeleteVariableModal.vue?vue&type=template&id=189ddb0e */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=template&id=189ddb0e");
/* harmony import */ var _DeleteVariableModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DeleteVariableModal.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_DeleteVariableModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_DeleteVariableModal_vue_vue_type_template_id_189ddb0e__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue":
/*!*********************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue ***!
  \*********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_356a2cf2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=356a2cf2 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=template&id=356a2cf2");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_356a2cf2__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateVariableModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateVariableModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CreateOrUpdateVariableModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteVariableModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteVariableModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DeleteVariableModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=template&id=6dabad19":
/*!************************************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=template&id=6dabad19 ***!
  \************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateVariableModal_vue_vue_type_template_id_6dabad19__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateVariableModal_vue_vue_type_template_id_6dabad19__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CreateOrUpdateVariableModal.vue?vue&type=template&id=6dabad19 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/CreateOrUpdateVariable/CreateOrUpdateVariableModal.vue?vue&type=template&id=6dabad19");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=template&id=189ddb0e":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=template&id=189ddb0e ***!
  \********************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteVariableModal_vue_vue_type_template_id_189ddb0e__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteVariableModal_vue_vue_type_template_id_189ddb0e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DeleteVariableModal.vue?vue&type=template&id=189ddb0e */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/DeleteVariable/DeleteVariableModal.vue?vue&type=template&id=189ddb0e");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=template&id=356a2cf2":
/*!***************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=template&id=356a2cf2 ***!
  \***************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_356a2cf2__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_356a2cf2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=356a2cf2 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/GlobalVariablesEditor/index.vue?vue&type=template&id=356a2cf2");


/***/ })

}]);