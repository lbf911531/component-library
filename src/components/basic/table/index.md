---
group:
  title: 基础
  path: /basic
---

## 基础表格 Table

## 代码演示

```tsx
import React from 'react';
import { Table } from 'polard';

export default function BasicTable() {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return <Table columns={columns} dataSource={dataSource} />;
}
```

## API

具体 API 可参考 [antd/table](https://ant.design/components/table-cn/)
