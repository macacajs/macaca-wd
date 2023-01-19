'use strict';

const fs = require('fs');
const path = require('path');
const macacaEcosystem = require('macaca-ecosystem');
const traceFragment = require('macaca-ecosystem/lib/trace-fragment');

const { name } = require('../../package');

function getAPIList() {
  const apisDir = path.resolve(__dirname, '..', 'apis');
  return fs.readdirSync(apisDir)
    .map(item => path.resolve(apisDir, item))
    .filter(item => fs.statSync(item).isDirectory())
    .map(groupDir => {
      const groupName = path.relative(apisDir, groupDir);
      const children = fs.readdirSync(groupDir).map(item => {
        const fileName = item.replace(path.extname(item), '');
        return [
          `${groupName}/${fileName}`,
          fileName,
        ];
      });
      return {
        title: groupName,
        collapsable: false,
        children,
      };
    });
}

module.exports = {
  dest: 'docs_dist',
  base: `/${name}/`,
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Macaca WD',
      description: 'Node.js WebDriver Client for Macaca',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Macaca WD',
      description: 'Macaca Node.js 客户端 API 模块',
    },
  },
  head: [
    ['link', {
      rel: 'icon',
      href: 'https://macacajs.github.io/assets/favicon.ico'
    }],
    ['script', {
      async: true,
      src: 'https://www.googletagmanager.com/gtag/js?id=UA-49226133-2',
    }, ''],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-49226133-2');
    `],
    ['script', {}, traceFragment],
  ],
  serviceWorker: true,
  themeConfig: {
    repo: `macacajs/${name}`,
    editLinks: true,
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        serviceWorker: {
          updatePopup: {
            message: 'New content is available.',
            buttonText: 'Refresh',
          },
        },
        nav: [
          macacaEcosystem.en,
        ],
        sidebar: {
          '/apis/': getAPIList(),
        },
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        serviceWorker: {
          updatePopup: {
            message: '发现新内容可用',
            buttonText: '刷新',
          },
        },
        nav: [
          macacaEcosystem.zh,
        ],
        sidebar: {
          '/zh/apis/': getAPIList(),
        },
      },
    },
  },
};
