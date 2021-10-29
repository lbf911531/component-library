/**
 * dumi 全局配置
 */
import { defineConfig } from 'dumi';
import path from 'path';
import slash from 'slash2';

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
    '/file': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
    },
    '/budget': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
    },
    '/expense': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
    },
    '/workflow': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
    },
  },
  alias: {
    share: path.resolve(__dirname, './src/share'),
    config: path.resolve(__dirname, './src/config/config.js'),
    dva: path.resolve(__dirname, './src/components/custom-connect'),
    'utils/utils': path.resolve(__dirname, './src/components/utils.tsx'),
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
    httpFetch: path.resolve('./src/share/httpFetch.js'),
    config: path.resolve('./src/config/config.js'),
    axios: 'axios',
    qs: 'qs',
  },
  cssLoader: {
    modules: {
      getLocalIdent: (context, localIdentName, localName) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }
        const match = context.resourcePath.match(/src(.*)/);
        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          const arr = slash(antdProPath)
            .split('/')
            .map((a) => a.replace(/([A-Z])/g, '-$1'))
            .map((a) => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
        return localName;
      },
    },
  },
  // targets: {
  //   ie: 11,
  // },
};

if (process.env.ENV_TYPE === 'native') {
  // 本地启动的时候不需要配置 externals
  delete config.externals;
}

export default defineConfig(config);
