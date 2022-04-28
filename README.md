# Macaca WD Client

[![NPM version][npm-image]][npm-url]
[![Package quality][quality-image]][quality-url]
[![build status][CI-image]][CI-url]
[![Test coverage][codecov-image]][codecov-url]
[![node version][node-image]][node-url]

[npm-image]: https://img.shields.io/npm/v/macaca-wd.svg
[npm-url]: https://npmjs.org/package/macaca-wd
[quality-image]: https://packagequality.com/shield/macaca-wd.svg
[quality-url]: https://packagequality.com/#?package=macaca-wd
[CI-image]: https://github.com/macacajs/macaca-wd/actions/workflows/ci.yml/badge.svg
[CI-url]: https://github.com/macacajs/macaca-wd/actions/workflows/ci.yml
[codecov-image]: https://img.shields.io/codecov/c/github/macacajs/macaca-wd.svg?logo=codecov
[codecov-url]: https://app.codecov.io/gh/macacajs/macaca-wd
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg
[node-url]: http://nodejs.org/download/

Macaca WD Client is inspired by [admc/wd](//github.com/admc/wd), according to [W3C WebDriver Spec](//w3c.github.io/webdriver/webdriver-spec.html).

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars.githubusercontent.com/u/1044425?v=4" width="100px;"/><br/><sub><b>ziczhu</b></sub>](https://github.com/ziczhu)<br/>|[<img src="https://avatars.githubusercontent.com/u/2139038?v=4" width="100px;"/><br/><sub><b>zhangyuheng</b></sub>](https://github.com/zhangyuheng)<br/>|[<img src="https://avatars.githubusercontent.com/u/1209810?v=4" width="100px;"/><br/><sub><b>paradite</b></sub>](https://github.com/paradite)<br/>|[<img src="https://avatars.githubusercontent.com/u/4006436?v=4" width="100px;"/><br/><sub><b>meowtec</b></sub>](https://github.com/meowtec)<br/>|[<img src="https://avatars.githubusercontent.com/u/11460601?v=4" width="100px;"/><br/><sub><b>zivyangll</b></sub>](https://github.com/zivyangll)<br/>|
| :---: | :---: | :---: | :---: | :---: | :---: |
[<img src="https://avatars.githubusercontent.com/u/2720537?v=4" width="100px;"/><br/><sub><b>tsj1107</b></sub>](https://github.com/tsj1107)<br/>|[<img src="https://avatars.githubusercontent.com/u/30293087?v=4" width="100px;"/><br/><sub><b>Jodeee</b></sub>](https://github.com/Jodeee)<br/>|[<img src="https://avatars.githubusercontent.com/u/52845048?v=4" width="100px;"/><br/><sub><b>snapre</b></sub>](https://github.com/snapre)<br/>|[<img src="https://avatars.githubusercontent.com/u/7878020?v=4" width="100px;"/><br/><sub><b>kobe990</b></sub>](https://github.com/kobe990)<br/>|[<img src="https://avatars.githubusercontent.com/u/29451458?v=4" width="100px;"/><br/><sub><b>centy720</b></sub>](https://github.com/centy720)<br/>|[<img src="https://avatars.githubusercontent.com/u/15025212?v=4" width="100px;"/><br/><sub><b>zhuyali</b></sub>](https://github.com/zhuyali)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Thu Apr 28 2022 14:20:57 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

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

