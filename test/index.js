const transform = require('../dist/transform');

let style = ':root{--1:#369;} body { width: 2rem; height: .2rem; border: 1rem .2rem 3.1rem; transform: translateX(.2rem) }'
let html = '<div style="width: 2rem; height: .2rem 3.1rem; transform: translateX(.2rem)"><text style="height:1rem; width:.1rem">'

console.log(transform.transformCss(style))
console.log(transform.transformHtml(html))