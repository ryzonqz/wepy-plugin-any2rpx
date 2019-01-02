import { setting } from './config'
import { transformCss, transformHtml } from './transform'

export default class WepyPluginCssUnit {
  constructor(opts = {}) {
    this.setting = Object.assign(setting, opts)
  }
  apply(op) {
    let setting = this.setting
    if (op.code && setting.filter.test(op.file)) {
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
