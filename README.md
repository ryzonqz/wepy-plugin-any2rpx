# wepy-plugin-any2rpx

[wepy](https://github.com/Tencent/wepy) 插件，转化任意css单位至rpx

# 安装

```
  $ npm i -D wepy-plugin-any2rpx
```

# 使用

wepy.config.js
```javascript
module.exports.plugins = {
  // ...
  any2rpx: {
    filter: /\.(wxml|wxss)$/,
    config: {
      unit: 'px',
      proportion: 1
    }
  }
  // ...
}
```

# 配置

* filter 监听的文件后缀<br>
  默认: `/\.(wxml|wxss)$/`

* config 具体配置<br>
  默认: 对象<br>
  可以是数组, 数组内每个配置都会被应用

  * config.unit 需要转化的单位<br>
   默认: 'px'

  * config.proportion 转化的比例=rpx/unit<br>
    默认: 1

# 注意

`wxml`内只转换普通内联样式，变量形式的`:style="{{}}"`不会转换