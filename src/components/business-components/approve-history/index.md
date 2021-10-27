---
group:
  title: 业务组件
  path: /business-components
---

## 审批历史 ApproveHistory

该审批历史组件对接了工作流

## 代码演示

### 基本使用

```tsx
import React from 'react';
import { ApproveHistory } from 'polard';

export default function ApproveHistoryDemo() {
  return (
    <ApproveHistory entityType="801016" documentId="222222" header="审批历史" />
  );
}
```

### 自定义数据

```tsx
import React from 'react';
import { ApproveHistory } from 'polard';

export default function ApproveHistoryDemoTwo() {
  const data = [
    {
      businessId: '1441954698371981314',
      operationType: '6001',
      description: '',
      operationTypeName: '暂挂',
      createdByCode: '000001',
      createdByName: '小肥肥',
      approvalNodeName: '节点3',
    },
    {
      businessId: '1441954698371981314',
      operationType: '2002',
      description: '管理员驳回流程',
      operationTypeName: '驳回',
      createdByCode: '000001',
      createdByName: '小肥肥',
      approvalNodeName: 4,
    },
    {
      businessId: '1441954698371981314',
      operationType: '2001',
      description: '管理员通过流程',
      operationTypeName: '审批通过',
      createdByCode: '000001',
      createdByName: '小肥肥',
      approvalNodeName: 1,
    },
    {
      businessId: '1441954698371981314',
      operationType: '1001',
      description: null,
      operationTypeName: '提交',
      createdByCode: '000001',
      createdByName: '小肥肥',
      approvalNodeName: 2,
    },
  ];
  return (
    <ApproveHistory
      infoData={data}
      header="这里是面板头"
      expandIcon={(props) => '~ '}
    />
  );
}
```

## API

| 参数           | 说明                                             | 类型                          | 默认值 |
| -------------- | ------------------------------------------------ | ----------------------------- | ------ |
| expandIcon     | 自定义切换图标                                   | (panelProps) => ReactNode     | -      |
| header         | 面板头内容                                       | ReactNode                     | -      |
| entityType     | 单据类型                                         | string                        | -      |
| documentId     | 单据 id                                          | string                        | -      |
| infoData       | 单据历史数据，如不通过接口获取也可外界自定义传入 | Array<{ [key: string]: any }> | -      |
| slideFrameFlag | 审批历史在侧滑框显示                             | boolean                       | -      |
| url            | 获取审批历史数据的接口                           | string                        | -      |
| params         | 接口请求参数                                     | { [key: string]: any }        | -      |
| methodType     | 接口请求方式                                     | string                        | "get"  |
