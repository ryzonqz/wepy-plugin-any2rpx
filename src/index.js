import { transformCss, transformHtml } from './transform'

export default class WepyPluginCssUnit {
  constructor(opts = {}) {
    //
    this.setting = Array.isArray(opts) ? opts : [opts]
  }
  apply(op) {
    let setting = this.setting
    if (/\.wxss$/.test(op.file)) {
      this.setting.forEach(st => {
        op.code = transformCss(op.code, st)
      })
    }
    if(/\.wxml$/.test(op.file)){
      this.setting.forEach(st => {
        op.code = transformHtml(op.code, st)
      })
    }
    op.next()
  }
}
