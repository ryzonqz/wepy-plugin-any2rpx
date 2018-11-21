'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var setting = {
  filter: /\.(wxml|wxss)$/
};

var config = {
  exclude: null,
  transform: {
    unit: 'px',
    targetUnit: 'rpx',
    proportion: 1 // targetUnit / unit
  }
};

exports.setting = setting;
exports.config = config;