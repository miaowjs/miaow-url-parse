# miaow-url-parse

> Miaow的URL补全工具

## 效果示例

```css
.foo {
  background: url(./foo.png#url);
}

/* 处理后 */
.foo {
  background: url(//www.example.com/foo_md5.png);
}
```

### 参数说明

#### keyword
Type:`String` Default:`'url'`

用于匹配哪些链接需要做链接替换操作

#### regexp
Type:`RegExp` Default:`undefined`

自定义匹配相对路径的正则表达式, 要保证匹配的第一个组应该是相对路径
