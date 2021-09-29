---
group:
  title: 组件
  path: /components
---

## Custom-table 自定义表格

<Alert type="info">
  该表格内部引入了axios，使用时可直接传入url，挂载时会以主动请求url返回的结果作为表格数据
</Alert>

## Demo

```tsx
import React from 'react';
import { CustomTable } from 'polard';
import { Badge, Divider } from 'antd';

export default function CustomTableDemo() {
  const columns = [
    {
      title: '数据权限代码',
      dataIndex: 'dataAuthorityCode',
      width: 200,
    },
    {
      title: '数据权限名称',
      dataIndex: 'dataAuthorityName',
      width: 100,
    },

    {
      title: '数据权限说明',
      dataIndex: 'description',
      width: 300,
    },
  ];

  function handleEdit(record) {
    console.log(record);
  }

  return <CustomTable columns={columns} url="/base/api/authority/query" />;
}
```
