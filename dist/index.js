'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('./config');

var _transform = require('./transform');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WepyPluginCssUnit = function () {
  function WepyPluginCssUnit() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WepyPluginCssUnit);

    this.setting = Object.assign(_config.setting, opts);
  }

  _createClass(WepyPluginCssUnit, [{
    key: 'apply',
    value: function apply(op) {
      var setting = this.setting;
      if (setting.filter.test(op.file)) {
        if (/\.wxss$/.test(op.file)) {
          op.code = (0, _transform.transformCss)(op.code, setting.config);
        }
        if (/\.wxml$/.test(op.file)) {
          op.code = (0, _transform.transformHtml)(op.code, setting.config);
        }
      }
      op.next();
    }
  }]);

  return WepyPluginCssUnit;
}();

exports.default = WepyPluginCssUnit;