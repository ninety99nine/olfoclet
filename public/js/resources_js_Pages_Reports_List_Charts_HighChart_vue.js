"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Reports_List_Charts_HighChart_vue"],{

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
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_HighChart_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_HighChart_vue_vue_type_template_id_a2c966ac__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Reports/List/Charts/HighChart.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

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


/***/ })

}]);