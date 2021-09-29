/**
 * dumi 全局配置
 */
import { defineConfig } from 'dumi';

export default defineConfig({
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
});
