"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Versions_Show_Builder_Content_Editor_ScreenEditor_ScreenMarkers_index_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @components/Button/PrimaryButton */ "./resources/js/Components/Button/PrimaryButton.vue");






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    useForm: _inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__.useForm,
    DefaultInput: _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_2__["default"],
    DefaultModal: _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_3__["default"],
    PrimaryButton: _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  props: {
    markers: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    marker: {
      type: String,
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
        this.form = (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__.useForm)((0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__.useVersionBuilder)().getBlankMarker(this.markers));
      } else if (['clone', 'update'].includes(this.mode)) {
        this.form = (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__.useForm)((0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__.useVersionBuilder)().getClonedMarker(this.marker));
      }
    },
    createMarker: function createMarker(closeModal) {
      //  Clear existing errors
      this.form.clearErrors();

      //  Check if we have an existing marker using the same name
      var totalExactMatches = this.useVersionBuilder.searchMarkers(this.markers, this.form.name, true).length;
      if (this.form.name.length == 0) {
        this.form.setError('name', 'The marker name is required');
      } else if (this.form.name.length < 3) {
        this.form.setError('name', 'The marker name is too short');
      } else if (this.form.name.length > 50) {
        this.form.setError('name', 'The marker name is too long');
      } else if (['create', 'clone'].includes(this.mode) && totalExactMatches) {
        this.form.setError('name', 'This marker name is already in use');
      } else if (this.mode == 'update' && totalExactMatches && this.marker !== this.form.name) {
        this.form.setError('name', 'This marker name is already in use');
      }
      if (this.form.hasErrors === false) {
        var marker = this.form.data();
        if (this.mode == 'update') {
          this.useVersionBuilder.updateMarker(this.markers, marker, this.index);
        } else {
          this.useVersionBuilder.addMarker(this.markers, marker);
        }

        //  Determine the action name e.g created, cloned or updated
        var actionName = this.mode + 'd';
        this.$message({
          message: 'Marker ' + actionName + ' successfully',
          type: 'success'
        });
        closeModal();
      }
    },
    cancelCreateMarker: function cancelCreateMarker() {
      //  Clear existing errors
      this.form.clearErrors();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************************************************************/
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
    markers: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    marker: {
      type: String,
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
    deleteMarker: function deleteMarker(closeModal) {
      //  Remove the current marker
      this.useVersionBuilder.removeMarkerByIndex(this.markers, this.index);
      this.$message({
        message: 'Marker deleted successfully',
        type: 'success'
      });
      closeModal();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Delete_DeleteMarkerModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Delete/DeleteMarkerModal */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue");
/* harmony import */ var _CreateOrUpdate_CreateOrUpdateMarkerModal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreateOrUpdate/CreateOrUpdateMarkerModal */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['markers', 'marker', 'index'],
  components: {
    DeleteMarkerModal: _Delete_DeleteMarkerModal__WEBPACK_IMPORTED_MODULE_0__["default"],
    CreateOrUpdateMarkerModal: _CreateOrUpdate_CreateOrUpdateMarkerModal__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      hexColor: '#00c2b1'
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Marker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Marker */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue");
/* harmony import */ var _NoMarkers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NoMarkers */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue");
/* harmony import */ var vue_draggable_next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-draggable-next */ "./node_modules/vue-draggable-next/dist/vue-draggable-next.esm-bundler.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['modelValue', 'searchTerm'],
  components: {
    draggable: vue_draggable_next__WEBPACK_IMPORTED_MODULE_2__.VueDraggableNext,
    NoMarkers: _NoMarkers__WEBPACK_IMPORTED_MODULE_1__["default"],
    Marker: _Marker__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {};
  },
  computed: {
    filteredMarkers: {
      get: function get() {
        var _this = this;
        return this.modelValue.filter(function (marker) {
          //  Check if the marker matches the search term
          var matchesSearchTerm = marker.toLowerCase().includes(_this.searchTerm);
          return _this.searchTerm == '' || matchesSearchTerm;
        });
      },
      set: function set(markers) {
        //  Allow re-ordering when the markers filtering input is empty
        if (this.searchTerm == '') {
          this.$emit('update:modelValue', markers);
        } else {
          this.$message({
            message: 'You cannot reorder markers while searching',
            type: 'warning'
          });
        }
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CreateOrUpdate_CreateOrUpdateMarkerModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateOrUpdate/CreateOrUpdateMarkerModal */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['markers'],
  components: {
    CreateOrUpdateMarkerModal: _CreateOrUpdate_CreateOrUpdateMarkerModal__WEBPACK_IMPORTED_MODULE_0__["default"]
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Markers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Markers */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_SearchBar_DefaultSearchBar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/SearchBar/DefaultSearchBar */ "./resources/js/Components/SearchBar/DefaultSearchBar.vue");
/* harmony import */ var _CreateOrUpdate_CreateOrUpdateMarkerModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CreateOrUpdate/CreateOrUpdateMarkerModal */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    modelValue: {
      type: Array
    },
    something: {
      type: String
    }
  },
  components: {
    Markers: _Markers__WEBPACK_IMPORTED_MODULE_0__["default"],
    DefaultSearchBar: _components_SearchBar_DefaultSearchBar__WEBPACK_IMPORTED_MODULE_2__["default"],
    CreateOrUpdateMarkerModal: _CreateOrUpdate_CreateOrUpdateMarkerModal__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {
      searchTerm: '',
      localModelValue: this.modelValue,
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__.useVersionBuilder)()
    };
  },
  watch: {
    modelValue: function modelValue(newValue, oldValue) {
      this.localModelValue = newValue;
    },
    localModelValue: function localModelValue(newValue, oldValue) {
      this.$emit('update:modelValue', newValue);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _markersEditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @markersEditor */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    MarkersEditor: _markersEditor__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__.useVersionBuilder)()
    };
  },
  computed: {
    markers: {
      get: function get() {
        return this.useVersionBuilder.selectedScreen.markers;
      },
      set: function set(markers) {
        return this.useVersionBuilder.selectedScreen.markers = markers;
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=template&id=879e4064":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=template&id=879e4064 ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
var _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, "Create Marker", -1 /* HOISTED */);
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
  var _component_DefaultInput = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultInput");
  var _component_PrimaryButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryButton");
  var _component_DefaultModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Modal "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultModal, {
    defaultText: "Cancel",
    onOpen: _cache[1] || (_cache[1] = function ($event) {
      return $options.resetForm();
    }),
    onClose: _cache[2] || (_cache[2] = function ($event) {
      return _ctx.$emit('close');
    }),
    primaryAction: $options.createMarker,
    primaryText: $options.modeInCaps + ' Marker',
    defaultAction: $options.cancelCreateMarker
  }, {
    title: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)((0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.modeInCaps + ' Marker'), 1 /* TEXT */)];
    }),

    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function (_ref) {
      var firePrimaryAction = _ref.firePrimaryAction;
      return [$props.mode == 'clone' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("p", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Cloning "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.marker), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" marker")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Marker Name "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultInput, {
        modelValue: $data.form.name,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return $data.form.name = $event;
        }),
        label: "Name",
        error: $data.form.errors.name,
        onKeyup: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)(firePrimaryAction, ["enter"]),
        autofocus: true,
        "class": "mb-6"
      }, null, 8 /* PROPS */, ["modelValue", "error", "onKeyup"])];
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
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["primaryAction", "primaryText", "defaultAction"])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=template&id=9f449ba4":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=template&id=9f449ba4 ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    dangerText: "Delete Marker",
    dangerAction: $options.deleteMarker
  }, {
    title: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Delete Marker")];
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
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Are you sure you want to delete the "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.marker), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" marker. After this marker is deleted you cannot recover it again. ")])];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["dangerAction"])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=template&id=4c55db84":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=template&id=4c55db84 ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  "class": "col-span-6 relative"
};
var _hoisted_3 = {
  "class": "absolute right-0 flex justify-end transition-all duration-300 opacity-0 group-hover:opacity-100"
};
var _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
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

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_CreateOrUpdateMarkerModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("CreateOrUpdateMarkerModal");
  var _component_DeleteMarkerModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DeleteMarkerModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    "class": "rounded-md border mb-2",
    style: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeStyle)({
      borderLeftColor: $data.hexColor,
      borderLeftWidth: '4px'
    })
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    "class": "grid grid-cols-12 group text-xs text-gray-700 py-2 px-4 cursor-pointer bg-gray-50 rounded-md",
    style: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeStyle)({
      backgroundColor: $data.hexColor + '05'
    })
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.marker), 1 /* TEXT */)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Edit Icon "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_CreateOrUpdateMarkerModal, {
    markers: $props.markers,
    marker: $props.marker,
    index: $props.index,
    mode: "update"
  }, null, 8 /* PROPS */, ["markers", "marker", "index"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Delete Icon "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DeleteMarkerModal, {
    markers: $props.markers,
    marker: $props.marker,
    index: $props.index
  }, null, 8 /* PROPS */, ["markers", "marker", "index"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Clone Icon "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_CreateOrUpdateMarkerModal, {
    markers: $props.markers,
    marker: $props.marker,
    mode: "clone"
  }, null, 8 /* PROPS */, ["markers", "marker"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Move Icon "), _hoisted_4])])], 4 /* STYLE */)], 4 /* STYLE */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=template&id=4211361f":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=template&id=4211361f ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_Marker = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("Marker");
  var _component_NoMarkers = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("NoMarkers");
  var _component_draggable = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("draggable");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_draggable, {
    invertSwap: true,
    "item-key": "markers",
    handle: ".draggble-handle",
    "ghost-class": "bg-yellow-100",
    modelValue: $options.filteredMarkers,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $options.filteredMarkers = $event;
    })
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Marker Menu "), ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.filteredMarkers, function (element, index) {
        return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_Marker, {
          index: index,
          key: element.id,
          marker: element,
          markers: $props.modelValue
        }, null, 8 /* PROPS */, ["index", "marker", "markers"]);
      }), 128 /* KEYED_FRAGMENT */)), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" No Markers Placeholder "), $options.filteredMarkers.length == 0 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_NoMarkers, {
        key: 0,
        markers: $props.modelValue
      }, null, 8 /* PROPS */, ["markers"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["modelValue"]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=template&id=e7391bc4":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=template&id=e7391bc4 ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "flex items-center justify-between bg-white rounded-sm border border-dashed border-gray-400 p-5"
};
var _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createStaticVNode)("<div class=\"flex\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-12 w-12 mr-4\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"1\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z\"></path></svg><div><p class=\"text-gray-800 text-md mb-1\">No markers</p><p class=\"text-gray-600 text-xs\">Go ahead and create your first marker</p></div></div>", 1);
var _hoisted_3 = {
  "class": "flex justify-end"
};
var _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "ml-2"
}, "Create Marker", -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_CreateOrUpdateMarkerModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("CreateOrUpdateMarkerModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [_hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Create Marker Modal "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_CreateOrUpdateMarkerModal, {
    markers: $props.markers,
    mode: "create"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_4];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["markers"])])]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=template&id=77f07ad0":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=template&id=77f07ad0 ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "p-4 rounded-lg bg-gray-50 shadow-md border"
};
var _hoisted_2 = {
  "class": "flex items-center justify-between border-b border-dotted pb-4 mb-4"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DefaultSearchBar = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSearchBar");
  var _component_CreateOrUpdateMarkerModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("CreateOrUpdateMarkerModal");
  var _component_Markers = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("Markers");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Marker Search Bar "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSearchBar, {
    modelValue: $data.searchTerm,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $data.searchTerm = $event;
    }),
    placeholder: "Search markers"
  }, null, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Add Marker Button & Modal "), $data.localModelValue.length ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_CreateOrUpdateMarkerModal, {
    key: 0,
    markers: $data.localModelValue,
    mode: "create"
  }, null, 8 /* PROPS */, ["markers"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Markers "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_Markers, {
    modelValue: $data.localModelValue,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
      return $data.localModelValue = $event;
    }),
    searchTerm: $data.searchTerm,
    "class": "mb-6"
  }, null, 8 /* PROPS */, ["modelValue", "searchTerm"])]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=template&id=dcb2ac8a":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=template&id=dcb2ac8a ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_MarkersEditor = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("MarkersEditor");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_MarkersEditor, {
    modelValue: $options.markers,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $options.markers = $event;
    })
  }, null, 8 /* PROPS */, ["modelValue"]);
}

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue":
/*!****************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue ***!
  \****************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CreateOrUpdateMarkerModal_vue_vue_type_template_id_879e4064__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateOrUpdateMarkerModal.vue?vue&type=template&id=879e4064 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=template&id=879e4064");
/* harmony import */ var _CreateOrUpdateMarkerModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreateOrUpdateMarkerModal.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_CreateOrUpdateMarkerModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_CreateOrUpdateMarkerModal_vue_vue_type_template_id_879e4064__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue":
/*!************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DeleteMarkerModal_vue_vue_type_template_id_9f449ba4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DeleteMarkerModal.vue?vue&type=template&id=9f449ba4 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=template&id=9f449ba4");
/* harmony import */ var _DeleteMarkerModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DeleteMarkerModal.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_DeleteMarkerModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_DeleteMarkerModal_vue_vue_type_template_id_9f449ba4__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue":
/*!******************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Marker_vue_vue_type_template_id_4c55db84__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Marker.vue?vue&type=template&id=4c55db84 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=template&id=4c55db84");
/* harmony import */ var _Marker_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Marker.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_Marker_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Marker_vue_vue_type_template_id_4c55db84__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue":
/*!*******************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Markers_vue_vue_type_template_id_4211361f__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Markers.vue?vue&type=template&id=4211361f */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=template&id=4211361f");
/* harmony import */ var _Markers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Markers.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_Markers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Markers_vue_vue_type_template_id_4211361f__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue":
/*!*********************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NoMarkers_vue_vue_type_template_id_e7391bc4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NoMarkers.vue?vue&type=template&id=e7391bc4 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=template&id=e7391bc4");
/* harmony import */ var _NoMarkers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NoMarkers.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_NoMarkers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_NoMarkers_vue_vue_type_template_id_e7391bc4__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue":
/*!*****************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_77f07ad0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=77f07ad0 */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=template&id=77f07ad0");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_77f07ad0__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue":
/*!******************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_dcb2ac8a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=dcb2ac8a */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=template&id=dcb2ac8a");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_dcb2ac8a__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateMarkerModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateMarkerModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CreateOrUpdateMarkerModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteMarkerModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteMarkerModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DeleteMarkerModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Marker_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Marker_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Marker.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Markers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Markers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Markers.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoMarkers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoMarkers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./NoMarkers.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=template&id=879e4064":
/*!**********************************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=template&id=879e4064 ***!
  \**********************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateMarkerModal_vue_vue_type_template_id_879e4064__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_CreateOrUpdateMarkerModal_vue_vue_type_template_id_879e4064__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./CreateOrUpdateMarkerModal.vue?vue&type=template&id=879e4064 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/CreateOrUpdate/CreateOrUpdateMarkerModal.vue?vue&type=template&id=879e4064");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=template&id=9f449ba4":
/*!******************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=template&id=9f449ba4 ***!
  \******************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteMarkerModal_vue_vue_type_template_id_9f449ba4__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DeleteMarkerModal_vue_vue_type_template_id_9f449ba4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DeleteMarkerModal.vue?vue&type=template&id=9f449ba4 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Delete/DeleteMarkerModal.vue?vue&type=template&id=9f449ba4");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=template&id=4c55db84":
/*!************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=template&id=4c55db84 ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Marker_vue_vue_type_template_id_4c55db84__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Marker_vue_vue_type_template_id_4c55db84__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Marker.vue?vue&type=template&id=4c55db84 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Marker.vue?vue&type=template&id=4c55db84");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=template&id=4211361f":
/*!*************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=template&id=4211361f ***!
  \*************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Markers_vue_vue_type_template_id_4211361f__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Markers_vue_vue_type_template_id_4211361f__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Markers.vue?vue&type=template&id=4211361f */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/Markers.vue?vue&type=template&id=4211361f");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=template&id=e7391bc4":
/*!***************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=template&id=e7391bc4 ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoMarkers_vue_vue_type_template_id_e7391bc4__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_NoMarkers_vue_vue_type_template_id_e7391bc4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./NoMarkers.vue?vue&type=template&id=e7391bc4 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/NoMarkers.vue?vue&type=template&id=e7391bc4");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=template&id=77f07ad0":
/*!***********************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=template&id=77f07ad0 ***!
  \***********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_77f07ad0__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_77f07ad0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=77f07ad0 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/MarkersEditor/index.vue?vue&type=template&id=77f07ad0");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=template&id=dcb2ac8a":
/*!************************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=template&id=dcb2ac8a ***!
  \************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_dcb2ac8a__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_dcb2ac8a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=dcb2ac8a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ScreenEditor/ScreenMarkers/index.vue?vue&type=template&id=dcb2ac8a");


/***/ })

}]);