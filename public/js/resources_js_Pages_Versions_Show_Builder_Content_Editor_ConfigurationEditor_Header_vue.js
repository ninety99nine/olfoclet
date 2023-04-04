"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Pages_Versions_Show_Builder_Content_Editor_ConfigurationEditor_Header_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/Input/DefaultInput */ "./resources/js/Components/Input/DefaultInput.vue");
/* harmony import */ var _stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @stores/VersionBuilder */ "./resources/js/Stores/VersionBuilder.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    DefaultInput: _components_Input_DefaultInput__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      useVersionBuilder: (0,_stores_VersionBuilder__WEBPACK_IMPORTED_MODULE_1__.useVersionBuilder)()
    };
  },
  computed: {
    title: function title() {
      return this.useVersionBuilder.selectedConfigMenu;
    },
    descriptionSnipets: function descriptionSnipets() {
      if (this.title == 'Airtime Billing Connection') {
        return [{
          text: 'Use '
        }, {
          highlight: 'Airtime Billing Connection'
        }, {
          text: ' to setup the Airtime Billing account credentials.'
        }, {
          "break": 3
        }, {
          text: 'This can be used for any of the following uses:'
        }, {
          "break": 2
        }, {
          text: '(1) To bill subscribers on their '
        }, {
          bold: 'postpaid / prepaid'
        }, {
          text: ' airtime balance'
        }, {
          "break": 2
        }, {
          text: '(2) To query the '
        }, {
          highlight: 'Usage Consumption'
        }, {
          text: ' (Information on the airtime balance, data balance and sms quantities remaining)'
        }, {
          "break": 2
        }, {
          text: '(3) To query the '
        }, {
          highlight: 'Product Inventory'
        }, {
          text: ' (Information on the mobile number status such as '
        }, {
          bold: 'active / inactive'
        }, {
          text: ' or rating type such as '
        }, {
          bold: 'prepaid / postpaid'
        }, {
          text: ')'
        }];
      } else if (this.title == 'Global Variables') {
        return [{
          text: 'Use '
        }, {
          highlight: 'Global Variables'
        }, {
          text: ' to set initial variables on every running session'
        }];
      } else if (this.title == 'Global Events') {
        return [{
          text: 'Use '
        }, {
          highlight: 'Global Events'
        }, {
          text: ' to share events between application lifecycle stages, screens or displays'
        }];
      } else if (this.title == 'Application Events') {
        return [{
          text: 'Use '
        }, {
          highlight: 'Application Events'
        }, {
          text: ' to run events at various instances of the application lifecycle'
        }];
      } else if (this.title == 'Global Pagination') {
        return [{
          text: 'Use '
        }, {
          highlight: 'Global Pagination'
        }, {
          text: ' to set the default pagination settings for content on displays'
        }];
      } else if (this.title == 'Firebase Connection') {
        return [{
          text: 'Connect to your '
        }, {
          highlight: 'Firebase project'
        }, {
          "break": 2
        }, {
          text: 'Download the service account file from the  '
        }, {
          link: {
            text: 'Firebase Console',
            href: 'https://console.firebase.google.com'
          }
        }, {
          "break": 2
        }, {
          text: 'Read the following '
        }, {
          link: {
            text: 'Article',
            href: 'https://support.google.com/firebase/answer/7015592?hl=en#zippy=%2Cin-this-article'
          }
        }, {
          text: 'or watch the following '
        }, {
          link: {
            text: 'Youtube Video',
            href: 'https://www.youtube.com/watch?v=qXFJ6E1D-c8'
          }
        }, {
          text: ' for more information'
        }];
      } else if (this.title == 'AppWrite Connection') {
        return [{
          text: 'Login to your '
        }, {
          highlight: 'AppWrite dashboard'
        }, {
          text: ', then navigate to '
        }, {
          highlight: 'Settings'
        }, {
          text: ' to acquire the '
        }, {
          highlight: 'Project ID'
        }, {
          text: ' and the '
        }, {
          highlight: 'Api Endpoint.'
        }, {
          "break": 2
        }, {
          text: 'Navigate to the '
        }, {
          highlight: 'API keys'
        }, {
          text: ' menu to add a new API Key.'
        }, {
          "break": 2
        }, {
          text: 'Refer to the '
        }, {
          link: {
            text: 'AppWrite Docs',
            href: 'https://appwrite.io/docs'
          }
        }, {
          text: ' to learn more.'
        }];
      } else if (this.title == 'Sms Connection') {
        return [{
          text: 'Use '
        }, {
          highlight: 'SMS Connection '
        }, {
          text: 'to setup the '
        }, {
          highlight: 'SMPP Account Credentials '
        }, {
          text: 'in order to send SMS '
        }];
      } else if (this.title == 'Restrictions') {
        return [{
          text: 'Use '
        }, {
          highlight: 'Restrictions '
        }, {
          text: 'to '
        }, {
          highlight: 'Grant '
        }, {
          text: 'or '
        }, {
          highlight: 'Block '
        }, {
          text: 'application access to specific mobile numbers'
        }];
      } else if (this.title == 'Select Screens Conditionally') {
        return [{
          text: 'Conditionally determine the first screen to load everytime the application is launched'
        }];
      } else if (this.title == 'Color Scheme') {
        return [{
          text: 'Use '
        }, {
          highlight: 'Color Scheme'
        }, {
          text: ' to set the default colors for highlighting related events'
        }];
      } else if (this.title == 'Log Settings') {
        return [{
          text: 'Use '
        }, {
          highlight: 'Log Settings'
        }, {
          text: ' to determine when to save the session logs'
        }];
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=template&id=1d39cdba":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=template&id=1d39cdba ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm-bundler.js");

var _hoisted_1 = {
  "class": "flex items-center"
};
var _hoisted_2 = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-6 w-6 text-gray-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
}, null, -1 /* HOISTED */);
var _hoisted_4 = [_hoisted_3];
var _hoisted_5 = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-6 w-6 text-gray-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_6 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
}, null, -1 /* HOISTED */);
var _hoisted_7 = [_hoisted_6];
var _hoisted_8 = {
  key: 2,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-6 w-6 text-gray-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_9 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
}, null, -1 /* HOISTED */);
var _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
}, null, -1 /* HOISTED */);
var _hoisted_11 = [_hoisted_9, _hoisted_10];
var _hoisted_12 = {
  key: 3,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-6 w-6 text-gray-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_13 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
}, null, -1 /* HOISTED */);
var _hoisted_14 = [_hoisted_13];
var _hoisted_15 = {
  key: 4,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-6 w-6 text-gray-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_16 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
}, null, -1 /* HOISTED */);
var _hoisted_17 = [_hoisted_16];
var _hoisted_18 = {
  key: 5,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-6 w-6 text-gray-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_19 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
}, null, -1 /* HOISTED */);
var _hoisted_20 = [_hoisted_19];
var _hoisted_21 = {
  key: 6,
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-6 w-6 text-gray-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
};
var _hoisted_22 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
}, null, -1 /* HOISTED */);
var _hoisted_23 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
}, null, -1 /* HOISTED */);
var _hoisted_24 = [_hoisted_22, _hoisted_23];
var _hoisted_25 = {
  "class": "text-md font-semibold text-gray-600 ml-2"
};
var _hoisted_26 = {
  "class": "text-xs text-gray-500 mt-4 text-justify border-y border-dotted py-6 my-6"
};
var _hoisted_27 = {
  key: 0
};
var _hoisted_28 = {
  "class": "text-gray-700 font-bold"
};
var _hoisted_29 = {
  "class": "text-blue-500 font-semibold"
};
var _hoisted_30 = {
  "class": "inline-flex items-center mx-1"
};
var _hoisted_31 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "class": "h-3 w-3 mr-1",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
})], -1 /* HOISTED */);
var _hoisted_32 = ["href"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Icons "), $options.title == 'Sms Connection' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_2, _hoisted_4)) : $options.title == 'Restrictions' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_5, _hoisted_7)) : $options.title == 'Firebase Connection' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_8, _hoisted_11)) : $options.title == 'AppWrite Connection' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_12, _hoisted_14)) : $options.title == 'Airtime Billing Connection' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_15, _hoisted_17)) : $options.title == 'Global Pagination' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_18, _hoisted_20)) : $options.title == 'Select Screens Conditionally' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("svg", _hoisted_21, _hoisted_24)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Title "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h1", _hoisted_25, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.title), 1 /* TEXT */)]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Description "), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("p", _hoisted_26, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Description Snipit "), ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.descriptionSnipets, function (descriptionSnipet, index) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
      key: index
    }, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(descriptionSnipet, function (snipitInfo, snipitType) {
      return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        key: snipitInfo
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Ordinary Text"), snipitType == 'text' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("span", _hoisted_27, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(snipitInfo), 1 /* TEXT */)) : snipitType == 'bold' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        key: 1
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Higlighted Text"), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_28, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(snipitInfo), 1 /* TEXT */)], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */)) : snipitType == 'highlight' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        key: 2
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Higlighted Text"), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_29, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(snipitInfo), 1 /* TEXT */)], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */)) : snipitType == 'link' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        key: 3
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Link Text"), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_30, [_hoisted_31, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("a", {
        href: snipitInfo.href,
        "class": "text-blue-500 font-semibold hover:underline hover:text-blue-600",
        target: "_blank"
      }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(snipitInfo.text), 9 /* TEXT, PROPS */, _hoisted_32)])], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(" Break Line "), snipitType == 'break' ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        key: 4
      }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(snipitInfo, function (index) {
        return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("br", {
          key: index
        });
      }), 128 /* KEYED_FRAGMENT */)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)], 64 /* STABLE_FRAGMENT */);
    }), 128 /* KEYED_FRAGMENT */))], 64 /* STABLE_FRAGMENT */);
  }), 128 /* KEYED_FRAGMENT */))])]);
}

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue":
/*!************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Header_vue_vue_type_template_id_1d39cdba__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Header.vue?vue&type=template&id=1d39cdba */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=template&id=1d39cdba");
/* harmony import */ var _Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Header.vue?vue&type=script&lang=js */ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_juliantabona_Sites_OQ_SCE_Revised_2_Webpack_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Header_vue_vue_type_template_id_1d39cdba__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Header.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=template&id=1d39cdba":
/*!******************************************************************************************************************************!*\
  !*** ./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=template&id=1d39cdba ***!
  \******************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Header_vue_vue_type_template_id_1d39cdba__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Header_vue_vue_type_template_id_1d39cdba__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Header.vue?vue&type=template&id=1d39cdba */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/Pages/Versions/Show/Builder/Content/Editor/ConfigurationEditor/Header.vue?vue&type=template&id=1d39cdba");


/***/ })

}]);