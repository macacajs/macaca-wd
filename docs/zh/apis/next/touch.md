# touch

* 功能描述: 在设备上进行触摸操作。
* 支持平台: iOS Android
* 标准链接: [POST /session/:sessionId/actions](https://w3c.github.io/webdriver/#actions)
* 参数: {string} action 动作名称, tap/doubleTap/press/pinch/rotate/drag
* 参数: {object} args 动作参数, [更多参数](https://github.com/alibaba/macaca/issues/366)

## 示例 

```javascript
driver.touch('doubleTap', { x: 100, y: 100 });
```