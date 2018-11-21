import css from 'css'
import { config } from './config'

const buling = /(^|[^\d])(\.\d)/g

const getValue = (val, unit) => {
  val = parseFloat(val.toFixed(6)) // control decimal precision of the calculated value
  return val == 0 ? val : val + unit
}

class UnitTransform {
  constructor(opts = {}) {
    this.exclude = config.exclude || opts.exclude

    let _arr = opts.transform && opts.transform.length ? opts.transform : [config.transform]
    this.rules = _arr.map(item => {
      let r = Object.assign(config.transform, item)
      r.regExp = new RegExp(`\\b(\\d+(\\.\\d+)?)${r.unit}\\b`, 'g')
      return r
    })
  }

  test(val) {
    return this.rules.some(r => r.regExp.test(val))
  }

  transformUnit(val) {
    //some style like content
    if (/'|"/.test(val)) return
    //add '0' before '.\d'
    if (buling.test(val)) {
      val = val.replace(buling, (match, $1, $2) => {
        return $1 + '0' + $2
      })
    }

    this.rules.forEach(r => {
      val = val.replace(r.regExp, (match, $1) => {
        if (this.exclude !== match) {
          return getValue($1 * r.proportion, r.targetUnit)
        }
        return match
      })
    })

    return val
  }
}

//transform css file
const transformCss = (content, opts) => {
  let ut = new UnitTransform(opts)

  let astObj = css.parse(content)
  astObj.stylesheet.rules.forEach(rule => {
    switch (rule.type) {
      // recursive invocation while dealing with media queries
      case 'media':
        transformCss(rule.rules)
        break
      // recursive invocation while dealing with keyframes
      case 'keyframes':
        transformCss(rule.keyframes)
        break
      default:
        if (rule.declarations && rule.declarations.length) {
          // need transform: declaration
          rule.declarations.forEach(declaration => {
            if (declaration.type === 'declaration' && ut.test(declaration.value)) {
              declaration.value = ut.transformUnit(declaration.value)
            }
          })
        }
    }
  })

  return css.stringify(astObj)
}

//transform inline style
const transformHtml = (content, opts) => {
  let ut = new UnitTransform(opts)

  if (/\sstyle="[^"]*"/.test(content)) {
    content = content.replace(/(\sstyle=")([^"]*)"/g, (match, $1, $2) => {
      return $1 + ut.transformUnit($2) + '"'
    })
  }

  return content
}

export { transformCss, transformHtml }
