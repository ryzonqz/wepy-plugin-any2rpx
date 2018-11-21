const setting = {
  filter: /\.(wxml|wxss)$/
}

const config = {
  exclude: null,
  transform: {
    unit: 'px',
    targetUnit: 'rpx',
    proportion: 1 // targetUnit / unit
  },
}

export { setting, config }
