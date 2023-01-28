---
home: true
heroImage: /logo/macaca.svg
actionText: API Documents
actionLink: /apis/
---

::: tip Introduction
Macaca is an open-source automation test solution for native, hybrid, mobile web and web application on mobile and desktop platforms.
:::

## Installation

```bash
$ npm i macaca-wd -D
```

## Usage

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

## Mixin Helper

```javascript
import wd from 'macaca-wd';
import {
  extendsMixIn,
} from 'macaca-wd/lib/helper'

extendsMixIn(wd)
```

## Extend WD chain

```javascript
import wd from 'macaca-wd';

wd.addPromiseChainMethod(name, method);
```

[API](//macacajs.github.io/macaca-wd/apis)

## Demo

- [demo-1](//github.com/app-bootstrap/web-app-bootstrap)
- [demo-2](//github.com/macacajs/macaca-reporter)
- [demo-3](//github.com/macaca-sample/antd-sample)
- [demo-4](//github.com/xudafeng/autoresponsive-react)
