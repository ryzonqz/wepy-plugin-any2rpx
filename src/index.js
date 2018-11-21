import { config } from './config'
import { transformCss, transformHtml } from './transform'

export default class WepyPluginCssUnit {
  constructor(opts = {}) {
    this.setting = Object.assign(config, opts)
  }
  apply(op) {
    let setting = this.setting
    if (setting.filter.test(op.file)) {
      if (/\.wxss$/.test(op.file)) {
        op.code = transformCss(op.code, setting.config)
      }
      if(/\.wxml$/.test(op.file)){
        op.code = transformHtml(op.code, setting.config)
      }
    }
    op.next()
  }
}
