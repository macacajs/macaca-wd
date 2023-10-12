#!/usr/bin/env node

'use strict';

const net = require('net');
const repl = require('repl');
const assert = require('assert');
const wd = require('./main');

const startRepl = function() {
  const r = repl.start('(wd): ');
  r.context.assert = assert;
  r.context.wd = wd;
  r.context.help = function() {
    console.log('WD - Shell.');
    console.log("Access the webdriver object via the object: 'wd'");
  };

  const server = net.createServer(function(socket) {
    socket.setTimeout(5 * 60 * 1000, function() {
      socket.destroy();
    });
    repl.start('(wd): ', socket);
  }).listen(process.platform === 'win32' ?
    '\\\\.\\pipe\\node-repl-sock-' + process.pid :
    '/tmp/node-repl-sock-' + process.pid);

  r.on('exit', function() {
    server.close();
    process.exit();
  });
};

if (process.argv[2] === 'shell') {
  startRepl();
}
