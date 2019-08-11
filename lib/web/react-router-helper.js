'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const { matchPath } = require('react-router');

const cwd = process.cwd();

exports.getRouter = (data, options = {}) => {
  const targetDirList = options.targetDirList;

  const routerWalker = (routes, parentRoute, handle) => {
    _.map(routes, (currentRoute, currentIndex) => {
      if (currentRoute) {
        handle(currentRoute, parentRoute, currentIndex);
        if (currentRoute.routes || currentRoute.childRoutes) {
          routerWalker(currentRoute.routes || currentRoute.childRoutes, currentRoute, handle);
        }
      }
    });
  };

  const fileWalkerSync = (rootDir, handle, options = {}) => {
    fs
      .readdirSync(rootDir)
      .forEach(file => {
        const currentDir = path.join(rootDir, file);
        const isDirectory = fs.existsSync(currentDir) && fs.statSync(currentDir).isDirectory();
        if (isDirectory) {
          fileWalkerSync(currentDir, handle, options);
        } else {
          handle(currentDir);
        }
      });
  };

  const cleaner = list => {
    const res = [];
    list.forEach(item => {
      if (item) {
        if (item.routes) {
          item.routes = cleaner(item.routes);
        } else if (item.childRoutes) {
          item.childRoutes = cleaner(item.childRoutes);
        }
        res.push(item);
      }
    });
    return res;
  };

  routerWalker(data, data, (currentRoute, parentRoute, currentIndex) => {
    if (parentRoute && parentRoute.path) {
      currentRoute._path = currentRoute.path;
      currentRoute.__path = `${parentRoute.__path || parentRoute.path}${path.sep}${currentRoute.path}`;
      currentRoute.path = `${parentRoute.__path || parentRoute.path}${path.sep}${currentRoute.path}`;
    }
    let isMatched = false;
    _.map(targetDirList, currentDir => {
      const targetDir = path.join(cwd, currentDir);
      fileWalkerSync(targetDir, file => {
        const content = fs.readFileSync(file, 'utf8');
        const matchReg = options.matchReg;
        let temp = null;
        while ((temp = matchReg.exec(content)) !== null) {
          let pathname = temp[1];
          if (!currentRoute.path.startsWith(path.sep) && pathname.startsWith(path.sep)) {
            pathname = pathname.slice(1);
          }
          if (pathname.includes('?')) {
            pathname = pathname.split('?')[0];
          }
          isMatched = matchPath(pathname, currentRoute) || isMatched;
        }
      }, {
        extname: '.js',
      });
    });
    currentRoute.path = currentRoute._path || currentRoute.path;
    if (!isMatched) {
      if (parentRoute.routes) {
        parentRoute.routes[currentIndex] = null;
      } else if (parentRoute.childRoutes) {
        parentRoute.childRoutes[currentIndex] = null;
      } else {
        parentRoute[currentIndex] = null;
      }
    } else {
      // console.log(currentRoute);
    }
  });
  return cleaner(data);
};

