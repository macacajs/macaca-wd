'use strict';

const DataHubClient = require('datahub-nodejs-sdk');

const datahubClient = new DataHubClient();

module.exports = wd => {
  /**
   * Switch scene with DataHub.
   * @function switchScene
   * @summary Support: Web(WebView)
   * @param {object} options.
   * @type datahub
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('switchScene', function(args) {
    return datahubClient.switchScene(args);
  });
  /**
   * Switch multi-scene with DataHub.
   * @function switchMultiScenes
   * @summary Support: Web(WebView)
   * @param {array} the scene list.
   * @type datahub
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('switchMultiScenes', function(args) {
    return datahubClient.switchMultiScenes(args);
  });
  /**
   * Switch all scenes with DataHub.
   * @function switchAllScenes
   * @summary Support: Web(WebView)
   * @param {object} options.
   * @type datahub
   * @return {Promise.<boolean>}
   */
  wd.addPromiseChainMethod('switchAllScenes', function(args) {
    return datahubClient.switchAllScenes(args);
  });
};
