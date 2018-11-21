'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var config = {
  filter: /\.(wxml|wxss)$/
};

var rule = {
  unit: 'px',
  targetUnit: 'rpx',
  proportion: 1 // targetUnit / unit
};

exports.config = config;
exports.rule = rule;