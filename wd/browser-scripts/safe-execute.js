/* jshint evil:true */
const args = Array.prototype.slice.call(arguments, 0);
const code = args[0];
const fargs = args[1];
const wrap = function() {
  // eslint-disable-next-line no-eval
  return eval(code);
};

wrap.apply(this, fargs);
