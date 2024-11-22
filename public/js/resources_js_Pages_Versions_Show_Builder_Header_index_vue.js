"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Versions_Show_Builder_Header_index_vue"],{

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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_Button_DefaultButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Button/DefaultButton */ "./resources/js/Components/Button/DefaultButton.vue");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['disabled'],
  components: {
    DefaultButton: _components_Button_DefaultButton__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  methods: {
    showApp: function showApp() {
      this.$inertia.get(route('app.show.with.versions', {
        project: this.route().params.project,
        app: this.route().params.app
      }));
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Alert/PrimaryAlert */ "./resources/js/Components/Alert/PrimaryAlert.vue");
/* harmony import */ var _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Modal/DefaultModal */ "./resources/js/Components/Modal/DefaultModal.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Button_DefaultButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Button/DefaultButton */ "./resources/js/Components/Button/DefaultButton.vue");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['form'],
  components: {
    PrimaryAlert: _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_0__["default"],
    DefaultModal: _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_1__["default"],
    DefaultButton: _components_Button_DefaultButton__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__.useVersionBuilder)(),
      project: this.$page.props.projectPayload,
      version: this.$page.props.versionPayload,
      app: this.$page.props.appPayload
    };
  },
  methods: {
    exportFile: function exportFile(closeModal) {
      /** Download builder automatically
       *
       *  This approach has the following advantages over other proposed ones:
       *  - No HTML element needs to be clicked
       *  - Result will be named as you want it
       *  - No jQuery needed
       *
       *  Reference: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
       */
      var name = this.app.name + ' - version ' + this.version.number;
      var json = this.useVersionBuilder.builder;
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", name + ".json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      this.$message({
        message: 'Exporting your project file',
        type: 'success'
      });
      closeModal();
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
            //  Get the Json File
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Alert/PrimaryAlert */ "./resources/js/Components/Alert/PrimaryAlert.vue");
/* harmony import */ var _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Modal/DefaultModal */ "./resources/js/Components/Modal/DefaultModal.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Button_WarningButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Button/WarningButton */ "./resources/js/Components/Button/WarningButton.vue");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['form'],
  components: {
    PrimaryAlert: _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_0__["default"],
    DefaultModal: _components_Modal_DefaultModal__WEBPACK_IMPORTED_MODULE_1__["default"],
    WarningButton: _components_Button_WarningButton__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_2__.useVersionBuilder)(),
      project: this.$page.props.projectPayload,
      version: this.$page.props.versionPayload,
      app: this.$page.props.appPayload
    };
  },
  computed: {
    name: function name() {
      return this.app.name + ' - version ' + this.version.number;
    }
  },
  methods: {
    undoChanges: function undoChanges(closeModal) {
      this.useVersionBuilder.setOriginalBuilder();
      this.$message({
        message: 'Changes reversed',
        type: 'success'
      });
      closeModal();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");
/* harmony import */ var _BackButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BackButton */ "./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue");
/* harmony import */ var _inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @inertiajs/vue3 */ "./node_modules/@inertiajs/vue3/dist/index.esm.js");
/* harmony import */ var _components_Error_DefaultError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Error/DefaultError */ "./resources/js/Components/Error/DefaultError.vue");
/* harmony import */ var _components_Alert_WarningAlert__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Alert/WarningAlert */ "./resources/js/Components/Alert/WarningAlert.vue");
/* harmony import */ var _components_Badges_WarningBadge__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @components/Badges/WarningBadge */ "./resources/js/Components/Badges/WarningBadge.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");
/* harmony import */ var _components_Button_DefaultButton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @components/Button/DefaultButton */ "./resources/js/Components/Button/DefaultButton.vue");
/* harmony import */ var _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @components/Button/PrimaryButton */ "./resources/js/Components/Button/PrimaryButton.vue");
/* harmony import */ var _UndoChanges_UndoChangesModal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./UndoChanges/UndoChangesModal */ "./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue");
/* harmony import */ var _ImportVersion_ImportVersionModal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ImportVersion/ImportVersionModal */ "./resources/js/Pages/Versions/Show/Builder/Header/ImportVersion/ImportVersionModal.vue");
/* harmony import */ var _ExportVersion_ExportVersionModal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ExportVersion/ExportVersionModal */ "./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue");
/* harmony import */ var _components_ProgressBar_DefaultProgressBar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @components/ProgressBar/DefaultProgressBar */ "./resources/js/Components/ProgressBar/DefaultProgressBar.vue");













/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    showEditor: Boolean
  },
  components: {
    BackButton: _BackButton__WEBPACK_IMPORTED_MODULE_0__["default"],
    DefaultError: _components_Error_DefaultError__WEBPACK_IMPORTED_MODULE_2__["default"],
    WarningAlert: _components_Alert_WarningAlert__WEBPACK_IMPORTED_MODULE_3__["default"],
    WarningBadge: _components_Badges_WarningBadge__WEBPACK_IMPORTED_MODULE_4__["default"],
    DefaultButton: _components_Button_DefaultButton__WEBPACK_IMPORTED_MODULE_6__["default"],
    PrimaryButton: _components_Button_PrimaryButton__WEBPACK_IMPORTED_MODULE_7__["default"],
    UndoChangesModal: _UndoChanges_UndoChangesModal__WEBPACK_IMPORTED_MODULE_8__["default"],
    ImportVersionModal: _ImportVersion_ImportVersionModal__WEBPACK_IMPORTED_MODULE_9__["default"],
    ExportVersionModal: _ExportVersion_ExportVersionModal__WEBPACK_IMPORTED_MODULE_10__["default"],
    DefaultProgressBar: _components_ProgressBar_DefaultProgressBar__WEBPACK_IMPORTED_MODULE_11__["default"]
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_5__.useVersionBuilder)(),
      project: this.$page.props.projectPayload,
      version: this.$page.props.versionPayload,
      app: this.$page.props.appPayload,
      downloadInSecondsInterval: null,
      stillLoadingConversation: null,
      progressPercentage: null,
      downloadInSeconds: 0,
      isDownloading: false,
      startingConvo: null,
      form: (0,_inertiajs_vue3__WEBPACK_IMPORTED_MODULE_1__.useForm)({}),
      isSaving: false,
      request: null
    };
  },
  watch: {
    // Watch the builder state and store it in localStorage on changes
    'useVersionBuilder.builder': {
      handler: function handler(newBuilder, oldBuilder) {
        // Only run if the oldBuilder is not an empty object
        if (!_.isEmpty(oldBuilder)) {
          // Update localStorage
          this.useVersionBuilder.setUnsavedBuilderOnLocalStorage(newBuilder);
        }
      },
      deep: true
    }
  },
  computed: {
    error: function error() {
      return this.form.errors.number || this.form.errors.description || this.form.errors.builder || this.form.errors.reset_builder || this.form.errors.confirmation_code;
    }
  },
  methods: {
    getStillLoadingConversations: function getStillLoadingConversations() {
      return [this.isSaving ? 'Saving changes ...' : 'Downloading app...', '🙂 Take a break for now', '🕑 This may take some time', '☕ Did you have a cup of coffee?', '🥇 Big projects take time to ' + (this.isSaving ? 'save' : 'download'), '😎 Just be patient in the meantime', '👌 This is all part of the process', '🥪 Did you get something to eat?', '🚶 This is a good time to relax', '👊 Still saving, don\'t worry', '👊 Still ' + (this.isSaving ? 'saving' : 'downloading') + ', don\'t worry', '👀 I know, just one moment please', '🥂C We are almost there'];
    },
    startConvo: function startConvo() {
      var _this = this;
      var startIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var stillLoadingConversations = this.getStillLoadingConversations();
      this.stillLoadingConversation = stillLoadingConversations[startIndex];
      var totalConversations = stillLoadingConversations.length;
      var nextIndex = startIndex == totalConversations - 1 ? 0 : startIndex + 1;
      this.startingConvo = setTimeout(function () {
        return _this.startConvo(nextIndex);
      }, 10000);
    },
    stopConvo: function stopConvo() {
      clearInterval(this.startingConvo);
    },
    updateVersion: function updateVersion() {
      var _this2 = this;
      //  Indicate that the builder has not been saved
      this.useVersionBuilder.hasSavedBuilder = false;
      this.isSaving = true;

      //  Start the conversation
      this.startConvo();

      /**
       *  Attempt to update version
       *
       *  Note that we use "post" instead of "put" when saving. This is because we want to make use
       *  of the "multipart/form-data" which is useful for tracking the upload progress. However
       *  the "multipart/form-data" does not support the put, patch or delete methods. We need
       *  to use "post" method while appending the "{ _method: 'put' }" parameters as part of
       *  the "form" data to allowing saving data while also enabling the upload progress
       *  tracker.
       */
      var formData = new FormData();
      formData.append('_method', 'put');
      formData.append('builder', JSON.stringify(this.useVersionBuilder.builder));
      var url = route('version.update', {
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
      var axiosSource = axios__WEBPACK_IMPORTED_MODULE_12__["default"].CancelToken.source();
      this.request = {
        cancel: axiosSource.cancel
      };
      var config = {
        //  Upload Progress
        onUploadProgress: function onUploadProgress(event) {
          _this2.progressPercentage = Math.round(event.loaded * 100 / event.total);
        },
        cancelToken: axiosSource.token
      };
      var self = this;
      axios__WEBPACK_IMPORTED_MODULE_12__["default"].post(url, formData, config).then(function (response) {
        self.$message({
          message: 'Changes saved successfully',
          type: 'success'
        });

        //  Remove builder from local storage (Changes have been saved)
        _this2.useVersionBuilder.removeUnsavedBuilderFromLocalStorage();

        //  Turn off indication that the builder has been imported
        _this2.useVersionBuilder.hasImportedBuilder = false;
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
    downloadVersion: function downloadVersion() {
      var _this3 = this;
      this.isDownloading = true;

      //  Start the conversation
      this.startConvo();
      var url = route('version.show', {
        project: this.route().params.project,
        app: this.route().params.app,
        version: this.route().params.version
      });
      var config = {
        //  Dowload Progress
        onDownloadProgress: function onDownloadProgress(event) {
          _this3.progressPercentage = Math.round(event.loaded * 100 / event.total);
        }
      };
      this.downloadInSecondsInterval = setInterval(function () {
        ++_this3.downloadInSeconds;
      }, 1000);
      var self = this;
      axios__WEBPACK_IMPORTED_MODULE_12__["default"].get(url, config).then(function (response) {
        //  If the download took 5 seconds or longer, notify the user on the download success
        if (self.downloadInSeconds >= 5) {
          self.$message({
            message: 'Download successful',
            type: 'success'
          });
        }
        var builder = response.data;

        //  Store the version builder as the stored state builder
        _this3.useVersionBuilder.setBuilder(builder);

        //  Select a screen by default
        _this3.useVersionBuilder.selectRecomendedScreen();
      })["catch"](function (error) {
        var _message2;
        self.$message({
          message: (_message2 = (error || {}).message) !== null && _message2 !== void 0 ? _message2 : 'Sorry, something went wrong',
          type: 'warning'
        });
      })["finally"](function () {
        _this3.resetRequest();
      });
    },
    cancelRequest: function cancelRequest() {
      if (this.request) this.request.cancel('Saving cancelled');
      this.useVersionBuilder.selectRecomendedScreen();
      this.resetRequest();
    },
    resetRequest: function resetRequest() {
      this.stopConvo();
      this.request = null;
      this.isSaving = false;
      this.isDownloading = false;
      this.downloadInSeconds = 0;
      this.progressPercentage = null;
      clearInterval(this.downloadInSecondsInterval);

      //  Indicate that the builder has been saved
      this.useVersionBuilder.hasSavedBuilder = true;

      //  Indicate that the builder has been downloaded
      this.useVersionBuilder.hasDownloadedBuilder = true;
    }
  },
  unmounted: function unmounted() {
    //  Stop the conversation
    this.stopConvo();
  },
  created: function created() {
    this.useVersionBuilder.project = this.project;
    this.useVersionBuilder.version = this.version;
    this.useVersionBuilder.app = this.app;
    this.downloadVersion();
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=template&id=8b2e08e0":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=template&id=8b2e08e0 ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 16l-4-4m0 0l4-4m-4 4h18"
})], -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_DefaultButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultButton");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultButton, {
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return $options.showApp();
    }),
    disabled: $props.disabled
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_1, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "default", {}, function () {
        return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Back")];
      })];
    }),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["disabled"])]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=template&id=0f1f45eb":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=template&id=0f1f45eb ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "block text-justify"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Exporting your "), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "font-semibold text-blue-500"
}, "Project File"), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" will download a JSON File that can be imported into a different project ")], -1 /* HOISTED */);
var _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "fill-rule": "evenodd",
  d: "M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z",
  "clip-rule": "evenodd"
})], -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_PrimaryAlert = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryAlert");
  var _component_DefaultButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultButton");
  var _component_DefaultModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Modal "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultModal, {
    defaultText: "Cancel",
    primaryAction: $options.exportFile,
    primaryText: $props.form.processing ? '' : 'Export File'
  }, {
    title: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Export Version")];
    }),
    trigger: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Import Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultButton, {
        "class": "rounded-l-none"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [_hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Export ")];
        }),
        _: 1 /* STABLE */
      })];
    }),

    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryAlert, null, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [_hoisted_1];
        }),
        _: 1 /* STABLE */
      })];
    }),

    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["primaryAction", "primaryText"])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */);
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=template&id=77b9b816":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=template&id=77b9b816 ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "block text-justify"
};
var _hoisted_2 = {
  "class": "font-semibold text-blue-500"
};
var _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2",
  fill: "none",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  stroke: "currentColor"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "m15 15-6 6m0 0-6-6m6 6V9a6 6 0 0 1 12 0v3"
})], -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_PrimaryAlert = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryAlert");
  var _component_WarningButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("WarningButton");
  var _component_DefaultModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultModal");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Modal "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultModal, {
    defaultText: "Cancel",
    warningAction: $options.undoChanges,
    warningText: $props.form.processing ? '' : 'Undo Changes'
  }, {
    title: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Undo Changes")];
    }),
    trigger: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Undo Changes Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_WarningButton, null, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [_hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Undo Changes ")];
        }),
        _: 1 /* STABLE */
      })];
    }),

    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryAlert, null, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" We have detected some changes that have not yet been saved for "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(". If you would like to revert back to the previous state, then you may undo these unsaved changes. Please note that this action cannot be undone and all unsaved changes will be lost once completed. ")])];
        }),
        _: 1 /* STABLE */
      })];
    }),

    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["warningAction", "warningText"])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=template&id=c6ae5eaa":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=template&id=c6ae5eaa ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" This builder has not been saved. Please "), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "font-semibold text-blue-500"
}, "Save Changes"), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" so that the simulator can reflect the imported changes. Then again you could refresh the browser to omit the imported changes. ")], -1 /* HOISTED */);
var _hoisted_2 = {
  "class": "flex justify-between mb-4"
};
var _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
})], -1 /* HOISTED */);
var _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-2",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
})], -1 /* HOISTED */);
var _hoisted_5 = {
  "class": "flex"
};
var _hoisted_6 = {
  key: 0,
  "class": "flex items-center mr-8"
};
var _hoisted_7 = {
  "class": "flex items-center space-x-2"
};
var _hoisted_8 = {
  key: 0
};
var _hoisted_9 = {
  key: 0,
  "class": "grid grid-cols-12 gap-8 justify-center mb-4"
};
var _hoisted_10 = {
  "class": "col-span-8"
};
var _hoisted_11 = {
  "class": "col-span-4 flex items-center justify-between"
};
var _hoisted_12 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
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
var _hoisted_13 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, "Cancel", -1 /* HOISTED */);
var _hoisted_14 = [_hoisted_12, _hoisted_13];
var _hoisted_15 = {
  key: 0,
  "class": "grid grid-cols-12 gap-8 justify-center mb-4"
};
var _hoisted_16 = {
  "class": "col-span-9"
};
var _hoisted_17 = {
  "class": "col-span-3 flex items-center justify-end"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_WarningAlert = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("WarningAlert");
  var _component_BackButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("BackButton");
  var _component_ImportVersionModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("ImportVersionModal");
  var _component_ExportVersionModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("ExportVersionModal");
  var _component_UndoChangesModal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("UndoChangesModal");
  var _component_PrimaryButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryButton");
  var _component_DefaultProgressBar = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultProgressBar");
  var _component_DefaultError = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultError");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Action Explainer "), $data.useVersionBuilder.hasImportedBuilder || $data.useVersionBuilder.hasUnsavedBuilderFromLocalStorage ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_WarningAlert, {
    key: 0,
    "class": "w-1/2 mb-6"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_1];
    }),
    _: 1 /* STABLE */
  })) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Back Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_BackButton, {
    disabled: $data.isSaving || $data.isDownloading
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Versions")];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["disabled"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Editor Button "), ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)((0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent)($props.showEditor == true ? 'PrimaryButton' : 'DefaultButton'), {
    "class": "rounded-r-none px-8",
    disabled: $data.isSaving || $data.isDownloading,
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return _ctx.$emit('showEditorState', true);
    })
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Editor ")];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["disabled"])), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Simulator Button "), ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)((0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent)($props.showEditor == false ? 'PrimaryButton' : 'DefaultButton'), {
    "class": "rounded-l-none px-8",
    disabled: $data.isSaving || $data.isDownloading,
    onClick: _cache[1] || (_cache[1] = function ($event) {
      return _ctx.$emit('showEditorState', false);
    })
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_hoisted_4, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Simulator ")];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["disabled"]))]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_5, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "fade"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [!$data.isSaving && !$data.isDownloading ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_6, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Import Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_ImportVersionModal, {
        form: $data.form
      }, null, 8 /* PROPS */, ["form"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Export Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_ExportVersionModal, {
        form: $data.form
      }, null, 8 /* PROPS */, ["form"])])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_7, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Undo Changes Button "), $data.useVersionBuilder.hasUnsavedBuilderFromLocalStorage ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_8, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_UndoChangesModal, {
    form: $data.form
  }, null, 8 /* PROPS */, ["form"])])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Save Changes Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryButton, {
    disabled: $data.isSaving || $data.isDownloading,
    onClick: _cache[2] || (_cache[2] = function ($event) {
      return $options.updateVersion();
    })
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Save Changes")];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["disabled"])])])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Saving Progress "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "fade"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$data.isSaving == true && $data.progressPercentage !== null ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_9, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_10, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Saving Progress Bar "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultProgressBar, {
        width: $data.progressPercentage
      }, null, 8 /* PROPS */, ["width"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_11, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Saving Conversation "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
        name: "fade",
        mode: "out-in",
        appear: ""
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [$data.stillLoadingConversation ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", {
            key: $data.stillLoadingConversation,
            "class": "text-gray-400 text-xs"
          }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.stillLoadingConversation), 1 /* TEXT */)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
        }),
        _: 1 /* STABLE */
      }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
        onClick: _cache[3] || (_cache[3] = function ($event) {
          return $options.cancelRequest();
        }),
        "class": "flex items-center text-xs text-red-500 hover:text-red-600 active:text-red-700 cursor-pointer ml-8"
      }, _hoisted_14)])])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Downloading Progress "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
    name: "slide-up"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$data.isDownloading == true && $data.downloadInSeconds >= 1 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_15, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_16, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Downloading Progress Bar "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultProgressBar, {
        width: $data.progressPercentage
      }, null, 8 /* PROPS */, ["width"])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_17, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Downloading Conversation "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(vue__WEBPACK_IMPORTED_MODULE_0__.Transition, {
        name: "slide-up",
        mode: "out-in",
        appear: ""
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [$data.stillLoadingConversation ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", {
            key: $data.stillLoadingConversation,
            "class": "text-gray-400 text-xs"
          }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.stillLoadingConversation), 1 /* TEXT */)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
        }),
        _: 1 /* STABLE */
      })])])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Saving Error "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultError, {
    error: $options.error,
    "class": "my-4"
  }, null, 8 /* PROPS */, ["error"])]);
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

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue":
/*!************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BackButton_vue_vue_type_template_id_8b2e08e0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BackButton.vue?vue&type=template&id=8b2e08e0 */ "./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=template&id=8b2e08e0");
/* harmony import */ var _BackButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BackButton.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_BackButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_BackButton_vue_vue_type_template_id_8b2e08e0__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue":
/*!**********************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ExportVersionModal_vue_vue_type_template_id_0f1f45eb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExportVersionModal.vue?vue&type=template&id=0f1f45eb */ "./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=template&id=0f1f45eb");
/* harmony import */ var _ExportVersionModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ExportVersionModal.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_ExportVersionModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_ExportVersionModal_vue_vue_type_template_id_0f1f45eb__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue"]])
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

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue":
/*!******************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _UndoChangesModal_vue_vue_type_template_id_77b9b816__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UndoChangesModal.vue?vue&type=template&id=77b9b816 */ "./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=template&id=77b9b816");
/* harmony import */ var _UndoChangesModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UndoChangesModal.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_UndoChangesModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_UndoChangesModal_vue_vue_type_template_id_77b9b816__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/index.vue":
/*!*******************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/index.vue ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_c6ae5eaa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=c6ae5eaa */ "./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=template&id=c6ae5eaa");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_c6ae5eaa__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Header/index.vue"]])
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

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=script&lang=js":
/*!************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=script&lang=js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_BackButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_BackButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./BackButton.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ExportVersionModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ExportVersionModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./ExportVersionModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=script&lang=js");
 

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

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UndoChangesModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UndoChangesModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./UndoChangesModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=script&lang=js":
/*!*******************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=script&lang=js");
 

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

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=template&id=8b2e08e0":
/*!******************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=template&id=8b2e08e0 ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_BackButton_vue_vue_type_template_id_8b2e08e0__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_BackButton_vue_vue_type_template_id_8b2e08e0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./BackButton.vue?vue&type=template&id=8b2e08e0 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/BackButton.vue?vue&type=template&id=8b2e08e0");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=template&id=0f1f45eb":
/*!****************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=template&id=0f1f45eb ***!
  \****************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ExportVersionModal_vue_vue_type_template_id_0f1f45eb__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ExportVersionModal_vue_vue_type_template_id_0f1f45eb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./ExportVersionModal.vue?vue&type=template&id=0f1f45eb */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/ExportVersion/ExportVersionModal.vue?vue&type=template&id=0f1f45eb");


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


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=template&id=77b9b816":
/*!************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=template&id=77b9b816 ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UndoChangesModal_vue_vue_type_template_id_77b9b816__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UndoChangesModal_vue_vue_type_template_id_77b9b816__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./UndoChangesModal.vue?vue&type=template&id=77b9b816 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/UndoChanges/UndoChangesModal.vue?vue&type=template&id=77b9b816");


/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=template&id=c6ae5eaa":
/*!*************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=template&id=c6ae5eaa ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_c6ae5eaa__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_c6ae5eaa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=c6ae5eaa */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Header/index.vue?vue&type=template&id=c6ae5eaa");


/***/ })

}]);