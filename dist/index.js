(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.SlateStylePlugin = global.SlateStylePlugin || {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Slate-Style-Plugin
 *      便于添加行内样式功能
 *
 * @constructor
 */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
var StylePlugin = {
  single: function single(style) {
    if (!style.mark || !style.type) {
      throw new Error("`mark` and `type` properties should be included in first parameter!");
    }

    return {
      schema: { marks: _defineProperty({}, style.type, style.mark) },
      onKeyDown: function onKeyDown(event, data, state) {
        var isCtrl = style.isCtrl || false;
        var isShift = style.isShift || false;

        if (style.key === data.key && data.isCmd && data.isCtrl === isCtrl && data.isShift === isShift) {
          event.preventDefault();

          return state.transform().toggleMark(style.type).apply();
        }
      }
    };
  },
  group: function group(styles) {
    var schema = { marks: {} };
    var types = [];

    for (var i = 0, len = styles.length; i < len; i++) {
      var style = styles[i];

      if (!style.mark || !style.type) {
        throw new Error("`mark` and `type` properties should be included in first parameter!");
      }

      schema.marks[style.type] = style.mark;
      types.push(style.type);
    }

    return {
      schema: schema,
      onKeyDown: function onKeyDown(event, data, state) {
        var _loop = function _loop(_i, _len) {
          var style = styles[_i];
          var isCtrl = style.isCtrl || false;
          var isShift = style.isShift || false;
          var isDefault = style.isDefault || false;
          var hasMark = state.marks.some(function (mark) {
            return mark.type === style.type;
          });

          if (style.key === data.key && data.isCmd && data.isCtrl === isCtrl && data.isShift === isShift) {
            event.preventDefault();

            var transform = state.transform();

            for (var j = 0; j < _len; j++) {
              if (_i === j && hasMark && !isDefault) {
                transform = transform.toggleMark(types[j]);
              } else if (_i === j && !hasMark && !isDefault) {
                transform = transform.addMark(types[j]);
              } else {
                transform = transform.removeMark(types[j]);
              }
            }

            return {
              v: transform.apply()
            };
          }
        };

        for (var _i = 0, _len = styles.length; _i < _len; _i++) {
          var _ret = _loop(_i, _len);

          if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
      }
    };
  }

  /**
   * 变化 style 的快捷函数
   */
};var toggleStyle = {
  single: function single(type, state, onChange) {
    if (!state) {
      throw new Error("`state` parameter can\'t be Void!");
    }

    return function (e) {
      // 阻止默认事件
      e.preventDefault();

      var res = state.transform().toggleMark(type).apply();

      return onChange ? onChange(res) : res;
    };
  },
  group: function group(types, state, onChange) {
    if (!state) {
      throw new Error("`state` parameter can\'t be Void!");
    }

    return function (type) {
      var isDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!type) {
        throw new Error("`type` parameter can\'t be Void!");
      }

      return function (e) {
        e.preventDefault();

        var hasMark = state.marks.some(function (mark) {
          return mark.type === type;
        });
        var transform = state.transform();

        for (var i = 0, len = types.length; i < len; i++) {
          if (type === types[i] && hasMark && !isDefault) {
            transform = transform.toggleMark(types[i]);
          } else if (type === types[i] && !hasMark && !isDefault) {
            transform = transform.addMark(types[i]);
          } else {
            transform = transform.removeMark(types[i]);
          }
        }

        var res = transform.apply();

        return onChange ? onChange(res) : res;
      };
    };
  }
};

exports['default'] = StylePlugin;
exports.toggleStyle = toggleStyle;

Object.defineProperty(exports, '__esModule', { value: true });

})));
