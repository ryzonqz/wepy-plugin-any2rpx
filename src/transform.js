import css from 'css'
import config from './config'

let buling = /(^|[^\d])(\.\d)/g

const getValue = (val, unit) => {
  val = parseFloat(val.toFixed(6)) // control decimal precision of the calculated value
  return val == 0 ? val : val + unit
}

class UnitTransform {
  constructor(opts = {}) {
    this.setting = Object.assign(config, opts)
    this.regExp = new RegExp(`\\b(\\d+(\\.\\d+)?)${this.setting.sourceUnit}\\b`, 'g')
  }

  test(val) {
    return this.regExp.test(val)
  }

  transformUnit(val) {
    //先补充.xrem之前的0
    if (!/'|"/.test(val) && buling.test(val)) {
      val = val.replace(buling, (match, $1, $2) => {
        return $1 + '0' + $2
      })
    }
    return val.replace(this.regExp, (match, $1) => {
      return getValue($1 * this.setting.rate, this.setting.targetUnit)
    })
  }
}

export const transformCss = (content, opts) => {
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
export const transformHtml = (content, opts) => {
  let ut = new UnitTransform(opts)

  if (/\sstyle="[^"]*"/.test(content)) {
    content = content.replace(/(\sstyle=")([^"]*)(")/g, (match, $1, $2, $3) => {
      return $1 + ut.transformUnit($2) + $3
    })
  }

  return content
}