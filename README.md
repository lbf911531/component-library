# polard

## Getting Started

Install dependencies,

```bash
$ npm i
```

Start the dev server,

```bash
$ npm start
```

Build documentation,

```bash
$ npm run docs:build
```

Build polard via `father-build`,

```bash
$ npm run build
```

## 本地开发注意事项

1. 本地 node 版本建议使用 v12.0.0 （个人使用的是 v14.16.0）以上，否则安装依赖时，dumi 内部无法兼容，导致项目启动报错
2. 组件内部如果需要使用 redux，建议使用 `window?.g_app?._store`

```js
// 全局入口
import { getDvaApp } from 'umi';
window.g_app = getDvaApp();

// 某js文件
const { dispatch, getState } = window?.g_app?._store;
```

或者

```js
// 某js文件
import { getDvaApp } from 'umi';
const { dispatch, getState } = getDvaApp()._store;
```
