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

## 本地开发步骤

1. src/components 根据分类创建存放组件的文件夹 A
2. 文件 A 中需至少有 index.ts/index.js , index.md
3. md 格式：

```markdown
---
nav:
  title: 组件
group:
  title: 基础 (组件分类：基础，表单，附件，业务组件，其他，可自行归类或补充)
  path: /basic
---

## 组件名

## 代码演示

## API
```

4. src/index.ts 导出上方自定义组件
5. src/locale-language/zh-CN.ts, en-US.ts 维护多语言

## 本地开发注意事项

1. 本地 node 版本建议使用 v12.0.0 （个人使用的是 v14.16.0）以上，否则安装依赖时，dumi 内部无法兼容，导致项目启动报错
2. 组件内部如果需要使用 redux，建议使用 `window?.g_app?._store`
   > - 由于组件库的建立后行于项目，组件库内部用到的 dispatch 的相关 models 文件夹暂时只能使用项目中，如果组件库内部自行引入 react-redux 实现，恐项目用到了组件库的 models 文件，导致访问路径发生改变；反之则与项目耦合度过高
   > - 目前只有 lov 组件，search-area，custom-table（后二者共用一个）会用到
   > - dispatch 在这三个组件内的作用，仅实现数据的缓存，用于优化，不影响主体功能的使用

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

1. 涉及到 form 组件，一律改用 antd 4.x 中的 form，`Form.create()(component)`改为`WrappedForm(component)`[path: "components/wrapped-form"]

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

```js
{
  "main": "lib/index.js",
  "module": "lib/index.js",
  "typings": "lib/index.d.ts",
  "sideEffect": false
}
// (改成这个貌似能实现一个假的按需加载，个人测试宿主项目中如果在babelrc中配置，经过依赖分析，也只是单独引用了某个组件)
{
  "main": "es/index.js",
  "module": "es/index.js",
  "typings": "es/index.d.ts",
  "sideEffect": false
}
```

且该模式下后续需要考虑做按需加载

记录踩坑：
babel 模式下打包，如果 tsx 文件中引入了.png 等，打包报错找不到图片，此时

1. 方案一，将该 tsx 文件改为 js 文件
2. 入口文件将 typings.d.ts 导入

```js
/// <reference path="../typings.d.ts" />
```

- 发布命令

```bash
$ npm run release
```

## 后续计划

1. 部分组件重构，减少代码量
2. 研究组件按需加载
3. 研究将组件打成一个压缩后的 js 文件

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
