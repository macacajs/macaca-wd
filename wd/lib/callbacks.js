'use strict';

const utils = require('./utils');
const newError = utils.newError;
const getJsonwireError = utils.getJsonwireError;
const isWebDriverException = utils.isWebDriverException;

const cbStub = function() {
  // none
};

// just calls the callback when there is no result
exports.simpleCallback = function(cb) {
  cb = cb || cbStub;
  return function(err, data) {
    if (err) { return cb(err); }
    if ((data === '') || (data === 'OK')) {
      // expected behaviour when not returning JsonWire response
      cb(null);
    } else {
      // looking for JsonWire response
      let jsonWireRes;
      try {
        jsonWireRes = JSON.parse(data);
      } catch (ign) {
        // none
      }
      if (jsonWireRes && (jsonWireRes.status !== undefined)) {
        // valid JsonWire response
        if (jsonWireRes.status === 0) {
          cb(null);
        } else {
          const jsonwireError = getJsonwireError(jsonWireRes.status);
          let errorMessage = 'Error response status: ' + jsonWireRes.status;
          if (jsonwireError) {
            errorMessage += ', ' + jsonwireError.summary + ' - ' + jsonwireError.detail;
          }
          if (jsonWireRes.value && jsonWireRes.value.message) {
            errorMessage += ' Selenium error: ' + jsonWireRes.value.message;
          }
          const error = newError(
            { message: errorMessage,
              status: jsonWireRes.status,
              cause: jsonWireRes });
          if (jsonwireError) { error['jsonwire-error'] = jsonwireError; }
          cb(error);
        }
      } else {
        // something wrong
        cb(newError(
          { message: 'Unexpected data in simpleCallback.', data: jsonWireRes || data }));
      }
    }
  };
};

// base for all callback handling data
const callbackWithDataBase = function(cb) {
  cb = cb || cbStub;
  return function(err, data) {
    if (err) { return cb(err); }
    let obj,
      alertText;
    try {
      obj = JSON.parse(data);
    } catch (e) {
      return cb(newError({ message: 'Not JSON response', data }));
    }
    try {
      alertText = obj.value.alert.text;
    } catch (e) {
      alertText = '';
    }
    if (obj.status > 0) {
      const jsonwireError = getJsonwireError(obj.status);
      let errorMessage = 'Error response status: ' + obj.status + ', ' + alertText;
      if (jsonwireError) {
        errorMessage += ', ' + jsonwireError.summary + ' - ' + jsonwireError.detail;
      }
      if (obj.value && obj.value.message) {
        errorMessage += ' Selenium error: ' + obj.value.message;
      }
      const error = newError(
        { message: errorMessage,
          status: obj.status,
          cause: obj });
      if (jsonwireError) { error['jsonwire-error'] = jsonwireError; }
      cb(error);
    } else {
      cb(null, obj);
    }
  };
};

// retrieves field value from result
exports.callbackWithData = function(cb, browser) {
  cb = cb || cbStub;
  return callbackWithDataBase(function(err, obj) {
    if (err) { return cb(err); }
    if (isWebDriverException(obj.value)) {
      return cb(newError(
        { message: obj.value.message, cause: obj.value }));
    }
    // we might get a WebElement back as part of executeScript, so let's
    // check to make sure we convert if necessary to element objects
    if (obj.value && typeof obj.value.ELEMENT !== 'undefined') {
      obj.value = browser.newElement(obj.value.ELEMENT);
    } else if (Object.prototype.toString.call(obj.value) === '[object Array]') {
      for (let i = 0; i < obj.value.length; i++) {
        if (obj.value[i] && typeof obj.value[i].ELEMENT !== 'undefined') {
          obj.value[i] = browser.newElement(obj.value[i].ELEMENT);
        }
      }
    }
    cb(null, obj.value);
  });
};

// retrieves ONE element
exports.elementCallback = function(cb, browser) {
  cb = cb || cbStub;
  return callbackWithDataBase(function(err, obj) {
    if (err) { return cb(err); }
    if (isWebDriverException(obj.value)) {
      return cb(newError(
        { message: obj.value.message, cause: obj.value }));
    }
    if (!obj.value.ELEMENT) {
      cb(newError(
        { message: 'no ELEMENT in response value field.', cause: obj }));
    } else {
      const el = browser.newElement(obj.value.ELEMENT);
      cb(null, el);
    }
  });
};

// retrieves SEVERAL elements
exports.elementsCallback = function(cb, browser) {
  cb = cb || cbStub;
  return callbackWithDataBase(function(err, obj) {
    if (err) { return cb(err); }
    if (isWebDriverException(obj.value)) {
      return cb(newError(
        { message: obj.value.message, cause: obj.value }));
    }
    if (!(obj.value instanceof Array)) {
      return cb(newError(
        { message: 'Response value field is not an Array.', cause: obj.value }));
    }
    let i;
    const elements = [];
    for (i = 0; i < obj.value.length; i++) {
      const el = browser.newElement(obj.value[i].ELEMENT);
      elements.push(el);
    }
    cb(null, elements);
  });
};

// retrieves ONE or SEVERAL elements
exports.elementOrElementsCallback = function(cb, browser) {
  cb = cb || cbStub;
  return callbackWithDataBase(function(err, obj) {
    if (err) { return cb(err); }
    if (isWebDriverException(obj.value)) {
      return cb(newError(
        { message: obj.value.message, cause: obj.value }));
    }
    let el;
    if (obj.value.ELEMENT) {
      el = browser.newElement(obj.value.ELEMENT);
      cb(null, el);
    } else if (obj.value instanceof Array) {
      let i;
      const elements = [];
      for (i = 0; i < obj.value.length; i++) {
        el = browser.newElement(obj.value[i].ELEMENT);
        elements.push(el);
      }
      cb(null, elements);
    } else {
      cb(newError(
        { message: 'no element or element array in response value field.', cause: obj }));
    }
  });
};
