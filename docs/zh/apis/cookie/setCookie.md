# setCookie

* 功能描述: 将单个 cookie 添加到与活动文档地址关联的 cookie 存储中。
* 支持平台: Web(WebView)
* 标准链接: [POST /session/:sessionId/cookie](https://w3c.github.io/webdriver/#add-cookie)
* 参数: {object} cookie 对象。
## 示例

```javascript
driver.setCookie({
  url: 'https://macacajs.github.io',
  name: 'foo',
  value: 'bar',

})
```