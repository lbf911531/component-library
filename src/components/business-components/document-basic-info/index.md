---
nav:
  title: 组件
group:
  title: 业务组件
  path: /business-components

order: 1
---

## 单据头展示 DocumentBasicInfo

单据头基本信息展示。

## API

| 参数              | 说明             | 类型                                                        | 默认值 |
| ----------------- | ---------------- | ----------------------------------------------------------- | ------ |
| params            | 单锯头信息       | object                                                      | 无     |
| extarButton       | 操作按钮         | any                                                         | 无     |
| deleteAttachments | 是否可以删除附件 | boolean                                                     |        |
| extraStatus       | 补充额外的状态   | { [status]: { label, color?: string, className?: string } } |        |

## params 属性

| 参数                 | 说明               | 类型                                                           | 默认值 |
| -------------------- | ------------------ | -------------------------------------------------------------- | ------ |
| formName             | 单据类型名称       | string                                                         |        |
| businessCode         | 单锯编号           | string                                                         |        |
| statusCode           | 单据状态（status） | string                                                         |        |
| currencyCode         | 币种               | string                                                         |        |
| totalAmount          | 金额               | number 或者 number                                             |        |
| infoList, customList | 其他字段           | [{ label, value, linkId?: string, onClick?: (linkId) => {}, }] |        |
| remark               | 备注               | string                                                         |        |
| attachments          | 附件               | array                                                          |        |

## 使用例子

```tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { messages } from 'utils/utils';
import { DocumentBasicInfo } from 'polard';

export default function Test() {
  const [reimburseInfo] = useState({
    formName: '测试单据',
    businessCode: 'BZD000000001',
    statusCode: '1001N',
    currencyCode: 'CNY',
    totalAmount: 1200,
    remark: '备注',
    infoList: [
      { label: '申请时间', value: '2021-10-25' },
      { label: '申请人', value: '小旋风-8888888' },
      { label: '公司', value: '上海分公司' },
      { label: '部门', value: '财务部' },
      { label: '岗位', value: '普通员工' },
      { label: '测试', value: 'test' },
    ],
    attachments: [
      {
        id: '1',
        attachmentId: '1',
        staticFileUrl:
          'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
        fileName: 'test.png',
        fileType: 'image',
      },
    ],
  });

  return (
    <DocumentBasicInfo
      extarButton={
        <div className="custom-btn-wrap">
          <Button type="primary">编辑</Button>
        </div>
      }
      params={reimburseInfo}
      deleteAttachments
    />
  );
}
```
