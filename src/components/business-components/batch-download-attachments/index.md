---
group:
  title: 业务组件
  path: /business-components
  order: 4
---

## 单据附件批量下载 BatchDownLoadAttachments

## 何时使用

- 勾选多个单据，批量下载单据头行附件

## API

| 参数                | 说明                                          | 类型     | 默认值                                                    |
| ------------------- | --------------------------------------------- | -------- | --------------------------------------------------------- |
| visible             | 弹框是否显示                                  | boolean  | false                                                     |
| pkName              | 附件 pkName { header, line }                  | boolean  |                                                           |
| queryUrl            | 查询附件接口 URL                              | string   | `${config.fileUrl}/api/attachment/get/by/pkValues`        |
| queryMethod         | 查询接口请求类型（get、post）                 | string   | post                                                      |
| saveMethod          | 下载附件接口请求类型（get、post）             | string   | post                                                      |
| downloadCompressURL | 压缩下载接口 URL                              | string   | `${config.fileUrl}/api/attachments/download/selected`     |
| downloadPdfURL      | PDF 格式下载接口 URL                          | string   | `${config.fileUrl}/api/attachments/download/pdf/selected` |
| pkValueList         | 单据头 ids(pkValue 集合)                      | array    |                                                           |
| allSelectedRows     | 勾选的每一行数据 { id: record, id2: record2 } | Object   |                                                           |
| categoryType        | 单据大类名称(拼接在下载的附件名称上)          | string   |                                                           |
| documentNumberField | 单号字段名                                    | string   | requisitionNumber                                         |
| linePKValueField    | 行 ids 集合字段名                             | string   |                                                           |
| onCancel            | 关闭弹框方法                                  | function |                                                           |

## 方法

- `transformSelectRows(selectedRows, lineIdsField, headerIdField)`
  - `selectedRows`(onSelectChange 选中的行数据)
  - `lineIdsField`(单据行 pkValueList 字段)
  - `headerIdField`(头 pkValueList 字段， 默认 id)

## 使用例子

```tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { BatchDownLoadAttachments } from 'polard';

export default function Test() {
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setRowKeys] = useState();
  const [allSelectedRows, setAllRows] = useState();

  function onClick() {
    setRowKeys(['123']);
    setAllRows({ 123: [{ id: '123', requisitionNumber: 'BZD001' }] });
    setVisible(true);
  }

  return (
    <div>
      <Button onClick={onClick}>批量下载</Button>
      <BatchDownLoadAttachments
        visible={visible}
        pkName={{ header: 'EXP_REPORT_HEADER', line: 'EXP_REPORT_LINE' }}
        pkValueList={selectedRowKeys}
        allSelectedRows={allSelectedRows}
        linePKValueField="lineIds"
        documentNumberField="requisitionNumber"
        categoryType="报账单"
        onCancel={() => setVisible(false)}
      />
    </div>
  );
}
```
