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
  any2rpx: {
    filter: /\.(wxml|wxss)$/,
    config: {
      exclude: '1px',
      transform: [{
        unit: 'px',
        proportion: 1
      }]
    }
  }
}
```

# 配置

* filter 监听的文件后缀<br>
  默认: `/\.(wxml|wxss)$/`

* config 具体配置<br>

  * config.exclude 例外, 例如'1px'<br>
    默认: 无

  * config.transform 转化规则数组, 可配置多项<br>
    默认:
    ```
      {
        unit: 'px', //转化单位
        proportion: 1 //转化系数=rpx/unit
      }
    ```


# 注意

`wxml`内只转换普通内联样式，变量形式的`:style="{{...}}"`不会转换