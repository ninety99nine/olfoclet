"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Reports_List_index_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    var _this$route$params$pr, _this$route$params$ve, _this$route$params$ap;
    return {
      selectedProject: (_this$route$params$pr = this.route().params.project) !== null && _this$route$params$pr !== void 0 ? _this$route$params$pr : 'any',
      selectedVersion: (_this$route$params$ve = this.route().params.version) !== null && _this$route$params$ve !== void 0 ? _this$route$params$ve : 'any',
      selectedApp: (_this$route$params$ap = this.route().params.app) !== null && _this$route$params$ap !== void 0 ? _this$route$params$ap : 'any',
      projectOptions: [],
      versionOptions: [],
      appOptions: []
    };
  },
  methods: {
    setProjectOptions: function setProjectOptions() {
      this.projectOptions = this.$page.props.projectOptions ? [{
        label: 'Any',
        value: 'any'
      }].concat(_toConsumableArray(this.$page.props.projectOptions.map(function (option) {
        return {
          label: option.name,
          value: option.id
        };
      }))) : [];
    },
    setAppOptions: function setAppOptions() {
      var _this = this;
      var options = [{
        label: 'Any',
        value: 'any'
      }];

      //  If the project options exist
      if ((this.$page.props.projectOptions || []).length) {
        //  Check if a project has been selected
        if (this.selectedProject !== 'any') {
          //  Get the selected project
          var project = this.$page.props.projectOptions.find(function (option) {
            return option.id == _this.selectedProject;
          });

          //  Get the selected project app options
          project.apps.forEach(function (option) {
            options.push({
              label: option.name,
              value: option.id
            });
          });
        }
      } else if ((this.$page.props.appOptions || []).length) {
        //  Get the route provided options
        this.$page.props.appOptions.forEach(function (option) {
          options.push({
            label: option.name,
            value: option.id
          });
        });
      }
      this.appOptions = options;
    },
    setVersionOptions: function setVersionOptions() {
      var _this2 = this;
      var options = [{
        label: 'Any',
        value: 'any'
      }];

      //  If the project options exist
      if ((this.$page.props.projectOptions || []).length) {
        //  Check if a project has been selected
        if (this.selectedProject !== 'any') {
          //  Get the selected project
          var project = this.$page.props.projectOptions.find(function (option) {
            return option.id == _this2.selectedProject;
          });

          //  If the app options exist
          if (project.apps.length) {
            //  Check if an app has been selected
            if (this.selectedApp !== 'any') {
              //  Get the selected app
              var app = project.apps.find(function (option) {
                return option.id == _this2.selectedApp;
              });

              //  Get the selected project app options
              app.versions.forEach(function (option) {
                options.push({
                  label: option.number,
                  value: option.id
                });
              });
            }
          }
        }

        //  If the app options exist
      } else if ((this.$page.props.appOptions || []).length) {
        //  Check if an app has been selected
        if (this.selectedApp !== 'any') {
          //  Get the selected app
          var _app = this.$page.props.appOptions.find(function (option) {
            return option.id == _this2.selectedApp;
          });

          //  Get the selected project app options
          _app.versions.forEach(function (option) {
            options.push({
              label: option.number,
              value: option.id
            });
          });
        }

        //  If the version options exist
      } else if ((this.$page.props.versionOptions || []).length) {
        //  Get the version options
        this.$page.props.versionOptions.forEach(function (option) {
          options.push({
            label: option.number,
            value: option.id
          });
        });
      } else {
        return [];
      }
      this.versionOptions = options;
    },
    onSelectProjectOption: function onSelectProjectOption() {
      this.selectedApp = 'any';
      this.selectedVersion = 'any';
      this.setAppOptions();
      this.refreshContent();
    },
    onSelectAppOption: function onSelectAppOption() {
      this.selectedVersion = 'any';
      this.setVersionOptions();
      this.refreshContent();
    }
  },
  created: function created() {
    this.setProjectOptions();
    this.setVersionOptions();
    this.setAppOptions();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/BackButton.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/BackButton.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************/
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
    showVersions: function showVersions() {
      this.$inertia.get(route('app.show.with.versions', {
        project: this.route().params.project,
        app: this.route().params.app
      }));
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue3_highcharts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue3-highcharts */ "./node_modules/vue3-highcharts/dist/vue3-highcharts.common.js");
/* harmony import */ var vue3_highcharts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue3_highcharts__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['report', 'showComparisons'],
  components: {
    VueHighcharts: (vue3_highcharts__WEBPACK_IMPORTED_MODULE_0___default())
  },
  data: function data() {
    return {};
  },
  computed: {
    chartOptions: function chartOptions() {
      var series = [{
        name: this.report.series_name,
        data: this.report.series_data['x-axis'],
        color: this.report.hasOwnProperty('series_color') ? this.report.series_color : '#3f83f8'
      }];
      if (this.showComparisons && this.report.hasOwnProperty('comparison_series_data')) {
        series.unshift({
          name: this.report.comparison_series_name,
          data: this.report.comparison_series_data['x-axis'],
          color: this.report.hasOwnProperty('comparison_series_color') ? this.report.comparison_series_color : '#9ca3af'
        });
      }
      var title = this.report.hasOwnProperty('title') ? this.report.title : '';
      var subtitle = this.report.hasOwnProperty('subtitle') ? this.report.subtitle : '';
      return {
        chart: {
          type: this.report.chart
        },
        title: {
          text: title,
          style: {
            color: '#3f83f8',
            fontSize: '1rem'
            //  fontWeight: 'bold',
          }
        },

        subtitle: {
          text: subtitle,
          style: {
            color: '#6b7280'
          }
        },
        series: series,
        xAxis: {
          categories: this.report.series_data['y-axis']
        },
        yAxis: {
          title: {
            text: 'Total'
          },
          allowDecimals: false
        },
        plotOptions: {
          series: {
            marker: {
              radius: 2
            }
          }
        }
      };
    }
  },
  methods: {
    onRender: function onRender() {
      console.log('Chart rendered');
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/index.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/index.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");
/* harmony import */ var _BackButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BackButton */ "./resources/js/Pages/Reports/List/BackButton.vue");
/* harmony import */ var _Charts_HighChart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Charts/HighChart */ "./resources/js/Pages/Reports/List/Charts/HighChart.vue");
/* harmony import */ var vue3_slide_up_down__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue3-slide-up-down */ "./node_modules/vue3-slide-up-down/dist/vue3-slide-up-down.es.js");
/* harmony import */ var _inertiajs_vue3__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @inertiajs/vue3 */ "./node_modules/@inertiajs/vue3/dist/index.esm.js");
/* harmony import */ var _mixins_ModelFilterMixin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mixins/ModelFilterMixin */ "./resources/js/Mixins/ModelFilterMixin.vue");
/* harmony import */ var _components_Popover_InfoPopover__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @components/Popover/InfoPopover */ "./resources/js/Components/Popover/InfoPopover.vue");
/* harmony import */ var _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @components/Alert/PrimaryAlert */ "./resources/js/Components/Alert/PrimaryAlert.vue");
/* harmony import */ var _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @components/Select/DefaultSelect */ "./resources/js/Components/Select/DefaultSelect.vue");
/* harmony import */ var _components_Switch_DefaultSwitch__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @components/Switch/DefaultSwitch */ "./resources/js/Components/Switch/DefaultSwitch.vue");










/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  mixins: [_mixins_ModelFilterMixin__WEBPACK_IMPORTED_MODULE_4__["default"]],
  components: {
    Head: _inertiajs_vue3__WEBPACK_IMPORTED_MODULE_3__.Head,
    HighChart: _Charts_HighChart__WEBPACK_IMPORTED_MODULE_1__["default"],
    SlideUpDown: vue3_slide_up_down__WEBPACK_IMPORTED_MODULE_2__["default"],
    BackButton: _BackButton__WEBPACK_IMPORTED_MODULE_0__["default"],
    PrimaryAlert: _components_Alert_PrimaryAlert__WEBPACK_IMPORTED_MODULE_6__["default"],
    InfoPopover: _components_Popover_InfoPopover__WEBPACK_IMPORTED_MODULE_5__["default"],
    DefaultSelect: _components_Select_DefaultSelect__WEBPACK_IMPORTED_MODULE_7__["default"],
    DefaultSwitch: _components_Switch_DefaultSwitch__WEBPACK_IMPORTED_MODULE_8__["default"]
  },
  data: function data() {
    return {
      dateType: 'Today',
      dateTypes: [{
        label: 'Today'
      }, {
        label: 'Yesterday'
      }, {
        label: 'This Week'
      }, {
        label: 'This Month'
      }, {
        label: 'This Year'
      }, {
        label: 'Last 7 days'
      }, {
        label: 'Last 14 days'
      }, {
        label: 'Last 30 days'
      }, {
        label: 'Last 60 days'
      }, {
        label: 'Last 90 days'
      }, {
        label: 'Last Week'
      }, {
        label: 'Last Month'
      }, {
        label: 'Last Year'
      }, {
        label: '2 years ago'
      }, {
        label: '3 years ago'
      }, {
        label: 'Custom'
      }],
      chartStats: [],
      overviewStats: [],
      expandOverview: true,
      showComparisons: true,
      appPayload: this.$page.props.appPayload,
      versionPayload: this.$page.props.versionPayload,
      reportPayload: this.$page.props.reportPayload,
      request: null
    };
  },
  computed: {
    dateRangeText: function dateRangeText() {
      return this.reportPayload.aboutReport.date_range_text;
    },
    dateRangeComparisonText: function dateRangeComparisonText() {
      return this.reportPayload.aboutReport.date_range_comparison_text;
    }
  },
  methods: {
    setChartStats: function setChartStats() {
      this.chartStats = this.reportPayload.accountReport.charts;
    },
    setOverviewStats: function setOverviewStats() {
      if (this.expandOverview) {
        this.overviewStats = this.reportPayload.accountReport.overview;
      } else {
        this.overviewStats = this.reportPayload.accountReport.overview.slice(0, 4);
      }
    },
    toggleExpandOverview: function toggleExpandOverview() {
      this.expandOverview = !this.expandOverview;
      this.setOverviewStats();
    },
    refreshContent: function refreshContent() {
      var _this = this;
      var canCancel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      //  If we can't cancel the previous request that has not eneded, then deny refreshing of content
      if (canCancel == false && this.request) return;

      //  If we can cancel the previous
      if (canCancel == true) {
        //  If the request is cancellable, cancel the previous request
        if (this.request) this.request.cancel();

        //  Start loader
        this.$emit('isLoading', true);
      }

      /**
       *  Generate the axios cancel token to allow this request
       *  to be cancelled if this action is required
       *
       *  Reference: https://stackoverflow.com/questions/50516438/cancel-previous-request-using-axios-with-vue-js
       */
      var axiosSource = axios__WEBPACK_IMPORTED_MODULE_9__["default"].CancelToken.source();
      this.request = {
        cancel: axiosSource.cancel
      };
      var config = {
        cancelToken: axiosSource.token
      };
      var url;
      if (this.selectedProject !== 'any' && this.selectedApp !== 'any' && this.selectedVersion !== 'any') {
        var _this$route$params$pa;
        //  /projects/1/apps/1/versions/1/reports
        url = route('version.reports.show', {
          project: this.selectedProject,
          version: this.selectedVersion,
          app: this.selectedApp,
          //  Query params
          page: (_this$route$params$pa = this.route().params.page) !== null && _this$route$params$pa !== void 0 ? _this$route$params$pa : 1,
          date_type: this.dateType
        });
      } else if (this.selectedProject !== 'any' && this.selectedApp !== 'any') {
        var _this$route$params$pa2;
        //  /projects/1/apps/1/reports
        url = route('app.reports.show', {
          project: this.selectedProject,
          app: this.selectedApp,
          //  Query params
          page: (_this$route$params$pa2 = this.route().params.page) !== null && _this$route$params$pa2 !== void 0 ? _this$route$params$pa2 : 1,
          date_type: this.dateType
        });
      } else if (this.selectedProject !== 'any') {
        var _this$route$params$pa3;
        //  /projects/1/reports
        url = route('project.reports.show', {
          project: this.selectedProject,
          //  Query params
          page: (_this$route$params$pa3 = this.route().params.page) !== null && _this$route$params$pa3 !== void 0 ? _this$route$params$pa3 : 1,
          date_type: this.dateType
        });
      } else {
        var _this$route$params$pa4;
        //  /reports
        url = route('reports.show', {
          //  Query params
          page: (_this$route$params$pa4 = this.route().params.page) !== null && _this$route$params$pa4 !== void 0 ? _this$route$params$pa4 : 1,
          date_type: this.dateType
        });
      }
      axios__WEBPACK_IMPORTED_MODULE_9__["default"].get(url, config).then(function (response) {
        _this.reportPayload = response.data.reportPayload;
        _this.setChartStats();
        _this.setOverviewStats();
        _this.$emit('response', response.data);

        //  Stop loader
        _this.$emit('isLoading', false);

        //  Set the request to null to grant refreshing of content
        _this.request = null;
      });
    }
  },
  created: function created() {
    this.setChartStats();
    this.setOverviewStats();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/BackButton.vue?vue&type=template&id=a7d61bbe":
/*!****************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/BackButton.vue?vue&type=template&id=a7d61bbe ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************/
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
    "class": "mb-4",
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return $options.showVersions();
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=template&id=a2c966ac":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=template&id=a2c966ac ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_vue_highcharts = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("vue-highcharts");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_vue_highcharts, {
    type: "chart",
    options: $options.chartOptions,
    redrawOnUpdate: true,
    oneToOneUpdate: false,
    animateOnUpdate: true,
    onRendered: $options.onRender
  }, null, 8 /* PROPS */, ["options", "onRendered"])]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/index.vue?vue&type=template&id=006f437a":
/*!***********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/index.vue?vue&type=template&id=006f437a ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "pt-8 px-16 mt-4 pb-52"
};
var _hoisted_2 = {
  "class": "flex justify-between"
};
var _hoisted_3 = {
  "class": "flex justify-between items-center my-4"
};
var _hoisted_4 = {
  "class": "flex space-x-2 bg-white text-xs text-gray-500 rounded-t-md border-b py-6 px-8 -mb-4"
};
var _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 text-blue-400",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
})], -1 /* HOISTED */);
var _hoisted_6 = {
  key: 0
};
var _hoisted_7 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
  "class": "border-l border-gray-300"
}, null, -1 /* HOISTED */);
var _hoisted_8 = {
  key: 1
};
var _hoisted_9 = {
  "class": "flex space-x-8"
};
var _hoisted_10 = {
  "class": /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['bg-white rounded-tr-md rounded-b-md shadow-md p-8 mb-4 relative overflow-hidden transition-all'])
};
var _hoisted_11 = {
  key: 0
};
var _hoisted_12 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "font-semibold text-green-500"
}, "several projects", -1 /* HOISTED */);
var _hoisted_13 = [_hoisted_12];
var _hoisted_14 = {
  key: 1
};
var _hoisted_15 = {
  "class": "font-semibold text-green-500"
};
var _hoisted_16 = {
  key: 2
};
var _hoisted_17 = {
  "class": "font-semibold text-green-500"
};
var _hoisted_18 = {
  key: 3
};
var _hoisted_19 = {
  "class": "font-semibold text-green-500"
};
var _hoisted_20 = {
  "class": "font-semibold text-green-500"
};
var _hoisted_21 = {
  "class": "grid grid-cols-4 gap-4"
};
var _hoisted_22 = {
  key: 0,
  "class": "absolute top-2 right-2"
};
var _hoisted_23 = ["innerHTML"];
var _hoisted_24 = {
  "class": "text-blue-400 font-semibold text-xl"
};
var _hoisted_25 = {
  "class": "text-gray-400 text-xs"
};
var _hoisted_26 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", {
  "class": "mx-2"
}, "/", -1 /* HOISTED */);
var _hoisted_27 = {
  "class": "flex justify-center text-xs border-t border-blue-200 border-dashed pt-4 mt-2"
};
var _hoisted_28 = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-1",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_29 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M8 7l4-4m0 0l4 4m-4-4v18"
}, null, -1 /* HOISTED */);
var _hoisted_30 = [_hoisted_29];
var _hoisted_31 = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-4 w-4 mr-1",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_32 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M16 17l-4 4m0 0l-4-4m4 4V3"
}, null, -1 /* HOISTED */);
var _hoisted_33 = [_hoisted_32];
var _hoisted_34 = {
  "class": "text-xs text-gray-400 mr-2"
};
var _hoisted_35 = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  stroke: "currentColor",
  "class": "w-6 h-6"
};
var _hoisted_36 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
}, null, -1 /* HOISTED */);
var _hoisted_37 = [_hoisted_36];
var _hoisted_38 = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  stroke: "currentColor",
  "class": "w-6 h-6"
};
var _hoisted_39 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
}, null, -1 /* HOISTED */);
var _hoisted_40 = [_hoisted_39];
var _hoisted_41 = {
  key: 0,
  "class": "absolute top-4 right-4"
};
var _hoisted_42 = ["innerHTML"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_Head = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("Head");
  var _component_BackButton = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("BackButton");
  var _component_DefaultSwitch = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSwitch");
  var _component_DefaultSelect = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultSelect");
  var _component_PrimaryAlert = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PrimaryAlert");
  var _component_InfoPopover = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("InfoPopover");
  var _component_HighChart = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("HighChart");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [$data.appPayload && $data.versionPayload ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_Head, {
    key: 0,
    title: $data.appPayload.name + ' - Version ' + $data.versionPayload.number + ' Reports'
  }, null, 8 /* PROPS */, ["title"])) : $data.appPayload ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_Head, {
    key: 1,
    title: $data.appPayload.name + ' Reports'
  }, null, 8 /* PROPS */, ["title"])) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_Head, {
    key: 2,
    title: "Reports"
  })), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Back Button "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_BackButton, null, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)("Versions")];
    }),
    _: 1 /* STABLE */
  })]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Date "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_4, [_hoisted_5, $options.dateRangeText ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_6, "Showing " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.dateRangeText), 1 /* TEXT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), _hoisted_7, $options.dateRangeComparisonText ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_8, "Compared to " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.dateRangeComparisonText), 1 /* TEXT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_9, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Switch "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSwitch, {
    modelValue: $data.showComparisons,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $data.showComparisons = $event;
    }),
    note: "Show comparisons"
  }, null, 8 /* PROPS */, ["modelValue"]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Date Selector "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_DefaultSelect, {
    modelValue: $data.dateType,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
      return $data.dateType = $event;
    }),
    options: $data.dateTypes,
    onChange: _cache[2] || (_cache[2] = function ($event) {
      return $options.refreshContent();
    }),
    "class": "w-60"
  }, null, 8 /* PROPS */, ["modelValue", "options"])])]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_10, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Explainer "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_PrimaryAlert, {
    "class": "mb-8"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" Showing reports of "), _ctx.route().current() === 'reports.show' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_11, _hoisted_13)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), _ctx.route().current() === 'project.reports.show' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_14, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" services running on the "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_15, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.projectPayload.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" project ")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), _ctx.route().current() === 'app.reports.show' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_16, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" services running on the "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_17, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.appPayload.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" app ")])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), _ctx.route().current() === 'version.reports.show' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_18, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" services running on "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_19, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.appPayload.name), 1 /* TEXT */), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(" version "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_20, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.versionPayload.number), 1 /* TEXT */)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_21, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($data.overviewStats, function (overviewStat, index) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
      key: index,
      "class": "col-span-1 relative text-center bg-blue-50 border border-blue-300 rounded-md pt-5 pb-3 hover:shadow-lg cursor-pointer"
    }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h4", {
      "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['text-blue-400 text-sm mb-2 whitespace-pre-wrap', overviewStat.hasOwnProperty('comparison_total') ? 'mb-2' : 'mb-6'])
    }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(overviewStat.title), 3 /* TEXT, CLASS */), overviewStat.subtitle ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_22, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_InfoPopover, {
      "class": "text-center"
    }, {
      "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
        return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", {
          "class": "text-xs text-gray-600 break-normal",
          innerHTML: overviewStat.subtitle
        }, null, 8 /* PROPS */, _hoisted_23)];
      }),
      _: 2 /* DYNAMIC */
    }, 1024 /* DYNAMIC_SLOTS */)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_24, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(overviewStat.total), 1 /* TEXT */), overviewStat.hasOwnProperty('comparison_total') ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
      key: 1
    }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_25, [_hoisted_26, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(overviewStat.comparison_total), 1 /* TEXT */)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_27, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
      "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['flex justify-center', {
        'text-green-500': overviewStat.show_positive_arrow,
        'text-red-500': overviewStat.show_negative_arrow,
        'text-blue-400': !overviewStat.show_positive_arrow && !overviewStat.show_negative_arrow
      }])
    }, [overviewStat.show_positive_arrow ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_28, _hoisted_30)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), overviewStat.show_negative_arrow ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_31, _hoisted_33)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(overviewStat.comparison_percentage) + "%", 1 /* TEXT */)], 2 /* CLASS */)])], 64 /* STABLE_FRAGMENT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]);
  }), 128 /* KEYED_FRAGMENT */))]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", {
    "class": "flex items-center absolute top-8 right-8 cursor-pointer text-gray-400",
    onClick: _cache[3] || (_cache[3] = function ($event) {
      return $options.toggleExpandOverview();
    })
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_34, "Click to " + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($data.expandOverview ? 'minimize' : 'maximize') + " — ", 1 /* TEXT */), $data.expandOverview ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_35, _hoisted_37)) : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_38, _hoisted_40))])]), ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    "class": "grid grid-cols-12 gap-4",
    key: $data.showComparisons
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Charts "), ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($data.chartStats, function (chartStat, index) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
      key: index,
      "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)([chartStat.hasOwnProperty('col_span') ? chartStat.col_span : 'col-span-4', 'bg-white rounded-md shadow-md relative p-8 mb-4'])
    }, [chartStat.hasOwnProperty('description') ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_41, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_InfoPopover, {
      "class": "text-center"
    }, {
      "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
        return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", {
          "class": "text-xs text-gray-600 break-normal",
          innerHTML: chartStat.description
        }, null, 8 /* PROPS */, _hoisted_42)];
      }),
      _: 2 /* DYNAMIC */
    }, 1024 /* DYNAMIC_SLOTS */)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Chart "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_HighChart, {
      report: chartStat,
      showComparisons: $data.showComparisons
    }, null, 8 /* PROPS */, ["report", "showComparisons"])], 2 /* CLASS */);
  }), 128 /* KEYED_FRAGMENT */))]))]);
}

/***/ }),

/***/ "./resources/js/Mixins/ModelFilterMixin.vue":
/*!**************************************************!*\
  !*** ./resources/js/Mixins/ModelFilterMixin.vue ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ModelFilterMixin_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelFilterMixin.vue?vue&type=script&lang=js */ "./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");



;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_ModelFilterMixin_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"], [['__file',"resources/js/Mixins/ModelFilterMixin.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Reports/List/BackButton.vue":
/*!********************************************************!*\
  !*** ./resources/js/Pages/Reports/List/BackButton.vue ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BackButton_vue_vue_type_template_id_a7d61bbe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BackButton.vue?vue&type=template&id=a7d61bbe */ "./resources/js/Pages/Reports/List/BackButton.vue?vue&type=template&id=a7d61bbe");
/* harmony import */ var _BackButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BackButton.vue?vue&type=script&lang=js */ "./resources/js/Pages/Reports/List/BackButton.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_BackButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_BackButton_vue_vue_type_template_id_a7d61bbe__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Reports/List/BackButton.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Reports/List/Charts/HighChart.vue":
/*!**************************************************************!*\
  !*** ./resources/js/Pages/Reports/List/Charts/HighChart.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HighChart_vue_vue_type_template_id_a2c966ac__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HighChart.vue?vue&type=template&id=a2c966ac */ "./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=template&id=a2c966ac");
/* harmony import */ var _HighChart_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HighChart.vue?vue&type=script&lang=js */ "./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_HighChart_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_HighChart_vue_vue_type_template_id_a2c966ac__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Reports/List/Charts/HighChart.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Reports/List/index.vue":
/*!***************************************************!*\
  !*** ./resources/js/Pages/Reports/List/index.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_006f437a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=006f437a */ "./resources/js/Pages/Reports/List/index.vue?vue&type=template&id=006f437a");
/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ "./resources/js/Pages/Reports/List/index.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_olfoclet_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_index_vue_vue_type_template_id_006f437a__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Reports/List/index.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js":
/*!**************************************************************************!*\
  !*** ./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ModelFilterMixin_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_ModelFilterMixin_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./ModelFilterMixin.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Mixins/ModelFilterMixin.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Reports/List/BackButton.vue?vue&type=script&lang=js":
/*!********************************************************************************!*\
  !*** ./resources/js/Pages/Reports/List/BackButton.vue?vue&type=script&lang=js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_BackButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_BackButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./BackButton.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/BackButton.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=script&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=script&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_HighChart_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_HighChart_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./HighChart.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Reports/List/index.vue?vue&type=script&lang=js":
/*!***************************************************************************!*\
  !*** ./resources/js/Pages/Reports/List/index.vue?vue&type=script&lang=js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/index.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Reports/List/BackButton.vue?vue&type=template&id=a7d61bbe":
/*!**************************************************************************************!*\
  !*** ./resources/js/Pages/Reports/List/BackButton.vue?vue&type=template&id=a7d61bbe ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_BackButton_vue_vue_type_template_id_a7d61bbe__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_BackButton_vue_vue_type_template_id_a7d61bbe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./BackButton.vue?vue&type=template&id=a7d61bbe */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/BackButton.vue?vue&type=template&id=a7d61bbe");


/***/ }),

/***/ "./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=template&id=a2c966ac":
/*!********************************************************************************************!*\
  !*** ./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=template&id=a2c966ac ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_HighChart_vue_vue_type_template_id_a2c966ac__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_HighChart_vue_vue_type_template_id_a2c966ac__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./HighChart.vue?vue&type=template&id=a2c966ac */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/Charts/HighChart.vue?vue&type=template&id=a2c966ac");


/***/ }),

/***/ "./resources/js/Pages/Reports/List/index.vue?vue&type=template&id=006f437a":
/*!*********************************************************************************!*\
  !*** ./resources/js/Pages/Reports/List/index.vue?vue&type=template&id=006f437a ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_006f437a__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_index_vue_vue_type_template_id_006f437a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./index.vue?vue&type=template&id=006f437a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Reports/List/index.vue?vue&type=template&id=006f437a");


/***/ })

}]);