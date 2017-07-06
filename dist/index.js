(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.SlateStylePlugin = global.SlateStylePlugin || {})));
}(this, (function (exports) { 'use strict';

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
        for (var _i = 0, _len = styles.length; _i < _len; _i++) {
          var _style = styles[_i];
          var isCtrl = _style.isCtrl || false;
          var isShift = _style.isShift || false;
          var isDefault = _style.isDefault || false;

          if (_style.key === data.key && data.isCmd && data.isCtrl === isCtrl && data.isShift === isShift) {
            event.preventDefault();

            var transform = state.transform();

            for (var j = 0; j < _len; j++) {
              transform = transform.removeMark(types[j]);
            }

            if (isDefault) {
              return transform.apply();
            }

            return transform.addMark(_style.type).apply();
          }
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

        var transform = state.transform();

        for (var i = 0, len = types.length; i < len; i++) {
          transform = transform.removeMark(types[i]);
        }

        var res = null;

        if (isDefault) {
          res = transform.apply();
        } else {
          res = transform.addMark(type).apply();
        }

        return onChange ? onChange(res) : res;
      };
    };
  }
};

exports['default'] = StylePlugin;
exports.toggleStyle = toggleStyle;

Object.defineProperty(exports, '__esModule', { value: true });

})));
