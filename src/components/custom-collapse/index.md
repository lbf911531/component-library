---
group:
  title: 展示
  path: /display
---

## 折叠面板 CustomCollapse

- 基于 collapse 改造折叠面板 header 部分样式
- 内部遍历节点数组，减少外界书写 Collapse.Panel 的代码量

## 代码演示

```tsx
import React from 'react';
import { CustomCollapse } from 'polard';

export default function CustomCollapseDemo() {
  const components = [
    {
      basicInfo: <div>info1</div>,
      header: 'header1',
      id: '1',
      key: '1',
    },
    {
      basicInfo: <h1>info2</h1>,
      header: 'header2',
      id: '2',
      key: '2',
    },
    {
      basicInfo: (
        <>
          <p>info2</p>
          <span>detail</span>
        </>
      ),
      header: 'header3',
      id: '3',
      key: '3',
    },
  ];

  return <CustomCollapse components={components} defaultActiveKey={['1']} />;
}
```

## API

| 参数             | 说明                                            | 类型                          | 默认值 |
| ---------------- | ----------------------------------------------- | ----------------------------- | ------ |
| components       | 折叠面板 Panel 组件内渲染的子元素及 panel props | [array](#collapse-components) | []     |
| defaultActiveKey | 指定默认展开的折叠面板                          | array                         | []     |

## <a id="collapse-components">components</a>

```ts
[
  {
    basicInfo: <div>info1</div>, // Panel展开后渲染的节点（必须）
    header: 'header1', // 折叠面板的title
    id: '1', // 可配合页面的Anchor使用，不需要时可以不传
    key: '1', // Panel的key值，不能重复！！
    panelProp: [], // Collapse.Panel的所有支持属性
  },
];
```
