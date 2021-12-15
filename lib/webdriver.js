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
    return driver;
  }
  
  async function saveScreenshots(context) {
    const reportspath = path.join(process.cwd(), 'report');
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
    return await client.navigateTo(url);
  }

  const { addPromiseChainMethod } = wd;
  addPromiseChainMethod('initDriver', initDriver);
  addPromiseChainMethod('saveScreenshots', saveScreenshots);
  addPromiseChainMethod('execute', execute);
  addPromiseChainMethod('quit', quit);
  addPromiseChainMethod('initWindow', initWindow);
  addPromiseChainMethod('get', get);

  return driver;
};