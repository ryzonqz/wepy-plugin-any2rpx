const transform = require('../dist/transform')

let config = {
  exclude: '1px',
  transform: [{
    unit: 'rem',
    proportion: 100
  }]
}

let style =
  ':root{--1:#369;} body { conent:"1rem"; width: 2rem; height: .2rem; border:1rem 1px 3.1rem; transform: translateX(-.2rem); left:20px }'
let html =
  '<div style="width: 2rem; height: .2rem 3.1rem; transform: translateY(-1.2rem)"><text style="height:1rem; width:.1rem">'

console.log(transform.transformCss(style, config))
console.log(transform.transformHtml(html, config))
