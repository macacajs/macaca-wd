---
home: true
heroImage: /logo/macaca.svg
actionText: API 文档
actionLink: /zh/apis/
footer: MIT Licensed | Copyright © 2015-present Macaca
---

::: tip 开发体验
API 文档
:::

## 安装

```bash
$ npm i macaca-wd -D
```

## 使用

```javascript
const wd = require('macaca-wd');

const remoteConfig = {
  host: 'localhost',
  port: 3456
};

var driver = wd.promiseChainRemote(remoteConfig);

before(function() {
  return driver.init({
    platformName: 'desktop', // iOS, Android, Desktop, Playwright
    browserName: 'chrome',   // chromium, firefox, webkit
    app: 'path/to/app',      // Only for mobile
  });
});

after(function() {
  return driver
    .sleep(1000)
    .quit();
});

it('#1 should', function() {

  ...

});

...

```

## 集成 Helper

```javascript
import wd from 'macaca-wd';
import {
  extendsMixIn,
} from 'macaca-wd/lib/helper'

extendsMixIn(wd)
```

## 扩展更多 API

```javascript
import wd from 'macaca-wd';

wd.addPromiseChainMethod(name, method);
```

[API](//macacajs.github.io/macaca-wd/zh/apis)

## 示例

[Macaca Getting Started](//macacajs.github.io/environment-setup)
