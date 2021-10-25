---
group:
  title: 业务组件
  path: /business-components
---

## 凭证查看 VoucherTable

获取凭证字段，以表格形式展示凭证

## API

| 参数            | 说明                                                                        | 类型    | 默认值                                                 |
| --------------- | --------------------------------------------------------------------------- | ------- | ------------------------------------------------------ |
| transactionType | 凭证                                                                        | string  | false                                                  |
| columnsUrl      | 获取凭证字段接口                                                            | string  | /api/expense/report/query/elements/of/accounting/model |
| url             | 获取凭证接口                                                                | string  |                                                        |
| params          | 获取凭证额外参数 { transactionNumber } (transactionNumber 改变时自动调接口) | object  |                                                        |
| isQuery         | 是否可以调用接口获取数据，值为 true 时调用接口                              | boolean | false                                                  |
| emptyFlag       | 搭配 isQuery 使用，emptyFlag 为 true、isQuery 为 false 时显示空表格         | boolean | false                                                  |
| refresh         | 值改变时，重新调接口获取数据                                                | any     |                                                        |

## 用法示例

- 基础用法

```tsx
import React from 'react';
import { VoucherTable } from 'polard';
import config from 'config';

export default function Test() {
  const headerInfo = { businessCode: 'BZD001' };

  return (
    <VoucherTable
      // ref={ref => { this.voucherTable = ref }}
      params={{
        transactionType: 'EXP_INPUT_TAX',
        transactionNumber: headerInfo.businessCode,
      }}
      transactionType="EXP_INPUT_TAX"
      isQuery={headerInfo.businessCode}
      url={`${config.expenseUrl}/api/input/header/check/accounting/entries`}
    />
  );
}
```
