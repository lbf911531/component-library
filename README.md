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

3. 涉及到 form 组件，一律改用 antd 4.x 中的 form，`Form.create()(component)`改为`WrappedForm(component)`[path: "components/wrapped-form"]

```js
export default WrappedForm(WrappedSearchArea);
```

4. 涉及到 connect 组件的使用，改用`WrapperConnect`[path: "components/custom-connect"]

```js
export default WrapperConnect(mapStateToProps)(CompatibleLov);
```

## 打包，发布

- 修改`.fatherrc.ts`文件中的`cjs,esm`
- 默认`rollup`打包模式，生成`dist`文件夹，该模式下体积小，但是 es6 语法
- 修改为`babel`模式时，会生成`lib`,`es`文件夹，该模式下体积大，同时需要修改`package.json`文件
  修改如下：

```json
"main": "lib/index.js",
"module": "lib/index.js",
"typings": "lib/index.d.ts",
```

且该模式下后续需要考虑做按需加载

- 发布命令

```bash
$ npm run release
```

## 后续计划

1. 支持多语言 (目前进度 50%)
2. 组件改为 tsx 语法
3. 部分组件重构，减少代码量

## 多语言

提供 LocaleProvider 组件，于项目入口出，调用该组件包裹子组件，并传入 locale 参数
如下是 antd 多语言与 polard 多语言共有场景：

```tsx
// locale: {
//   locale: "zh_cn",
//   localeMap: {
//     zh_cn: {"common.key": "键",...},
//     en_us: {},
//   },
// }
//  组件库内部暂时仅支持zh_cn,en_us, 如项目有需求增加其他语言，可自行配置，并传入即可，localeMap同名配置以外界传入为主
<ConfigProvider locale={localeInfo[locale] || zhCN}>
  <IntlProvider onError={() => { }} locale={langTypes[locale]} messages={messages}>
    <InjectedWrapper>
      <LocaleProvider locale={{locale,localeMap}}>
        {basicLayout}
      </InjectedWrapper>
  </IntlProvider>
</ConfigProvider>
```
