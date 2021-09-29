/**
 * dumi 全局配置
 */
import { defineConfig } from 'dumi';
import path from 'path';

const config = {
  title: 'polard',
  favicon: '/images/favicon.png',
  // 配置文档的Logo
  logo: '/images/favicon.png',
  // 指定输出路径
  outputPath: 'docs-dist',
  // 设定文档的展现模式
  mode: 'site',
  // more config: https://d.umijs.org/config
  forkTSChecker: false,
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  proxy: {
    '/api': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
    },
    '/base': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
    },
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    '@ant-design/icons': 'icons',
    moment: 'moment',
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_',
    },
    httpFetch: 'window.httpFetch',
  },
};

export default defineConfig(config);
