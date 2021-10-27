---
group:
  title: 表单
  path: /form
  order: 2
---

## 级联选择框 Cascader

二级级联选择框，第二级下拉菜单中内嵌输入框，用于第二级过滤

## 代码演示

```tsx
import React from 'react';
import { Cascader } from 'polard';

export default function CascaderDemo() {
  const options = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
        },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
        },
      ],
    },
  ];

  return <Cascader options={options} filterSecondData />;
}
```

## API

- 级联组件只有两级，第二级支持搜索
- 例子：业务类型定义，规则参数新建侧滑框的来源接口字段
- 其余属性可参考[antd/cascader](https://ant.design/components/cascader-cn/)

| 属性             | 值类型  | 描述                   | 默认值 |
| ---------------- | ------- | ---------------------- | ------ |
| filterSecondData | boolean | 是否第二级需要展示搜索 | false  |
