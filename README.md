# Macaca WD Client

[![Gitter Chat][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![node version][node-image]][node-url]

[npm-image]: https://img.shields.io/npm/v/macaca-wd.svg?style=flat-square
[npm-url]: https://npmjs.org/package/macaca-wd
[travis-image]: https://img.shields.io/travis/macacajs/macaca-wd.svg?style=flat-square
[travis-url]: https://travis-ci.org/macacajs/macaca-wd
[node-image]: https://img.shields.io/badge/node.js-%3E=_4-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[gitter-image]: https://img.shields.io/badge/GITTER-join%20chat-green.svg?style=flat-square
[gitter-url]: https://gitter.im/alibaba/macaca

Macaca WD Client is inspired by [admc/wd](//github.com/admc/wd), according to [W3C WebDriver Spec](//w3c.github.io/webdriver/webdriver-spec.html).

## Installation

```bash
$ npm i macaca-wd --save-dev
```

## Documentation

### Usage

```javascript
var wd = require('macaca-wd');

var remoteConfig = {
  host: 'localhost',
  port: 3456
};

var driver = wd.promiseChainRemote(remoteConfig);

before(function() {
  return driver.init({
    platformName: 'desktop', // iOS, Android, Desktop
    browserName: 'chrome'    // Chrome, Electron
    app: path/to/app         // Only for mobile
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

### Mixin Helper

```javascript
import wd from 'macaca-wd';
import {
  extendsMixIn,
} from 'macaca-wd/lib/helper'

extendsMixIn(wd)
```

[see more about helper](./lib/helper.js)

### Extend WD chain

```javascript
import wd from 'macaca-wd';

wd.addPromiseChainMethod(name, method);
```

[API](//macacajs.github.io/macaca-wd/)

## Demo

[Macaca Getting Started](//macacajs.github.io/environment-setup)
<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars1.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars0.githubusercontent.com/u/2720537?v=4" width="100px;"/><br/><sub><b>tsj1107</b></sub>](https://github.com/tsj1107)<br/>|[<img src="https://avatars1.githubusercontent.com/u/1044425?v=4" width="100px;"/><br/><sub><b>ziczhu</b></sub>](https://github.com/ziczhu)<br/>|[<img src="https://avatars3.githubusercontent.com/u/15025212?v=4" width="100px;"/><br/><sub><b>zhuyali</b></sub>](https://github.com/zhuyali)<br/>|[<img src="https://avatars1.githubusercontent.com/u/2139038?v=4" width="100px;"/><br/><sub><b>zhangyuheng</b></sub>](https://github.com/zhangyuheng)<br/>
| :---: | :---: | :---: | :---: | :---: |


This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto upated at `Mon Mar 26 2018 12:10:47 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->
