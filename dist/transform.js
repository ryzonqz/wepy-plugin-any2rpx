'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformHtml = exports.transformCss = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _css = require('css');

var _css2 = _interopRequireDefault(_css);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var buling = /(^|[^\d])(\.\d)/g;

var getValue = function getValue(val, unit) {
  val = parseFloat(val.toFixed(6)); // control decimal precision of the calculated value
  return val == 0 ? val : val + unit;
};

var UnitTransform = function () {
  function UnitTransform() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, UnitTransform);

    this.setting = Object.assign(_config2.default, opts);
    this.regExp = new RegExp('\\b(\\d+(\\.\\d+)?)' + this.setting.sourceUnit + '\\b', 'g');
  }

  _createClass(UnitTransform, [{
    key: 'test',
    value: function test(val) {
      return this.regExp.test(val);
    }
  }, {
    key: 'transformUnit',
    value: function transformUnit(val) {
      var _this = this;

      //先补充.xrem之前的0
      if (!/'|"/.test(val) && buling.test(val)) {
        val = val.replace(buling, function (match, $1, $2) {
          return $1 + '0' + $2;
        });
      }
      return val.replace(this.regExp, function (match, $1) {
        return getValue($1 * _this.setting.rate, _this.setting.targetUnit);
      });
    }
  }]);

  return UnitTransform;
}();

var transformCss = exports.transformCss = function transformCss(content, opts) {
  var ut = new UnitTransform(opts);

  var astObj = _css2.default.parse(content);
  astObj.stylesheet.rules.forEach(function (rule) {
    switch (rule.type) {
      // recursive invocation while dealing with media queries
      case 'media':
        transformCss(rule.rules);
        break;
      // recursive invocation while dealing with keyframes
      case 'keyframes':
        transformCss(rule.keyframes);
        break;
      default:
        if (rule.declarations && rule.declarations.length) {
          // need transform: declaration
          rule.declarations.forEach(function (declaration) {
            if (declaration.type === 'declaration' && ut.test(declaration.value)) {
              declaration.value = ut.transformUnit(declaration.value);
            }
          });
        }
    }
  });

  return _css2.default.stringify(astObj);
};

//transform inline style
var transformHtml = exports.transformHtml = function transformHtml(content, opts) {
  var ut = new UnitTransform(opts);

  if (/\sstyle="[^"]*"/.test(content)) {
    content = content.replace(/(\sstyle=")([^"]*)(")/g, function (match, $1, $2, $3) {
      return $1 + ut.transformUnit($2) + $3;
    });
  }

  return content;
};