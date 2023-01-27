# hasElement

* 功能描述: 检查元素是否存在。
* 支持平台: Android iOS Web(WebView)
* 标准链接: [POST /session/:sessionId/element](https://w3c.github.io/webdriver/#elements)
* 参数: {string} using 元素定位器策略。
* 参数: {string} value 对应的值。
## 示例

```javascript
driver.hasElement('id', 'com.demo.demo:id/searchEdit');
```