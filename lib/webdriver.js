'use strict';

const fs = require('fs');
const path = require('path');
const { appendToContext } = require('macaca-reporter');
const { sync: mkdir } = require('mkdirp');
const { default: WebDriver } = require('webdriver');

module.exports.buildDriver = wd => {
  let client;
  const driver = wd.promiseChainRemote();

  async function initDriver(options = {}) {
    client = await WebDriver.newSession(options);
    driver.browserName = options.browserName;
    return driver;
  }

  async function saveScreenshots(context) {
    const reportspath = path.join(process.cwd(), 'reports');
    const base64 = await client.takeScreenshot();
    const img = new Buffer(base64, 'base64');
    const filepath = path.join(reportspath, 'screenshots', `${Date.now()}.png`);
    mkdir(path.dirname(filepath));
    fs.writeFileSync(filepath, img.toString('binary'), 'binary');
    appendToContext(context, `${path.relative(reportspath, filepath)}`);
  }

  async function execute(code) {
    return await client.executeScript(code, []);
  }

  async function quit() {
    await client.deleteSession();
  }

  async function initWindow() {
    return driver;
  }

  async function get(url) {
    await client.navigateTo(url);
  }

  async function getUrl() {
    return await client.getUrl();
  }

  async function getElementAttribute(element, value) {
    return await client.getElementAttribute(Object.values(element)[0], value);
  }

  async function elementClick(element) {
    await client.elementClick(Object.values(element)[0]);
  }

  async function elementSendKeys(element, value) {
    if (driver.browserName === 'chrome') {
      await client.elementSendKeys(Object.values(element)[0], value);
    } else {
      await client.elementSendKeys(Object.values(element)[0], value[0]);
    }
  }

  async function elementByXPath(value) {
    return await client.findElements('xpath', value);
  }

  async function maximizeWindow() {
    try {
      await client.maximizeWindow();
    } catch (error) {
      console.log(error);
    }
  }

  const { addPromiseChainMethod } = wd;
  addPromiseChainMethod('initDriver', initDriver);
  addPromiseChainMethod('saveScreenshots', saveScreenshots);
  addPromiseChainMethod('execute', execute);
  addPromiseChainMethod('quit', quit);
  addPromiseChainMethod('initWindow', initWindow);
  addPromiseChainMethod('get', get);
  addPromiseChainMethod('getUrl', getUrl);
  addPromiseChainMethod('elementClick', elementClick);
  addPromiseChainMethod('elementSendKeys', elementSendKeys);
  addPromiseChainMethod('elementByXPath', elementByXPath);
  addPromiseChainMethod('maximizeWindow', maximizeWindow);
  addPromiseChainMethod('getElementAttribute', getElementAttribute);

  return driver;
};
