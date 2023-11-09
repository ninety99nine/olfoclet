"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Versions_Show_Builder_Header_ImportVersion_ImportVersionModal_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    width: {
      type: Number,
      "default": 0
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");
/* harmony import */ var _components_Error_DefaultError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Error/DefaultError */ "./resources/js/Components/Error/DefaultError.vue");
/* harmony import */ var _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Alert/PrimaryAlert */ "./resources/js/Components/Alert/PrimaryAlert.vue");
/* harmony import */ var _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Modal/DefaultModal */ "./resources/js/Components/Modal/DefaultModal.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Button_DefaultButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @components/Button/DefaultButton */ "./resources/js/Components/Button/DefaultButton.vue");
/* harmony import */ var _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @components/Button/PrimaryButton */ "./resources/js/Components/Button/PrimaryButton.vue");
/* harmony import */ var _components_ProgressBar_DefaultProgressBar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @components/ProgressBar/DefaultProgressBar */ "./resources/js/Components/ProgressBar/DefaultProgressBar.vue");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }








/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['form'],
  components: {
    DefaultError: _components_Error_DefaultError__WEBPACK_IMPORTED_MODULE_1__["default"],
    PrimaryAlert: _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_2__["default"],
    DefaultModal: _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_3__["default"],
    DefaultButton: _components_Button_DefaultButton__WEBPACK_IMPORTED_MODULE_5__["default"],
    PrimaryButton: _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_6__["default"],
    DefaultProgressBar: _components_ProgressBar_DefaultProgressBar__WEBPACK_IMPORTED_MODULE_7__["default"]
  },
  data: function data() {
    return {
      file: null,
      error: null,
      fileList: [],
      builder: null,
      request: null,
      properties: [],
      isLoading: false,
      uploadMessage: null,
      progressPercentage: null,
      uploadProgressPercentage: null,
      downloadProgressPercentage: null,
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_4__.useVersionBuilder)()
    };
  },
  methods: {
    beforeUpload: function beforeUpload(file) {
      this.reset();
      var rawFile = file.raw;
      if (rawFile.type == 'application/json') {
        //  Set the raw JSON file
        this.file = rawFile;
        var reader = new FileReader();

        //  On load of the JSON file
        reader.onload = function (event) {
          try {
            //  Get the JSON data
            var builder = JSON.parse(event.target.result);
            var properties = Object.keys(builder);

            //  Check if the builder has the following properties
            if (properties.includes('screens') && properties.includes('simulator')) {
              this.builder = builder;
              this.properties = properties.map(function (property) {
                return {
                  label: property.split('_').join(' '),
                  value: property,
                  checked: true
                };
              });
            } else {
              this.setImportError('The file imported is not a valid Builder File');
            }
          } catch (e) {
            this.reset();
            this.setImportError('Failed to process the file');
          }
        }.bind(this);
        if (this.file) {
          //  Read the JSON file
          reader.readAsText(this.file);
        }
      } else {
        this.setImportError('The file imported is not a valid JSON File');
      }
    },
    reset: function reset() {
      this.file = null;
      this.fileList = [];
      this.builder = null;
      this.properties = [];
      this.unsetImportError();
    },
    setImportError: function setImportError() {
      var _this = this;
      var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      this.error = msg;
      setTimeout(function () {
        _this.unsetImportError();
      }, 3000);
    },
    unsetImportError: function unsetImportError() {
      this.error = '';
    },
    getFileSize: function getFileSize(fileSize) {
      //  1 kb = 1024 bytes
      var kb = 1024;

      //  1 mb = (kb * 1024) bytes
      var mb = kb * 1024;
      fileSize = parseInt(fileSize);

      //  If the file size is less than 1000 bytes
      if (fileSize >= mb) {
        fileSize = Math.round(fileSize / mb * 100) / 100 + ' MB';
      } else if (fileSize >= kb) {
        fileSize = Math.round(fileSize / kb * 100) / 100 + ' KB';
      } else {
        fileSize + ' Bytes';
      }
      return fileSize;
    },
    importFile: function importFile(closeModal) {
      if (this.builder) {
        //  Get the value of the builder properties
        var propertyValues = this.properties.map(function (property) {
          return property.value;
        });

        //  Get the value of the unselected builder properties
        var unselectedPropertyNames = this.properties.filter(function (property) {
          return property.checked == false;
        }).map(function (property) {
          return property.value;
        });

        //  Foreach of the builder properties
        for (var index = 0; index < propertyValues.length; index++) {
          var propertyValue = propertyValues[index];

          //  If the property is unselected
          if (unselectedPropertyNames.includes(propertyValue)) {
            //  Delete the property from the builder
            delete this.builder[propertyValue];
          }
        }
        var mergedBuilder = _objectSpread(_objectSpread({}, this.useVersionBuilder.builder), this.builder);
        this.uploadToRepairFile(mergedBuilder, closeModal);
      } else {
        this.setImportError('Select a JSON File to upload');
      }
    },
    uploadToRepairFile: function uploadToRepairFile(builderForRepair, closeModal) {
      var _this2 = this;
      this.isLoading = true;
      console.log('builderForRepair');
      console.log(builderForRepair);

      /**
       *  Attempt to update version
       *
       *  Note that we use "FormData()" to make use of the "multipart/form-data"
       *  which is useful for tracking the upload progress.
       */
      var formData = new FormData();
      formData.append('builder', JSON.stringify(builderForRepair));
      var url = route('version.repair', {
        project: this.route().params.project,
        app: this.route().params.app,
        version: this.route().params.version
      });

      /**
       *  Generate the axios cancel token to allow this request
       *  to be cancelled if this action is required
       *
       *  Reference: https://stackoverflow.com/questions/50516438/cancel-previous-request-using-axios-with-vue-js
       */
      var axiosSource = axios.CancelToken.source();
      this.request = {
        cancel: axiosSource.cancel
      };
      var config = {
        //  Upload Progress
        onUploadProgress: function onUploadProgress(event) {
          _this2.uploadMessage = 'Uploading file for repair analysis';
          _this2.uploadProgressPercentage = Math.round(event.loaded * 100 / event.total);
          _this2.calculateProgress();
        },
        //  Dowload Progress
        onDownloadProgress: function onDownloadProgress(event) {
          _this2.uploadMessage = 'Downloading repaired file';
          _this2.downloadProgressPercentage = Math.round(event.loaded * 100 / event.total);
          _this2.calculateProgress();
        },
        cancelToken: axiosSource.token
      };
      var self = this;
      axios.post(url, formData, config).then(function (response) {
        //  Get the builder
        var builder = response.data;

        //  Update the project version builder
        self.useVersionBuilder.setBuilder(builder);

        //  Select a screen by default
        _this2.useVersionBuilder.selectRecomendedScreen();

        //  Indicate that the builder has been imported
        _this2.useVersionBuilder.hasImportedBuilder = true;
        self.$message({
          type: 'success',
          message: (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)('p', null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.h)('span', null, 'Import successful'), (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)('div', {
            "class": 'text-xs mt-2'
          }, 'The builder was imported successfully.'), (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)('div', {
            "class": 'text-xs mt-2'
          }, 'Click "Save Changes" to permanently save these updates. Refresh the page to undo the import.')]),
          duration: 8000
        });
        closeModal();
      })["catch"](function (error) {
        var _message;
        var message = (_message = (error || {}).message) !== null && _message !== void 0 ? _message : 'Sorry, something went wrong';

        //  Request failed with status code 419 (CSRF token mismatch.)
        if (error.response.status === 419) {
          message = 'Please login';

          //  Proceed to login
          _this2.$inertia.get(route('login.show'));
        }
        self.$message({
          message: message,
          type: 'warning'
        });
      })["finally"](function () {
        _this2.resetRequest();
      });
    },
    calculateProgress: function calculateProgress() {
      var total = (this.uploadProgressPercentage || 0) + (this.downloadProgressPercentage || 0);
      this.progressPercentage = Math.round(total * 100 / 200);
    },
    cancelRequest: function cancelRequest() {
      if (this.request) this.request.cancel('File repair cancelled');
      this.resetRequest();
    },
    resetRequest: function resetRequest() {
      this.request = null;
      this.isLoading = false;
      this.uploadMessage = null;
      this.progressPercentage = null;
      this.uploadProgressPercentage = null;
      this.downloadProgressPercentage = null;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=template&id=5705fdd9":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=template&id=5705fdd9 ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "w-full bg-gray-200 rounded-full"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    "class": "bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full",
    style: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeStyle)({
      width: $props.width + '%'
    })
  }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.width) + "%", 5 /* TEXT, STYLE */)]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=template&id=0450480d":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=template&id=0450480d ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "block text-justify"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Select a previously exported "), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "font-semibold text-blue-500"
}, "Project File"), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" to begin importing the project. Note that this import process will replace your current version's screens, displays, events, settings e.t.c. After you import any Project File you must "), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "font-semibold text-green-500"
}, "Save Changes"), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" to finalize the process. This will permanently update the changes. If the JSON file imported is very large, it may take some time to save changes. ")], -1 /* HOISTED */);
var _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
})], -1 /* HOISTED */);
var _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "text-xs text-gray-400"
}, "Select the exported JSON File", -1 /* HOISTED */);
var _hoisted_4 = {
  key: 0,
  "class": "flex justify-between border rounded-md p-2 mt-2"
};
var _hoisted_5 = {
  "class": "flex"
};
var _hoisted_6 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
  "class": "mr-2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "text-blue-400 h-6 w-6",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
})])], -1 /* HOISTED */);
var _hoisted_7 = {
  "class": "text-gray-700 mb-1"
};
var _hoisted_8 = {
  "class": "text-gray-500 text-xs"
};
var _hoisted_9 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "text-gray-300 italic"
}, " — application/json", -1 /* HOISTED */);
var _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
}, null, -1 /* HOISTED */);
var _hoisted_11 = [_hoisted_10];
var _hoisted_12 = {
  key: 1
};
var _hoisted_13 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h1", {
  "class": "text-gray-700 text-xs font-semibold my-4"
}, "Properties To Import", -1 /* HOISTED */);
var _hoisted_14 = {
  "class": "grid grid-cols-2 bg-blue-50 p-4 rounded-md"
};
var _hoisted_15 = ["id", "onUpdate:modelValue"];
var _hoisted_16 = ["for"];
var _hoisted_17 = {
  "class": "grid grid-cols-12 gap-8 justify-center mb-4"
};
var _hoisted_18 = {
  "class": "col-span-8"
};
var _hoisted_19 = {
  "class": "col-span-4 flex items-center justify-end"
};
var _hoisted_20 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-3 w-3 mr-1",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
})], -1 /* HOISTED */);
var _hoisted_21 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, "Cancel", -1 /* HOISTED */);
var _hoisted_22 = [_hoisted_20, _hoisted_21];
var _hoisted_23 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "fill-rule": "evenodd",
  d: "M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z",
  "clip-rule": "evenodd"
})], -1 /* HOISTED */);
var _hoisted_24 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, "Import", -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_PrimaryAlert = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryAlert");
  var _component_DefaultButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultButton");
  var _component_el_upload = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("el-upload");
  var _component_DefaultProgressBar = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultProgressBar");
  var _component_DefaultError = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultError");
  var _component_DefaultModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Modal "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultModal, {
    onOpen: _cache[2] || (_cache[2] = function ($event) {
      return $options.reset();
    }),
    defaultText: "Cancel",
    primaryAction: $options.importFile,
    primaryText: $props.form.processing ? '' : 'Import'
  }, {
    title: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Import Version")];
    }),
    trigger: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Import Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultButton, {
        "class": "rounded-r-none"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [_hoisted_23, _hoisted_24];
        }),
        _: 1 /* STABLE */
      })];
    }),

    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryAlert, {
        "class": "mb-4"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [_hoisted_1];
        }),
        _: 1 /* STABLE */
      }), $data.progressPercentage == null ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        key: 0
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Upload File "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_el_upload, {
        action: "/",
        multiple: false,
        "auto-upload": false,
        "file-list": $data.fileList,
        "on-change": $options.beforeUpload
      }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createSlots)({
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultButton, {
            "class": "px-3 mr-2"
          }, {
            "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
              return [_hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.file ? 'Replace' : 'Select') + " File", 1 /* TEXT */)];
            }),

            _: 1 /* STABLE */
          })];
        }),

        _: 2 /* DYNAMIC */
      }, [!$data.file ? {
        name: "tip",
        fn: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [_hoisted_3];
        }),
        key: "0"
      } : undefined]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["file-list", "on-change"]), $data.file ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_4, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_5, [_hoisted_6, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", _hoisted_7, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.file.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_8, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.getFileSize($data.file.size)), 1 /* TEXT */), _hoisted_9])])]), ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", {
        onClick: _cache[0] || (_cache[0] = function ($event) {
          return $options.reset();
        }),
        xmlns: "http://www.w3.org/2000/svg",
        "class": "h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500 active:text-red-600",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        "stroke-width": "2"
      }, _hoisted_11))])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), $data.file ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_12, [_hoisted_13, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_14, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($data.properties, function (property, index) {
        return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
          key: index,
          "class": "col-span-1"
        }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("input", {
          id: 'property-checkbox-' + index,
          type: "checkbox",
          "onUpdate:modelValue": function onUpdateModelValue($event) {
            return property.checked = $event;
          },
          "class": "w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        }, null, 8 /* PROPS */, _hoisted_15), [[vue__WEBPACK_IMPORTED_MODULE_0__.vModelCheckbox, property.checked]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("label", {
          "for": 'property-checkbox-' + index
        }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(property.label), 9 /* TEXT, PROPS */, _hoisted_16)]);
      }), 128 /* KEYED_FRAGMENT */))])])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)], 64 /* STABLE_FRAGMENT */)) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        key: 1
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Uploading & Downloading Progress "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
        name: "slide-up"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_17, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_18, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Uploading & Downloading Progress Bar "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultProgressBar, {
            width: $data.progressPercentage
          }, null, 8 /* PROPS */, ["width"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_19, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
            onClick: _cache[1] || (_cache[1] = function ($event) {
              return $options.cancelRequest();
            }),
            "class": "flex items-center text-xs text-red-500 hover:text-red-600 active:text-red-700 cursor-pointer ml-8"
          }, _hoisted_22)])])];
        }),
        _: 1 /* STABLE */
      })], 64 /* STABLE_FRAGMENT */)), $data.error ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultError, {
        key: 2,
        error: $data.error,
        "class": "mt-2"
      }, null, 8 /* PROPS */, ["error"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["primaryAction", "primaryText"])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */);
}

/***/ }),

/***/ "./resources/js/Components/ProgressBar/DefaultProgressBar.vue":
/*!********************************************************************!*\
  !*** ./resources/js/Components/ProgressBar/DefaultProgressBar.vue ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DefaultProgressBar_vue_vue_type_template_id_5705fdd9__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DefaultProgressBar.vue?vue&type=template&id=5705fdd9 */ "./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=template&id=5705fdd9");
/* harmony import */ var _DefaultProgressBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DefaultProgressBar.vue?vue&type=script&lang=js */ "./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_DefaultProgressBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_DefaultProgressBar_vue_vue_type_template_id_5705fdd9__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Components/ProgressBar/DefaultProgressBar.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue":
/*!**********************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ImportVersionModal_vue_vue_type_template_id_0450480d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImportVersionModal.vue?vue&type=template&id=0450480d */ "./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=template&id=0450480d");
/* harmony import */ var _ImportVersionModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImportVersionModal.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_ImportVersionModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_ImportVersionModal_vue_vue_type_template_id_0450480d__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=script&lang=js":
/*!********************************************************************************************!*\
  !*** ./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=script&lang=js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DefaultProgressBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DefaultProgressBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DefaultProgressBar.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ImportVersionModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ImportVersionModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./ImportVersionModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=template&id=5705fdd9":
/*!**************************************************************************************************!*\
  !*** ./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=template&id=5705fdd9 ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DefaultProgressBar_vue_vue_type_template_id_5705fdd9__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DefaultProgressBar_vue_vue_type_template_id_5705fdd9__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DefaultProgressBar.vue?vue&type=template&id=5705fdd9 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Components/ProgressBar/DefaultProgressBar.vue?vue&type=template&id=5705fdd9");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=template&id=0450480d":
/*!****************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=template&id=0450480d ***!
  \****************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ImportVersionModal_vue_vue_type_template_id_0450480d__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ImportVersionModal_vue_vue_type_template_id_0450480d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./ImportVersionModal.vue?vue&type=template&id=0450480d */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue?vue&type=template&id=0450480d");


/***/ })

}]);