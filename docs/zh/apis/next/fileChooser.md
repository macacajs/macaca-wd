# fileChooser

* 功能描述: 通过文件选择器上传文件。
* 支持平台: Web(WebView)
* 参数: {string} filePath 文件路径

## 示例 

```javascript
.sleep(1000)
.then(() => {
  driver.fileChooser('./image/test.png');
  driver.clickOn('图片');
})
```