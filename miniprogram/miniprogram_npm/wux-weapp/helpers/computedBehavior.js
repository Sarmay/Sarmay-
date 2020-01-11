"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _isEmpty=_interopRequireDefault(require("./isEmpty")),_shallowEqual=_interopRequireDefault(require("./shallowEqual"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var r=0,t=new Array(e.length);r<e.length;r++)t[r]=e[r];return t}}function ownKeys(r,e){var t=Object.keys(r);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(r);e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})),t.push.apply(t,n)}return t}function _objectSpread(r){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(t,!0).forEach(function(e){_defineProperty(r,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):ownKeys(t).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(t,e))})}return r}function _defineProperty(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function _slicedToArray(e,r){return _arrayWithHoles(e)||_iterableToArrayLimit(e,r)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(e,r){var t=[],n=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(n=(a=u.next()).done)&&(t.push(a.value),!r||t.length!==r);n=!0);}catch(e){o=!0,i=e}finally{try{n||null==u.return||u.return()}finally{if(o)throw i}}return t}function _arrayWithHoles(e){if(Array.isArray(e))return e}var ALL_DATA_KEY="**",trim=function(e){return(0<arguments.length&&void 0!==e?e:"").replace(/\s/g,"")},_default=Behavior({lifetimes:{attached:function(){this.initComputed()}},definitionFilter:function(e){var r=e.computed,n=void 0===r?{}:r,a=Object.keys(n).reduce(function(e,i){var r=_slicedToArray(Array.isArray(n[i])?n[i]:[ALL_DATA_KEY,n[i]],2),t=r[0],a=r[1];return _objectSpread({},e,_defineProperty({},t,function(){if("function"==typeof a){for(var e=arguments.length,r=new Array(e),t=0;t<e;t++)r[t]=arguments[t];var n=a.apply(this,r),o=this.data[i];(0,_isEmpty.default)(n)||(0,_shallowEqual.default)(n,o)||this.setData(_defineProperty({},i,n))}}))},{});Object.assign(e.observers=e.observers||{},a),Object.assign(e.methods=e.methods||{},{initComputed:function(e,r){var t=0<arguments.length&&void 0!==e?e:{},n=1<arguments.length&&void 0!==r&&r;if(!this.runInitComputed||n){this.runInitComputed=!1;var o=this,i=_objectSpread({},this.data,{},t);Object.keys(a).forEach(function(e){var r=trim(e).split(",").reduce(function(e,r){return[].concat(_toConsumableArray(e),[i[r]])},[]);a[e].apply(o,r)}),this.runInitComputed=!0}}})}});exports.default=_default;