'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformHtml = exports.transformCss = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _css = require('css');

var _css2 = _interopRequireDefault(_css);

var _config = require('./config');

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

    var _arr = Array.isArray(opts) ? opts : [opts];

    this.rules = _arr.map(function (item) {
      var r = Object.assign(_config.rule, item);
      r.regExp = new RegExp('\\b(\\d+(\\.\\d+)?)' + r.unit + '\\b', 'g');
      return r;
    });
  }

  _createClass(UnitTransform, [{
    key: 'test',
    value: function test(val) {
      return this.rules.some(function (r) {
        return r.regExp.test(val);
      });
    }
  }, {
    key: 'transformUnit',
    value: function transformUnit(val) {
      //some style like content
      if (/'|"/.test(val)) return;
      //add '0' before '.\d'
      if (buling.test(val)) {
        val = val.replace(buling, function (match, $1, $2) {
          return $1 + '0' + $2;
        });
        console.log(val);
      }
      this.rules.forEach(function (r) {
        val = val.replace(r.regExp, function (match, $1) {
          return getValue($1 * r.proportion, r.targetUnit);
        });
      });

      return val;
    }
  }]);

  return UnitTransform;
}();

//transform css file


var transformCss = function transformCss(content, opts) {
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
var transformHtml = function transformHtml(content, opts) {
  var ut = new UnitTransform(opts);

  if (/\sstyle="[^"]*"/.test(content)) {
    content = content.replace(/(\sstyle=")([^"]*)"/g, function (match, $1, $2) {
      return $1 + ut.transformUnit($2) + '"';
    });
  }

  return content;
};

exports.transformCss = transformCss;
exports.transformHtml = transformHtml;