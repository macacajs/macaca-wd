# Macaca WD Client

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]

[npm-image]: https://img.shields.io/npm/v/macaca-wd.svg?style=flat-square
[npm-url]: https://npmjs.org/package/macaca-wd
[travis-image]: https://img.shields.io/travis/macacajs/macaca-wd.svg?style=flat-square
[travis-url]: https://travis-ci.org/macacajs/macaca-wd
[coveralls-image]: https://img.shields.io/coveralls/macacajs/macaca-wd.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/macacajs/macaca-wd?branch=master
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

Macaca WD Client is inspired by [admc/wd](//github.com/admc/wd), according to [W3C WebDriver Spec](//w3c.github.io/webdriver/webdriver-spec.html).

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars1.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars1.githubusercontent.com/u/1044425?v=4" width="100px;"/><br/><sub><b>ziczhu</b></sub>](https://github.com/ziczhu)<br/>|[<img src="https://avatars1.githubusercontent.com/u/2139038?v=4" width="100px;"/><br/><sub><b>zhangyuheng</b></sub>](https://github.com/zhangyuheng)<br/>|[<img src="https://avatars3.githubusercontent.com/u/1209810?v=4" width="100px;"/><br/><sub><b>paradite</b></sub>](https://github.com/paradite)<br/>|[<img src="https://avatars3.githubusercontent.com/u/4006436?v=4" width="100px;"/><br/><sub><b>meowtec</b></sub>](https://github.com/meowtec)<br/>|[<img src="https://avatars1.githubusercontent.com/u/11460601?v=4" width="100px;"/><br/><sub><b>zivyangll</b></sub>](https://github.com/zivyangll)<br/>|
| :---: | :---: | :---: | :---: | :---: | :---: |
[<img src="https://avatars0.githubusercontent.com/u/2720537?v=4" width="100px;"/><br/><sub><b>tsj1107</b></sub>](https://github.com/tsj1107)<br/>|[<img src="https://avatars3.githubusercontent.com/u/7878020?v=4" width="100px;"/><br/><sub><b>kobe990</b></sub>](https://github.com/kobe990)<br/>|[<img src="https://avatars0.githubusercontent.com/u/29451458?v=4" width="100px;"/><br/><sub><b>centy720</b></sub>](https://github.com/centy720)<br/>|[<img src="https://avatars3.githubusercontent.com/u/15025212?v=4" width="100px;"/><br/><sub><b>zhuyali</b></sub>](https://github.com/zhuyali)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Fri Jul 17 2020 15:03:49 GMT+0800`.

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

