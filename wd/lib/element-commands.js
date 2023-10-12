'use strict';

// Element object
// Wrapper around browser methods
const _ = require('./lodash');
const utils = require('./utils.js');
const { deprecator } = utils;
const fs = require('fs');
const callbacks = require('./callbacks');
const elementCallback = callbacks.elementCallback;
const elementsCallback = callbacks.elementsCallback;
const simpleCallback = callbacks.simpleCallback;
const commands = require('./commands');

const elementCommands = {};

/**
 * element.type(keys, cb) -> cb(err)
 *
 * @param keys
 * @param cb
 * @jsonWire POST /session/:sessionId/element/:id/value
 */
elementCommands.type = function(keys, cb) {
  commands.type.apply(this.browser, [ this, keys, cb ]);
};

/**
 * element.keys(keys, cb) -> cb(err)
 *
 * @param keys
 * @param cb
 * @jsonWire POST /session/:sessionId/element/:id/value
 */
elementCommands.keys = function(keys, cb) {
  commands.keys.apply(this.browser, [ keys, cb ]);
};

function _isLocalFile(path, cb) {
  fs.exists(path, function(exists) {
    if (exists) {
      // eslint-disable-next-line node/prefer-promises/fs
      fs.lstat(path, function(err, stats) {
        cb(err, stats.isFile());
      });
    } else { cb(null, false); }
  });
}

/**
 * Equivalent to the python sendKeys binding. Upload file if
 * a local file is detected, otherwise behaves like type.
 * element.sendKeys(keys, cb) -> cb(err)
 * @param keys
 * @param cb
 */
elementCommands.sendKeys = function(keys, cb) {
  const _this = this;
  if (!(keys instanceof Array)) { keys = [ keys ]; }

  // ensure all keystrokes are strings to conform to JSONWP
  _.each(keys, function(key, idx) {
    if (typeof key !== 'string') {
      keys[idx] = key.toString();
    }
  });

  const path = keys.join('');
  _isLocalFile(path, function(err, isLocalFile) {
    if (err) { return cb(err); }
    if (isLocalFile) {
      commands.uploadFile.apply(_this.browser, [ path, function(err, distantFilePath) {
        if (err) { return cb(err); }
        return commands.type.apply(_this.browser, [ _this, distantFilePath, cb ]);
      } ]);
    } else {
      commands.type.apply(_this.browser, [ _this, keys, cb ]);
    }
  });
};

/**
 * Equivalent to the python sendKeys binding, but replaces texts instead of keeping original. Upload file if
 * a local file is detected, otherwise behaves like type.
 * element.setText(keys, cb) -> cb(err)
 * @param keys
 * @param cb
 */
elementCommands.setText = function(keys, cb) {
  const _this = this;
  if (!(keys instanceof Array)) { keys = [ keys ]; }

  // ensure all keystrokes are strings to conform to JSONWP
  _.each(keys, function(key, idx) {
    if (typeof key !== 'string') {
      keys[idx] = key.toString();
    }
  });
  commands.replace.apply(_this.browser, [ _this, keys, cb ]);
};

elementCommands.replaceKeys = function(keys, cb) {
  deprecator.warn('element.replaceKeys', 'element.replaceKeys has been deprecated, use element.setText instead.');
  elementCommands.setText.call(this, keys, cb);
};

/**
 * element.click(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/click
 */
elementCommands.click = function() {
  const fargs = utils.varargs(arguments);
  const cb = fargs.callback;
  const clickOpts = fargs.all[0] || {};
  commands.clickElement.apply(this.browser, [ this, clickOpts, cb ]);
};

/**
 * element.takeElementScreenshot(cb) -> cb(err)
 *
 * @param cb
 * @jsonWire POST /session/:sessionId/element/:id/screenshot
 */
elementCommands.screenshot = function(cb) {
  commands.takeElementScreenshot.apply(this.browser, [ this, cb ]);
};

/**
 * element.tap(cb) -> cb(err)
 *
 * @param cb
 * @jsonWire POST /session/:sessionId/touch/click
 */
elementCommands.tap = function(cb) {
  commands.tapElement.apply(this.browser, [ this, cb ]);
};

/**
 * element.doubleClick(cb) -> cb(err)
 *
 * @param cb
 * @jsonWire POST /session/:sessionId/doubleclick
 */
elementCommands.doubleclick = function(cb) {
  return commands.moveTo.apply(this.browser, [ this, function(err) {
    if (err) { return cb(err); }
    commands.doubleclick.apply(this.browser, [ cb ]);
  }.bind(this) ]);
};

elementCommands.doubleClick = elementCommands.doubleclick;

/**
 * element.moveTo(xoffset, yoffset, cb) -> cb(err)
 * xoffset and y offset are optional.
 *
 * @jsonWire POST /session/:sessionId/moveto
 */
elementCommands.moveTo = function() {
  const fargs = utils.varargs(arguments);
  const cb = fargs.callback;
  const xoffset = fargs.all[0];
  const yoffset = fargs.all[1];
  commands.moveTo.apply(this.browser, [ this, xoffset, yoffset, cb ]);
};

/**
 * element.flick(xoffset, yoffset, speed, cb) -> cb(err)
 *
 * @param xoffset
 * @param yoffset
 * @param speed
 * @param cb
 * @jsonWire POST /session/:sessionId/touch/flick
 */
elementCommands.flick = function(xoffset, yoffset, speed, cb) {
  commands.flick.apply(this.browser, [ this.value, xoffset, yoffset, speed, cb ]);
};

/**
 * element.text(cb) -> cb(err, text)
 *
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 2
 */
elementCommands.text = function(cb) {
  commands.text.apply(this.browser, [ this, cb ]);
};

/**
 * element.textPresent(searchText, cb) -> cb(err, boolean)
 *
 * @param searchText
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 4
 */
elementCommands.textPresent = function(searchText, cb) {
  commands.textPresent.apply(this.browser, [ searchText, this, cb ]);
};

/**
 * element.getAttribute(attrName, cb) -> cb(err, value)
 *
 * @param name
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 2
 */
elementCommands.getAttribute = function(name, cb) {
  commands.getAttribute.apply(this.browser, [ this, name, cb ]);
};

/**
 * element.getProperty(propertyName, cb) -> cb(err, value)
 *
 * @param name
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/property/:name
 * @docOrder 2
 */
elementCommands.getProperty = function(name, cb) {
  commands.getProperty.apply(this.browser, [ this, name, cb ]);
};

/**
 * element.getRect(cb) -> cb(err, value)
 *
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/rect
 * @docOrder 2
 */
elementCommands.getRect = function(cb) {
  commands.getRect.apply(this.browser, [ this, cb ]);
};

/**
 * element.getTagName(cb) -> cb(err, name)
 *
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/name
 */
elementCommands.getTagName = function(cb) {
  commands.getTagName.apply(this.browser, [ this, cb ]);
};

/**
 * element.isDisplayed(cb) -> cb(err, displayed)
 *
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/displayed
 */
elementCommands.isDisplayed = function(cb) {
  commands.isDisplayed.apply(this.browser, [ this, cb ]);
};

elementCommands.displayed = elementCommands.isDisplayed;

/**
 * element.isSelected(cb) -> cb(err, selected)
 *
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/selected
 */
elementCommands.isSelected = function(cb) {
  commands.isSelected.apply(this.browser, [ this, cb ]);
};

elementCommands.selected = elementCommands.isSelected;

/**
  * element.isEnabled(cb) -> cb(err, enabled)
  *
  * @param cb
  * @jsonWire GET /session/:sessionId/element/:id/enabled
  */
elementCommands.isEnabled = function(cb) {
  commands.isEnabled.apply(this.browser, [ this, cb ]);
};

elementCommands.enabled = elementCommands.isEnabled;

/**
 * isVisible(cb) -> cb(err, boolean)
 * @param cb
 */
elementCommands.isVisible = function(cb) {
  deprecator.warn('element.isVisible', 'element.isVisible has been deprecated, use element.isDisplayed instead.');
  commands.isVisible.apply(this.browser, [ this, cb ]);
};

/**
 * element.getLocation(cb) -> cb(err, location)
 *
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/location
 */
elementCommands.getLocation = function(cb) {
  commands.getLocation.apply(this.browser, [ this, cb ]);
};

/**
 * element.getLocationInView(cb) -> cb(err, location)
 *
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/location
 */
elementCommands.getLocationInView = function(cb) {
  commands.getLocationInView.apply(this.browser, [ this, cb ]);
};

/**
 * element.getSize(cb) -> cb(err, size)
 *
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/size
 */
elementCommands.getSize = function(cb) {
  commands.getSize.apply(this.browser, [ this, cb ]);
};

/**
 * element.getValue(cb) -> cb(err, value)
 *
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 4
 */
elementCommands.getValue = function(cb) {
  commands.getValue.apply(this.browser, [ this, cb ]);
};

/**
 * element.getComputedCss(cssProperty , cb) -> cb(err, value)
 *
 * @param styleName
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/css/:propertyName
 */
elementCommands.getComputedCss = function(styleName, cb) {
  commands.getComputedCss.apply(this.browser, [ this, styleName, cb ]);
};

elementCommands.getComputedCSS = elementCommands.getComputedCss;

/**
 * element.clear(cb) -> cb(err)
 *
 * @param cb
 * @jsonWire POST /session/:sessionId/element/:id/clear
 */
elementCommands.clear = function(cb) {
  commands.clear.apply(this.browser, [ this, cb ]);
};

/**
 * element.submit(cb) -> cb(err)
 *
 * @param cb
 * @jsonWire POST /session/:sessionId/element/:id/submit
 */
elementCommands.submit = function(cb) {
  commands.submit.apply(this.browser, [ this, cb ]);
};

_.each(utils.elementFuncTypes, function(type) {
  /**
   * element.elementByClassName(value, cb) -> cb(err, element)
   * element.elementByCssSelector(value, cb) -> cb(err, element)
   * element.elementById(value, cb) -> cb(err, element)
   * element.elementByName(value, cb) -> cb(err, element)
   * element.elementByLinkText(value, cb) -> cb(err, element)
   * element.elementByPartialLinkText(value, cb) -> cb(err, element)
   * element.elementByTagName(value, cb) -> cb(err, element)
   * element.elementByXPath(value, cb) -> cb(err, element)
   * element.elementByCss(value, cb) -> cb(err, element)
   * element.elementByIosUIAutomation(value, cb) -> cb(err, element)
   * element.elementByAndroidUIAutomator(value, cb) -> cb(err, element)
   * element.elementByAccessibilityId(value, cb) -> cb(err, element)
   *
   * @param value
   * @param cb
   * @jsonWire POST /session/:sessionId/element/:id/element
   * @docOrder 2
   */
  elementCommands['element' + utils.elFuncSuffix(type)] = function(value, cb) {
    elementCommands.element.apply(this, [ utils.elFuncFullType(type), value, cb ]);
  };

  /**
   * element.elementsByClassName(value, cb) -> cb(err, elements)
   * element.elementsByCssSelector(value, cb) -> cb(err, elements)
   * element.elementsById(value, cb) -> cb(err, elements)
   * element.elementsByName(value, cb) -> cb(err, elements)
   * element.elementsByLinkText(value, cb) -> cb(err, elements)
   * element.elementsByPartialLinkText(value, cb) -> cb(err, elements)
   * element.elementsByTagName(value, cb) -> cb(err, elements)
   * element.elementsByXPath(value, cb) -> cb(err, elements)
   * element.elementsByCss(value, cb) -> cb(err, elements)
   * element.elementsByIosUIAUtomation(value, cb) -> cb(err, elements)
   * element.elementsByAndroidUIAutomator(value, cb) -> cb(err, elements)
   * element.elementsByAccessibilityId(value, cb) -> cb(err, elements)
   *
   * @param value
   * @param cb
   * @jsonWire POST /session/:sessionId/element/:id/elements
   * @docOrder 2
   */
  elementCommands['elements' + utils.elFuncSuffix(type)] = function(value, cb) {
    elementCommands.elements.apply(this, [ utils.elFuncFullType(type), value, cb ]);
  };
});

/**
 * element.element(using, value, cb) -> cb(err, element)
 *
 * @param using
 * @param value
 * @param cb
 * @jsonWire POST /session/:sessionId/element/:id/element
 * @docOrder 1
 */
elementCommands.element = function(using, value, cb) {
  const _this = this;
  this.browser._jsonWireCall({
    method: 'POST',
    relPath: '/element/' + _this.value + '/element',
    data: { using, value },
    cb: elementCallback(cb, this.browser),
  });
};

/**
 * element.elements(using, value, cb) -> cb(err, elements)
 *
 * @param using
 * @param value
 * @param cb
 * @jsonWire POST /session/:sessionId/element/:id/elements
 * @docOrder 1
 */
elementCommands.elements = function(using, value, cb) {
  const _this = this;
  this.browser._jsonWireCall({
    method: 'POST',
    relPath: '/element/' + _this.value + '/elements',
    data: { using, value },
    cb: elementsCallback(cb, this.browser),
  });
};

/**
 * element.equals(other, cb) -> cb(err, value)
 *
 * @param other
 * @param cb
 * @jsonWire GET /session/:sessionId/element/:id/equals/:other
 * @docOrder 1
 */
elementCommands.equals = function(other, cb) {
  commands.equalsElement.apply(this.browser, [ this, other, cb ]);
};

/**
 * element.sleep(ms, cb) -> cb(err)
 * @param ms
 * @param cb
 */
elementCommands.sleep = function(ms, cb) {
  cb = cb || function() {
    // none
  };
  setTimeout(cb, ms);
};

/**
 * element.noop(cb) -> cb(err)
 * @param cb
 */
elementCommands.noop = function(cb) {
  if (cb) { cb(); }
};

/**
 * element.performMultiAction(actions) -> cb(err, touchStateObjects)
 *
 * @param actions
 * @param cb
 * @jsonWire POST /session/:sessionId/touch/multi/perform
 */
elementCommands.performMultiAction = function(actions, cb) {
  commands.performMultiAction.apply(this.browser, [ this, actions, cb ]);
};

/**
 * element.rotate(opts, cb) -> cb(err)
 * opts is like the following:
 * {x: 114, y: 198, duration: 5, radius: 3, rotation: 220, touchCount: 2}
 *
 * @param opts
 * @param cb
 * @jsonWire POST /session/:sessionId/appium/device/rotate
 */
elementCommands.rotate = function(opts, cb) {
  commands.rotateDevice.apply(this.browser, [ this, opts, cb ]);
};

elementCommands.touch = function() {
  const _this = this;
  const cb = utils.findCallback(arguments);
  const fargs = utils.varargs(arguments);
  const code = fargs.all[0];
  const args = fargs.all[1] || {};
  let actions = [];
  if (Array.isArray(code)) {
    actions = code.map(function(el) {
      el.element = _this.value;
      return el;
    });
  } else if (typeof code === 'string') {
    args.type = code;
    args.element = _this.value;
    actions = [ args ];
  } else {
    cb(new Error('Touch function only accept a action name or a list of actions.'));
  }

  this.browser._jsonWireCall({
    method: 'POST',
    relPath: '/actions',
    data: { actions },
    cb: simpleCallback(cb),
  });
};

/**
 * element.setImmediateValueInApp(value, cb) -> cb(err)
 *
 * @param value
 * @param cb
 * @jsonWire POST /session/:sessionId/appium/element/:elementId?/value
 */
elementCommands.setImmediateValueInApp = function(value, cb) {
  commands.setImmediateValueInApp.apply(this.browser, [ this, value, cb ]);
};
/**
 * element.setImmediateValue(value, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/element/:elementId?/value
 */
elementCommands.setImmediateValue = elementCommands.setImmediateValueInApp;

module.exports = elementCommands;
