# miaow-url-parse

> Miaow的URL补全工具


```css
.foo {
  background: url(./foo.png?url);
}

/* 处理后 */
.foo {
  background: url(//www.example.com/foo_md5.png);
}
```

## 使用说明

### 安装

```
npm install miaow-url-parse -save
```

### 在项目的 miaow.config.js 中添加模块的 parse 设置

```javascript
//miaow.config.js
module: {
  parse: [
    {
      test: /\.(js|css)$/,
      plugins: ['miaow-url-parse']
    }
  ]
}
```

### 选项

* keyword 默认是`url`, 用于匹配哪些链接需要做链接替换操作
