# waitForElement

* 功能描述: 上述所有与元素相关的方法（后缀为 OrNull、IfExists 的方法除外）都可以使用“waitFor-”作为前缀（需要将“e”大写，例如 waitForElementByCss）动态等待元素加载。
* 支持平台: Android iOS Web(WebView)
* 参数: {string} using 元素定位器策略，在使用 waitForElementByCss 等特定方法时省略。
* 参数: {string} value 对应的值。
* 参数: {function} 断言器函数（常用的断言器函数可以在wd.asserters中找到）（可选）。
* 参数: {number} timeout 查找元素前的超时时间，单位：ms（可选）
* 参数: {number} interval 每次搜索的间隔时间，单位：ms（可选）

## 示例 

```javascript
// 以 100ms 的间隔搜索类名为 'btn' 的元素，持续 2000ms。
driver.waitForElementByCss('btn', 2000, 100) 
```