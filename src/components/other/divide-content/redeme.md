---
group:
  title: 其他
  path: /other
---

## 分割线 DivideContent

为代码块提供上下方向的分割线

## 代码演示

```tsx
import React from 'react';
import { DivideContent, SearchArea, Table } from 'polard';

export default function DivideContentDemo() {
  const searchForm = [
    {
      type: 'input',
      id: 'code',
      label: '代码',
      title: '代码',
      dataIndex: 'code',
    },
    {
      type: 'input',
      id: 'name',
      label: '名称',
      title: '名称',
      dataIndex: 'name',
    },
    {
      type: 'input',
      id: 'desc',
      label: '描述',
      title: '描述',
      dataIndex: 'desc',
    },
  ];
  return (
    <div style={{ overflow: 'hidden' }}>
      <SearchArea searchForm={searchForm} submitHandle={() => {}} />
      {/* 与上面的 search-area 分割开 */}
      {/* 加入 requirePadding 属性，让 Button 和 customTable 外面被 padding: '24px 32px' 包着 */}
      <DivideContent requirePadding>
        <p>操作栏</p>
        <Table columns={searchForm} dataSource={[]} />
      </DivideContent>
    </div>
  );
}
```

## API

- 将需要与上面分割开的代码包起来
- 如果需要给包起来的代码加 padding，传入一个 requirePadding 属性即可

| 属性           | 值类型  | 描述                                          |
| -------------- | ------- | --------------------------------------------- |
| requirePadding | boolean | 为被包住的代码提供一个可以设置 padding 的属性 |
