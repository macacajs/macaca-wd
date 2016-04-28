# macaca-wd

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

Macaca wd client inspired by [admc/wd](//github.com/admc/wd), according to W3 [Webdriver](https://w3c.github.io/webdriver/webdriver-spec.html).

## Installment

```shell
$ npm i macaca-wd --save-dev
```

## Documentation

### Initial

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

### Extend

```javascript
wd.addPromiseChainMethod(name, method);
```
[API](//macacajs.github.io/macaca-wd/docs)

## Demo

[macaca guide](//macacajs.github.io/macaca/guide.html)

## License

The MIT License (MIT)
