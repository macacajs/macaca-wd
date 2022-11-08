/* jshint evil:true */
const args = Array.prototype.slice.call(arguments, 0);
const condExpr = args[0];
const timeout = args[1];
const poll = args[2];
const cb = args[3];
const waitForConditionImpl = function(conditionExpr, limit, poll, cb) {
  let res;
  if ((new Date().getTime()) < limit) {
    // eslint-disable-next-line no-eval
    res = eval(conditionExpr);
    if (res === true) {
      cb(res);
    } else {
      setTimeout(function() {
        waitForConditionImpl(conditionExpr, limit, poll, cb);
      }, poll);
    }
  } else {
    // eslint-disable-next-line no-eval
    res = eval(conditionExpr);
    return cb(res);
  }
};

const limit = (new Date().getTime()) + timeout;
waitForConditionImpl(condExpr, limit, poll, cb);
