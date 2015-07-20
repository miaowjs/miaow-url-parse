# miaow-url-parse

> Miaow的URL补全工具


```css
.foo {
  background: url(./foo.png#url);
}

/* 处理后 */
.foo {
  background: url(//www.example.com/foo_md5.png);
}
```

## 使用说明

### 安装

```
npm install miaow-url-parse --save-dev
```

### 在项目的 miaow.config.js 中添加模块的 tasks 设置

```javascript
//miaow.config.js
module: {
  tasks: [
    {
      test: /\.(js|css)$/,
      plugins: ['miaow-url-parse']
    }
  ]
}
```

### 选项

* keyword 默认是`url`, 用于匹配哪些链接需要做链接替换操作
* reg 默认是`undefined`, 自定义匹配相对路径的正则表达式, 要保证匹配的第一个组应该是相对路径
